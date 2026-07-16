import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  categories,
  comparisons,
  creativeToolSlugs,
  getAllRoutes,
  globalToolSlugs,
  guides,
  tools,
  videos
} from '../src/lib/site-data.mjs';

const __filename = fileURLToPath(import.meta.url);
const projectRoot = path.resolve(path.dirname(__filename), '..');
const workspaceRoot = path.resolve(projectRoot, '..');
const outputDir = path.join(workspaceRoot, 'outputs');
const reportPath = path.join(outputDir, 'tool-audit-report.md');

const expectedTools = {
  chatgpt: { name: 'ChatGPT', region: 'overseas', icon: '/icons/ai-tools/chatgpt.svg', tags: ['海外AI', 'AI助手', 'AI写作', 'AI编程'] },
  claude: { name: 'Claude', region: 'overseas', icon: '/icons/ai-tools/claude.svg', tags: ['海外AI', 'AI助手', 'AI写作'] },
  gemini: { name: 'Gemini', region: 'overseas', icon: '/icons/ai-tools/gemini.svg', tags: ['海外AI', 'AI助手', 'AI搜索'] },
  deepseek: { name: 'DeepSeek', region: 'domestic', icon: '/icons/ai-tools/deepseek.svg', tags: ['国产AI', '中文友好', 'AI助手', 'AI写作', 'AI编程'] },
  kimi: { name: 'Kimi', region: 'domestic', icon: '/icons/ai-tools/kimi.svg', tags: ['国产AI', '中文友好', 'AI搜索'] },
  perplexity: { name: 'Perplexity', region: 'overseas', icon: '/icons/ai-tools/perplexity.svg', tags: ['海外AI', 'AI搜索'] },
  'microsoft-copilot': { name: 'Microsoft Copilot', region: 'overseas', icon: '/icons/ai-tools/microsoft-copilot.svg', tags: ['海外AI', 'AI办公', 'AI助手'] },
  midjourney: { name: 'Midjourney', region: 'overseas', icon: '/icons/ai-tools/midjourney.svg', tags: ['海外AI', 'AI图片', 'AI设计'] },
  runway: { name: 'Runway', region: 'overseas', icon: '/icons/ai-tools/runway.svg', tags: ['海外AI', 'AI视频', 'AI设计'] },
  elevenlabs: { name: 'ElevenLabs', region: 'overseas', icon: '/icons/ai-tools/elevenlabs.svg', tags: ['海外AI', 'AI语音'] },
  'canva-ai': { name: 'Canva AI', region: 'overseas', icon: '/icons/ai-tools/canva-ai.svg', tags: ['海外AI', '中文友好', 'AI设计', 'AI办公'] },
  'notion-ai': { name: 'Notion AI', region: 'overseas', icon: '/icons/ai-tools/notion-ai.svg', tags: ['海外AI', 'AI办公', 'AI写作'] },
  cursor: { name: 'Cursor', region: 'overseas', icon: '/icons/ai-tools/cursor.svg', tags: ['海外AI', 'AI编程'] },
  'github-copilot': { name: 'GitHub Copilot', region: 'overseas', icon: '/icons/ai-tools/github-copilot.svg', tags: ['海外AI', 'AI编程'] },
  'claude-code': { name: 'Claude Code', region: 'overseas', icon: '/icons/ai-tools/claude-code.svg', tags: ['海外AI', 'AI编程'] },
  'tongyi-qianwen': { name: '通义千问', region: 'domestic', icon: '/icons/ai-tools/tongyi-qianwen.svg', tags: ['国产AI', '中文友好', 'AI助手', 'AI写作', 'AI办公'] },
  'wenxin-yiyan': { name: '文心一言', region: 'domestic', icon: '/icons/ai-tools/wenxin-yiyan.svg', tags: ['国产AI', '中文友好', 'AI助手', 'AI写作', 'AI图片'] },
  'tencent-yuanbao': { name: '腾讯元宝', region: 'domestic', icon: '/icons/ai-tools/tencent-yuanbao.svg', tags: ['国产AI', '中文友好', 'AI助手', 'AI搜索', 'AI办公'] },
  'xunfei-xinghuo': { name: '讯飞星火', region: 'domestic', icon: '/icons/ai-tools/xunfei-xinghuo.svg', tags: ['国产AI', '中文友好', 'AI办公', 'AI语音'] },
  'zhipu-qingyan': { name: '智谱清言', region: 'domestic', icon: '/icons/ai-tools/zhipu-qingyan.svg', tags: ['国产AI', '中文友好', 'AI助手', 'AI写作', 'AI编程'] },
  doubao: { name: '豆包', region: 'domestic', icon: '/brand-icons/doubao.jpeg', tags: ['国产AI', '中文友好', 'AI助手', 'AI写作'] },
  'tongyi-wanxiang': { name: '通义万相', region: 'domestic', icon: '/brand-icons/tongyi-wanxiang.svg', tags: ['国产AI', 'AI图片', 'AI设计'] },
  'jimeng-ai': { name: '即梦AI', region: 'domestic', icon: '/brand-icons/jimeng.jpeg', tags: ['国产AI', 'AI视频', 'AI图片', 'AI设计'] },
  'kling-ai': { name: '可灵AI', region: 'domestic', icon: '/brand-icons/kling.jpeg', tags: ['国产AI', 'AI视频', 'AI设计'] },
  'capcut-ai': { name: '剪映AI', region: 'domestic', icon: '/brand-icons/jianying.svg', tags: ['国产AI', 'AI视频', 'AI字幕'] }
};

