import test from 'node:test';
import assert from 'node:assert/strict';
import { getGuideContext, guides } from '../src/lib/guide-content.mjs';

function fallbackPriority(guide, candidate) {
  return [
    Number(candidate.searchIntent === guide.searchIntent),
    Number(Boolean(guide.toolSlug && candidate.toolSlug === guide.toolSlug))
  ];
}

test('every guide exposes deterministic and valid related content', () => {
  for (const guide of guides) {
    const firstContext = getGuideContext(guide);
    const secondContext = getGuideContext(guide);
    const allRelationSlugs = [
      ...guide.relatedGuidesSlugs,
      ...guide.relatedToolsSlugs,
      ...guide.relatedVideosSlugs,
      ...guide.relatedComparisonsSlugs
    ];

    assert.deepEqual(secondContext, firstContext, `${guide.slug} relationships should be deterministic`);
    assert.ok(guide.relatedGuidesSlugs.length >= 3, `${guide.slug} should link at least three guides`);
    assert.ok(allRelationSlugs.length >= 3, `${guide.slug} should expose at least three related links`);
    assert.ok(!guide.relatedGuidesSlugs.includes(guide.slug), `${guide.slug} should not link to itself`);

    for (const slugs of [
      guide.relatedGuidesSlugs,
      guide.relatedToolsSlugs,
      guide.relatedVideosSlugs,
      guide.relatedComparisonsSlugs
    ]) {
      assert.equal(new Set(slugs).size, slugs.length, `${guide.slug} relationship lists should not contain duplicates`);
    }

    assert.equal(firstContext.relatedGuides.length, guide.relatedGuidesSlugs.length);
    assert.equal(firstContext.relatedTools.length, guide.relatedToolsSlugs.length);
    assert.equal(firstContext.relatedVideos.length, guide.relatedVideosSlugs.length);
    assert.equal(firstContext.relatedComparisons.length, guide.relatedComparisonsSlugs.length);
  }
});

test('guide relationships prioritize category, search intent, and tool without randomness', () => {
  for (const guide of guides) {
    const relatedGuides = getGuideContext(guide).relatedGuides;
    const sameCategoryCandidates = guides.filter((candidate) => (
      candidate.slug !== guide.slug
      && candidate.contentCategorySlug === guide.contentCategorySlug
    ));
    const expectedSameCategoryCount = Math.min(3, sameCategoryCandidates.length);
    const actualSameCategory = relatedGuides.filter((candidate) => (
      candidate.contentCategorySlug === guide.contentCategorySlug
    ));

    assert.equal(
      actualSameCategory.length,
      expectedSameCategoryCount,
      `${guide.slug} should use all available same-category slots first`
    );

    const fallbackGuides = relatedGuides.filter((candidate) => (
      candidate.contentCategorySlug !== guide.contentCategorySlug
    ));

    for (let index = 1; index < fallbackGuides.length; index += 1) {
      const previousPriority = fallbackPriority(guide, fallbackGuides[index - 1]);
      const currentPriority = fallbackPriority(guide, fallbackGuides[index]);
      assert.ok(
        previousPriority[0] > currentPriority[0]
          || (previousPriority[0] === currentPriority[0] && previousPriority[1] >= currentPriority[1]),
        `${guide.slug} fallback relationships should prioritize intent before tool`
      );
    }
  }
});

test('guide detail page uses the unified related content component', async () => {
  const { readFile } = await import('node:fs/promises');
  const page = await readFile(new URL('../src/app/guides/[slug]/page.js', import.meta.url), 'utf8');
  const component = await readFile(new URL('../src/components/GuideRelatedContent.jsx', import.meta.url), 'utf8');

  assert.match(page, /GuideRelatedContent/);
  for (const heading of ['相关文章', '相关工具', '相关视频', '工具对比']) {
    assert.ok(component.includes(heading), `GuideRelatedContent should render ${heading}`);
  }
});
