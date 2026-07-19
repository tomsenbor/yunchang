import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { guides } from '../src/lib/guide-content.mjs';

const intentQuestionPatterns = {
  learn: /零基础|学习|核查/,
  compare: /比较|验证比较结果/,
  choose: /选择|适合自己的工作流/,
  workflow: /工作流|工作场景|复核/
};

test('all guides expose reviewed authorship, supported intent, and intent-aligned FAQ', () => {
  const intentCounts = new Map();

  for (const guide of guides) {
    assert.equal(guide.author, 'AI效率工具库编辑团队');
    assert.equal(guide.reviewer, 'AI工具研究组');
    assert.ok(['learn', 'compare', 'choose', 'workflow'].includes(guide.searchIntent));
    assert.ok(['beginner', 'intermediate', 'advanced'].includes(guide.level));
    assert.ok(guide.faq.length >= 3, `${guide.slug} should expose at least three FAQ entries`);
    assert.ok(
      guide.faq.some((item) => intentQuestionPatterns[guide.searchIntent].test(item.question)),
      `${guide.slug} FAQ should match ${guide.searchIntent} intent`
    );

    intentCounts.set(guide.searchIntent, (intentCounts.get(guide.searchIntent) || 0) + 1);
  }

  for (const intent of ['learn', 'compare', 'choose', 'workflow']) {
    assert.ok(intentCounts.get(intent) > 0, `${intent} should be represented in the guide library`);
  }
});

test('guide detail exposes trust metadata, visible FAQ, and FAQ structured data', async () => {
  const page = await readFile(new URL('../src/app/guides/[slug]/page.js', import.meta.url), 'utf8');

  for (const marker of [
    '作者：{guide.author}',
    '审核：{guide.reviewer}',
    '更新：{guide.updatedAt}',
    '难度：{levelLabels[guide.level] || guide.level}',
    'id="faq"',
    'guide.faq.map',
    'faqJsonLd(guide.faq)'
  ]) {
    assert.ok(page.includes(marker), `guide detail should include ${marker}`);
  }
});
