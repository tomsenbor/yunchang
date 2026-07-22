import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const dataUrl = new URL('../src/lib/model-data.mjs', import.meta.url);
const sourcesUrl = new URL('../src/lib/model-sources.mjs', import.meta.url);
const dataExists = existsSync(fileURLToPath(dataUrl));
const sourcesExist = existsSync(fileURLToPath(sourcesUrl));
const dataModule = dataExists ? await import(dataUrl) : null;
const sourceModule = sourcesExist ? await import(sourcesUrl) : null;
const explorerModule = await import('../src/lib/model-explorer.mjs');

const factKeys = ['value', 'unit', 'status', 'sourceId', 'verifiedAt', 'note'];
const requiredModelKeys = [
  'slug', 'name', 'officialModelId', 'officialAliases', 'snapshotId', 'snapshotIds', 'vendorSlug',
  'familySlug', 'productLine', 'version', 'lifecycleStatus', 'releaseChannel', 'releaseDate',
  'deprecationDate', 'shutdownDate', 'replacementModelSlug', 'knowledgeCutoff',
  'contextWindow', 'maxOutputTokens', 'inputModalities', 'outputModalities',
  'reasoningModes', 'reasoningEffortLevels', 'functionCalling', 'toolCalling',
  'structuredOutput', 'webSearch', 'fileSearch', 'computerUse', 'codeExecution',
  'fineTuning', 'batchApi', 'promptCaching', 'apiAvailable', 'webAvailable',
  'openWeights', 'license', 'parameterCount', 'activeParameterCount',
  'localDeployment', 'regions', 'lastVerifiedAt', 'nextReviewAt', 'sourceIds', 'pricing'
];

test('official model data and source registries exist', () => {
  assert.equal(dataExists, true, 'src/lib/model-data.mjs should exist');
  assert.equal(sourcesExist, true, 'src/lib/model-sources.mjs should exist');
});

test('current catalog contains the official-confirmed unique models and retains ten vendor entry cards', { skip: !dataModule }, () => {
  const { currentAiModels, modelVendors } = dataModule;
  assert.equal(currentAiModels.length, 31);
  assert.equal(modelVendors.length, 10);
  assert.equal(new Set(currentAiModels.map((model) => model.slug)).size, currentAiModels.length);
  assert.equal(new Set(currentAiModels.map((model) => model.vendorSlug)).size, 10);
});

test('every model exposes the publishable schema and an official ID state', { skip: !dataModule }, () => {
  for (const model of dataModule.allAiModels) {
    for (const key of requiredModelKeys) assert.ok(key in model, `${model.slug} missing ${key}`);
    if (typeof model.officialModelId === 'string') {
      assert.ok(model.officialModelId.trim(), `${model.slug} officialModelId must not be empty`);
    } else {
      assert.equal(model.officialModelId.value, null);
      assert.equal(model.officialModelId.status, 'unpublished');
      assert.ok(model.officialModelId.sourceId);
      assert.match(model.officialModelId.verifiedAt, /^\d{4}-\d{2}-\d{2}$/);
    }
  }
});

test('field facts use the six-part provenance shape', { skip: !dataModule }, () => {
  const fields = [
    'releaseDate', 'knowledgeCutoff', 'contextWindow', 'maxOutputTokens',
    'inputModalities', 'outputModalities', 'reasoningModes', 'reasoningEffortLevels',
    'functionCalling', 'toolCalling', 'structuredOutput', 'webSearch', 'fileSearch',
    'computerUse', 'codeExecution', 'fineTuning', 'batchApi', 'promptCaching',
    'apiAvailable', 'webAvailable', 'openWeights', 'license', 'parameterCount',
    'activeParameterCount', 'localDeployment', 'regions'
  ];
  for (const model of dataModule.allAiModels) {
    for (const field of fields) {
      assert.ok(factKeys.every((key) => key in model[field]), `${model.slug}.${field} has invalid provenance shape`);
    }
  }
});

test('verified exact values always carry a valid sourceId and verifiedAt', { skip: !dataModule || !sourceModule }, () => {
  const sourceIds = new Set(sourceModule.modelSources.map((source) => source.id));
  for (const model of dataModule.allAiModels) {
    for (const [field, fact] of Object.entries(model)) {
      if (!fact || typeof fact !== 'object' || Array.isArray(fact) || fact.status !== 'verified') continue;
      assert.ok(fact.sourceId, `${model.slug}.${field} missing sourceId`);
      assert.ok(sourceIds.has(fact.sourceId), `${model.slug}.${field} has unknown sourceId`);
      assert.match(fact.verifiedAt, /^\d{4}-\d{2}-\d{2}$/, `${model.slug}.${field} missing verifiedAt`);
    }
  }
});

test('all registered sources use an allowed official host', { skip: !sourceModule }, () => {
  for (const source of sourceModule.modelSources) {
    const hostname = new URL(source.url).hostname.toLowerCase();
    assert.ok(sourceModule.isAllowedOfficialSource(source.url), `${source.id} uses disallowed host ${hostname}`);
    assert.match(source.accessedAt, /^\d{4}-\d{2}-\d{2}$/);
  }
});

test('active models have at least one official source', { skip: !dataModule || !sourceModule }, () => {
  const sourceIds = new Set(sourceModule.modelSources.map((source) => source.id));
  for (const model of dataModule.currentAiModels) {
    assert.ok(model.sourceIds.length >= 1, `${model.slug} has no source`);
    assert.ok(model.sourceIds.every((id) => sourceIds.has(id)), `${model.slug} has invalid source`);
  }
});

