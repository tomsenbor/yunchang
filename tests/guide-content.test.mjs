import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getGuideCategory,
  getGuideContext,
  getGuidesByCategory,
  guideCategories,
  guideCategoryRoutes,
  guides,
  seoGuideSeeds
} from '../src/lib/guide-content.mjs';

const requiredCategorySlugs = [
  'ai-assistant',
  'ai-writing',
  'ai-search',
  'ai-office',
  'ai-image',
  'ai-video',
  'ai-coding',
  'ai-design',
  'ai-audio',
  'domestic-ai',
  'ai-tool-selection'
];

const requiredGuideFields = [
  'summary',
  'categorySlug',
  'author',
  'reviewer',
  'publishedAt',
  'updatedAt',
  'level',
  'searchIntent',
  'primaryKeyword',
  'faq',
  'topicSlugs',
  'relatedGuidesSlugs',
  'relatedToolsSlugs',
  'relatedVideosSlugs',
  'relatedComparisonsSlugs'
];

test('guide taxonomy exposes all public category routes', () => {
  assert.deepEqual(guideCategories.map((category) => category.slug), requiredCategorySlugs);
  assert.equal(new Set(guideCategoryRoutes).size, requiredCategorySlugs.length);

  for (const slug of requiredCategorySlugs) {
    assert.ok(getGuideCategory(slug), `${slug} category should exist`);
    assert.ok(getGuidesByCategory(slug).length > 0, `${slug} should contain at least one guide`);
    assert.ok(guideCategoryRoutes.includes(`/guides/category/${slug}`));
  }
});

test('every guide exposes complete content and relationship metadata', () => {
  const guideSlugs = new Set(guides.map((guide) => guide.slug));

  for (const guide of guides) {
    for (const field of requiredGuideFields) {
      assert.ok(Object.hasOwn(guide, field), `${guide.slug}.${field} should exist`);
    }

    assert.ok(!Number.isNaN(Date.parse(guide.publishedAt)), `${guide.slug}.publishedAt should be a valid date`);
    assert.ok(!Number.isNaN(Date.parse(guide.updatedAt)), `${guide.slug}.updatedAt should be a valid date`);
    assert.ok(getGuideCategory(guide.contentCategorySlug), `${guide.slug} should use a public guide category`);
    assert.ok(guide.summary, `${guide.slug}.summary should not be empty`);
    assert.ok(Array.isArray(guide.faq) && guide.faq.length >= 3, `${guide.slug}.faq should contain at least three items`);
    assert.ok(guide.topicSlugs.length > 0, `${guide.slug} should expose topics`);
    assert.ok(!guide.relatedGuidesSlugs.includes(guide.slug), `${guide.slug} should not recommend itself`);

    for (const relatedSlug of guide.relatedGuidesSlugs) {
      assert.ok(guideSlugs.has(relatedSlug), `${guide.slug} references missing guide ${relatedSlug}`);
    }
  }
});

test('first SEO growth batch adds exactly three guides to each target category', () => {
  const targetCategorySlugs = [
    'ai-assistant',
    'ai-writing',
    'ai-image',
    'ai-video',
    'ai-coding',
    'ai-search',
    'ai-office',
    'domestic-ai',
    'ai-tool-selection'
  ];

  assert.equal(seoGuideSeeds.length, 27);
  assert.equal(guides.length, 51);
  assert.equal(new Set(guides.map((guide) => guide.slug)).size, guides.length);

  for (const categorySlug of targetCategorySlugs) {
    const categoryGuides = seoGuideSeeds.filter((guide) => guide.categorySlug === categorySlug);
    assert.equal(categoryGuides.length, 3, `${categorySlug} should add exactly three guides`);
  }

  for (const seed of seoGuideSeeds) {
    const guide = guides.find((item) => item.slug === seed.slug);
    assert.ok(guide, `${seed.slug} should be available through the guide model`);
    assert.ok(getGuideCategory(seed.categorySlug), `${seed.categorySlug} should be a public category`);

    const context = getGuideContext(guide);
    assert.ok(context.relatedGuides.length >= seed.relatedGuidesSlugs.length);
    assert.ok(context.relatedTools.length >= seed.relatedToolsSlugs.length);
    assert.ok(context.relatedVideos.length >= seed.relatedVideosSlugs.length);
    assert.ok(context.relatedComparisons.length >= seed.relatedComparisonsSlugs.length);
  }
});

test('guide context resolves explicit relations without random ordering', () => {
  for (const guide of guides) {
    const context = getGuideContext(guide);
    assert.equal(context.category.slug, guide.contentCategorySlug);
    assert.deepEqual(
      context.relatedGuides.map((item) => item.slug),
      guide.relatedGuidesSlugs.filter((slug) => guides.some((item) => item.slug === slug))
    );
  }
});
