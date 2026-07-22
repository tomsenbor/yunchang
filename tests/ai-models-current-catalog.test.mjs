import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import {
  archivedAiModels,
  currentAiModels,
  getModelDataStats,
  getModelBySlug,
  modelRoutes
} from '../src/lib/model-data.mjs';
import { filterModels, getVendorSummaries, searchModels } from '../src/lib/model-explorer.mjs';
import { modelTasks, modelVendors } from '../src/lib/model-content.mjs';
import { modelSourceById } from '../src/lib/model-sources.mjs';

const expectedCurrentSlugs = [
  'gpt-5-6-sol',
  'gpt-5-6-terra',
  'gpt-5-6-luna',
  'gpt-5-3-codex',
  'gpt-oss-120b',
  'gpt-oss-20b',
  'claude-sonnet-5',
  'claude-opus-4-8',
  'claude-haiku-4-5',
  'gemini-3-1-pro-preview',
  'gemini-3-6-flash',
  'gemini-3-5-flash-lite',
  'deepseek-v4-pro',
  'deepseek-v4-flash',
  'qwen3-7-max',
  'qwen3-7-plus',
  'qwen3-6-flash',
  'llama-4-scout',
  'llama-4-maverick',
  'grok-4-5',
  'grok-build-0-1',
  'mistral-medium-3-5',
  'mistral-small-4',
  'mistral-large-3',
  'ministral-3-14b',
  'ministral-3-8b',
  'ministral-3-3b',
  'codestral-25-08',
  'kimi-k3',
  'glm-5-2',
  'glm-5v-turbo'
];

const removedSlugs = [
  'gemini-3-5-flash',
  'gemini-3-1-flash-lite',
  'qwen3-5-omni-plus',
  'grok-4-3',
  'codestral-25-01',
  'kimi-k2-5',
  'kimi-k2-instruct',
  'glm-5-turbo',
  'gpt-4o',
  'claude-sonnet-4',
  'deepseek-chat'
];

test('currentModels contains only the official-confirmed latest catalog', () => {
  assert.deepEqual(currentAiModels.map((model) => model.slug), expectedCurrentSlugs);
  assert.ok(currentAiModels.every((model) => ['stable', 'preview', 'open-weight'].includes(model.lifecycleStatus)));
  assert.ok(currentAiModels.every((model) => (
    typeof model.officialModelId === 'string'
      ? model.officialModelId.trim().length > 0
      : model.officialModelId?.status === 'unpublished' && model.officialModelId.value === null
  )));
});

test('Kimi K3 is a current web product without fabricated API identity or pricing', () => {
  const kimi = getModelBySlug('kimi-k3');
  assert.ok(kimi);
  assert.equal(kimi.vendorSlug, 'moonshot-ai');
  assert.equal(kimi.displayName, 'Kimi K3');
  assert.equal(kimi.familySlug, 'kimi');
  assert.equal(kimi.lifecycleStatus, 'stable');
  assert.equal(kimi.releaseChannel, 'official-product');
  assert.equal(kimi.officialModelId.value, null);
  assert.equal(kimi.officialModelId.status, 'unpublished');
  assert.equal(kimi.apiAvailable.status, 'unpublished');
  assert.equal(kimi.apiAvailable.value, null);
  assert.equal(kimi.webAvailable.value, true);
  assert.equal(kimi.pricing.status, 'unpublished');
  assert.deepEqual(kimi.pricing.standard, { input: null, cachedInput: null, output: null });
  assert.equal(kimi.maxOutputTokens.value, null);
  assert.equal(kimi.knowledgeCutoff.value, null);
  assert.doesNotMatch(modelVendors.find((vendor) => vendor.id === 'moonshot-ai').positioning, /开放权重/);
  assert.equal(modelSourceById.get('moonshot-kimi-k3').crossChecked, false);
});

test('Kimi K3 exact product facts carry field-level official provenance', () => {
  const kimi = getModelBySlug('kimi-k3');
  for (const field of ['positioning', 'releaseDate', 'contextWindow', 'inputModalities', 'parameterCount', 'webAvailable']) {
    const fact = kimi[field];
    assert.equal(fact.status, 'verified', `kimi-k3.${field} must be verified`);
    assert.equal(fact.sourceId, 'moonshot-kimi-k3');
    assert.equal(fact.verifiedAt, '2026-07-22');
    assert.equal(fact.verificationMethod, 'manual-official-page-review');
  }
});

test('each current product line appears once and carries explicit provenance', () => {
  const productLines = currentAiModels.map((model) => `${model.vendorSlug}:${model.productLine}`);
  assert.equal(new Set(productLines).size, currentAiModels.length);
  assert.ok(currentAiModels.every((model) => model.sourceIds.length > 0));
});

