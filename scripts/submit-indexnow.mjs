import { readFile, writeFile, mkdir } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

const SITE_ORIGIN = 'https://aixiaolvtools.com';
const SITE_HOST = 'aixiaolvtools.com';
const SITEMAP_URL = `${SITE_ORIGIN}/sitemap.xml`;
const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/IndexNow';
const MAX_BATCH_SIZE = 10000;
const configDir = path.join(os.homedir(), '.config', 'aixiaolvtools-search');
const defaultKeyFile = path.join(configDir, 'indexnow-key.txt');
const stateFile = path.join(configDir, 'indexnow-state.json');

function usage() {
  console.log('用法：node scripts/submit-indexnow.mjs [--dry-run] (--all | --file <urls.txt>)');
}

function normalizeAuditUrl(value) {
  const url = new URL(value.trim());
  url.hash = '';
  if (url.pathname === '') url.pathname = '/';
  return url.href;
}

function validateSiteUrl(value) {
  const url = new URL(value.trim());
  if (url.protocol !== 'https:' || url.hostname !== SITE_HOST || url.port) {
    throw new Error(`拒绝非本站 HTTPS URL：${value}`);
  }
  if (/^(localhost|127\.0\.0\.1)$/i.test(url.hostname) || url.hostname.startsWith('www.')) {
    throw new Error(`拒绝本地或 www URL：${value}`);
  }
  return normalizeAuditUrl(url.href);
}

