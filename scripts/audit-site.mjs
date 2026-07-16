import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  SITE_URL,
  categories,
  comparisons,
  getAllRoutes,
  guides,
  navItems,
  staticRoutes,
  templates,
  tools,
  videos
} from '../src/lib/site-data.mjs';
import { buildSitemapXml } from '../src/lib/seo.mjs';

const __filename = fileURLToPath(import.meta.url);
const projectRoot = path.resolve(path.dirname(__filename), '..');
const workspaceRoot = path.resolve(projectRoot, '..');
const outputDir = path.join(workspaceRoot, 'outputs');
const reportPath = path.join(outputDir, 'site-audit-report.md');

const srcDir = path.join(projectRoot, 'src');
const appDir = path.join(srcDir, 'app');
const publicDir = path.join(projectRoot, 'public');

const requestedCanonicalChecks = [
  { requested: '/', actual: '/', note: 'home route' },
  { requested: '/global-ai-tools', actual: '/global-ai-tools', note: 'global AI tools list' },
  { requested: '/tools', actual: '/ai-tools', note: 'project currently uses /ai-tools for the AI tool library' },
  { requested: '/china-ai-tools', actual: '/china-ai-tools', note: 'china AI tools list' },
  { requested: '/guides', actual: '/guides', note: 'guides list' },
  { requested: '/compare', actual: '/compare', note: 'compare list' },
  { requested: '/videos', actual: '/videos', note: 'videos list' },
  { requested: '/free-tools', actual: '/free-ai-tools', note: 'project currently uses /free-ai-tools for free tools' },
  { requested: '/templates', actual: '/templates', note: 'templates list' },
  { requested: '/submit', actual: '/contact', note: 'project currently uses /contact for submission/contact' },
  { requested: '/ai-tools/chatgpt', actual: '/ai-tools/chatgpt', note: 'key tool detail' },
  { requested: '/ai-tools/claude', actual: '/ai-tools/claude', note: 'key tool detail' },
  { requested: '/ai-tools/gemini', actual: '/ai-tools/gemini', note: 'key tool detail' },
  { requested: '/ai-tools/deepseek', actual: '/ai-tools/deepseek', note: 'key tool detail' },
  { requested: '/guides/chatgpt-beginner-guide', actual: '/guides/chatgpt-beginner-guide', note: 'key guide detail' },
  { requested: '/videos/chatgpt-intro', actual: '/videos/chatgpt-3min-guide', note: 'project data currently uses chatgpt-3min-guide' },
  { requested: '/compare/chatgpt-vs-claude', actual: '/compare/chatgpt-vs-claude', note: 'key compare detail' }
];

const internalRoutePrefixes = [
  '/categories/',
  '/ai-tools/',
  '/guides/',
  '/compare/',
  '/videos/'
];

const placeholderPatterns = [
  { pattern: 'TODO', label: 'TODO marker' },
  { pattern: '待补充', label: 'pending-content marker' },
  { pattern: '这里填写', label: 'fill-here marker' },
  { pattern: '占位', label: 'placeholder marker' },
  { pattern: '后续补充', label: 'future-fill marker' },
  { pattern: '人工教程占位', label: 'manual-guide placeholder marker' },
  { pattern: 'xxx', label: 'xxx placeholder marker' }
];

const issues = [];

function addIssue({ page = '-', type, item = '-', issue, severity = 'warning', fixed = false, note = '' }) {
  issues.push({ page, type, item, issue, severity, fixed, note });
}

function publicPathExists(publicPath) {
  if (!publicPath || !publicPath.startsWith('/')) return false;
  return existsSync(path.join(publicDir, publicPath.slice(1)));
}

function routeToPageFile(route) {
  if (route === '/') return path.join(appDir, 'page.js');

  const parts = route.split('/').filter(Boolean);
  if (parts.length === 1) return path.join(appDir, parts[0], 'page.js');
  if (parts[0] === 'categories') return path.join(appDir, 'categories', '[slug]', 'page.js');
  if (parts[0] === 'ai-tools') return path.join(appDir, 'ai-tools', '[slug]', 'page.js');
  if (parts[0] === 'guides') return path.join(appDir, 'guides', '[slug]', 'page.js');
  if (parts[0] === 'compare') return path.join(appDir, 'compare', '[slug]', 'page.js');
  if (parts[0] === 'videos') return path.join(appDir, 'videos', '[slug]', 'page.js');
  return path.join(appDir, ...parts, 'page.js');
}

function routeExists(route, routes) {
  return routes.has(route);
}

