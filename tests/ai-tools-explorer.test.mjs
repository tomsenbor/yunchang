import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { toolCategories, tools } from '../src/lib/tool-content.mjs';
import {
  createExplorerCategories,
  createExplorerTasks,
  createExplorerTools,
  createFeaturedTools,
  matchesExplorerTask,
  resolveToolLogo
} from '../src/lib/tool-explorer.mjs';

const pagePath = new URL('../src/app/ai-tools/page.js', import.meta.url);
const componentPath = new URL('../src/components/ToolExplorer.jsx', import.meta.url);
const stylesPath = new URL('../src/app/ai-tools/ai-tools.module.css', import.meta.url);

test('AI tools page exposes the exploration center SEO structure', async () => {
  const page = await readFile(pagePath, 'utf8');
  const component = await readFile(componentPath, 'utf8');
  const combined = `${page}\n${component}`;

  assert.match(page, /const pageTitle = '全球 AI 工具库'/);
  assert.match(page, /探索100\+精选AI工具/);
  assert.match(component, /<h1 id="ai-tools-title">探索适合你的 AI 工具<\/h1>/);
  assert.match(component, /<p className=\{styles\.heroEyebrow\}>AI 工具探索中心<\/p>/);
  assert.equal((combined.match(/<h1\b/g) || []).length, 1, 'The page should expose one H1');
  assert.match(component, /<dt>\{stats\.tools\}\+<\/dt><dd>AI工具<\/dd>/);
  assert.match(component, /<dt>\{stats\.guides\}\+<\/dt><dd>教程<\/dd>/);
  assert.match(component, /<dt>\{stats\.resources\}\+<\/dt><dd>资源页面<\/dd>/);
  assert.match(page, /'@type': 'CollectionPage'/);
  assert.match(page, /'@type': 'ItemList'/);
  assert.match(page, /buildCanonicalUrl\('\/ai-tools'\)/);
  assert.match(page, /numberOfItems: explorerTools\.length/);
  assert.match(page, /itemListElement: explorerTools\.map/);
  assert.match(page, /tasks=\{explorerTasks\}/);
  assert.match(page, /featuredTools=\{featuredTools\}/);
  assert.match(page, /stats=\{\{ tools: tools\.length, guides: 51, resources: 183 \}\}/);
});

test('AI tools page uses the immersive V2.1 information architecture', async () => {
  const component = await readFile(componentPath, 'utf8');

  for (const heading of [
    '探索适合你的 AI 工具',
    '100+ AI 工具，',
    '按任务找 AI 工具',
    '热门 AI 工具',
    'AI 工具分类',
    '全部 AI 工具',
    '少试错，更快找到合适工具',
    '开始探索你的 AI 工作流'
  ]) {
    assert.match(component, new RegExp(heading.replace('+', '\\+')), `Missing ${heading}`);
  }

  assert.doesNotMatch(component, /floatingSlugs|floatingTools|styles\.floatingCard/);
  assert.match(component, /featuredCategory/);
  assert.match(component, /visibleFeaturedTools/);
  assert.match(component, /href="\/methodology"/);
});

test('AI tool explorer includes deterministic search, task, category and filter controls', async () => {
  const component = await readFile(componentPath, 'utf8');
  const taskNames = createExplorerTasks(createExplorerTools(tools, toolCategories)).map((task) => task.name);

  assert.match(component, /placeholder="搜索工具名称、分类、标签或使用场景"/);

  for (const task of ['写文章和文案', '生成图片', '制作视频', '编写代码', '办公和整理资料', '生成音乐与配音', '学习与研究']) {
    assert.ok(taskNames.includes(task), `Missing ${task} task entry`);
  }

  for (const control of ['热门', '最新', '免费', '付费', '平台']) {
    assert.match(component, new RegExp(control), `Missing ${control} control`);
  }

  assert.match(component, /tool\.capabilities/);
  assert.match(component, /tool\.useCases/);
  assert.match(component, /tool\.platforms/);
  assert.match(component, /tool\.developer/);
  assert.match(component, /tool\.updatedAt/);
  assert.match(component, /tool\.capabilities\.slice\(0, 3\)/);
  assert.match(component, />\s*查看详情\s*</);
  assert.match(component, /加入对比/);
  assert.match(component, /aria-pressed=\{isCompared\}/);
  assert.match(component, /tool\.categorySlugs\.includes\(category\)/);
  assert.match(component, /tool\.logoType === 'image'/);
  assert.match(component, /tool\.logoValue/);
  assert.doesNotMatch(component, /<img src=\{tool\.icon\}/);
  assert.match(component, /href=\{`\/ai-tools\/\$\{tool\.slug\}`\}/);
  assert.doesNotMatch(component, /Math\.random/);
});