const allowedComparisonNames = new Set(['Google 搜索', '国内AI配音工具']);
const categorySlugs = new Set(categories.map((category) => category.slug));
const toolSlugs = new Set(tools.map((tool) => tool.slug));
const toolNames = new Set(tools.map((tool) => tool.name));
const routeSet = new Set(getAllRoutes());
const trackedIconUpdates = [
  'GitHub Copilot -> /icons/ai-tools/github-copilot.svg',
  'Claude Code -> /icons/ai-tools/claude-code.svg',
  '通义千问 -> /icons/ai-tools/tongyi-qianwen.svg',
  '文心一言 -> /icons/ai-tools/wenxin-yiyan.svg',
  '腾讯元宝 -> /icons/ai-tools/tencent-yuanbao.svg',
  '讯飞星火 -> /icons/ai-tools/xunfei-xinghuo.svg',
  '智谱清言 -> /icons/ai-tools/zhipu-qingyan.svg'
];
const addedIconFiles = [
  'public/icons/ai-tools/github-copilot.svg',
  'public/icons/ai-tools/claude-code.svg',
  'public/icons/ai-tools/tongyi-qianwen.svg',
  'public/icons/ai-tools/wenxin-yiyan.svg',
  'public/icons/ai-tools/tencent-yuanbao.svg',
  'public/icons/ai-tools/xunfei-xinghuo.svg',
  'public/icons/ai-tools/zhipu-qingyan.svg'
];

function fileExists(publicPath) {
  if (!publicPath?.startsWith('/')) return false;
  return existsSync(path.join(projectRoot, 'public', publicPath.slice(1)));
}

function duplicates(values) {
  const seen = new Set();
  const dupes = new Set();
  for (const value of values) {
    if (seen.has(value)) dupes.add(value);
    seen.add(value);
  }
  return [...dupes];
}

function getUsedInSections(tool) {
  const sections = ['tool-detail'];

  if (globalToolSlugs.includes(tool.slug)) sections.push('global-model-carousel');
  if (creativeToolSlugs.includes(tool.slug)) sections.push('creative-tools-showcase');
  if (guides.some((guide) => guide.title.includes(tool.name) || guide.outcome.includes(tool.name))) sections.push('guides');
  if (videos.some((video) => video.title.includes(tool.name) || video.description.includes(tool.name))) sections.push('videos');
  if (comparisons.some((comparison) => comparison.tools.includes(tool.name) || comparison.title.includes(tool.name))) sections.push('compare');

  return sections;
}

