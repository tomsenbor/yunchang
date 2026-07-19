import assert from 'node:assert/strict';
import test from 'node:test';
import { comparisons, videos } from '../src/lib/site-data.mjs';
import { guides } from '../src/lib/guide-content.mjs';
import {
  getTool,
  getToolRelations,
  getToolsByCategory,
  toolCategories,
  toolCategoryRoutes,
  toolRoutes,
  tools
} from '../src/lib/tool-content.mjs';
import { toolExpansionSeeds } from '../src/lib/tool-expansion-seeds.mjs';
import { coreToolQualitySlugs } from '../src/lib/tool-quality-profiles.mjs';

const prioritySlugs = [
  'chatgpt',
  'claude',
  'gemini',
  'kimi',
  'deepseek',
  'cursor',
  'canva-ai',
  'runway',
  'elevenlabs'
];

test('tool content model exposes the required structured fields', () => {
  assert.equal(tools.length, 100);
  assert.equal(toolExpansionSeeds.length, 75);
  assert.equal(new Set(tools.map((tool) => tool.slug)).size, 100);

  for (const tool of tools) {
    assert.equal(typeof tool.developer, 'string', `${tool.slug} should expose developer`);
    assert.equal(typeof tool.officialUrl, 'string', `${tool.slug} should expose officialUrl`);
    assert.equal(typeof tool.pricing, 'string', `${tool.slug} should expose pricing`);
    assert.ok(Array.isArray(tool.platforms), `${tool.slug} should expose platforms`);
    assert.ok(Array.isArray(tool.capabilities), `${tool.slug} should expose capabilities`);
    assert.ok(Array.isArray(tool.useCases), `${tool.slug} should expose useCases`);
    assert.ok(Array.isArray(tool.searchKeywords), `${tool.slug} should expose searchKeywords`);
    assert.ok(Array.isArray(tool.relatedGuides), `${tool.slug} should expose relatedGuides`);
    assert.ok(Array.isArray(tool.relatedVideos), `${tool.slug} should expose relatedVideos`);
    assert.ok(Array.isArray(tool.relatedComparisons), `${tool.slug} should expose relatedComparisons`);
  }
});

test('the first expansion batch is represented without duplicating existing tools', () => {
  const requestedSlugs = [
    'grok', 'perplexity', 'microsoft-copilot', 'poe', 'character-ai',
    'midjourney', 'dall-e', 'stable-diffusion', 'leonardo-ai', 'ideogram',
    'pika', 'kling-ai', 'luma-dream-machine', 'heygen', 'synthesia',
    'cursor', 'windsurf', 'replit-ai', 'github-copilot', 'claude-code'
  ];
  const slugs = new Set(tools.map((tool) => tool.slug));
  for (const slug of requestedSlugs) assert.ok(slugs.has(slug), `${slug} should exist`);
  assert.equal(toolRoutes.length, 100);
  assert.equal(new Set(toolRoutes).size, 100);
});

test('core tools meet the pre-publication content quality thresholds', () => {
  assert.equal(coreToolQualitySlugs.length, 25);

  for (const slug of coreToolQualitySlugs) {
    const tool = getTool(slug);
    assert.ok(tool, `${slug} should exist`);
    const seoLength = [...tool.seoDescription].length;
    const metaLength = [...tool.metaDescription].length;
    assert.ok(seoLength >= 80 && seoLength <= 150, `${slug} SEO description length is ${seoLength}`);
    assert.ok(metaLength >= 120 && metaLength <= 160, `${slug} meta description length is ${metaLength}`);
    assert.ok(tool.capabilities.length >= 5, `${slug} should have at least 5 capabilities`);
    assert.ok(tool.useCases.length >= 4, `${slug} should have at least 4 use cases`);
    assert.ok(tool.pros.length >= 3, `${slug} should have at least 3 pros`);
    assert.ok(tool.cons.length >= 2, `${slug} should have at least 2 limitations`);
    assert.ok(tool.relatedGuides.length >= 3, `${slug} should have at least 3 related guides`);
    assert.ok(tool.relatedComparisons.length >= 1, `${slug} should have a related comparison`);
    assert.ok(tool.relatedVideos.length >= 1, `${slug} should have a related video`);
    assert.match(tool.updatedAt, /^\d{4}-\d{2}-\d{2}$/);
  }
});

test('priority tools have complete core metadata', () => {
  for (const slug of prioritySlugs) {
    const tool = getTool(slug);
    assert.ok(tool, `${slug} should exist`);
    assert.notEqual(tool.developer, '待核对', `${slug} should have a verified developer label`);
    assert.match(tool.officialUrl, /^https:\/\//, `${slug} should have an HTTPS official URL`);
    assert.ok(tool.pricing.length > 0, `${slug} should have pricing guidance`);
    assert.ok(tool.platforms.length > 0, `${slug} should have platforms`);
    assert.ok(tool.capabilities.length > 0, `${slug} should have capabilities`);
    assert.ok(tool.useCases.length > 0, `${slug} should have use cases`);
  }
});

test('tool category routes are stable and resolve deterministic tool lists', () => {
  assert.deepEqual(toolCategoryRoutes, [
    '/ai-tools/category/chatbot',
    '/ai-tools/category/image-ai',
    '/ai-tools/category/video-ai',
    '/ai-tools/category/coding-ai'
  ]);
  assert.equal(toolCategories.length, 4);

  for (const category of toolCategories) {
    const categoryTools = getToolsByCategory(category.slug);
    assert.ok(categoryTools.length >= 17, `${category.slug} should contain a meaningful tool set`);
    assert.deepEqual(categoryTools.map((tool) => tool.slug), category.toolSlugs);
  }
});

test('tool relationships only reference existing guides, videos and comparisons', () => {
  const guideSlugs = new Set(guides.map((guide) => guide.slug));
  const videoSlugs = new Set(videos.map((video) => video.slug));
  const comparisonSlugs = new Set(comparisons.map((comparison) => comparison.slug));

  for (const tool of tools) {
    assert.equal(new Set(tool.relatedGuides).size, tool.relatedGuides.length);
    assert.equal(new Set(tool.relatedVideos).size, tool.relatedVideos.length);
    assert.equal(new Set(tool.relatedComparisons).size, tool.relatedComparisons.length);
    assert.ok(tool.relatedGuides.every((slug) => guideSlugs.has(slug)));
    assert.ok(tool.relatedVideos.every((slug) => videoSlugs.has(slug)));
    assert.ok(tool.relatedComparisons.every((slug) => comparisonSlugs.has(slug)));

    const relations = getToolRelations(tool.slug);
    assert.deepEqual(relations.guides.map((item) => item.slug), tool.relatedGuides);
    assert.deepEqual(relations.videos.map((item) => item.slug), tool.relatedVideos);
    assert.deepEqual(relations.comparisons.map((item) => item.slug), tool.relatedComparisons);
  }
});
