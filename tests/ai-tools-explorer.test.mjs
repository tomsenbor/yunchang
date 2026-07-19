import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { toolCategories, tools } from '../src/lib/tool-content.mjs';
import {
  createExplorerCategories,
  createExplorerTools,
  resolveToolLogo
} from '../src/lib/tool-explorer.mjs';

const pagePath = new URL('../src/app/ai-tools/page.js', import.meta.url);
const componentPath = new URL('../src/components/ToolExplorer.jsx', import.meta.url);
const stylesPath = new URL('../src/app/ai-tools/ai-tools.module.css', import.meta.url);

test('AI tools page exposes the exploration center SEO structure', async () => {
  const page = await readFile(pagePath, 'utf8');

  assert.match(page, /const pageTitle = '全球 AI 工具库'/);
  assert.match(page, /探索100\+精选AI工具，覆盖聊天、写作、图片、视频、编程和办公场景。/);
  assert.match(page, /<h1[^>]*>全球 AI 工具库<\/h1>/);
  assert.equal((page.match(/<h1\b/g) || []).length, 1, 'The page should expose one H1');
  assert.match(page, /<dt>\{tools\.length\}\+<\/dt>[\s\S]*?<dd>AI工具<\/dd>/);
  assert.match(page, /<dt>51\+<\/dt>[\s\S]*?<dd>教程<\/dd>/);
  assert.match(page, /<dt>183\+<\/dt>[\s\S]*?<dd>资源页面<\/dd>/);
  assert.match(page, /'@type': 'CollectionPage'/);
  assert.match(page, /'@type': 'ItemList'/);
  assert.match(page, /buildCanonicalUrl\('\/ai-tools'\)/);
  assert.match(page, /<ToolExplorer tools=\{explorerTools\} categories=\{explorerCategories\}/);
});

test('AI tool explorer includes deterministic search, task, category and filter controls', async () => {
  const component = await readFile(componentPath, 'utf8');

  assert.match(component, /placeholder="搜索工具名称、分类、标签或使用场景"/);

  for (const task of ['写作', '图片', '视频', '编程', '办公', '音乐', '学习']) {
    assert.match(component, new RegExp(`label: '${task}'`), `Missing ${task} task filter`);
  }

  for (const control of ['热门', '最新', '免费', '付费', '平台']) {
    assert.match(component, new RegExp(control), `Missing ${control} control`);
  }

  assert.match(component, /tool\.capabilities/);
  assert.match(component, /tool\.useCases/);
  assert.match(component, /tool\.platforms/);
  assert.match(component, /tool\.categorySlugs\.includes\(category\)/);
  assert.match(component, /tool\.logoType === 'image'/);
  assert.match(component, /tool\.logoValue/);
  assert.doesNotMatch(component, /<img src=\{tool\.icon\}/);
  assert.match(component, /href=\{`\/ai-tools\/\$\{tool\.slug\}`\}/);
  assert.doesNotMatch(component, /Math\.random/);
});

test('category cards and filters use the same explorer membership data', () => {
  const explorerTools = createExplorerTools(tools, toolCategories);
  const explorerCategories = createExplorerCategories(explorerTools, toolCategories);

  for (const category of explorerCategories) {
    const filteredCount = explorerTools.filter((tool) =>
      tool.categorySlugs.includes(category.slug)
    ).length;

    assert.equal(category.count, filteredCount, `${category.name} count should match its filter`);
  }

  const deepSeek = explorerTools.find((tool) => tool.slug === 'deepseek');
  assert.deepEqual(deepSeek.categorySlugs, ['chatbot', 'coding-ai']);
});

test('all tool logos resolve to an existing image or a text fallback', () => {
  const resolvedLogos = tools.map((tool) => ({ tool, ...resolveToolLogo(tool) }));

  assert.equal(resolvedLogos.length, 100);

  for (const logo of resolvedLogos) {
    assert.ok(['image', 'text'].includes(logo.logoType), `${logo.tool.name} needs a logo type`);
    assert.ok(logo.logoValue, `${logo.tool.name} needs a logo value`);

    if (logo.logoType === 'image') {
      assert.match(logo.logoValue, /^\//, `${logo.tool.name} image should be a local public asset`);
      const imagePath = fileURLToPath(
        new URL(`../public/${logo.logoValue.replace(/^\/+/, '')}`, import.meta.url)
      );
      assert.equal(existsSync(imagePath), true, `${logo.tool.name} image asset should exist`);
    } else {
      assert.doesNotMatch(logo.logoValue, /^(?:https?:\/\/|\/)/i);
    }
  }
});

test('AI tool exploration styling stays page-scoped and responsive', async () => {
  const styles = await readFile(stylesPath, 'utf8');

  assert.match(styles, /\.explorerPage\s*\{/);
  assert.match(styles, /\.categoryGrid\s*\{/);
  assert.match(styles, /\.toolGrid\s*\{/);
  assert.match(styles, /\.toolSummary\s*\{[^}]*-webkit-line-clamp:\s*2/s);
  assert.match(styles, /@media \(max-width: 760px\)[\s\S]*\.toolSummary\s*\{[^}]*-webkit-line-clamp:\s*3/s);
  assert.match(styles, /@media \(max-width: 760px\)/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
  assert.doesNotMatch(styles, /!important/);
});
