import assert from 'node:assert/strict';
import test from 'node:test';

import {
  aiModels, allAiModels, featuredDetailSlugs, getModelBySlug, modelFaqs,
  modelRoutes, modelSelectionSteps, modelTasks, modelVendors
} from '../src/lib/model-content.mjs';
import {
  buildComparisonRows, filterModels, getModelStats, getTaskSummaries,
  getVendorSummaries, searchModels, sortModels, toggleComparisonSlug
} from '../src/lib/model-explorer.mjs';

test('current catalog and lifecycle archive have deterministic unique records', () => {
  assert.equal(aiModels.length, 31);
  assert.equal(allAiModels.length, aiModels.length);
  assert.equal(modelVendors.length, 10);
  assert.equal(new Set(allAiModels.map((model) => model.slug)).size, aiModels.length);
  assert.deepEqual(aiModels.slice(0, 5).map((model) => model.name), [
    'GPT-5.6 Sol', 'GPT-5.6 Terra', 'GPT-5.6 Luna', 'GPT-5.3-Codex', 'gpt-oss-120b'
  ]);
});

test('featured current details and generated routes are deterministic', () => {
  assert.deepEqual(featuredDetailSlugs, ['gpt-5-6-sol', 'claude-sonnet-5', 'gemini-3-1-pro-preview']);
  assert.ok(featuredDetailSlugs.every((slug) => getModelBySlug(slug)?.detailLevel === 'featured'));
  assert.deepEqual(modelRoutes, allAiModels.map((model) => `/ai-models/${model.slug}`));
  assert.ok(modelRoutes.every((route) => route !== '/ai-models/compare'));
});

test('vendors, tasks, FAQ and selection steps retain the locked editorial counts', () => {
  assert.equal(modelVendors.length, 10);
  assert.equal(modelTasks.length, 6);
  assert.equal(modelFaqs.length, 8);
  assert.equal(modelSelectionSteps.length, 6);
});

test('stats are derived from current model facts', () => {
  const stats = getModelStats(aiModels, modelVendors);
  assert.equal(stats.modelCount, aiModels.length);
  assert.equal(stats.vendorCount, new Set(aiModels.map((model) => model.vendorSlug)).size);
  assert.equal(stats.reviewedCount, aiModels.length);
  assert.equal(stats.staleCount, 0);
  assert.equal(stats.updatedAt, '2026-07-22');
});

test('search matches names, official IDs, vendors, families, aliases and tasks', () => {
  assert.deepEqual(searchModels(aiModels, 'GPT', { vendors: modelVendors, tasks: modelTasks }).map((model) => model.slug), [
    'gpt-5-6-sol', 'gpt-5-6-terra', 'gpt-5-6-luna', 'gpt-5-3-codex', 'gpt-oss-120b', 'gpt-oss-20b'
  ]);
  assert.equal(searchModels(aiModels, 'Anthropic', { vendors: modelVendors, tasks: modelTasks }).length, 3);
  assert.equal(searchModels(aiModels, 'Llama', { vendors: modelVendors, tasks: modelTasks }).length, 2);
  assert.ok(searchModels(aiModels, '编程', { vendors: modelVendors, tasks: modelTasks }).some((model) => model.slug === 'gpt-5-3-codex'));
  assert.equal(searchModels(aiModels, '', { vendors: modelVendors, tasks: modelTasks }).length, aiModels.length);
});

test('filters combine official fields and lifecycle values', () => {
  assert.deepEqual(filterModels(aiModels, { vendorId: 'alibaba-cloud', taskId: 'coding' }).map((model) => model.slug), ['qwen3-7-max']);
  assert.equal(filterModels(allAiModels, { lifecycleStatus: 'current' }).length, aiModels.length);
  assert.equal(filterModels(allAiModels, { lifecycleStatus: 'deprecated' }).length, 0);
  assert.equal(filterModels(allAiModels, { lifecycleStatus: 'retired' }).length, 0);
  assert.deepEqual(filterModels(aiModels, { lifecycleStatus: 'preview' }).map((model) => model.slug), [
    'gemini-3-1-pro-preview', 'deepseek-v4-pro', 'deepseek-v4-flash', 'grok-build-0-1'
  ]);
  assert.ok(filterModels(aiModels, { contextBucket: 'long' }).length > 0);
  assert.ok(filterModels(aiModels, { priceBucket: 'low' }).length > 0);
});

test('numeric and date sorts keep unknown values at the end', () => {
  for (const key of ['latest', 'context', 'price']) {
    const sorted = sortModels(aiModels, key);
    assert.equal(sorted.length, aiModels.length);
  }
  assert.equal(sortModels(aiModels, 'context')[0].slug, 'llama-4-scout');
  assert.equal(sortModels(aiModels, 'price')[0].slug, 'ministral-3-3b');
});

test('comparison selection remains deterministic and capped at four', () => {
  let selected = [];
  for (const slug of ['gpt-5-6-sol', 'claude-sonnet-5', 'gemini-3-1-pro-preview', 'deepseek-v4-pro']) selected = toggleComparisonSlug(selected, slug);
  assert.equal(selected.length, 4);
  assert.deepEqual(toggleComparisonSlug(selected, 'qwen3-7-max'), selected);
  assert.deepEqual(toggleComparisonSlug(selected, 'gpt-5-6-sol'), selected.slice(1));
});

test('comparison rows use sourced fields and never expose ranking', () => {
  const rows = buildComparisonRows(aiModels.slice(0, 2));
  assert.deepEqual(rows.map((row) => row.label), [
    '模型', '官方模型 ID', '厂商', '家族', '生命周期', '模型类型', '上下文', '最大输出',
    '输入模态', '输出模态', '推理模式', 'API', '开放权重', '标准输入价格', '标准输出价格', '最后核查'
  ]);
  assert.doesNotMatch(JSON.stringify(rows), /score|rank|benchmark|综合总分/i);
});

test('vendor and task summaries are derived from current records', () => {
  const vendors = getVendorSummaries(aiModels, modelVendors);
  const tasks = getTaskSummaries(aiModels, modelTasks);
  assert.equal(vendors.length, 10);
  assert.equal(vendors.reduce((sum, vendor) => sum + vendor.modelCount, 0), aiModels.length);
  assert.equal(tasks.length, 6);
  assert.ok(tasks.every((task) => task.modelCount > 0));
});