test('aliases, snapshots and archived records never generate canonical detail routes', () => {
  const currentRoutes = currentAiModels.map((model) => `/ai-models/${model.slug}`);
  assert.deepEqual(modelRoutes, currentRoutes);
  for (const model of currentAiModels) {
    for (const alias of model.officialAliases.filter((value) => value !== model.slug)) {
      assert.ok(!modelRoutes.includes(`/ai-models/${alias}`));
    }
    for (const snapshot of model.snapshotIds) assert.ok(!modelRoutes.includes(`/ai-models/${snapshot}`));
  }
  for (const slug of removedSlugs) {
    assert.ok(!modelRoutes.includes(`/ai-models/${slug}`), `${slug} must not have a route`);
    assert.equal(getModelBySlug(slug), undefined, `${slug} must not resolve as a current detail`);
  }
  assert.ok(archivedAiModels.some((model) => model.slug === 'gpt-4o'));
});

test('Gemini Pro remains an explicitly dated preview, not stable or GA', () => {
  const preview = getModelBySlug('gemini-3-1-pro-preview');
  assert.equal(preview.lifecycleStatus, 'preview');
  assert.equal(preview.releaseChannel, 'preview');
  assert.equal(preview.releaseDate.value, '2026-02-19');
  assert.equal(preview.releaseDate.status, 'verified');
});

test('search and vendor counts are derived exclusively from currentModels', () => {
  assert.equal(searchModels(currentAiModels, '', { vendors: modelVendors, tasks: modelTasks }).length, expectedCurrentSlugs.length);
  assert.equal(searchModels(currentAiModels, 'Grok 4.3', { vendors: modelVendors, tasks: modelTasks }).length, 0);
  const summaries = getVendorSummaries(currentAiModels, modelVendors);
  assert.equal(summaries.reduce((total, vendor) => total + vendor.modelCount, 0), expectedCurrentSlugs.length);
  assert.equal(summaries.find((vendor) => vendor.id === 'moonshot-ai').modelCount, 1);
});

test('Kimi K3 participates in product filters but not API availability', () => {
  assert.deepEqual(filterModels(currentAiModels, { vendorId: 'moonshot-ai' }).map((model) => model.slug), ['kimi-k3']);
  assert.deepEqual(filterModels(currentAiModels, { family: 'Kimi' }).map((model) => model.slug), ['kimi-k3']);
  assert.ok(filterModels(currentAiModels, { modality: '原生多模态' }).some((model) => model.slug === 'kimi-k3'));
  assert.ok(filterModels(currentAiModels, { taskId: 'multimodal' }).some((model) => model.slug === 'kimi-k3'));
  assert.ok(!filterModels(currentAiModels, { apiAvailability: 'true' }).some((model) => model.slug === 'kimi-k3'));
});

test('catalog transparency statistics are derived from current models only', () => {
  const stats = getModelDataStats();
  assert.equal(stats.currentModelCount, currentAiModels.length);
  assert.equal(stats.vendorCount, new Set(currentAiModels.map((model) => model.vendorSlug)).size);
  assert.equal(stats.familyCount, new Set(currentAiModels.map((model) => model.familySlug)).size);
  assert.equal(stats.apiModelCount, currentAiModels.filter((model) => model.apiAvailable.value === true).length);
  assert.equal(stats.openWeightModelCount, currentAiModels.filter((model) => model.openWeights.value === true).length);
  assert.equal(stats.previewModelCount, currentAiModels.filter((model) => model.releaseChannel === 'preview').length);
  assert.equal(stats.sitemapUrlCount, modelRoutes.length + 1);
  assert.equal(stats.currentModelCount, 31);
  assert.equal(stats.vendorCount, 10);
  assert.equal(stats.familyCount, 15);
  assert.equal(stats.apiModelCount, 26);
  assert.equal(stats.sitemapUrlCount, 32);
});

test('overview, detail generation and sitemap consume current model routes only', async () => {
  const [overview, detail, sitemap] = await Promise.all([
    readFile(new URL('../src/app/ai-models/page.js', import.meta.url), 'utf8'),
    readFile(new URL('../src/app/ai-models/[slug]/page.js', import.meta.url), 'utf8'),
    readFile(new URL('../src/app/sitemap.js', import.meta.url), 'utf8')
  ]);
  assert.match(overview, /catalogModels=\{aiModels\}/);
  assert.match(detail, /currentAiModels\.map/);
  assert.doesNotMatch(detail, /allAiModels\.map/);
  assert.match(sitemap, /modelRoutes/);
  assert.ok(modelRoutes.includes('/ai-models/kimi-k3'));
  assert.doesNotMatch(`${overview}\n${detail}\n${sitemap}`, /\/ai-models\/compare/);
});