test('task entry counts and representatives come from the explorer tool data', () => {
  const explorerTools = createExplorerTools(tools, toolCategories);
  const tasks = createExplorerTasks(explorerTools);

  assert.equal(tasks.length, 7);
  for (const task of tasks) {
    const matchingTools = explorerTools.filter((tool) => matchesExplorerTask(tool, task.id));
    assert.equal(task.count, matchingTools.length, `${task.name} count should match its filter`);
    assert.ok(task.count > 0, `${task.name} should have matching tools`);
    assert.deepEqual(task.representatives, matchingTools.slice(0, 3).map((tool) => tool.name));
  }
});

test('featured tools are explicit, deterministic and limited to ten', () => {
  const explorerTools = createExplorerTools(tools, toolCategories);
  const featuredTools = createFeaturedTools(explorerTools);

  assert.equal(tools.filter((tool) => tool.featured).length, 10);
  assert.equal(featuredTools.length, 10);
  assert.ok(featuredTools.every((tool) => tool.featured));
  assert.deepEqual(featuredTools.map((tool) => tool.slug), [
    'chatgpt', 'claude', 'gemini', 'deepseek', 'kimi', 'perplexity', 'cursor', 'midjourney', 'runway', 'kling-ai'
  ]);
});

test('every explorer card exposes the V2.1 discovery fields', () => {
  const explorerTools = createExplorerTools(tools, toolCategories);
  for (const tool of explorerTools) {
    assert.ok(tool.name, `${tool.slug} needs a name`);
    assert.ok(tool.developer, `${tool.slug} needs a developer`);
    assert.ok(tool.summary, `${tool.slug} needs a positioning summary`);
    assert.ok(Array.isArray(tool.capabilities), `${tool.slug} needs capabilities`);
    assert.ok(Array.isArray(tool.platforms), `${tool.slug} needs platforms`);
    assert.ok(tool.pricing, `${tool.slug} needs pricing`);
    assert.ok(tool.updatedAt, `${tool.slug} needs an update date`);
  }
});

test('category cards and filters use the same explorer membership data', () => {
  const explorerTools = createExplorerTools(tools, toolCategories);
  const explorerCategories = createExplorerCategories(explorerTools, toolCategories);
  for (const category of explorerCategories) {
    const filteredCount = explorerTools.filter((tool) => tool.categorySlugs.includes(category.slug)).length;
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
      const imagePath = fileURLToPath(new URL(`../public/${logo.logoValue.replace(/^\/+/, '')}`, import.meta.url));
      assert.equal(existsSync(imagePath), true, `${logo.tool.name} image asset should exist`);
    } else {
      assert.doesNotMatch(logo.logoValue, /^(?:https?:\/\/|\/)/i);
    }
  }
});

test('AI tool exploration styling stays page-scoped and responsive', async () => {
  const styles = await readFile(stylesPath, 'utf8');

  for (const selector of [
    '.explorerPage', '.immersiveHero', '.platformIntro', '.lightCanvas', '.taskGrid',
    '.featuredGrid', '.categoryGrid', '.toolsDatabase', '.toolGrid', '.finalCta'
  ]) {
    assert.match(styles, new RegExp(`\\${selector}\\s*\\{`), `Missing ${selector}`);
  }
  assert.doesNotMatch(styles, /\.floatingCard|@keyframes (?:toolFloat|driftRightDown|orbitDrift)/);
  assert.match(styles, /\.toolSummary\s*\{[^}]*-webkit-line-clamp:\s*2/s);
  assert.match(styles, /@media \(max-width: 700px\)[\s\S]*\.toolSummary\s*\{[^}]*-webkit-line-clamp:\s*3/s);
  assert.match(styles, /@media \(max-width: 390px\)/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
  assert.doesNotMatch(styles, /!important/);
});