function getCanonical(html, pageUrl) {
  const links = html.match(/<link\b[^>]*>/gi) ?? [];
  const canonicalTag = links.find((tag) => /\brel\s*=\s*["'][^"']*\bcanonical\b[^"']*["']/i.test(tag));
  const href = canonicalTag?.match(/\bhref\s*=\s*["']([^"']+)["']/i)?.[1];
  return href ? new URL(href, pageUrl).href : '';
}

function getRobotsMeta(html) {
  const tags = html.match(/<meta\b[^>]*>/gi) ?? [];
  return tags
    .filter((tag) => /\bname\s*=\s*["'](?:robots|googlebot|bingbot)["']/i.test(tag))
    .map((tag) => tag.match(/\bcontent\s*=\s*["']([^"']*)["']/i)?.[1] ?? '')
    .join(',');
}

async function fetchWithoutRedirect(url) {
  return fetch(url, {
    redirect: 'manual',
    headers: { 'user-agent': 'AixiaolvtoolsIndexNow/1.0' },
  });
}

async function readSitemapUrls() {
  const response = await fetchWithoutRedirect(SITEMAP_URL);
  if (response.status !== 200) throw new Error(`读取 sitemap 失败：HTTP ${response.status}`);
  const xml = await response.text();
  const urls = [...xml.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/gi)]
    .map((match) => match[1].replaceAll('&amp;', '&').trim());
  if (!urls.length) throw new Error('sitemap 中没有 URL');
  return urls;
}

async function readUrlFile(filePath) {
  const content = await readFile(path.resolve(filePath), 'utf8');
  return content.split(/\r?\n/).map((line) => line.trim()).filter((line) => line && !line.startsWith('#'));
}

async function readState() {
  try {
    const state = JSON.parse(await readFile(stateFile, 'utf8'));
    return state && typeof state.submitted === 'object' ? state : { submitted: {} };
  } catch {
    return { submitted: {} };
  }
}

async function writeState(state) {
  await mkdir(configDir, { recursive: true });
  await writeFile(stateFile, `${JSON.stringify(state, null, 2)}\n`, { encoding: 'utf8', mode: 0o600 });
}

async function validatePage(url) {
  const response = await fetchWithoutRedirect(url);
  if (response.status !== 200) {
    const suffix = response.status >= 300 && response.status < 400 ? '（重定向）' : '';
    throw new Error(`页面不可提交：HTTP ${response.status}${suffix} ${url}`);
  }

  const html = await response.text();
  const canonical = getCanonical(html, url);
  if (!canonical || normalizeAuditUrl(canonical) !== normalizeAuditUrl(url)) {
    throw new Error(`canonical 不匹配：${url}`);
  }

  const robots = `${getRobotsMeta(html)},${response.headers.get('x-robots-tag') ?? ''}`;
  if (/\bnoindex\b/i.test(robots)) throw new Error(`页面为 noindex：${url}`);
  return url;
}

async function validatePages(urls, concurrency = 8) {
  const results = new Array(urls.length);
  let nextIndex = 0;
  const workers = Array.from({ length: Math.min(concurrency, urls.length) }, async () => {
    while (nextIndex < urls.length) {
      const index = nextIndex;
      nextIndex += 1;
      results[index] = await validatePage(urls[index]);
    }
  });
  await Promise.all(workers);
  return results;
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const allIndex = args.indexOf('--all');
  const fileIndex = args.indexOf('--file');
  const modeCount = Number(allIndex !== -1) + Number(fileIndex !== -1);
  if (modeCount !== 1 || (fileIndex !== -1 && !args[fileIndex + 1])) {
    usage();
    process.exitCode = 2;
    return;
  }

  const keyFile = process.env.INDEXNOW_KEY_FILE || defaultKeyFile;
  const key = (process.env.INDEXNOW_KEY || await readFile(keyFile, 'utf8').catch(() => '')).trim();
  if (!/^[A-Za-z0-9-]{8,128}$/.test(key)) {
    throw new Error('IndexNow Key 不存在或格式无效。未发送 URL。');
  }

  const keyLocation = `${SITE_ORIGIN}/${key}.txt`;
  const keyResponse = await fetchWithoutRedirect(keyLocation);
  const keyBody = keyResponse.status === 200 ? await keyResponse.text() : '';
  if (keyResponse.status !== 200 || keyBody !== key) {
    throw new Error(`IndexNow Key 文件验证失败：HTTP ${keyResponse.status}。未发送 URL。`);
  }

  const sourceUrls = allIndex !== -1 ? await readSitemapUrls() : await readUrlFile(args[fileIndex + 1]);
  const uniqueUrls = [...new Set(sourceUrls.map(validateSiteUrl))];
  const validatedUrls = await validatePages(uniqueUrls);
  const state = await readState();
  const pendingUrls = allIndex !== -1
    ? validatedUrls.filter((url) => !state.submitted[url])
    : validatedUrls;
  const batchCount = Math.ceil(pendingUrls.length / MAX_BATCH_SIZE);

  console.log(`IndexNow 合规 URL：${validatedUrls.length}`);
  console.log(`IndexNow 待提交 URL：${pendingUrls.length}`);
  console.log(`IndexNow 批次数：${batchCount}`);

  if (dryRun) {
    console.log('IndexNow dry-run 完成，未发送请求。');
    return;
  }

  if (!pendingUrls.length) {
    console.log('没有新的待提交 URL，未调用 IndexNow。');
    return;
  }

  let submittedCount = 0;
  for (let offset = 0; offset < pendingUrls.length; offset += MAX_BATCH_SIZE) {
    const batch = pendingUrls.slice(offset, offset + MAX_BATCH_SIZE);
    let response;
    try {
      response = await fetch(INDEXNOW_ENDPOINT, {
        method: 'POST',
        headers: { 'content-type': 'application/json; charset=utf-8' },
        body: JSON.stringify({ host: SITE_HOST, key, keyLocation, urlList: batch }),
      });
    } catch {
      throw new Error('IndexNow 网络请求失败；未自动重试。');
    }

    console.log(`IndexNow 批次 ${Math.floor(offset / MAX_BATCH_SIZE) + 1}/${batchCount}：HTTP ${response.status}，URL ${batch.length}`);
    if (response.status !== 200 && response.status !== 202) {
      const reasons = {
        400: '请求格式无效',
        403: 'Key 验证失败',
        422: 'URL 或 Host 不符合协议',
        429: '请求过多',
      };
      throw new Error(`IndexNow 未接收该批次：HTTP ${response.status} ${reasons[response.status] ?? '未知错误'}；未自动重试。`);
    }

    if (response.status === 202) {
      console.log('IndexNow 已接收该批次，Key 验证正在处理；不会自动重试。');
    }

    const submittedAt = new Date().toISOString();
    for (const url of batch) state.submitted[url] = submittedAt;
    await writeState(state);
    submittedCount += batch.length;
  }

  console.log(`IndexNow 已接收 URL：${submittedCount}`);
  console.log(`IndexNow 接收时间：${new Date().toISOString()}`);
}

main().catch((error) => {
  console.error(`IndexNow 错误：${error instanceof Error ? error.message : '未知错误'}`);
  process.exitCode = 1;
});