function listFiles(dir, extensions = new Set(['.js', '.jsx', '.mjs', '.ts', '.tsx', '.css'])) {
  const files = [];

  for (const entry of readdirSync(dir)) {
    const fullPath = path.join(dir, entry);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      files.push(...listFiles(fullPath, extensions));
    } else if (extensions.has(path.extname(fullPath))) {
      files.push(fullPath);
    }
  }

  return files;
}

function duplicates(values) {
  const seen = new Set();
  const duplicateSet = new Set();

  for (const value of values) {
    if (seen.has(value)) duplicateSet.add(value);
    seen.add(value);
  }

  return [...duplicateSet];
}

function routePrefixExists(href, routeSet) {
  if (routeSet.has(href)) return true;
  return internalRoutePrefixes.some((prefix) => href.startsWith(prefix));
}

function collectStaticInternalHrefs(files) {
  const rows = [];
  const hrefRegexes = [
    /href=["'](\/[^"'#{}]+)["']/g,
    /href:\s*["'](\/[^"'#{}]+)["']/g
  ];

  for (const file of files) {
    const source = readFileSync(file, 'utf8');
    const relativeFile = path.relative(projectRoot, file);

    for (const regex of hrefRegexes) {
      for (const match of source.matchAll(regex)) {
        rows.push({ href: match[1].replace(/\/$/, '') || '/', file: relativeFile });
      }
    }
  }

  return rows;
}

function checkRouteCoverage(routeSet) {
  for (const row of requestedCanonicalChecks) {
    const requestedExists = routeSet.has(row.requested);
    const actualExists = routeSet.has(row.actual);

    if (!requestedExists && actualExists && row.requested !== row.actual) {
      addIssue({
        page: row.requested,
        type: 'route-alias',
        item: row.note,
        issue: `requested route is not generated; current route is ${row.actual}`,
        severity: 'needs-confirmation',
        note: 'Alias/redirect decision needed before launch if the requested URL must work.'
      });
    } else if (!actualExists) {
      addIssue({
        page: row.requested,
        type: 'route',
        item: row.note,
        issue: `route is missing: ${row.actual}`,
        severity: 'error',
        note: 'Generated route data does not include this page.'
      });
    }
  }

  for (const route of routeSet) {
    const pageFile = routeToPageFile(route);
    if (!existsSync(pageFile)) {
      addIssue({
        page: route,
        type: 'route-file',
        item: path.relative(projectRoot, pageFile),
        issue: 'route is generated but matching app page file was not found',
        severity: 'error'
      });
    }
  }
}

function checkNavigation(routeSet) {
  for (const item of navItems) {
    if (!routeSet.has(item.href)) {
      addIssue({
        page: item.href,
        type: 'navigation',
        item: item.label,
        issue: 'nav item href is not in generated route data',
        severity: 'error'
      });
    }
  }
}

function checkStaticLinks(routeSet, sourceFiles) {
  const seen = new Set();
  for (const { href, file } of collectStaticInternalHrefs(sourceFiles)) {
    const key = `${href}:${file}`;
    if (seen.has(key)) continue;
    seen.add(key);

    if (!routePrefixExists(href, routeSet)) {
      addIssue({
        page: href,
        type: 'internal-link',
        item: file,
        issue: 'static internal href is not in generated route data',
        severity: 'warning',
        note: 'Dynamic route links are checked by prefix only.'
      });
    }
  }
}

