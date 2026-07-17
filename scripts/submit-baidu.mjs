import { mkdir, readFile, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

const SITE_ORIGIN = 'https://aixiaolvtools.com';
const SITE_HOST = 'aixiaolvtools.com';
const HOME_URL = `${SITE_ORIGIN}/`;
const SITEMAP_URL = `${SITE_ORIGIN}/sitemap.xml`;
const CONFIG_DIR = path.join(os.homedir(), '.config', 'aixiaolvtools-search');
const STATE_FILE = path.join(CONFIG_DIR, 'baidu-state.json');
const DEFAULT_CORE_FILE = path.resolve('tmp', 'search-submit', 'core-urls.txt');
const MODE_FLAGS = ['--one', '--core', '--all', '--file'];

function usage() {
  console.log(
    '用法: node scripts/submit-baidu.mjs (--one | --core | --all | --file <文件路径>) [--dry-run]'
  );
}

function parseArguments(args) {
  const selectedModes = args.filter((arg) => MODE_FLAGS.includes(arg));
  const dryRunCount = args.filter((arg) => arg === '--dry-run').length;

  if (selectedModes.length !== 1 || dryRunCount > 1) {
    throw new Error('提交模式参数无效。');
  }

  const selectedMode = selectedModes[0];
  const dryRun = dryRunCount === 1;
  const expectedCount = (selectedMode === '--file' ? 2 : 1) + (dryRun ? 1 : 0);

  if (args.length !== expectedCount) {
    throw new Error('存在未知参数或缺少参数。');
  }

  let filePath = null;
  if (selectedMode === '--file') {
    const fileIndex = args.indexOf('--file');
    filePath = args[fileIndex + 1];
    if (!filePath || filePath.startsWith('--')) {
      throw new Error('--file 必须提供 URL 文件路径。');
    }
  }

  return {
    mode: selectedMode.slice(2),
    dryRun,
    filePath,
  };
}

function normalizeUrl(value) {
  let url;
  try {
    url = new URL(value.trim());
  } catch {
    throw new Error(`URL 格式无效：${value}`);
  }

  if (
    url.protocol !== 'https:'
    || url.hostname !== SITE_HOST
    || url.port
    || url.username
    || url.password
    || url.hash
  ) {
    throw new Error(`拒绝非本站 HTTPS 规范 URL：${value}`);
  }

  if (url.pathname === '') url.pathname = '/';
  return url.href;
}

function normalizeCanonicalUrl(value) {
  const url = new URL(value);
  url.hash = '';
  if (url.pathname === '') url.pathname = '/';
  return url.href;
}

function getCanonical(html, pageUrl) {
  const links = html.match(/<link\b[^>]*>/gi) ?? [];
  const tag = links.find((value) => /\brel\s*=\s*["'][^"']*\bcanonical\b[^"']*["']/i.test(value));
  const href = tag?.match(/\bhref\s*=\s*["']([^"']+)["']/i)?.[1];
  return href ? new URL(href, pageUrl).href : '';
}

function getRobotsMeta(html) {
  return (html.match(/<meta\b[^>]*>/gi) ?? [])
    .filter((tag) => /\bname\s*=\s*["'](?:robots|baiduspider)["']/i.test(tag))
    .map((tag) => tag.match(/\bcontent\s*=\s*["']([^"']*)["']/i)?.[1] ?? '')
    .join(',');
}

async function fetchWithoutRedirect(url) {
  return fetch(url, {
    redirect: 'manual',
    headers: { 'user-agent': 'AixiaolvtoolsBaiduSubmit/1.0' },
  });
}

async function readUrlFile(filePath) {
  const content = await readFile(path.resolve(filePath), 'utf8');
  return content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

async function readSitemapUrls() {
  const response = await fetchWithoutRedirect(SITEMAP_URL);
  if (response.status !== 200) {
    throw new Error(`读取 sitemap 失败：HTTP ${response.status}`);
  }

  const xml = await response.text();
  const urls = [...xml.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/gi)]
    .map((match) => match[1].replaceAll('&amp;', '&').trim());

  if (!urls.length) throw new Error('sitemap 中没有 URL。');
  return urls;
}

async function validatePage(url) {
  const response = await fetchWithoutRedirect(url);
  if (response.status !== 200) {
    throw new Error(`页面不可提交：HTTP ${response.status} ${url}`);
  }

  const html = await response.text();
  const canonical = getCanonical(html, url);
  if (!canonical || normalizeCanonicalUrl(canonical) !== normalizeCanonicalUrl(url)) {
    throw new Error(`canonical 不匹配：${url}`);
  }

  const robots = `${getRobotsMeta(html)},${response.headers.get('x-robots-tag') ?? ''}`;
  if (/\bnoindex\b/i.test(robots)) {
    throw new Error(`页面包含 noindex：${url}`);
  }

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

async function readState() {
  try {
    const state = JSON.parse(await readFile(STATE_FILE, 'utf8'));
    return state && typeof state.submitted === 'object' ? state : { submitted: {} };
  } catch {
    return { submitted: {} };
  }
}

async function writeState(state) {
  await mkdir(CONFIG_DIR, { recursive: true });
  await writeFile(STATE_FILE, `${JSON.stringify(state, null, 2)}\n`, {
    encoding: 'utf8',
    mode: 0o600,
  });
}

function loadAndValidateEndpoint() {
  const endpoint = process.env.BAIDU_PUSH_ENDPOINT;
  if (!endpoint) {
    throw new Error('未设置 BAIDU_PUSH_ENDPOINT，未发送 URL。');
  }
  if (endpoint !== endpoint.trim()) {
    throw new Error('BAIDU_PUSH_ENDPOINT 包含首尾空白，未发送 URL。');
  }

  let parsed;
  try {
    parsed = new URL(endpoint);
  } catch {
    throw new Error('BAIDU_PUSH_ENDPOINT 格式无效，未发送 URL。');
  }

  const siteValues = parsed.searchParams.getAll('site');
  const tokenValues = parsed.searchParams.getAll('token');
  const queryKeys = [...parsed.searchParams.keys()];
  const allowedQuery = queryKeys.length === 2
    && queryKeys.every((key) => key === 'site' || key === 'token');

  if (
    parsed.protocol !== 'http:'
    || parsed.hostname !== 'data.zz.baidu.com'
    || parsed.port
    || parsed.pathname !== '/urls'
    || parsed.username
    || parsed.password
    || parsed.hash
    || !allowedQuery
    || siteValues.length !== 1
    || siteValues[0] !== SITE_ORIGIN
    || tokenValues.length !== 1
    || !tokenValues[0]
  ) {
    throw new Error('百度 Endpoint 安全校验失败，未发送 URL。');
  }

  return { endpoint, token: tokenValues[0] };
}

function redact(value, endpoint, token) {
  let safe = String(value ?? '');
  for (const secret of [endpoint, token, encodeURIComponent(token)]) {
    if (secret) safe = safe.replaceAll(secret, '[REDACTED]');
  }
  return safe;
}

function countRejected(value) {
  if (Array.isArray(value)) return value.length;
  if (value == null) return 0;
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

async function main() {
  const args = process.argv.slice(2);
  let parsedArgs;
  try {
    parsedArgs = parseArguments(args);
  } catch (error) {
    usage();
    throw error;
  }

  const { mode, dryRun, filePath } = parsedArgs;
  const { endpoint, token } = loadAndValidateEndpoint();

  let sourceUrls;
  if (mode === 'one') sourceUrls = [HOME_URL];
  else if (mode === 'core') sourceUrls = await readUrlFile(DEFAULT_CORE_FILE);
  else if (mode === 'all') sourceUrls = await readSitemapUrls();
  else sourceUrls = await readUrlFile(filePath);

  const uniqueUrls = [...new Set(sourceUrls.map(normalizeUrl))];

  if (mode === 'file' && uniqueUrls.length > 9) {
    throw new Error('文件模式最多允许 9 个不重复 URL，未发送请求。');
  }
  if (mode === 'file' && uniqueUrls.includes(HOME_URL)) {
    throw new Error('文件模式禁止提交首页，未发送请求。');
  }
  if (!uniqueUrls.length) {
    throw new Error('没有可验证的 URL，未发送请求。');
  }

  const validatedUrls = await validatePages(uniqueUrls);
  const state = await readState();
  const pendingUrls = validatedUrls.filter((url) => !state.submitted[url]);

  if (mode === 'file' && pendingUrls.length !== validatedUrls.length) {
    throw new Error('文件中包含本机已记录提交的 URL，未发送请求。');
  }
  if (!pendingUrls.length) {
    throw new Error('没有新的待提交 URL，未发送请求。');
  }

  const requestBody = pendingUrls.join('\n');
  console.log('百度 Endpoint：已安全加载并通过验证');
  console.log(`站点：${SITE_ORIGIN}`);
  console.log(`提交模式：${mode}`);
  console.log(`URL 数量：${uniqueUrls.length}`);
  console.log(`URL 验证通过：${validatedUrls.length}`);
  if (mode === 'file') console.log('首页不在提交列表：是');
  console.log(`提交 URL 数量：${pendingUrls.length}`);
  console.log(`请求体字节数：${Buffer.byteLength(requestBody, 'utf8')}`);

  if (dryRun) {
    console.log('Dry Run：未实际发送请求。');
    return;
  }

  let response;
  try {
    response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'content-type': 'text/plain' },
      body: requestBody,
    });
  } catch {
    throw new Error('百度接口网络请求失败，未自动重试。');
  }

  const responseText = await response.text();
  const contentType = response.headers.get('content-type') ?? '未公开';
  let result = {};
  let parsedJson = false;
  try {
    result = JSON.parse(responseText);
    parsedJson = true;
  } catch {
    result = {};
  }

  const success = Number.isFinite(Number(result.success)) ? Number(result.success) : 0;
  const remain = Number.isFinite(Number(result.remain)) ? Number(result.remain) : '未公开';
  const notSameSite = countRejected(result.not_same_site);
  const notValid = countRejected(result.not_valid);
  const error = redact(result.error ?? '', endpoint, token) || '无';
  const message = redact(result.message ?? '', endpoint, token) || '无';

  console.log(`HTTP 状态：${response.status}`);
  console.log(`响应 Content-Type：${contentType}`);
  console.log(`提交 URL 数量：${pendingUrls.length}`);
  console.log(`success：${success}`);
  console.log(`remain：${remain}`);
  console.log(`not_same_site：${notSameSite}`);
  console.log(`not_valid：${notValid}`);
  console.log(`error：${error}`);
  console.log(`message：${message}`);

  if (response.status !== 200) {
    console.log(`百度响应正文：${redact(responseText || '(空)', endpoint, token)}`);
    if (!parsedJson) console.log('百度响应正文不是 JSON。');
    process.exitCode = 1;
    return;
  }

  if (success > 0) {
    const submittedAt = new Date().toISOString();
    for (const url of pendingUrls.slice(0, Math.min(success, pendingUrls.length))) {
      state.submitted[url] = submittedAt;
    }
    await writeState(state);
  }

  if (success !== pendingUrls.length || notSameSite || notValid || result.error) {
    process.exitCode = 1;
    return;
  }

  console.log(`百度已接收提交：${success} 条 URL。`);
}

main().catch((error) => {
  console.error(`百度提交错误：${error instanceof Error ? error.message : '未知错误'}`);
  process.exitCode = 1;
});