import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const auditUrl = new URL('../scripts/audit-model-sources.mjs', import.meta.url);
const freshnessUrl = new URL('../scripts/check-model-freshness.mjs', import.meta.url);
const reportUrl = new URL('../scripts/generate-model-audit-report.mjs', import.meta.url);

test('all three model audit scripts exist', () => {
  for (const url of [auditUrl, freshnessUrl, reportUrl]) assert.equal(existsSync(fileURLToPath(url)), true);
});

test('CLI entry guards work when the workspace resolves through a Windows junction', () => {
  for (const url of [auditUrl, freshnessUrl, reportUrl]) {
    const source = readFileSync(fileURLToPath(url), 'utf8');
    assert.match(source, /basename\(process\.argv\[1\]/);
  }
});

test('source audit detects redirects and reachability without mutating model data', async () => {
  const { auditSources } = await import(auditUrl);
  const fakeFetch = async (url) => ({ ok: true, status: 200, redirected: url.includes('redirect'), url: `${url}/final` });
  const result = await auditSources([
    { id: 'a', url: 'https://developers.openai.com/test' },
    { id: 'b', url: 'https://docs.x.ai/redirect' }
  ], { fetchImpl: fakeFetch });
  assert.equal(result.length, 2);
  assert.equal(result[0].reachable, true);
  assert.equal(result[1].redirected, true);
});

test('freshness audit checks review periods, lifecycle replacements and provenance', async () => {
  const { checkModelFreshness } = await import(freshnessUrl);
  const { allAiModels } = await import('../src/lib/model-data.mjs');
  const result = checkModelFreshness(allAiModels, { asOf: '2026-07-22' });
  assert.equal(result.errors.length, 0);
  assert.equal(result.summary.checkedModels, allAiModels.length);
  assert.ok(result.summary.checkedFacts > 0);
});

test('report generator returns Markdown with model, source, price and stale counts', async () => {
  const { buildAuditReport } = await import(reportUrl);
  const { archivedAiModels } = await import('../src/lib/model-data.mjs');
  const markdown = buildAuditReport();
  assert.match(markdown, /AI 模型数据审计报告/);
  assert.match(markdown, /当前模型/);
  assert.match(markdown, /官方来源/);
  assert.match(markdown, /价格完整模型/);
  assert.match(markdown, /过期数据/);
  assert.match(markdown, new RegExp(`排除与归档记录：${archivedAiModels.length}`));
  assert.doesNotMatch(markdown, /Kimi K3.*needs-review/);
  assert.match(markdown, /当前模型：31/);
});