test('pricing records include currency and billing unit whenever exact standard prices exist', { skip: !dataModule }, () => {
  for (const model of dataModule.allAiModels) {
    const values = Object.values(model.pricing.standard || {}).filter((value) => typeof value === 'number');
    if (!values.length) continue;
    assert.ok(model.pricing.currency, `${model.slug} pricing currency missing`);
    assert.ok(model.pricing.billingUnit, `${model.slug} billing unit missing`);
    assert.ok(model.pricing.sourceId, `${model.slug} pricing source missing`);
    assert.match(model.pricing.verifiedAt, /^\d{4}-\d{2}-\d{2}$/);
  }
});

test('numeric fields never use vague strings as values', { skip: !dataModule }, () => {
  for (const model of dataModule.allAiModels) {
    for (const field of ['contextWindow', 'maxOutputTokens', 'parameterCount', 'activeParameterCount']) {
      assert.doesNotMatch(String(model[field].value ?? ''), /以官方|待核对/);
    }
  }
});

test('deprecated and retired models have lifecycle evidence and valid replacements', { skip: !dataModule }, () => {
  const slugs = new Set(dataModule.allAiModels.map((model) => model.slug));
  for (const model of dataModule.allAiModels) {
    if (model.lifecycleStatus === 'deprecated') {
      assert.ok(model.deprecationSourceId, `${model.slug} missing deprecation source`);
    }
    if (model.lifecycleStatus === 'retired') {
      assert.ok(model.shutdownDate.value || model.shutdownDate.note, `${model.slug} missing shutdown evidence`);
    }
    if (model.replacementModelSlug) {
      assert.ok(slugs.has(model.replacementModelSlug), `${model.slug} replacement is invalid`);
      const replacement = dataModule.allAiModels.find((item) => item.slug === model.replacementModelSlug);
      assert.ok(!['deprecated', 'retired'].includes(replacement.lifecycleStatus), `${model.slug} points to inactive replacement`);
    }
  }
});

test('current models never use deprecated or retired lifecycle values', { skip: !dataModule }, () => {
  assert.ok(dataModule.currentAiModels.every((model) => !['deprecated', 'retired'].includes(model.lifecycleStatus)));
});

test('model routes are generated only from actual detail records and exclude compare', { skip: !dataModule }, () => {
  assert.deepEqual(dataModule.modelRoutes, dataModule.allAiModels.map((model) => `/ai-models/${model.slug}`));
  assert.ok(dataModule.modelRoutes.every((route) => route !== '/ai-models/compare'));
});

test('data transparency statistics are derived from fields', { skip: !dataModule }, () => {
  const stats = dataModule.getModelDataStats(dataModule.currentAiModels, dataModule.modelSources);
  assert.equal(stats.currentModelCount, dataModule.currentAiModels.length);
  assert.equal(stats.verifiedModelCount, dataModule.currentAiModels.length);
  assert.ok(stats.verifiedFieldCount > 0);
  assert.ok(stats.officialUnpublishedFieldCount >= 0);
  assert.ok(stats.sourceCount > 0);
  assert.ok(stats.priceCompleteModelCount > 0);
});

test('official benchmark records cannot become an aggregate score', { skip: !dataModule }, () => {
  for (const model of dataModule.allAiModels) {
    assert.equal('overallScore' in model, false);
    assert.ok(Array.isArray(model.benchmarks));
    for (const benchmark of model.benchmarks) {
      for (const key of ['benchmarkName', 'score', 'unit', 'evaluationVariant', 'testConditions', 'comparedModels', 'sourceId', 'publishedAt', 'verifiedAt', 'notes']) {
        assert.ok(key in benchmark, `${model.slug} benchmark missing ${key}`);
      }
    }
  }
});

test('explorer formats verified facts and official price tiers without inventing values', { skip: !dataModule }, () => {
  const sol = dataModule.getModelBySlug('gpt-5-6-sol');
  assert.equal(explorerModule.formatModelFact(sol.contextWindow), '1.05M tokens');
  assert.equal(explorerModule.formatModelFact(sol.maxOutputTokens), '128K tokens');
  assert.equal(explorerModule.formatStandardPrice(sol.pricing, 'input'), '$5 / 1M tokens');
  assert.equal(explorerModule.formatStandardPrice(sol.pricing, 'output'), '$30 / 1M tokens');
  assert.equal(explorerModule.formatModelFact(dataModule.getModelBySlug('gemini-3-6-flash').contextWindow), '1.05M tokens');
  const kimi = dataModule.getModelBySlug('kimi-k3');
  assert.equal(explorerModule.formatModelFact(kimi.contextWindow), '1M tokens');
  assert.equal(explorerModule.formatModelFact(kimi.parameterCount), '2.8T 参数');
  assert.equal(explorerModule.formatModelFact(kimi.apiAvailable), '官方尚未公开');
  assert.equal(explorerModule.formatStandardPrice(kimi.pricing, 'input'), '官方尚未公开');
});

test('explorer filters lifecycle values and keeps archived models out of current defaults', { skip: !dataModule }, () => {
  assert.equal(explorerModule.filterModels(dataModule.allAiModels, { lifecycleStatus: 'deprecated' }).length, 0);
  assert.equal(explorerModule.filterModels(dataModule.allAiModels, { lifecycleStatus: 'retired' }).length, 0);
  assert.equal(explorerModule.filterModels(dataModule.currentAiModels, {}).length, dataModule.currentAiModels.length);
});