function checkDataIntegrity(routeSet) {
  const categorySlugs = new Set(categories.map((category) => category.slug));
  const toolSlugs = new Set(tools.map((tool) => tool.slug));
  const toolNames = new Set(tools.map((tool) => tool.name));
  const allowedComparisonNames = new Set(['Google 搜索', '国内AI配音工具', 'Google 鎼滅储', '鍥藉唴AI閰嶉煶宸ュ叿']);

  for (const [type, rows] of [
    ['tool', tools],
    ['guide', guides],
    ['video', videos],
    ['comparison', comparisons],
    ['category', categories],
    ['template', templates]
  ]) {
    for (const slug of duplicates(rows.map((row) => row.slug))) {
      addIssue({ page: '-', type: 'data-duplicate', item: `${type}:${slug}`, issue: 'duplicate slug', severity: 'error' });
    }
  }

  for (const tool of tools) {
    const page = `/ai-tools/${tool.slug}`;

    for (const field of ['slug', 'name', 'categorySlug', 'summary', 'pricing', 'pricingLabel', 'region', 'icon', 'iconAlt']) {
      if (!tool[field]) {
        addIssue({ page, type: 'tool-data', item: field, issue: 'missing required tool field', severity: 'error' });
      }
    }

    if (!categorySlugs.has(tool.categorySlug)) {
      addIssue({ page, type: 'tool-data', item: tool.categorySlug, issue: 'invalid categorySlug', severity: 'error' });
    }

    if (!routeSet.has(page)) {
      addIssue({ page, type: 'tool-data', item: tool.slug, issue: 'tool detail route missing', severity: 'error' });
    }

    if (typeof tool.rating !== 'number' || tool.rating < 0 || tool.rating > 5) {
      addIssue({ page, type: 'tool-data', item: 'rating', issue: 'rating is missing or outside 0-5', severity: 'error' });
    }

    if (tool.icon && !publicPathExists(tool.icon)) {
      addIssue({ page, type: 'icon', item: tool.icon, issue: 'icon file does not exist', severity: 'error' });
    }

    if (tool.icon === '/icons/ai-tools/generic-ai-tool.svg') {
      addIssue({
        page,
        type: 'icon',
        item: tool.name,
        issue: 'tool uses generic-ai-tool.svg placeholder',
        severity: 'needs-confirmation',
        note: 'Keep only if explicitly approved as a placeholder.'
      });
    }

    if (tool.iconAlt !== `${tool.name} logo`) {
      addIssue({
        page,
        type: 'icon-alt',
        item: tool.iconAlt || '-',
        issue: 'iconAlt does not match "<tool name> logo"',
        severity: 'error'
      });
    }

    if (tool.domestic && tool.region !== 'domestic') {
      addIssue({ page, type: 'region', item: tool.name, issue: 'domestic tool does not use domestic region', severity: 'error' });
    }

    if (!tool.domestic && tool.region !== 'overseas') {
      addIssue({ page, type: 'region', item: tool.name, issue: 'overseas tool does not use overseas region', severity: 'error' });
    }

    if (!tool.galleryTags?.length) {
      addIssue({ page, type: 'tool-data', item: tool.name, issue: 'tool has no category/gallery tags', severity: 'error' });
    }
  }

  for (const guide of guides) {
    const page = `/guides/${guide.slug}`;
    for (const field of ['slug', 'title', 'categorySlug', 'outcome', 'excerpt', 'readTime', 'updatedAt']) {
      if (!guide[field]) addIssue({ page, type: 'guide-data', item: field, issue: 'missing required guide field', severity: 'error' });
    }
    if (!categorySlugs.has(guide.categorySlug)) addIssue({ page, type: 'guide-data', item: guide.categorySlug, issue: 'invalid categorySlug', severity: 'error' });
    if (!routeSet.has(page)) addIssue({ page, type: 'guide-data', item: guide.slug, issue: 'guide route missing', severity: 'error' });
  }

  for (const video of videos) {
    const page = `/videos/${video.slug}`;
    for (const field of ['slug', 'title', 'categorySlug', 'description', 'duration', 'publishedAt', 'thumbnail']) {
      if (!video[field]) addIssue({ page, type: 'video-data', item: field, issue: 'missing required video field', severity: 'error' });
    }
    if (!categorySlugs.has(video.categorySlug)) addIssue({ page, type: 'video-data', item: video.categorySlug, issue: 'invalid categorySlug', severity: 'error' });
    if (!routeSet.has(page)) addIssue({ page, type: 'video-data', item: video.slug, issue: 'video route missing', severity: 'error' });
    if (video.thumbnail && !publicPathExists(video.thumbnail)) addIssue({ page, type: 'video-data', item: video.thumbnail, issue: 'thumbnail file missing', severity: 'error' });
    if (!/^\d{2}:\d{2}$/.test(video.duration || '')) addIssue({ page, type: 'video-data', item: video.duration, issue: 'video duration is not mm:ss', severity: 'warning' });
  }

  for (const comparison of comparisons) {
    const page = `/compare/${comparison.slug}`;
    for (const field of ['slug', 'title', 'summary']) {
      if (!comparison[field]) addIssue({ page, type: 'compare-data', item: field, issue: 'missing required comparison field', severity: 'error' });
    }
    if (!routeSet.has(page)) addIssue({ page, type: 'compare-data', item: comparison.slug, issue: 'comparison route missing', severity: 'error' });
    for (const name of comparison.tools || []) {
      if (!toolNames.has(name) && !allowedComparisonNames.has(name)) {
        addIssue({
          page,
          type: 'compare-data',
          item: name,
          issue: 'comparison references unknown tool name',
          severity: 'needs-confirmation'
        });
      }
    }
  }

  for (const category of categories) {
    if (!routeSet.has(`/categories/${category.slug}`)) {
      addIssue({ page: `/categories/${category.slug}`, type: 'category-data', item: category.name, issue: 'category route missing', severity: 'error' });
    }
  }

  for (const template of templates) {
    for (const field of ['slug', 'title', 'type', 'format']) {
      if (!template[field]) addIssue({ page: '/templates', type: 'template-data', item: field, issue: `template ${template.slug} missing field`, severity: 'error' });
    }
  }

  for (const slug of ['chatgpt', 'claude', 'gemini', 'deepseek', 'kimi', 'perplexity', 'microsoft-copilot', 'midjourney', 'runway', 'elevenlabs', 'canva-ai', 'notion-ai', 'cursor', 'doubao', 'tongyi-qianwen', 'wenxin-yiyan', 'tencent-yuanbao', 'xunfei-xinghuo', 'zhipu-qingyan', 'jimeng-ai', 'kling-ai', 'tongyi-wanxiang', 'capcut-ai', 'github-copilot', 'claude-code']) {
    if (!toolSlugs.has(slug)) {
      addIssue({ page: `/ai-tools/${slug}`, type: 'key-tool', item: slug, issue: 'key launch-check tool is missing from data', severity: 'error' });
    }
  }
}