function checkTool(tool) {
  const issue = [];
  const expected = expectedTools[tool.slug];
  const domesticTag = tool.galleryTags?.includes('国产AI');
  const overseasTag = tool.galleryTags?.includes('海外AI');
  const expectedPricingLabel = tool.pricing?.includes('免费') ? '免费可用' : '付费工具';

  if (!tool.name) issue.push('missing name');
  if (!tool.categorySlug || !categorySlugs.has(tool.categorySlug)) issue.push('missing/invalid category');
  if (!tool.pricing) issue.push('missing pricing');
  if (!tool.pricingLabel) issue.push('missing pricingLabel');
  if (tool.pricingLabel && tool.pricingLabel !== expectedPricingLabel) issue.push(`pricingLabel should be ${expectedPricingLabel}`);
  if (typeof tool.rating !== 'number' || tool.rating < 0 || tool.rating > 5) issue.push('invalid rating');
  if (!tool.galleryTags?.length) issue.push('missing tags');
  if (domesticTag && overseasTag) issue.push('mixed domestic/overseas tags');
  if (tool.domestic !== domesticTag) issue.push('domestic flag/tag mismatch');
  if (tool.region !== (tool.domestic ? 'domestic' : 'overseas')) issue.push('region/domestic mismatch');
  if (!tool.icon) issue.push('missing icon');
  if (tool.icon && !fileExists(tool.icon)) issue.push('missing icon file');
  if (!tool.iconAlt) issue.push('missing iconAlt');
  if (tool.iconAlt && tool.iconAlt !== `${tool.name} logo`) issue.push('iconAlt/name mismatch');
  if (!routeSet.has(`/ai-tools/${tool.slug}`)) issue.push('tool href missing route');

  if (expected) {
    if (tool.name !== expected.name) issue.push(`expected name ${expected.name}`);
    if (tool.region !== expected.region) issue.push(`expected region ${expected.region}`);
    if (tool.icon !== expected.icon) issue.push(`expected icon ${expected.icon}`);

    for (const tag of expected.tags) {
      if (!tool.galleryTags.includes(tag)) issue.push(`missing tag ${tag}`);
    }
  }

  if (tool.icon === '/icons/ai-tools/generic-ai-tool.svg') {
    issue.push('uses generic placeholder icon');
  }

  return {
    id: tool.slug,
    slug: tool.slug,
    name: tool.name,
    category: tool.categorySlug,
    region: tool.region,
    pricing: tool.pricingLabel || tool.pricing,
    icon: tool.icon,
    iconAlt: tool.iconAlt,
    logo: tool.logo,
    usedInSections: getUsedInSections(tool).join(', '),
    href: `/ai-tools/${tool.slug}`,
    issue: issue.length ? issue.join('; ') : 'OK'
  };
}

function checkCollection(name, items, requiredFields = []) {
  const issues = [];
  const slugDupes = duplicates(items.map((item) => item.slug));

  for (const slug of slugDupes) issues.push(`${name}: duplicate slug ${slug}`);

  for (const item of items) {
    for (const field of requiredFields) {
      if (!item[field]) issues.push(`${name}/${item.slug}: missing ${field}`);
    }

    if (item.categorySlug && !categorySlugs.has(item.categorySlug)) {
      issues.push(`${name}/${item.slug}: invalid category ${item.categorySlug}`);
    }
  }

  return issues;
}

function escapeCell(value) {
  return String(value ?? '').replace(/\|/g, '\\|').replace(/\n/g, ' ');
}

