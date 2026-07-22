import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

import { aiModels, modelRoutes, modelSelectionSteps } from '../src/lib/model-content.mjs';
import { buildCanonicalUrl } from '../src/lib/seo.mjs';

const pageUrl = new URL('../src/app/ai-models/page.js', import.meta.url);
const componentUrl = new URL('../src/components/ModelExplorer.jsx', import.meta.url);
const stylesUrl = new URL('../src/app/ai-models/ai-models.module.css', import.meta.url);
const headerUrl = new URL('../src/components/Header.jsx', import.meta.url);
const sitemapUrl = new URL('../src/app/sitemap.js', import.meta.url);
const detailPageUrl = new URL('../src/app/ai-models/[slug]/page.js', import.meta.url);
const detailStylesUrl = new URL('../src/app/ai-models/[slug]/page.module.css', import.meta.url);
const methodologyUrl = new URL('../src/app/methodology/page.js', import.meta.url);
const appIconUrl = new URL('../src/app/icon.svg', import.meta.url);

const overviewFilesExist = [pageUrl, componentUrl, stylesUrl].every((url) => existsSync(fileURLToPath(url)));

test('AI models overview files exist', () => {
  assert.equal(overviewFilesExist, true, 'overview page, client component and CSS module should exist');
});

test('site declares a local app icon so model pages do not request a missing favicon', () => {
  assert.equal(existsSync(fileURLToPath(appIconUrl)), true);
});

test('AI models overview exposes canonical collection SEO and one H1', { skip: !overviewFilesExist }, async () => {
  const page = await readFile(pageUrl, 'utf8');
  const component = await readFile(componentUrl, 'utf8');
  const combined = `${page}\n${component}`;

  assert.match(page, /path: '\/ai-models'/);
  assert.match(page, /buildCanonicalUrl\('\/ai-models'\)/);
  assert.match(page, /'@type': 'CollectionPage'/);
  assert.match(page, /'@type': 'ItemList'/);
  assert.match(page, /numberOfItems: aiModels\.length/);
  assert.match(page, /faqJsonLd\(modelFaqs\)/);
  assert.match(component, /<h1[^>]*>\s*<span>找到适合你的<\/span>\s*<span[^>]*> AI 模型<\/span>\s*<\/h1>/s);
  assert.equal((combined.match(/<h1\b/g) || []).length, 1);
  assert.doesNotMatch(combined, /\{\{[^}]+\}\}/);
  assert.equal(buildCanonicalUrl('/ai-models'), 'https://aixiaolvtools.com/ai-models');
});

test('AI models overview skeleton follows the locked section order and dynamic stats', { skip: !overviewFilesExist }, async () => {
  const component = await readFile(componentUrl, 'utf8');
  const headings = [
    '按模型厂商探索',
    '按任务快速选模型',
    '完整模型数据库',
    '如何选择 AI 模型',
    'AI 模型和 AI 工具有何不同？',
    'AI 模型常见问题',
    '数据来源与评测方法',
    '开始比较适合你的 AI 模型'
  ];

  let lastIndex = -1;
  for (const heading of headings) {
    const index = component.indexOf(heading);
    assert.ok(index > lastIndex, `${heading} should appear in the locked order`);
    lastIndex = index;
  }

  for (const key of ['modelCount', 'vendorCount', 'familyCount']) {
    assert.match(component, new RegExp(`stats\\.${key}`));
  }
  assert.match(component, /taskSummaries\.length/);
  for (const key of ['updatedAt', 'verifiedModelCount', 'staleFieldCount', 'pendingReviewFieldCount']) {
    assert.match(component, new RegExp(`dataStats\\.${key}`));
  }
  assert.match(component, /模型信息持续核查更新/);
});

test('AI models hero decoration is page-scoped, non-semantic and responsive', { skip: !overviewFilesExist }, async () => {
  const component = await readFile(componentUrl, 'utf8');
  const styles = await readFile(stylesUrl, 'utf8');

  assert.match(component, /aria-hidden="true"/);
  assert.match(styles, /\.heroTrack[^}]*pointer-events:\s*none/s);
  assert.match(styles, /\.explorerPage[^}]*overflow-x:\s*(?:clip|hidden)/s);
  assert.match(styles, /radial-gradient/);
  assert.match(styles, /linear-gradient/);
  assert.match(styles, /@media \(max-width: 639px\)/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
  assert.doesNotMatch(`${component}\n${styles}`, /<canvas\b|WebGLRenderer|<video\b/i);
});

test('Header links AI models to its own route and isolates the dark overlay state', async () => {
  const header = await readFile(headerUrl, 'utf8');

  assert.match(header, /\{ href: '\/ai-models', label: 'AI模型库' \}/);
  assert.match(header, /const isAiModelsLanding = pathname === '\/ai-models'/);
  assert.match(header, /const isAiModelsRoute = isAiModelsLanding \|\| pathname\.startsWith\('\/ai-models\/'\)/);
  assert.match(header, /isDarkLanding/);
});

test('sitemap consumes every generated model route without a compare route', async () => {
  const sitemap = await readFile(sitemapUrl, 'utf8');

  assert.equal(modelRoutes.length, aiModels.length);
  assert.match(sitemap, /import \{ modelRoutes \} from '\.\.\/lib\/model-content\.mjs'/);
  assert.match(sitemap, /\.\.\.modelRoutes/);
  assert.equal(existsSync(fileURLToPath(new URL('../src/app/ai-models/compare', import.meta.url))), false);
  assert.ok(modelRoutes.every((route) => !route.startsWith('/ai-models/compare')));
  assert.ok(modelRoutes.includes('/ai-models/kimi-k3'));
  assert.equal(modelRoutes.filter((route) => route.startsWith('/ai-models/')).length, 31);
});