function checkPlaceholderText(sourceFiles) {
  for (const file of sourceFiles) {
    const relativeFile = path.relative(projectRoot, file);
    if (relativeFile.startsWith(`tests${path.sep}`)) continue;
    const source = readFileSync(file, 'utf8');

    for (const { pattern, label } of placeholderPatterns) {
      if (!source.includes(pattern)) continue;

      const lines = source.split(/\r?\n/);
      lines.forEach((line, index) => {
        if (!line.includes(pattern)) return;

        const isFallbackOnly = /fallback|aria-label|button|placeholder/i.test(line);
        addIssue({
          page: relativeFile,
          type: 'content-placeholder',
          item: label,
          issue: `source contains a ${label}`,
          severity: isFallbackOnly ? 'needs-confirmation' : 'warning',
          note: `line ${index + 1}; verify whether this is visible front-end copy or only a fallback/control label.`
        });
      });
    }
  }
}

function checkSeo(routeSet, sourceFiles) {
  if (!existsSync(path.join(appDir, 'robots.js'))) {
    addIssue({ page: '/robots.txt', type: 'seo', item: 'robots.js', issue: 'robots route file is missing', severity: 'error' });
  }
  if (!existsSync(path.join(appDir, 'sitemap.js'))) {
    addIssue({ page: '/sitemap.xml', type: 'seo', item: 'sitemap.js', issue: 'sitemap route file is missing', severity: 'error' });
  }

  const sitemapXml = buildSitemapXml([...routeSet]);
  for (const route of routeSet) {
    if (!sitemapXml.includes(`${SITE_URL}${route === '/' ? '/' : route}`)) {
      addIssue({ page: route, type: 'seo', item: 'sitemap', issue: 'route missing from generated sitemap XML', severity: 'error' });
    }
  }

  const pageFiles = sourceFiles.filter((file) => file.endsWith(`${path.sep}page.js`));
  for (const file of pageFiles) {
    const source = readFileSync(file, 'utf8');
    const relativeFile = path.relative(projectRoot, file);
    const hasMetadata = source.includes('export const metadata') || source.includes('export function generateMetadata') || source.includes('export async function generateMetadata');
    if (!hasMetadata) {
      addIssue({
        page: relativeFile,
        type: 'seo',
        item: 'metadata',
        issue: 'page file does not export metadata/generateMetadata',
        severity: 'warning',
        note: 'Some nested utility pages may rely on layout metadata; confirm before adding metadata.'
      });
    }
  }
}