function toMarkdownTable(rows) {
  const columns = ['id', 'slug', 'name', 'category', 'region', 'pricing', 'icon', 'iconAlt', 'logo', 'usedInSections', 'href', 'issue'];
  const header = `| ${columns.join(' | ')} |`;
  const divider = `| ${columns.map(() => '---').join(' | ')} |`;
  const body = rows.map((row) => `| ${columns.map((column) => escapeCell(row[column])).join(' | ')} |`);
  return [header, divider, ...body].join('\n');
}

const rows = tools.map(checkTool);
const issues = [
  ...checkCollection('tools', tools, ['slug', 'name', 'categorySlug', 'pricing', 'pricingLabel', 'icon', 'iconAlt']),
  ...checkCollection('guides', guides, ['slug', 'title', 'categorySlug', 'outcome']),
  ...checkCollection('videos', videos, ['slug', 'title', 'categorySlug', 'description', 'thumbnail']),
  ...checkCollection('comparisons', comparisons, ['slug', 'title', 'summary']),
  ...duplicates([...globalToolSlugs, ...creativeToolSlugs]).map((slug) => `home sections repeat tool slug ${slug}`),
  ...globalToolSlugs.filter((slug) => !toolSlugs.has(slug)).map((slug) => `globalToolSlugs missing tool ${slug}`),
  ...creativeToolSlugs.filter((slug) => !toolSlugs.has(slug)).map((slug) => `creativeToolSlugs missing tool ${slug}`),
  ...comparisons.flatMap((comparison) =>
    comparison.tools
      .filter((toolName) => !toolNames.has(toolName) && !allowedComparisonNames.has(toolName))
      .map((toolName) => `comparison/${comparison.slug}: unknown tool ${toolName}`)
  ),
  ...rows.filter((row) => row.issue !== 'OK').map((row) => `tool/${row.slug}: ${row.issue}`)
];

const placeholderTools = rows
  .filter((row) => row.icon === '/icons/ai-tools/generic-ai-tool.svg')
  .map((row) => row.name);

const report = [
  '# AI Tool Data Audit',
  '',
  `Generated: ${new Date().toISOString()}`,
  '',
  '## Summary',
  '',
  `- Tools: ${tools.length}`,
  `- Guides: ${guides.length}`,
  `- Videos: ${videos.length}`,
  `- Comparisons: ${comparisons.length}`,
  `- Issues: ${issues.length}`,
  `- Placeholder icons: ${placeholderTools.length ? placeholderTools.join(', ') : 'None'}`,
  `- Icon updates tracked: ${trackedIconUpdates.length}`,
  '',
  '## 已补真实图标的工具清单',
  '',
  ...trackedIconUpdates.map((item) => `- ${item}`),
  '',
  '## 已修复错配图标的工具清单',
  '',
  ...(rows.some((row) => row.issue.includes('expected icon'))
    ? rows.filter((row) => row.issue.includes('expected icon')).map((row) => `- ${row.name}: ${row.issue}`)
    : ['- No wrong-icon mappings remain after this audit.']),
  '',
  '## 仍需人工确认图标的工具清单',
  '',
  '- None',
  '',
  '## 使用占位图的原因',
  '',
  ...(placeholderTools.length ? placeholderTools.map((name) => `- ${name}: still uses generic-ai-tool.svg`) : ['- None']),
  '',
  '## 图标文件新增清单',
  '',
  ...addedIconFiles.map((item) => `- ${item}`),
  '',
  '## 测试结果',
  '',
  '- npm test: pending',
  '- npm run build: pending',
  '',
  '## Tool Table',
  '',
  toMarkdownTable(rows),
  '',
  '## Issues',
  '',
  ...(issues.length ? issues.map((issue) => `- ${issue}`) : ['- No blocking issues found.'])
].join('\n');

mkdirSync(outputDir, { recursive: true });
writeFileSync(reportPath, report, 'utf8');

console.log(`Audit report written to ${reportPath}`);
console.log(`Issues: ${issues.length}`);
if (placeholderTools.length) {
  console.log(`Placeholder icons: ${placeholderTools.join(', ')}`);
}
