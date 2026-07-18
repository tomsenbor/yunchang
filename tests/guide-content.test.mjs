import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getGuideCategory,
  getGuideContext,
  getGuidesByCategory,
  guideCategories,
  guideCategoryRoutes,
  guides
} from '../src/lib/guide-content.mjs';

const requiredCategorySlugs = [
  'ai-assistant',
  'ai-writing',
  'ai-search',
  'ai-image',
  'ai-video',
  'ai-coding',
  'ai-design',
  'ai-audio',
  'domestic-ai'
];

const requiredGuideFields = [
  'publishedAt',
  'updatedAt',
  'level',
  'searchIntent',
  'primaryKeyword',
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
    assert.ok(guide.topicSlugs.length > 0, `${guide.slug} should expose topics`);
    assert.ok(!guide.relatedGuidesSlugs.includes(guide.slug), `${guide.slug} should not recommend itself`);

    for (const relatedSlug of guide.relatedGuidesSlugs) {
      assert.ok(guideSlugs.has(relatedSlug), `${guide.slug} references missing guide ${relatedSlug}`);
    }
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