const detailFilesExist = [detailPageUrl, detailStylesUrl].every((url) => existsSync(fileURLToPath(url)));

test('AI model detail template files exist', () => {
  assert.equal(detailFilesExist, true, 'detail page and CSS module should exist');
});

test('detail template generates current routes only with canonical metadata', { skip: !detailFilesExist }, async () => {
  const detailPage = await readFile(detailPageUrl, 'utf8');

  assert.match(detailPage, /export function generateStaticParams\(\)/);
  assert.match(detailPage, /currentAiModels\.map\(\(model\) => \(\{ slug: model\.slug \}\)\)/);
  assert.match(detailPage, /export async function generateMetadata/);
  assert.match(detailPage, /path: `\/ai-models\/\$\{model\.slug\}`/);
  assert.match(detailPage, /notFound\(\)/);
  assert.equal(modelRoutes.length, aiModels.length);
  assert.match(detailPage, /formatOfficialModelId/);
  assert.match(detailPage, /官方尚未公开/);
  assert.match(detailPage, /export default async function AiModelDetailPage[\s\S]*const officialModelIdValue = getOfficialModelIdValue\(model\.officialModelId\);[\s\S]*const modelJsonLd/);
  const pricingComponent = detailPage.slice(detailPage.indexOf('function PricingValue'), detailPage.indexOf('const rawPrice'));
  assert.doesNotMatch(pricingComponent, /officialModelIdValue/);
});

test('detail template exposes the locked document sections and sticky table of contents', { skip: !detailFilesExist }, async () => {
  const detailPage = await readFile(detailPageUrl, 'utf8');
  const detailStyles = await readFile(detailStylesUrl, 'utf8');
  const headings = [
    '模型简介', '基础参数', '支持模态', '能力与适用任务', 'API 和访问方式', '价格',
    '公开基准测试', '优点与限制', '版本差异', '相关模型', '相关工具与教程', '官方来源与核查记录'
  ];

  for (const heading of headings) assert.match(detailPage, new RegExp(heading));
  assert.match(detailPage, /<aside[^>]*aria-label="页面目录"/);
  assert.match(detailStyles, /\.detailToc[^}]*position:\s*sticky/s);
  assert.match(detailStyles, /@media \(max-width: 1023px\)[\s\S]*\.detailToc[^}]*position:\s*static/s);
});

test('detail pages separate public benchmarks from editorial guidance without fake scores', { skip: !detailFilesExist }, async () => {
  const detailPage = await readFile(detailPageUrl, 'utf8');

  assert.match(detailPage, /当前暂无可核查的统一数据/);
  assert.match(detailPage, /本站编辑评价，仅用于场景选择参考/);
  assert.match(detailPage, /href=\{officialSource\.url\}/);
  assert.match(detailPage, /数据状态：/);
  assert.match(detailPage, /核查日期：/);
  assert.doesNotMatch(detailPage, /overallScore|benchmarkScore|综合总分|progress-bar|aria-valuenow/i);
  assert.doesNotMatch(detailPage, /\{\{[^}]+\}\}/);
});

test('three featured detail records are explicit and the other records keep the safe template', async () => {
  const { featuredDetailSlugs, getModelBySlug } = await import('../src/lib/model-content.mjs');

  assert.deepEqual(featuredDetailSlugs, ['gpt-5-6-sol', 'claude-sonnet-5', 'gemini-3-1-pro-preview']);
  assert.ok(featuredDetailSlugs.every((slug) => getModelBySlug(slug)?.detailLevel === 'featured'));
  assert.equal(aiModels.filter((model) => model.detailLevel === 'standard').length, aiModels.length - featuredDetailSlugs.length);
});

test('selection guide and model-versus-tool content follow the locked editorial structure', async () => {
  const component = await readFile(componentUrl, 'utf8');
  const steps = ['确定任务类型', '判断上下文需求', '判断是否需要多模态', '判断 API、网页或本地部署', '比较输入与输出价格', '检查版本和核查日期'];

  assert.deepEqual(modelSelectionSteps.map(([title]) => title), steps);
  assert.match(component, /底层能力系统/);
  assert.match(component, /基于模型构建的产品或应用/);
  assert.match(component, /GPT.*Claude.*Gemini.*DeepSeek.*Qwen.*Llama/s);
  assert.match(component, /ChatGPT.*Cursor.*Notion AI.*Midjourney.*Runway/s);
  assert.match(component, /href="\/ai-tools"[^>]*>浏览 AI 工具库</);
});

test('model methodology link and dedicated methodology anchor are present', async () => {
  const component = await readFile(componentUrl, 'utf8');
  const methodology = await readFile(methodologyUrl, 'utf8');

  assert.match(component, /href="\/methodology#ai-models"/);
  assert.match(methodology, /id="ai-models"/);
  assert.match(component, /官方模型文档/);
  assert.match(component, /API 与价格页面/);
  assert.match(component, /官方发布公告/);
  assert.match(component, /官方技术报告/);
  assert.match(component, /可追溯的公开基准测试/);
});
