import { fileURLToPath } from 'node:url';
import { basename } from 'node:path';
import { isAllowedOfficialSource, modelSources } from '../src/lib/model-sources.mjs';

export async function auditSources(sources = modelSources, { fetchImpl = globalThis.fetch, timeoutMs = 12000 } = {}) {
  return Promise.all(sources.map(async (source) => {
    if (!isAllowedOfficialSource(source.url)) {
      return { id: source.id, url: source.url, reachable: false, status: null, redirected: false, finalUrl: null, error: 'disallowed-host' };
    }
    try {
      const response = await fetchImpl(source.url, {
        method: 'GET', redirect: 'follow', signal: AbortSignal.timeout(timeoutMs),
        headers: { 'user-agent': 'AIModelSourceAudit/1.0 (+offline editorial verification)' }
      });
      return {
        id: source.id, url: source.url, reachable: response.ok || [401, 403, 405, 429].includes(response.status),
        status: response.status, redirected: Boolean(response.redirected), finalUrl: response.url || source.url, error: null
      };
    } catch (error) {
      return { id: source.id, url: source.url, reachable: false, status: null, redirected: false, finalUrl: null, error: error.message };
    }
  }));
}

async function main() {
  const results = await auditSources();
  const reachable = results.filter((item) => item.reachable).length;
  const redirected = results.filter((item) => item.redirected).length;
  const unreachable = results.filter((item) => !item.reachable);
  console.log(`官方来源审计：${reachable}/${results.length} 可访问，${redirected} 个发生重定向，${unreachable.length} 个需人工复核。`);
  for (const item of unreachable) console.log(`- ${item.id}: ${item.error || `HTTP ${item.status}`}`);
}

if (process.argv[1] && basename(process.argv[1]) === basename(fileURLToPath(import.meta.url))) await main();