function checkStructuralCss(sourceFiles) {
  const cssPath = path.join(appDir, 'globals.css');
  const css = existsSync(cssPath) ? readFileSync(cssPath, 'utf8') : '';

  const requiredCssSnippets = [
    { item: 'site footer', snippet: '.site-footer', note: 'Footer styles should exist globally.' },
    { item: 'tool detail mobile collapse', snippet: '@media (max-width: 1024px)', note: 'Detail layouts need a mobile breakpoint.' },
    { item: 'video player ratio', snippet: 'aspect-ratio: 16 / 9', note: 'Video player/card should keep 16:9.' },
    { item: 'site container variables', snippet: '--site-max-width', note: 'Containers should share the site width variables.' }
  ];

  for (const { item, snippet, note } of requiredCssSnippets) {
    if (!css.includes(snippet)) {
      addIssue({
        page: 'src/app/globals.css',
        type: 'responsive/static-check',
        item,
        issue: `CSS snippet not found: ${snippet}`,
        severity: 'warning',
        note
      });
    }
  }

  const header = sourceFiles.find((file) => file.endsWith(`${path.sep}Header.jsx`));
  const footer = sourceFiles.find((file) => file.endsWith(`${path.sep}Footer.jsx`));
  if (!header) addIssue({ page: 'src/components/Header.jsx', type: 'structure', item: 'Header', issue: 'Header component missing', severity: 'error' });
  if (!footer) addIssue({ page: 'src/components/Footer.jsx', type: 'structure', item: 'Footer', issue: 'Footer component missing', severity: 'error' });
}

function summarizeIssues() {
  return issues.reduce((summary, issue) => {
    summary[issue.severity] = (summary[issue.severity] || 0) + 1;
    return summary;
  }, {});
}

function escapeCell(value) {
  return String(value ?? '')
    .replace(/\|/g, '\\|')
    .replace(/\r?\n/g, ' ')
    .trim();
}

function issueTable(rows) {
  const columns = ['page', 'type', 'item', 'issue', 'severity', 'fixed', 'note'];
  const header = `| ${columns.join(' | ')} |`;
  const divider = `| ${columns.map(() => '---').join(' | ')} |`;
  const body = rows.map((row) => `| ${columns.map((column) => escapeCell(row[column])).join(' | ')} |`);
  return [header, divider, ...body].join('\n');
}

const routeSet = new Set(getAllRoutes());
const sourceFiles = listFiles(srcDir);

checkRouteCoverage(routeSet);
checkNavigation(routeSet);
checkStaticLinks(routeSet, sourceFiles);
checkDataIntegrity(routeSet);
checkPlaceholderText(sourceFiles);
checkSeo(routeSet, sourceFiles);
checkStructuralCss(sourceFiles);

const summary = summarizeIssues();
const report = [
  '# Site Audit Report',
  '',
  `Generated: ${new Date().toISOString()}`,
  '',
  '## Scope',
  '',
  '- Homepage, list pages, detail pages, routes, static internal links, data integrity, icons, SEO files, placeholder text, and static responsive hooks.',
  '- This audit script does not change UI, data, routes, or SEO implementation.',
  '',
  '## Summary',
  '',
  `- Generated routes: ${routeSet.size}`,
  `- Static routes in data: ${staticRoutes.length}`,
  `- Tools: ${tools.length}`,
  `- Guides: ${guides.length}`,
  `- Videos: ${videos.length}`,
  `- Comparisons: ${comparisons.length}`,
  `- Templates: ${templates.length}`,
  `- Errors: ${summary.error || 0}`,
  `- Warnings: ${summary.warning || 0}`,
  `- Needs confirmation: ${summary['needs-confirmation'] || 0}`,
  '',
  '## Requested URL Check',
  '',
  '| Requested | Current generated route | Status | Note |',
  '| --- | --- | --- | --- |',
  ...requestedCanonicalChecks.map((row) => {
    const requestedOk = routeSet.has(row.requested);
    const actualOk = routeSet.has(row.actual);
    const status = requestedOk ? 'OK' : actualOk ? 'Needs confirmation' : 'Missing';
    return `| ${escapeCell(row.requested)} | ${escapeCell(row.actual)} | ${status} | ${escapeCell(row.note)} |`;
  }),
  '',
  '## Issue Table',
  '',
  issues.length ? issueTable(issues) : '- No issues found.',
  '',
  '## Manual Confirmation Queue',
  '',
  ...(issues
    .filter((issue) => issue.severity === 'needs-confirmation')
    .map((issue) => `- ${issue.page}: ${issue.issue} (${issue.note || issue.item})`) || []),
  ...(issues.some((issue) => issue.severity === 'needs-confirmation') ? [] : ['- None']),
  '',
  '## Verification Commands',
  '',
  '- npm run build: pending',
  '- npm test: pending',
  '- npm run lint: pending'
].join('\n');

mkdirSync(outputDir, { recursive: true });
writeFileSync(reportPath, report, 'utf8');

console.log(`Site audit report written to ${reportPath}`);
console.log(`errors=${summary.error || 0} warnings=${summary.warning || 0} needs-confirmation=${summary['needs-confirmation'] || 0}`);
