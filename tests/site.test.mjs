import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { readFile } from 'node:fs/promises';

import {
  categories,
  comparisons,
  getAllRoutes,
  globalToolSlugs,
  guides,
  homeFilters,
  homeHero,
  homeSeo,
  navItems,
  tools,
  toolIconBySlug,
  videos,
  creativeToolSlugs,
  templates
} from '../src/lib/site-data.mjs';
import { firstBatchToolSlugs } from '../src/lib/first-batch-content.mjs';
import { buildCanonicalUrl, buildSitemapXml } from '../src/lib/seo.mjs';

test('seed data covers the global AI content pillars', () => {
  assert.ok(categories.length >= 12);
  assert.ok(tools.length >= 20);
  assert.ok(guides.length >= 24);
  assert.ok(videos.length >= 10);
  assert.ok(comparisons.length >= 9);
  assert.ok(templates.length >= 4);
});

test('navigation and generated routes include global and china tool hubs', () => {
  const routes = getAllRoutes();
  const uniqueRoutes = new Set(routes);

  assert.equal(routes.length, uniqueRoutes.size);
  assert.equal(navItems[0].href, '/');
  assert.equal(navItems[0].label, '\u9996\u9875');
  assert.deepEqual(navItems.map((item) => item.href), [
    '/',
    '/ai-tools',
    '/ai-models',
    '/china-ai-tools',
    '/guides',
    '/compare',
    '/videos',
    '/free-ai-tools',
    '/templates'
  ]);
  assert.ok(routes.includes('/'));
  assert.ok(!routes.includes('/global-ai-tools'));
  assert.ok(routes.includes('/ai-tools'));
  assert.ok(routes.includes('/ai-models'));
  assert.ok(routes.includes('/china-ai-tools'));
  assert.ok(routes.includes('/ai-tools/chatgpt'));
  assert.ok(routes.includes('/ai-tools/deepseek'));
  assert.ok(routes.includes('/guides/chatgpt-beginner-guide'));
  assert.ok(routes.includes('/videos/chatgpt-3min-guide'));
  assert.ok(routes.includes('/compare/chatgpt-vs-claude'));
  assert.ok(routes.includes('/free-ai-tools'));
});

test('Header closes navigation after route changes without synchronous effect state updates', async () => {
  const header = await readFile(new URL('../src/components/Header.jsx', import.meta.url), 'utf8');

  assert.doesNotMatch(header, /useEffect\(\(\) => \{\s*setIsMenuOpen\(false\);\s*setOpenDropdown\(null\);\s*\}, \[pathname\]\)/s);
  assert.match(header, /requestAnimationFrame/);
  assert.match(header, /\[pathname\]/);
  assert.match(header, /closeAllNavigation/);
});

test('canonical URLs and sitemap XML are generated from route data', () => {
  assert.equal(
    buildCanonicalUrl('/ai-tools'),
    'https://aixiaolvtools.com/ai-tools'
  );

  const sitemap = buildSitemapXml(['/', '/ai-tools']);
  assert.match(sitemap, /<loc>https:\/\/aixiaolvtools\.com\/<\/loc>/);
  assert.match(sitemap, /<loc>https:\/\/aixiaolvtools\.com\/ai-tools<\/loc>/);
  assert.doesNotMatch(sitemap, /global-ai-tools/);
});

test('legacy global AI tools route permanently redirects to the tool overview', () => {
  const route = readFileSync(new URL('../src/app/global-ai-tools/page.js', import.meta.url), 'utf8');

  assert.ok(route.includes("import { permanentRedirect } from 'next/navigation'"));
  assert.ok(route.includes("permanentRedirect('/ai-tools')"));
  assert.ok(!route.includes('pageMetadata'), 'redirect route should not expose independent metadata');
});

test('home data supports the global AI toolkit guide direction', () => {
  assert.equal(homeHero.badge, '全球 AI 实验室');
  assert.equal(homeHero.title, 'AI FLUID LAB');
  assert.equal(
    homeHero.subtitle,
    '用中文探索 ChatGPT、DeepSeek、Kimi、Claude、Gemini、Midjourney、Runway 等 AI 工具。'
  );
  assert.equal(homeHero.searchPlaceholder, '搜索 ChatGPT、DeepSeek、Kimi、AI视频、提示词模板……');
  assert.deepEqual(homeHero.tags, ['全球AI工具', '国产AI', 'DeepSeek教程', 'AI视频', '免费工具', '提示词模板']);
  assert.deepEqual(homeFilters, ['全部', '全球热门', '国产AI', '海外AI', 'AI助手', 'AI搜索', 'AI写作', 'AI图片', 'AI视频', 'AI办公', 'AI编程', '免费工具', '新手推荐']);
  assert.equal(homeSeo.title, '全球AI工具攻略库 - ChatGPT、Claude、Gemini、DeepSeek、Midjourney 与 Runway 教程');
  assert.match(homeSeo.description, /全球AI工具教程/);
});

test('home tool sections and guides cover global plus domestic tools', () => {
  assert.deepEqual(globalToolSlugs, [
    'chatgpt',
    'claude',
    'gemini',
    'perplexity',
    'microsoft-copilot',
    'deepseek',
    'kimi',
    'doubao'
  ]);
  assert.deepEqual(creativeToolSlugs, [
    'midjourney',
    'runway',
    'elevenlabs',
    'canva-ai',
    'notion-ai',
    'cursor',
    'jimeng-ai',
    'kling-ai',
    'tongyi-wanxiang',
    'capcut-ai'
  ]);

  const requiredTags = ['全球热门', '国产AI', '海外AI', '中文友好', '免费可用', '付费工具', 'AI助手', 'AI搜索', 'AI写作', 'AI图片', 'AI视频', 'AI语音', 'AI办公', 'AI编程', 'AI设计', 'AI自动化'];
  const allTags = new Set(tools.flatMap((tool) => tool.galleryTags || []));
  for (const tag of requiredTags) assert.ok(allTags.has(tag), `${tag} should exist in tool tags`);

  assert.deepEqual(
    guides.slice(0, 12).map((guide) => guide.title),
    [
      'ChatGPT新手入门教程：从注册到日常使用',
      'Claude怎么用：长文档、写作和总结教程',
      'Gemini怎么用：Google生态 AI 助手入门',
      'Perplexity怎么用：AI搜索和资料整理教程',
      'DeepSeek新手入门教程：写作、代码和问答',
      'Kimi怎么阅读长文档和总结资料',
      '豆包AI怎么写小红书文案',
      '通义千问怎么写文章和做办公',
      'Midjourney怎么生成高质量图片',
      'Runway怎么生成AI视频',
      'ElevenLabs怎么做AI配音',
      'Cursor怎么用AI写代码'
    ]
  );
});

test('home videos and comparisons match the global AI positioning', () => {
  assert.deepEqual(
    videos.slice(0, 10).map((video) => video.title),
    [
      '3分钟了解 ChatGPT 怎么用',
      'Claude 适合哪些人使用',
      'Gemini 和 ChatGPT 有什么区别',
      'Perplexity 怎么做资料搜索',
      'DeepSeek 新手教程',
      'Kimi 怎么读长文档',
      'Midjourney 怎么生成图片',
      'Runway 怎么生成视频',
      'ElevenLabs 怎么做AI配音',
      'Cursor 怎么用AI写代码'
    ]
  );
  assert.deepEqual(
    comparisons.slice(0, 9).map((comparison) => comparison.title),
    [
      'ChatGPT 和 Claude 哪个好用',
      'Gemini 和 ChatGPT 有什么区别',
      'Perplexity 和 Google 搜索怎么选',
      'DeepSeek 和 ChatGPT 哪个适合中文用户',
      'Kimi 和 Claude 哪个适合长文档',
      'Midjourney 和通义万相怎么选',
      'Runway 和可灵AI 哪个适合视频生成',
      'ElevenLabs 和国内AI配音工具怎么选',
      'Cursor 和 Claude Code 哪个适合写代码'
    ]
  );
});

test('tool data audit keeps identifiers, regions, icons, labels, and hrefs consistent', () => {
  const routes = new Set(getAllRoutes());
  const categorySlugs = new Set(categories.map((category) => category.slug));
  const toolSlugs = tools.map((tool) => tool.slug);
  const guideSlugs = guides.map((guide) => guide.slug);
  const videoSlugs = videos.map((video) => video.slug);
  const comparisonSlugs = comparisons.map((comparison) => comparison.slug);
  const toolNames = new Set(tools.map((tool) => tool.name));
  const externalComparisonNames = new Set(['Google 搜索', '国内AI配音工具']);

  assert.equal(toolSlugs.length, new Set(toolSlugs).size, 'tool slugs should be unique');
  assert.equal(guideSlugs.length, new Set(guideSlugs).size, 'guide slugs should be unique');
  assert.equal(videoSlugs.length, new Set(videoSlugs).size, 'video slugs should be unique');
  assert.equal(comparisonSlugs.length, new Set(comparisonSlugs).size, 'comparison slugs should be unique');

  for (const slug of [...globalToolSlugs, ...creativeToolSlugs]) {
    assert.ok(toolSlugs.includes(slug), `${slug} should exist in tools`);
  }

  for (const tool of tools) {
    assert.ok(tool.name, `${tool.slug} should have a name`);
    assert.ok(categorySlugs.has(tool.categorySlug), `${tool.slug} should use an existing category`);
    assert.ok(tool.galleryTags?.length, `${tool.slug} should have category tags`);
    assert.ok(tool.pricing, `${tool.slug} should have pricing`);
    assert.equal(tool.pricingLabel, tool.pricing.includes('免费') ? '免费可用' : '付费工具', `${tool.slug} pricing label should match pricing`);
    assert.equal(tool.region, tool.domestic ? 'domestic' : 'overseas', `${tool.slug} region should match domestic flag`);
    assert.equal(tool.domestic, tool.galleryTags.includes('国产AI'), `${tool.slug} domestic flag should match 国产AI tag`);
    assert.ok(!(tool.galleryTags.includes('国产AI') && tool.galleryTags.includes('海外AI')), `${tool.slug} should not mix domestic and overseas tags`);
    assert.equal(typeof tool.rating, 'number', `${tool.slug} should have numeric rating`);
    assert.ok(tool.rating >= 0 && tool.rating <= 5, `${tool.slug} rating should be in range`);
    assert.ok(tool.icon, `${tool.slug} should have icon data`);
    assert.ok(toolIconBySlug[tool.slug], `${tool.slug} should have an explicit icon mapping`);
    assert.notEqual(tool.icon, '/icons/ai-tools/generic-ai-tool.svg', `${tool.slug} should not use the generic icon placeholder`);
    assert.ok(existsSync(new URL(`../public${tool.icon}`, import.meta.url)), `${tool.slug} icon file should exist`);
    assert.equal(tool.iconAlt, `${tool.name} logo`, `${tool.slug} icon alt should match tool name`);
    assert.ok(routes.has(`/ai-tools/${tool.slug}`), `${tool.slug} detail href should exist`);
  }

  for (const [slug, icon] of Object.entries(toolIconBySlug)) {
    assert.ok(toolSlugs.includes(slug), `${slug} icon mapping should point to an existing tool`);
    assert.ok(existsSync(new URL(`../public${icon}`, import.meta.url)), `${slug} mapped icon file should exist`);
  }

  for (const guide of guides) {
    assert.ok(categorySlugs.has(guide.categorySlug), `${guide.slug} guide category should exist`);
    assert.ok(routes.has(`/guides/${guide.slug}`), `${guide.slug} guide href should exist`);
  }

  for (const video of videos) {
    assert.ok(categorySlugs.has(video.categorySlug), `${video.slug} video category should exist`);
    assert.ok(routes.has(`/videos/${video.slug}`), `${video.slug} video href should exist`);
  }

  for (const comparison of comparisons) {
    assert.ok(routes.has(`/compare/${comparison.slug}`), `${comparison.slug} comparison href should exist`);
    for (const name of comparison.tools) {
      assert.ok(toolNames.has(name) || externalComparisonNames.has(name), `${comparison.slug} should reference a known tool: ${name}`);
    }
  }
});

test('first batch tools include beginner-ready content fields and tutorial drafts', () => {
  const requiredArrayFields = [
    ['useCases', 3],
    ['quickStart', 4],
    ['scenarios', 3],
    ['pros', 3],
    ['cons', 3],
    ['beginnerTips', 3],
    ['commonMistakes', 3],
    ['promptExamples', 3],
    ['alternatives', 2],
    ['tutorialOutline', 5]
  ];

  for (const slug of firstBatchToolSlugs) {
    const tool = tools.find((item) => item.slug === slug);
    assert.ok(tool, `${slug} should exist in tools`);
    assert.ok(tool.summary && tool.summary.length >= 20, `${slug} should have a useful summary`);
    assert.ok(tool.audience && tool.audience.length >= 12, `${slug} should have a useful audience`);

    for (const [field, minLength] of requiredArrayFields) {
      assert.ok(Array.isArray(tool[field]), `${slug}.${field} should be an array`);
      assert.ok(tool[field].length >= minLength, `${slug}.${field} should have at least ${minLength} items`);
      assert.ok(tool[field].every((item) => typeof item === 'string' && item.length >= 4), `${slug}.${field} should use readable text items`);
    }

    const guide = guides.find((item) => item.toolSlug === slug);
    assert.ok(guide, `${slug} should have a first-batch guide draft`);
    assert.ok(guide.tutorialDraft, `${slug} guide should expose tutorialDraft`);
    assert.equal(guide.tutorialDraft.title, `${tool.name} 新手入门教程：从注册到第一个实用工作流`);
    for (const field of ['suitableFor', 'taskExample']) {
      assert.ok(guide.tutorialDraft[field], `${slug} tutorialDraft.${field} should be present`);
    }
    for (const field of ['problemsSolved', 'firstUse', 'recommendedPrompts', 'commonPitfalls', 'alternatives', 'outline']) {
      assert.ok(Array.isArray(guide.tutorialDraft[field]), `${slug} tutorialDraft.${field} should be an array`);
      assert.ok(guide.tutorialDraft[field].length > 0, `${slug} tutorialDraft.${field} should not be empty`);
    }
  }
});

test('guide detail page uses follow-along tutorial structure', () => {
  const guidePage = readFileSync(new URL('../src/app/guides/[slug]/page.js', import.meta.url), 'utf8');
  const css = readFileSync(new URL('../src/app/globals.css', import.meta.url), 'utf8');

  assert.ok(guidePage.includes('className="guide-detail-layout"'), 'Guide detail should use a main plus toc tutorial layout');
  assert.ok(guidePage.includes('className="guide-main"'), 'Guide detail should keep tutorial content in a dedicated main column');
  assert.ok(guidePage.includes('className="guide-toc"'), 'Guide detail should render the right-side guide table of contents');
  assert.ok(guidePage.includes('本篇你会完成什么'), 'Guide detail should expose the outcome section');
  assert.ok(guidePage.includes('准备工作'), 'Guide detail should expose the preparation section');
  assert.ok(guidePage.includes('跟做步骤'), 'Guide detail should expose the follow-along steps section');
  assert.ok(guidePage.includes('Step {index + 1}.'), 'Guide steps should render article-style numbered titles');
  assert.ok(guidePage.includes('className="prompt-block"'), 'Guide detail should render prompt examples as prompt blocks');
  assert.ok(guidePage.includes('完成本步后，建议记录输入内容、生成结果和需要继续追问的地方。'), 'Guide steps should include a practical follow-along note');
  assert.ok(css.includes('.guide-detail-layout') && css.includes('grid-template-columns: minmax(0, 940px) 280px'), 'Guide detail desktop layout should use the balanced main and toc columns');
  assert.ok(css.includes('.guide-detail-page .prompt-block'), 'Guide prompt blocks should be scoped to guide detail pages');
  assert.ok(css.includes('.guide-step') && css.includes('border-bottom: 1px solid rgba(15, 23, 42, 0.08)'), 'Guide steps should use document dividers instead of heavy cards');
  assert.ok(css.includes('@media (max-width: 1024px)') && css.includes('.guide-toc') && css.includes('position: static'), 'Guide toc should become non-sticky on smaller screens');
});

test('guides list page uses varied tutorial card templates', () => {
  const guidesPage = readFileSync(new URL('../src/app/guides/page.js', import.meta.url), 'utf8');
  const showcase = readFileSync(new URL('../src/components/GuideListShowcase.jsx', import.meta.url), 'utf8');
  const css = readFileSync(new URL('../src/app/globals.css', import.meta.url), 'utf8');

  assert.ok(guidesPage.includes('<GuideListShowcase guides={guides} />'), 'Guides page should render the dedicated varied showcase');
  assert.ok(!guidesPage.includes('guides.map((guide) => <GuideCard'), 'Guides page should not render one repeated GuideCard layout');
  assert.ok(showcase.includes('guide-list-card-${variant}'), 'Guides showcase should generate card classes from variants');
  assert.ok(showcase.includes('variant="featured"'), 'Guides showcase should render featured cards');
  assert.ok(showcase.includes("variant={index % 3 === 0 ? 'standard' : 'compact'}"), 'Guides showcase should mix standard and compact cards');
  assert.ok(showcase.includes('guide-list-collection-card'), 'Guides showcase should implement a collection/path card');
  assert.ok(showcase.includes('新手先学这 4 个 AI 工具'), 'Guides showcase should include a learning path collection entry');
  assert.ok(showcase.includes('variant={index % 3 === 0 ?') && showcase.includes("variant=\"featured\""), 'Guides showcase should mix card variants instead of using one template');
  assert.ok(css.includes('.guide-list-featured-grid') && css.includes('grid-template-columns: minmax(0, 1.15fr) minmax(0, .85fr)'), 'Guides list should use a varied featured row');
  assert.ok(css.includes('.guide-list-group-grid') && css.includes('grid-template-columns: repeat(3, minmax(0, 1fr))'), 'Guides groups should use compact multi-card rows on desktop');
  assert.ok(css.includes('.guide-list-card-featured') && css.includes('.guide-list-card-standard') && css.includes('.guide-list-card-compact'), 'Guides list CSS should style all three tutorial card densities');
  assert.ok(css.includes('.guide-list-collection-card'), 'Guides list CSS should style the learning path card');
  assert.ok(css.includes('@media (max-width: 640px)') && css.includes('.guide-list-group-grid') && css.includes('grid-template-columns: minmax(0, 1fr)'), 'Guides list should collapse to one column on mobile');
});

test('video detail page prioritizes the player experience', () => {
  const videoPage = readFileSync(new URL('../src/app/videos/[slug]/page.js', import.meta.url), 'utf8');
  const css = readFileSync(new URL('../src/app/globals.css', import.meta.url), 'utf8');

  assert.ok(videoPage.includes('className="video-detail-layout"'), 'Video detail should use a dedicated watch-first layout');
  assert.ok(videoPage.includes('className="video-detail-hero"'), 'Video detail should keep a compact title area');
  assert.ok(videoPage.includes('className="video-watch-section"'), 'Video detail should place the watch section directly after the title area');
  assert.ok(videoPage.includes('className="video-player-card"'), 'Video detail should render a dedicated player card');
  assert.ok(videoPage.includes('className="video-line-list"'), 'Video detail should include lightweight learning and note lists');
  assert.ok(videoPage.includes('className="video-timeline"'), 'Video detail should include a chapter timeline');
  assert.ok(videoPage.includes('className="video-detail-toc"'), 'Video detail should keep a lightweight right-side table of contents');
  assert.ok(css.includes('.video-detail-page') && css.includes('padding-top: calc(var(--site-header-height) + 1rem)'), 'Video detail should reduce the top whitespace below the header');
  assert.ok(css.includes('.video-detail-layout') && css.includes('grid-template-columns: minmax(0, 920px) 260px') && css.includes('column-gap: 88px'), 'Video detail desktop layout should use a main column plus lightweight toc');
  assert.ok(css.includes('.video-watch-section') && css.includes('margin-top: 1.75rem'), 'Video player should sit close to the compressed title area');
  assert.ok(css.includes('.video-player-card') && css.includes('aspect-ratio: 16 / 9') && css.includes('border-radius: 28px'), 'Video player should keep a 16:9 rounded frame');
  assert.ok(css.includes('.video-section-kicker') && css.includes('color: #64748b'), 'Video section helper labels should stay muted');
  assert.ok(css.includes('@media (max-width: 1180px)') && css.includes('.video-detail-toc') && css.includes('display: none'), 'Video detail should collapse the side toc on smaller screens');
});

test('global CSS keeps the gallery system and reduced motion guard', () => {
  const css = readFileSync(new URL('../src/app/globals.css', import.meta.url), 'utf8');
  const globalCarouselCss = css.slice(css.indexOf('.global-tools-carousel'), css.indexOf('.compact-tool-card'));
  for (const className of [
    '.gallery-card',
    '.gallery-grid',
    '.hover-lift',
    '.section-badge',
    '.section-minimal',
    '.section-accent-dots',
    '.section-dot',
    '.section-eyebrow',
    '.section-glow-soft',
    '.glow-button',
    '.interactive-card',
    '.gradient-border',
    '.shine-effect',
    '.soft-glow',
    '.fade-up',
    '.stagger-item',
    '.magnetic-button',
    '.motion-safe-only',
    '.compact-tool-card',
    '.global-tools-carousel',
    '.global-tool-card',
    '.workflow-bento',
    '.video-card',
    '.compare-card',
    '.line-clamp-2'
  ]) {
    assert.ok(css.includes(className), `${className} should be defined`);
  }
  assert.ok(css.includes('--accent-green: #59ff76'));
  assert.ok(css.includes('--accent-cyan: #59fff6'));
  assert.ok(css.includes('--accent-blue: #5973ff'));
  assert.ok(css.includes('--accent-purple: #8959ff'));
  assert.ok(css.includes('--accent-orange: #ff9b59'));
  assert.ok(css.includes('--site-bg: #fafafa'));
  assert.ok(css.includes('--site-bg-soft: #fafafa'));
  assert.ok(css.includes('--site-text: #0f172a'));
  assert.ok(css.includes('--site-max-width: 1440px'), 'Site containers should share one max-width variable');
  assert.ok(css.includes('--site-gutter: clamp(1rem, 6.5vw, 6rem)'), 'Site containers should share one gutter variable with the header logo');
  assert.ok(css.includes('.site-header-shell') && css.includes('left: var(--site-gutter)'), 'Header logo should use the shared gutter');
  assert.ok(css.includes('.site-page-container') && css.includes('max-width: calc(var(--site-max-width) + (var(--site-gutter) * 2))'), 'Functional pages should use the shared header-aligned container width');
  assert.ok(css.includes('.guide-detail-layout') && css.includes('max-width: calc(1308px + (var(--site-gutter) * 2))'), 'Guide detail layout should align to the shared gutter');
  assert.ok(css.includes('.tool-detail-page.doc-page-shell') && css.includes('padding-left: var(--site-gutter) !important'), 'Tool detail layout should align to the shared gutter');
  assert.match(
    css,
    /html\s*,\s*body\s*\{(?=[^}]*min-height:\s*100%)(?=[^}]*background:\s*var\(--site-bg\))[^}]*\}/s,
    'Html and body should provide full-height page background coverage'
  );
  assert.match(css, /body\s*\{[^}]*min-height:\s*100vh[^}]*\}/s, 'Body should cover at least the viewport height');
  assert.ok(css.includes('background: var(--site-bg)'), 'Unified page background should be a neutral gray-white, not a blue gradient');
  assert.ok(css.includes('body > main') && css.includes('background: transparent'), 'Root main should stay transparent over the unified page background');
  assert.ok(css.includes('.section-minimal') && css.includes('background: transparent'), 'Sections should not own independent background blocks');
  assert.ok(css.includes('--section-header-gap: 18px'), 'Section headers should share a consistent top gap');
  assert.ok(css.includes('--section-title-desc-gap: 12px'), 'Section titles and descriptions should share a consistent gap');
  assert.ok(css.includes('--section-header-bottom: 34px'), 'Section headers should share a consistent bottom gap before grids');
  assert.ok(css.includes('.section-minimal') && css.includes('padding: 72px 0'), 'Lower sections should share a consistent vertical rhythm');
  assert.ok(css.includes('.section-glow-soft::after') && css.includes('display: none'), 'Section-local glow backgrounds should be disabled');
  assert.ok(css.includes('.section-divider-line::before') && css.includes('display: none'), 'Section divider lines should be disabled');
  assert.ok(css.includes('.section-heading::before') && css.includes('display: none'), 'Section heading vertical lines should be disabled');
  assert.ok(css.includes('font-size: clamp(28px, 2vw, 36px)'), 'Lower section titles should shrink to the unified smaller size');
  assert.ok(!css.includes('font-size: clamp(26px, 2.2vw, 40px)'), 'Lower section titles should not keep the old larger size');
  assert.ok(css.includes('.section-dot') && css.includes('width: 9px') && css.includes('height: 9px'), 'Section dots should render as equal solid balls');
  assert.ok(css.includes('--section-dot-purple: #7c6dff'), 'First section dot should use the deeper purple color');
  assert.ok(css.includes('--section-dot-yellow: #f2c94c'), 'Second section dot should use the deeper yellow color');
  assert.ok(css.includes('--section-dot-cyan: #35d6cf'), 'Third section dot should use the deeper cyan color');
  assert.ok(css.includes('.section-dot-purple') && css.includes('background: var(--section-dot-purple)'), 'First section dot should use the shared purple variable');
  assert.ok(css.includes('.section-dot-yellow') && css.includes('background: var(--section-dot-yellow)'), 'Second section dot should use the shared yellow variable');
  assert.ok(css.includes('.section-dot-cyan') && css.includes('background: var(--section-dot-cyan)'), 'Third section dot should use the shared cyan variable');
  assert.ok(css.includes('.section-dot.is-active') && css.includes('scale(1.45)'), 'Clicked section dots should enlarge');
  assert.ok(css.includes('.section-eyebrow') && css.includes('background: #ffffff'), 'Section eyebrow should use a clean gray-white pill background');
  assert.ok(css.includes('color: #334155'), 'Section eyebrow text color should be unified');
  assert.ok(css.includes('.section-eyebrow.is-active') && css.includes('scale(1.08)'), 'Clicked section eyebrow pills should enlarge');
  assert.ok(!css.includes('#fbfcff'), 'Old page background color should be removed');
  assert.ok(!css.includes('#f4f8ff'), 'Hero should not keep a separate page background color');
  assert.ok(css.includes('prefers-reduced-motion'));
  assert.ok(css.includes('.fluid-hero-fullscreen'));
  assert.ok(css.includes('min-height: 100vh'));
  assert.ok(css.includes('.fluid-canvas-layer'));
  assert.ok(css.includes('position: absolute'));
  assert.ok(css.includes('inset: 0'));
  assert.ok(css.includes('display: none'));
  assert.ok(css.includes('.fluid-aura'), 'Fluid hero should style the SVG fluid aura');
  assert.ok(css.includes('width: clamp(572px, 59.4vw, 902px)'), 'SVG aura should grow 10% in desktop width');
  assert.ok(css.includes('height: clamp(462px, 52.8vw, 792px)'), 'SVG aura should grow 10% in desktop height');
  assert.ok(css.includes('width: 100vw'), 'SVG aura should grow on mobile without horizontal overflow');
  assert.ok(css.includes('height: 66vh'), 'SVG aura should grow 10% in mobile height');
  assert.ok(css.includes('.fluid-aura animate'), 'Reduced motion should target SVG SMIL animations');
  assert.ok(!css.includes('.fluid-blob {'), 'Fluid hero should no longer use CSS blur div blobs');
  assert.ok(!css.includes('@keyframes blobCyan'), 'Fluid hero should not keep the old CSS blob animations');
  assert.ok(!css.includes('filter: blur(20px)'), 'Fluid hero should not rely on CSS blur blobs');
  assert.ok(!css.includes('mix-blend-mode: multiply'), 'Fluid hero should not multiply colors into a muddy merged color');
  assert.ok(css.includes('font-size: clamp(3.75rem, 7.85vw, 8.125rem)'), 'Hero main title should be reduced again');
  assert.ok(!css.includes('font-size: clamp(4.05rem, 8.55vw, 8.75rem)'), 'Hero main title should not keep the previous size');
  assert.ok(!css.includes('.fluid-orb-secondary'), 'Fluid hero should not keep the old concentric secondary orb');
  assert.ok(css.includes('.site-header'), 'Header should have a dedicated transparent shell style');
  assert.ok(css.includes('.brand-trigger'), 'Header brand trigger should have a dedicated transparent layout class');
  assert.ok(css.includes('.brand-mark-ai'), 'Header should style the selected AI mark from the provided reference');
  assert.ok(css.includes('.brand-copy'), 'Header should support stacked Chinese/English brand copy');
  assert.ok(css.includes('.brand-cn'), 'Header should style the Chinese brand name as primary');
  assert.ok(css.includes('.brand-en'), 'Header should style the English brand name as secondary');
  assert.match(css, /--site-header-height:\s*5\.25rem;/s, 'Header height should use the 84px brand rhythm');
  assert.match(css, /\.site-header\s*\{[^}]*border-bottom:\s*1px solid rgba\(15, 23, 42, 0\.07\);/s, 'Header should use a very light bottom border');
  assert.match(css, /\.brand-en\s*\{[^}]*color: #64748b;[^}]*opacity: 0\.62;/s, 'English brand text should remain quiet secondary information');
  assert.ok(css.includes('gap: 0.7rem'), 'Logo and brand copy should use a compact horizontal brand rhythm');
  assert.ok(css.includes('min-width: 108px'), 'Brand copy should keep a stable non-shrinking text width');
  assert.ok(css.includes('width: 3.285rem'), 'Brand mark width should shrink by 10%');
  assert.ok(css.includes('height: 2.205rem'), 'Brand mark height should shrink by 10%');
  assert.match(css, /\.brand-cn\s*\{[^}]*font-size: 1\.05rem;[^}]*font-weight: 760;/s, 'Chinese brand name should remain the primary text');
  assert.match(css, /\.brand-en\s*\{[^}]*font-size: 0\.47rem;[^}]*font-weight: 560;/s, 'English brand text should be smaller and lighter');
  assert.ok(css.includes('letter-spacing: 0.14em'), 'English brand copy should use quiet uppercase tracking');
  assert.ok(css.includes('.site-logo-mark'), 'Header should render a graphical AI logo mark');
  assert.ok(!css.includes('.brand-mark-v5'), 'Header should not keep the prior self-designed option 5 style');
  assert.ok(!css.includes('.site-logo-preview'), 'Header should not keep the prior five-logo preview area');
  assert.ok(css.includes('.site-header-inner'), 'Header should use one shared inner layout container');
  assert.match(css, /\.site-header-shell\s*\{[^}]*flex:\s*0 0 auto;/s, 'Header brand area should not shrink');
  assert.ok(css.includes('.site-nav-panel'), 'Header should render a persistent nav panel');
  assert.match(css, /\.site-nav-panel\s*\{[^}]*flex:\s*1 1 auto;/s, 'Header nav should consume remaining space');
  assert.match(css, /\.site-nav-panel\s*\{[^}]*min-width:\s*0;/s, 'Header nav should be allowed to size within remaining space');
  assert.ok(!css.includes('.site-brand.is-hidden-after-hero'), 'Header brand should no longer hide after the hero');
  assert.match(css, /\.site-header\s*\{[^}]*position: fixed;/s, 'Header should stay fixed to the viewport');
  assert.match(css, /\.site-header\s*\{[^}]*backdrop-filter: blur\(16px\);/s, 'Header should keep a light translucent backdrop');
  assert.match(css, /\.site-nav-panel\s*\{[^}]*opacity: 1;/s, 'Header nav should be visible by default');
  assert.match(css, /\.site-nav-panel\s*\{[^}]*pointer-events: auto;/s, 'Header nav should remain interactive by default');
  assert.match(css, /\.site-nav-panel\s*\{[^}]*transform: translate3d\(0, 0, 0\);/s, 'Header nav should not slide away by default');
  assert.match(css, /\.site-nav-panel\s*\{[^}]*justify-content:\s*space-between;/s, 'Desktop nav should separate primary links and the right action');
  assert.match(css, /\.site-nav-primary\s*\{[^}]*flex-wrap:\s*nowrap;/s, 'Desktop primary nav should stay on one line');
  assert.ok(css.includes('@media (min-width: 1180px) and (max-width: 1439px)'), 'Header should include a compact desktop breakpoint');
  assert.ok(css.includes('@media (max-width: 1179px)'), 'Header should switch to a menu below 1180px');
  assert.ok(css.includes(".site-nav-panel[data-open='true']"), 'Mobile nav should expose an explicit open state');
  assert.ok(css.includes('.site-nav-dropdown-menu'), 'Desktop navigation should style dropdown cards');
  assert.ok(css.includes(".site-nav-dropdown[data-open='true'] .site-nav-dropdown-menu"), 'Dropdowns should expose an explicit open state');
  assert.ok(css.includes('.site-menu-toggle'), 'Header should style a mobile menu button');
  assert.ok(css.includes('font-size: 0.95rem'), 'Desktop navigation should use the requested 15px scale');
  assert.match(css, /\.site-nav-link\s*\{[^}]*font-weight: 600;/s, 'Primary navigation should use a restrained shared weight');
  assert.match(css, /\.site-nav-link:hover[^}]*\{[^}]*color: var\(--color-brand\);/s, 'Navigation hover should use a subtle brand color');
  assert.match(css, /\.site-nav-link\[aria-current='page'\][^{]*\{[^}]*color: var\(--color-brand\);/s, 'Current navigation item should use the brand color');
  assert.ok(css.includes('color: #0f172a'), 'Header logo/navigation should use pure dark text');
  assert.ok(css.includes('.site-nav-panel-inner') && css.includes('background: transparent'), 'Expanded nav should be pure text without a card background');
  assert.doesNotMatch(
    css,
    /\.site-nav-panel-inner\s*\{(?=[^}]*display:\s*flex\s*;)(?=[^}]*flex-wrap:\s*wrap\s*;)(?=[^}]*align-items:\s*center\s*;)(?=[^}]*justify-content:\s*center\s*;)(?=[^}]*gap:\s*0\.35rem\s*;)(?=[^}]*border:\s*1px)[^}]*\}/s,
    'Expanded nav should not use the old pill/card shell'
  );
  assert.ok(css.includes('.fluid-core-toggle'), 'Hero should allow clicking the center ball area');
  assert.ok(css.includes('--hero-title-y: 45%'), 'Hero title should move down 5% from the previous position');
  assert.ok(css.includes('--hero-title-y: 47%'), 'Mobile hero title should move down 5% from the previous position');
  assert.ok(!css.includes('--hero-title-y: 40%'), 'Hero title should not keep the previous desktop position');
  assert.ok(!css.includes('--hero-title-y: 42%'), 'Hero title should not keep the previous mobile position');
  assert.ok(css.includes('--hero-panel-y: calc(45% + 8.75rem)'), 'Expanded hero copy should move upward 5% on desktop');
  assert.ok(css.includes('--hero-panel-y: calc(45% + 9rem)'), 'Open expanded hero copy should keep spacing while moving upward');
  assert.ok(css.includes('--hero-panel-y: calc(45% + 6.6rem)'), 'Expanded hero copy should move upward 5% on mobile');
  assert.ok(css.includes('--hero-panel-y: calc(45% + 6.8rem)'), 'Open mobile expanded hero copy should keep spacing while moving upward');
  assert.ok(css.includes('transform: translate3d(-50%, -50%, 0)'), 'Hero title group should be centered with translate -50%');
  assert.ok(css.includes('.fluid-center-overlay') && css.includes('z-index: 40'), 'Hero title layer should sit above the icon layer');
  assert.ok(css.includes('.fluid-aura') && css.includes('filter: saturate(1.12) contrast(1.04);'), 'Fluid aura should deepen color with saturation and contrast only');
  assert.ok(!css.includes('filter: saturate(1.12) contrast(1.04) brightness'), 'Fluid aura should not brighten the colors');
  assert.ok(css.includes('.fluid-title-stack') && css.includes('z-index: 50'), 'Hero title stack should keep icons on the same visual layer as the title');
  assert.ok(css.includes('.fluid-main-title') && css.includes('cursor: pointer'), 'Hero main title should expose a clickable animation target');
  assert.ok(css.includes('.title-letter') && css.includes('transform-origin: 50% 100%'), 'Hero title letters should animate from their baseline');
  assert.ok(css.includes('animation-delay: calc(var(--beat-index) * 82ms)'), 'Hero title letters should use a fixed 82ms left-to-right beat');
  assert.ok(css.includes('@keyframes titlePianoBeat'), 'Hero title should define the normal piano beat animation');
  assert.ok(css.includes('translateY(-0.18em) scaleY(1.06)'), 'Normal title letters should jump lightly like piano keys');
  assert.ok(css.includes('.fluid-main-title.is-playing .title-letter-final'), 'Hero title should target the final B separately');
  assert.ok(css.includes('animation-delay: calc(var(--beat-index) * 82ms + 80ms)'), 'Final B animation should start after the prior beat sequence');
  assert.ok(css.includes('@keyframes titleFinalBeatFall'), 'Hero title should define the final B jump-fall-stand animation');
  assert.ok(css.includes('rotate(16deg)'), 'Final B should have a falling motion');
  assert.ok(css.includes('.hero-bounce-orb') && css.includes('z-index: 90'), 'Hero title should render a high-layer collision ball wrapper after the final B beat');
  assert.ok(css.includes('.hero-bounce-ball') && css.includes('width: 24px'), 'Hero collision ball should enlarge to 24px');
  assert.ok(css.includes('height: 24px'), 'Hero collision ball should stay circular after enlargement');
  assert.ok(css.includes('background: radial-gradient(circle at 34% 28%, rgba(255, 255, 255, 0.38) 0%, #475569 18%, #111827 58%, #020617 100%)'), 'Hero collision ball should use a darker radial gradient for sphere depth');
  assert.ok(css.includes('box-shadow: inset -5px -6px 10px rgba(0, 0, 0, 0.38)'), 'Hero collision ball should have an inset shadow for volume');
  assert.ok(css.includes('.hero-bounce-shadow') && css.includes('width: 38px'), 'Hero collision ball should include a heavier oval ground shadow');
  assert.ok(css.includes('height: 10px'), 'Hero collision shadow should stay flat and wider');
  assert.ok(css.includes('background: rgba(15, 23, 42, 0.32)'), 'Hero collision shadow should use a heavier slate reflection');
  assert.ok(css.includes('filter: blur(5px)'), 'Hero collision shadow should blur like a soft floor reflection');
  assert.ok(css.includes('opacity: 0.7'), 'Hero collision shadow should start with a heavier visible reflection');
  assert.ok(css.includes('.fluid-title-stack.is-ball-flying .hero-bounce-orb'), 'Hero collision ball wrapper should only animate after the final B beat');
  assert.ok(css.includes('transform: translate3d(var(--ball-x, 0px), var(--ball-y, 0px), 0)'), 'Hero collision ball wrapper should be positioned by JS-computed coordinates');
  assert.ok(css.includes('opacity: var(--ball-opacity, 0)'), 'Hero collision ball visibility should be controlled by JS animation state');
  assert.ok(css.includes('transform: translateY(var(--ball-lift, 0px))'), 'Hero collision ball lift should be controlled separately for parabolic motion');
  assert.ok(css.includes('opacity: var(--ball-shadow-opacity, 0)'), 'Hero collision shadow opacity should be controlled by height');
  assert.ok(css.includes('scaleX(var(--ball-shadow-scale, 1))'), 'Hero collision shadow scale should be controlled by height');
  assert.ok(!css.includes('@keyframes heroBouncePath'), 'Hero should not hard-code the ball trajectory in CSS keyframes');
  assert.ok(!css.includes('@keyframes heroBounceLift'), 'Hero should not hard-code the ball lift in CSS keyframes');
  assert.ok(!css.includes('@keyframes heroBounceShadow'), 'Hero should not hard-code the ball shadow in CSS keyframes');
  assert.ok(css.includes('.subtitle-part') && css.includes('transform-origin: 50% 100%'), 'Hero subtitle parts should animate from their baseline');
  assert.ok(css.includes('.subtitle-title.is-playing .subtitle-part:not(.subtitle-part-first)'), 'Hero subtitle should animate normal parts from back to front');
  assert.ok(css.includes('animation: subtitlePianoBack 420ms ease-out both'), 'Hero subtitle normal parts should use the back-to-front piano animation');
  assert.ok(css.includes('animation-delay: calc(var(--beat-index) * 80ms)'), 'Hero subtitle should use a fixed 80ms reverse beat');
  assert.ok(css.includes('.subtitle-title.is-playing .subtitle-part-first'), 'Hero subtitle should target the first Chinese character separately');
  assert.ok(css.includes('animation: subtitleFirstFall 720ms ease-out both'), 'The first Chinese subtitle character should have a fall-and-recover animation');
  assert.ok(css.includes('animation-delay: calc(var(--beat-index) * 80ms + 80ms)'), 'The first Chinese subtitle character should animate after the reverse beat reaches it');
  assert.ok(css.includes('@keyframes subtitlePianoBack'), 'Hero should define the subtitle back-to-front piano animation');
  assert.ok(css.includes('@keyframes subtitleFirstFall'), 'Hero should define the first-character fall animation');
  assert.ok(css.includes('translateY(-0.16em) scaleY(1.05)'), 'Subtitle normal parts should jump lightly');
  assert.ok(css.includes('rotateX(82deg)'), 'The first Chinese subtitle character should fall forward before standing back up');
  assert.ok(css.includes('rotateX(-6deg)'), 'The first Chinese subtitle character should recover with a small shake');
  assert.ok(!css.includes('@keyframes logoForwardFall'), 'Hero should remove the old subtitle AI logo knockdown animation');
  assert.ok(!css.includes('.flying-logo-piece'), 'Hero should remove the old vertical flying logo piece');
  assert.ok(!css.includes('.hero-logo-target-piece'), 'Hero should remove the old target piece inside the AI logo');
  assert.ok(!css.includes('.flying-logo-bar'), 'Hero should not keep the old short horizontal flying bar');
  assert.ok(!css.includes('.hero-logo-target-bar'), 'Hero should not keep the old horizontal target bar');
  assert.ok(css.includes('.hero-title-cn') && css.includes('gap: 0.12em'), 'Hero Chinese title logo gap should stay tight and balanced');
  assert.ok(css.includes('.hero-title-logo') && css.includes('width: 1.7em'), 'Hero Chinese title AI logo container should be wide enough for the compact mark');
  assert.ok(css.includes('height: 1.12em'), 'Hero Chinese title AI logo container should match the Chinese character height visually');
  assert.ok(css.includes('transform: translateY(0.02em)'), 'Hero Chinese title AI logo should stay visually aligned to the text baseline');
  assert.ok(css.includes('.hero-title-logo-mark') && css.includes('transform: scale(1.22)'), 'Hero Chinese title AI logo SVG body should be enlarged to compensate for viewBox whitespace');
  assert.ok(css.includes('transform-origin: center'), 'Hero Chinese title AI logo SVG body should scale from the center');
  assert.ok(css.includes('.hero-tool-row') && css.includes('justify-content: center'), 'Hero tool icons should render as a centered horizontal row');
  assert.ok(css.includes('gap: clamp(0.75rem, 1.4vw, 1.25rem)'), 'Hero tool row should use an 18-24px style responsive gap');
  assert.ok(css.includes('.hero-tool-button') && css.includes('width: 3.5rem'), 'Hero tool buttons should enlarge to 56px on desktop');
  assert.ok(css.includes('height: 3.5rem'), 'Hero tool buttons should keep a 56px circular height on desktop');
  assert.ok(css.includes('.hero-tool-button.is-active') && css.includes('scale(1.18)'), 'Clicked hero tool icon should enlarge without disrupting the row');
  assert.ok(css.includes('.hero-tool-button img') && css.includes('width: 2rem'), 'Hero tool SVG bodies should enlarge to 32px on desktop');
  assert.ok(css.includes('.tool-icon-tooltip') && css.includes('z-index: 80'), 'Tool icon tooltip should sit above the title stack');
  assert.ok(css.includes('background: rgba(15, 23, 42, 0.92)'), 'Tool icon tooltip should use a compact dark label');
  assert.match(
    css,
    /\.fluid-static-fallback::before\s*,\s*\.fluid-static-fallback::after\s*,\s*\.fluid-fallback-orbit\s*\{[^}]*display:\s*none\s*;[^}]*\}/s,
    'Hero orbit and ring line decorations should be hidden'
  );
  assert.match(
    css,
    /\.fluid-hero-fullscreen\s+\.fluid-scene-canvas-shell\s*\{[^}]*display:\s*none\s*;[^}]*\}/s,
    'Hidden 3D orbit canvas should not render line decorations'
  );
  assert.ok(css.includes('.fluid-inline-search'), 'Expanded hero search should be a minimal inline rail');
  assert.ok(css.includes('font-size: clamp(0.81rem, 1.53vw, 0.945rem)'), 'Expanded hero subtitle should shrink by 10%');
  assert.ok(css.includes('width: min(31.5rem, calc(100vw - 40px))'), 'Expanded hero search should shrink to a 504px max width');
  assert.ok(css.includes('height: 3.0375rem'), 'Expanded hero search should shrink by 10%');
  assert.ok(css.includes('font-size: 0.88rem'), 'Expanded hero search input should shrink by 10%');
  assert.ok(css.includes('height: 2.34rem'), 'Expanded hero search button should shrink by 10%');
  assert.ok(css.includes('border: 1px solid rgba(15, 23, 42, 0.12)'), 'Expanded hero search should use a thin full outline');
  assert.ok(css.includes('border-radius: 999px'), 'Expanded hero search should remain a pill outline');
  assert.ok(css.includes('background: rgba(255, 255, 255, 0.42)'), 'Expanded hero search should stay translucent');
  assert.ok(css.includes('backdrop-filter: blur(14px)'), 'Expanded hero search should use a light glass blur');
  assert.ok(!css.includes('border-bottom: 1px solid rgba(15, 23, 42, 0.14)'), 'Expanded hero search should not be bottom-line only');
  assert.doesNotMatch(
    css,
    /\.fluid-inline-search\s*\{(?=[^}]*border:\s*1px\s+solid\s+rgba\(15\s*,\s*23\s*,\s*42\s*,\s*0\.08\)\s*;)(?=[^}]*border-radius:\s*1\.5rem\s*;)(?=[^}]*background:\s*rgba\(255\s*,\s*255\s*,\s*255\s*,\s*0\.9\)\s*;)(?=[^}]*padding:\s*1rem\s*;)[^}]*\}/s,
    'Search should not use a card-like block'
  );
  assert.ok(css.includes('background: transparent;'), 'Hero should sit on the unified page background');
  assert.ok(css.includes('width: 2.875rem'), 'Mobile hero tool buttons should use a 46px container');
  assert.ok(css.includes('width: 1.625rem'), 'Mobile hero tool SVG bodies should use a 26px size');
  assert.ok(css.includes('.fluid-scroll-hint'), 'Hero should keep a scroll hint class');
  assert.ok(css.includes('display: block'), 'Hero scroll hint should always display');
  assert.ok(css.includes('visibility: visible'), 'Hero scroll hint should stay visible');
  assert.ok(css.includes('opacity: 1'), 'Hero scroll hint should not be hidden by opacity');
  assert.ok(css.includes('transform: translateX(-50%)'), 'Hero scroll hint should keep its bottom-center position without being moved offscreen');
  assert.ok(css.includes('.fluid-main-title.is-playing .title-letter') && css.includes('animation: none !important'), 'Reduced motion should disable title letter animation');
  assert.match(
    css,
    /\.hero-bounce-orb\s*,\s*\.hero-bounce-ball\s*,\s*\.hero-bounce-shadow\s*,\s*\.subtitle-part\s*\{[^}]*animation:\s*none\s*!important\s*;[^}]*\}/s,
    'Reduced motion should disable the collision ball, shadow, and subtitle piano animation'
  );
  assert.ok(!css.includes('linear-gradient(115deg, transparent 0 39%'), 'Hero should not render diagonal background lines');
  assert.ok(!css.includes('linear-gradient(144deg, transparent 0 57%'), 'Hero should not render diagonal background lines');
  assert.ok(!css.includes('linear-gradient(28deg, transparent 0 62%'), 'Hero should not render diagonal background lines');
  assert.ok(!css.includes('.fluid-node-card'), 'Hero CSS should not keep complex tool card styles');
  assert.ok(css.includes('.home-section-container'), 'Lower home sections should share one container class');
  assert.ok(css.includes('max-width: 1440px'), 'Home sections should use a unified max-width');
  assert.ok(css.includes('padding-left: clamp(1rem, 6.5vw, 6rem)') && css.includes('padding-right: clamp(1rem, 6.5vw, 6rem)'), 'Home sections should align with the fixed header logo edge');
  assert.ok(css.includes('margin: 0 auto'), 'Lower sections should use padding rather than divider margins for vertical rhythm');
  assert.ok(css.includes('padding: 72px 0'), 'Lower sections should use a unified vertical gap');
  assert.ok(css.includes('font-size: clamp(28px, 2vw, 36px)'), 'Lower section titles should stay below the logo visual height');
  assert.ok(css.includes('border-radius: 28px'), 'Lower cards should share the unified Apple-style radius');
  assert.ok(css.includes('0 18px 48px rgba(15, 23, 42, .06)') && css.includes('0 2px 8px rgba(15, 23, 42, .04)'), 'Lower cards should use a softer unified shadow');
  assert.ok(css.includes('gap: 18px'), 'Tool gallery grids should be tighter without crowding');
  assert.ok(!css.includes('.home-global-tools-grid'), 'Global tools should not keep the old 3-column desktop grid hook');
  assert.ok(css.includes('.global-tools-carousel'), 'Global tools should render as a focused carousel');
  assert.ok(css.includes('.global-tool-card.is-active') && css.includes('translateZ(120px)') && css.includes('scale(1)'), 'Active global tool card should be closest and prominent');
  assert.ok(css.includes('.global-tools-carousel') && css.includes('perspective: 1400px'), 'Global carousel should use natural perspective for 3D depth');
  assert.ok(css.includes('perspective-origin: center center'), 'Global carousel should center its 3D perspective');
  assert.ok(css.includes('.global-tools-stage') && css.includes('transform-style: preserve-3d'), 'Global carousel cards should sit on a 3D stage');
  assert.ok(css.includes('.global-tool-card.is-prev1') && css.includes('translateX(calc(-50% - 250px))') && css.includes('translateZ(40px)') && css.includes('scale(.88)'), 'Prev1 global tool card should sit left of the active card');
  assert.ok(css.includes('.global-tool-card.is-next1') && css.includes('translateX(calc(-50% + 250px))') && css.includes('translateZ(40px)') && css.includes('scale(.88)'), 'Next1 global tool card should sit right of the active card');
  assert.ok(css.includes('.global-tool-card.is-prev2') && css.includes('translateX(calc(-50% - 430px))') && css.includes('translateZ(-80px)') && css.includes('scale(.72)'), 'Prev2 global tool card should be visible in the second left layer');
  assert.ok(css.includes('.global-tool-card.is-next2') && css.includes('translateX(calc(-50% + 430px))') && css.includes('translateZ(-80px)') && css.includes('scale(.72)'), 'Next2 global tool card should be visible in the second right layer');
  assert.ok(css.includes('.global-tool-card.is-prev3') && css.includes('translateX(calc(-50% - 590px))') && css.includes('translateZ(-160px)') && css.includes('scale(.58)'), 'Prev3 global tool card should fade naturally at the left edge');
  assert.ok(css.includes('.global-tool-card.is-next3') && css.includes('translateX(calc(-50% + 590px))') && css.includes('translateZ(-160px)') && css.includes('scale(.58)'), 'Next3 global tool card should fade naturally at the right edge');
  assert.ok(css.includes('.global-tool-card.is-prev4') && css.includes('visibility: hidden'), 'Prev4 global tool card should not add an abrupt extra edge layer');
  assert.ok(css.includes('.global-tool-card.is-next4') && css.includes('visibility: hidden'), 'Next4 global tool card should not add an abrupt extra edge layer');
  assert.ok(css.includes('.global-tool-card.is-hidden') && css.includes('visibility: hidden'), 'Off-stage global tool cards should be hidden instead of stacked behind');
  assert.ok(globalCarouselCss.includes('opacity: 1') && !globalCarouselCss.includes('opacity: .') && !globalCarouselCss.includes('opacity: 0.'), 'Global carousel should keep visible cards fully opaque');
  assert.ok(css.includes('-webkit-mask-image: linear-gradient(') && css.includes('black 12%') && css.includes('black 88%'), 'Global carousel should fade at container edges with a mask');
  assert.ok(css.includes('mask-image: linear-gradient('), 'Global carousel should define the standard mask-image edge fade');
  assert.ok(css.includes('.global-tool-card::after') && css.includes('display: none'), 'Global tool cards should remove the heavy stamp perforation border');
  assert.ok(!globalCarouselCss.includes('radial-gradient(circle, var(--site-bg) 0 4.5px'), 'Global carousel should not keep visible stamp perforation gradients');
  assert.ok(css.includes('.global-tools-section') && css.includes('min-height: 100vh'), 'Global tools section should visually approach first-screen height');
  assert.ok(css.includes('.global-tools-section') && css.includes('display: flex') && css.includes('flex-direction: column'), 'Global tools section should stack heading and carousel in a full-height column');
  assert.ok(css.includes('.global-tools-carousel') && css.includes('margin-top: clamp(90px, 10vh, 120px)'), 'Global carousel card group should move down without moving the section heading');
  assert.ok(css.includes('.global-tool-card') && css.includes('background: #ffffff') && css.includes('border: 1px solid rgba(15, 23, 42, .08)'), 'Global cards should switch to a clean white card with a fine gray outline');
  assert.ok(css.includes('.global-tool-card.is-active') && css.includes('border-color: rgba(15, 23, 42, .12)'), 'Active global card should keep a slightly stronger fine outline');
  assert.ok(!globalCarouselCss.includes('--stamp-color: var(--stamp-cyan)'), 'Global cards should not use colorful stamp border variables');
  assert.ok(css.includes('0 18px 48px rgba(15, 23, 42, .06)') && css.includes('0 2px 8px rgba(15, 23, 42, .04)'), 'Global cards should use a soft Apple-style shadow');
  assert.ok(css.includes('.global-tool-card.is-active') && css.includes('0 24px 64px rgba(15, 23, 42, .09)') && css.includes('0 6px 18px rgba(15, 23, 42, .05)'), 'Active global card should use a restrained foreground shadow');
  assert.ok(css.includes('.global-tool-card-inner') && css.includes('transition: transform 180ms ease'), 'Global stamp card inner should handle click pop without breaking the 3D card transform');
  assert.ok(css.includes('.global-tool-card:active .global-tool-card-inner') && css.includes('translateY(-8px) scale(1.018)'), 'Clicked global cards should pop upward lightly');
  assert.ok(css.includes('width: 300px'), 'Active global stamp card should use the requested desktop base width');
  assert.ok(css.includes('height: 400px'), 'Active global stamp card should use the requested desktop base height');
  assert.ok(css.includes('height: 460px'), 'Global carousel stage should use the requested height');
  assert.ok(css.includes('transition:') && css.includes('transform 620ms cubic-bezier(.22, .8, .22, 1)') && css.includes('box-shadow 620ms ease') && css.includes('filter 620ms ease'), 'Global carousel should use the requested slow focus transition timing');
  assert.ok(css.includes('.global-tool-card.is-active:not(:active) .global-tool-card-inner') && css.includes('animation: activeFloat 3200ms ease-in-out infinite'), 'Active global card should have a subtle breathing float');
  assert.ok(css.includes('.global-tools-carousel:hover .global-tool-card.is-active .global-tool-card-inner') && css.includes('animation-play-state: paused'), 'Active float should pause on hover for readability');
  assert.ok(css.includes('@keyframes activeFloat') && css.includes('translateY(-6px)'), 'Active float keyframes should stay subtle');
  assert.ok(css.includes('.global-tools-section .section-eyebrow') && css.includes('background: #ffffff') && css.includes('color: #334155') && css.includes('border: 1px solid rgba(15, 23, 42, .08)'), 'Global section eyebrow should use a scoped gray-white pill style');
  assert.ok(css.includes('@media (max-width: 768px)') && css.includes('width: 78vw'), 'Global carousel should adapt to one prominent mobile card');
  assert.ok(css.includes('.create-tools-section .section-eyebrow') && css.includes('background: #ffffff') && css.includes('color: #334155') && css.includes('border: 1px solid rgba(15, 23, 42, .08)'), 'Creative tools eyebrow should use the scoped gray-white pill style');
  assert.ok(css.includes('.home-section-container') && css.includes('max-width: 1440px') && css.includes('padding-left: clamp(1rem, 6.5vw, 6rem)') && css.includes('padding-right: clamp(1rem, 6.5vw, 6rem)'), 'Lower home sections should align to the header logo edge with one shared container');
  assert.ok(css.includes('.section-minimal') && css.includes('padding: 72px 0'), 'Lower home sections should use consistent vertical whitespace');
  assert.ok(css.includes('.section-eyebrow') && css.includes('background: #ffffff') && css.includes('color: #334155') && css.includes('box-shadow: 0 8px 22px rgba(15, 23, 42, .04)'), 'All lower section eyebrow pills should use a minimal gray-white style');
  assert.match(
    css,
    /\.gallery-card\s*,\s*\.create-tool-card\s*,\s*\.global-tool-card\s*\{(?=[^}]*background:\s*rgba\(255\s*,\s*255\s*,\s*255\s*,\s*0?\.86\)\s*;)(?=[^}]*border-radius:\s*28px\s*;)[^}]*\}/s,
    'All lower cards should share the unified Apple-style surface'
  );
  assert.ok(css.includes('0 18px 48px rgba(15, 23, 42, .06)') && css.includes('0 2px 8px rgba(15, 23, 42, .04)'), 'Unified lower cards should use a softer Apple-style shadow');
  assert.ok(css.includes('.interactive-card::before') && css.includes('display: none'), 'Lower cards should remove colorful top accent lines');
  assert.ok(css.includes('.shine-effect::after') && css.includes('display: none'), 'Lower cards should remove decorative shine sweeps');
  assert.ok(css.includes('.home-section-action') && css.includes('min-height: 44px') && css.includes('padding: 0 22px'), 'View actions should use one compact capsule size');
  assert.ok(css.includes('.home-section-action') && css.includes('border-radius: 999px') && css.includes('background: rgba(255, 255, 255, .88)') && css.includes('color: #0f172a'), 'View actions should use a white Apple-style capsule');
  assert.ok(css.includes('.home-section-action') && css.includes('0 10px 26px rgba(15, 23, 42, .06)') && css.includes('inset 0 1px 0 rgba(255, 255, 255, .85)'), 'View actions should use a light inset Apple-style shadow');
  assert.ok(css.includes('.home-section-action:hover') && css.includes('transform: translateY(-2px)') && css.includes('background: #ffffff'), 'View actions should lift lightly on hover');
  assert.ok(css.includes('.home-section-action:active') && css.includes('transform: translateY(0) scale(.98)'), 'View actions should compress lightly when clicked');
  assert.ok(css.includes('.cta-actions') && css.includes('justify-content: flex-end') && css.includes('gap: 16px'), 'Bottom CTA button group should stay right-aligned with 16px spacing');
  assert.ok(css.includes('.cta-actions .home-section-action-primary') && css.includes('color: #0f766e') && css.includes('border-color: rgba(15, 118, 110, .18)'), 'Primary CTA should keep only a subtle teal emphasis');
  assert.ok(css.includes('.guide-card .shine-effect') && css.includes('background: transparent') && css.includes('border-bottom: 0'), 'Guide cards should remove heavy colored header panels');
  assert.ok(css.includes('.video-cover') && css.includes('background: #0f172a'), 'Video covers should use a simple dark cover base');
  assert.ok(css.includes('.home-video-grid .video-cover') && css.includes('aspect-ratio: 16 / 9') && css.includes('linear-gradient(135deg, var(--video-deep) 0%, var(--video-mid) 52%, #263447 100%)'), 'Home video covers should use a lighter 16:9 tech gradient instead of a pure black panel');
  assert.ok(css.includes('.home-video-grid .video-card') && css.includes('background: rgba(255, 255, 255, .88)') && css.includes('0 18px 48px rgba(15, 23, 42, .06)'), 'Home video cards should use a light Apple-style card surface');
  assert.ok(css.includes('.home-video-grid .video-card:hover .video-play-button') && css.includes('transform: scale(1.06)'), 'Home video play buttons should scale subtly on hover');
  assert.ok(css.includes('.compare-vs') && css.includes('opacity: 0.08'), 'Compare cards should keep the VS watermark subtle');
  assert.ok(css.includes('.creative-tools-showcase') && css.includes('-webkit-mask-image: linear-gradient(90deg, transparent 0%, black 9%, black 91%, transparent 100%)'), 'Creative tools should render inside a horizontally faded showcase mask');
  assert.ok(css.includes('.creative-tools-showcase::before') && css.includes('background: linear-gradient(90deg, var(--site-bg) 0%, rgba(250, 250, 250, 0) 100%)'), 'Creative tools should add a left edge fade fallback overlay');
  assert.ok(css.includes('.creative-tools-showcase::after') && css.includes('background: linear-gradient(270deg, var(--site-bg) 0%, rgba(250, 250, 250, 0) 100%)'), 'Creative tools should add a right edge fade fallback overlay');
  assert.ok(css.includes('.create-tools-section .section-heading') && css.includes('margin-bottom: clamp(56px, 6vw, 76px) !important'), 'Creative tools section should add desktop spacing between the header and marquee wall');
  assert.ok(css.includes('@media (max-width: 1024px)') && css.includes('margin-bottom: clamp(40px, 5vw, 56px) !important'), 'Creative tools section should use tablet-specific header spacing');
  assert.ok(css.includes('@media (max-width: 640px)') && css.includes('margin-bottom: clamp(28px, 8vw, 40px) !important'), 'Creative tools section should use compact mobile header spacing');
  assert.ok(css.includes('.creative-tools-marquee') && css.includes('display: flex') && css.includes('gap: 18px'), 'Creative tools marquee rows should move whole cards with a compact gap');
  assert.ok(css.includes('.creative-tools-row + .creative-tools-row') && css.includes('margin-top: 0.75rem'), 'Creative tools marquee rows should keep a slightly more comfortable vertical gap');
  assert.ok(css.includes('.creative-tools-row:nth-child(1) .creative-tools-marquee') && css.includes('animation-name: marqueeRight'), 'Creative tools first row should flow left to right');
  assert.ok(css.includes('.creative-tools-row:nth-child(2) .creative-tools-marquee') && css.includes('animation-name: marqueeLeft'), 'Creative tools second row should flow right to left');
  assert.ok(css.includes('.creative-tools-row:nth-child(3) .creative-tools-marquee') && css.includes('animation-name: marqueeRight'), 'Creative tools third row should flow left to right');
  assert.ok(css.includes('@keyframes marqueeLeft') && css.includes('translate3d(-50%, 0, 0)'), 'Creative marquee should define a seamless left-moving transform loop');
  assert.ok(css.includes('@keyframes marqueeRight') && css.includes('translate3d(0, 0, 0)'), 'Creative marquee should define a seamless right-moving transform loop');
  assert.ok(css.includes('.creative-marquee-card') && css.includes('width: clamp(260px, 24vw, 320px)') && css.includes('min-height: 176px'), 'Creative marquee cards should use the requested compact desktop size');
  assert.ok(css.includes('.creative-marquee-card') && css.includes('opacity: 1'), 'Creative marquee cards should stay opaque instead of fading individual cards');
  assert.ok(css.includes('0 18px 48px rgba(15, 23, 42, .055)') && css.includes('0 4px 16px rgba(15, 23, 42, .035)'), 'Creative marquee card shadows should be broad and soft, not hard bottom lines');
  assert.ok(css.includes('0 24px 68px rgba(15, 23, 42, .075)') && css.includes('0 8px 22px rgba(15, 23, 42, .04)'), 'Creative marquee hover shadows should remain soft while adding lift');
  assert.ok(css.includes('.creative-card-logo-wrap') && css.includes('width: 52px') && css.includes('height: 52px'), 'Creative marquee cards should use a larger but light Apple-style logo shell');
  assert.ok(css.includes('.creative-card-logo') && css.includes('width: 36px') && css.includes('height: 36px'), 'Creative marquee logos should be larger and readable');
  assert.ok(css.includes('.creative-marquee-card:hover') && css.includes('translateY(-8px) scale(1.035)'), 'Creative marquee cards should lift and scale on hover');
  assert.ok(css.includes('.creative-tools-row:hover .creative-tools-marquee') && css.includes('animation-play-state: paused'), 'Hovering a creative row should pause that row');
  assert.ok(css.includes('@media (max-width: 1024px)') && css.includes('.creative-tools-row:nth-child(3)') && css.includes('display: none'), 'Tablet creative showcase should reduce to two marquee rows');
  assert.ok(css.includes('@media (max-width: 640px)') && css.includes('.creative-tools-showcase') && css.includes('overflow-x: auto'), 'Mobile creative showcase should become a one-row horizontal scroller');
  assert.ok(css.includes('@media (prefers-reduced-motion: reduce)') && css.includes('.creative-tools-marquee') && css.includes('animation: none !important'), 'Reduced motion should disable the creative marquee animation');
  assert.ok(css.includes('.home-guides-grid') && css.includes('grid-template-columns: repeat(2, minmax(0, 1fr))'), 'Guide cards should use a 2-column desktop grid for three clean rows');
  assert.ok(css.includes('.guides-section-layout') && css.includes('grid-template-columns: 320px minmax(0, 1fr)'), 'Home guides should use a learning-path panel plus tutorial grid layout');
  assert.ok(css.includes('.guide-learning-path') && css.includes('border: 1px solid rgba(15, 23, 42, .08)'), 'Home guides should render a lightweight learning path panel');
  assert.ok(css.includes('.home-guides-grid .guide-outcome') && css.includes('border: 0') && css.includes('background: transparent'), 'Home guide outcomes should be a weak text line instead of a nested card');
  assert.ok(css.includes('.home-video-grid') && css.includes('grid-template-columns: repeat(3, minmax(0, 1fr))'), 'Video cards should use a 3-column desktop grid so nine cards fill three rows');
  assert.ok(css.includes('.home-compare-grid') && css.includes('grid-template-columns: repeat(3, minmax(0, 1fr))'), 'Compare cards should use a 3-column desktop grid so nine decision cards fill three rows');
  assert.ok(css.includes('.compare-pair') && css.includes('.compare-tool-pill') && css.includes('.compare-vs-text'), 'Compare cards should show tool-vs-tool decision pills');
  assert.ok(css.includes('.compare-conclusion') && css.includes('.compare-tags') && css.includes('.compare-tag'), 'Compare cards should expose a quick conclusion and gray scenario tags');
  assert.ok(css.includes('content: "VS"') && css.includes('rgba(15, 23, 42, .035)'), 'Compare cards should keep only a very faint VS watermark');
  assert.ok(css.includes('.home-video-grid .video-card') && css.includes('width: 100%') && css.includes('min-width: 0'), 'Video cards should shrink cleanly into the 3-column grid');
  assert.ok(css.includes('@media (min-width: 640px) and (max-width: 1023px)') && css.includes('.home-video-grid') && css.includes('grid-template-columns: repeat(2, minmax(0, 1fr))'), 'Guide and video grids should use two columns on tablet widths');
  assert.ok(css.includes('.home-guides-grid .guide-card:first-child') && css.includes('grid-column: span 1'), 'The first home guide card should not span columns in the 2x3 layout');
  assert.ok(css.includes('min-height: 242px'), 'Tool gallery cards should shrink from the previous 278px minimum');
  assert.ok(css.includes('height: 252px'), 'Desktop tool gallery cards should shrink from the previous 286px height');
  assert.ok(!css.includes('min-height: 278px'), 'Tool gallery cards should not keep the larger previous minimum height');
  assert.ok(!css.includes('height: 286px'), 'Desktop tool gallery cards should not keep the larger previous height');
  assert.ok(css.includes('.guide-card'), 'Guide cards should have a dedicated lightweight card hook');
  assert.ok(css.includes('.guide-outcome'), 'Guide cards should keep outcome content with home-specific lightweight styling');
  assert.ok(css.includes('.video-card'), 'Video cards should share the unified lower-card treatment');
  assert.ok(css.includes('.compare-card'), 'Compare cards should share the unified lower-card treatment');
  assert.ok(css.includes('.interactive-card:hover') && css.includes('box-shadow: none'), 'Reduced motion should disable hover lift emphasis');
});

test('home page uses minimal sections and compact gallery grids', () => {
  const page = readFileSync(new URL('../src/app/page.js', import.meta.url), 'utf8');
  const galleries = readFileSync(new URL('../src/components/HomeToolGalleries.tsx', import.meta.url), 'utf8');
  const globalCarousel = readFileSync(new URL('../src/components/GlobalToolsCarousel.tsx', import.meta.url), 'utf8');
  const creativeShowcase = readFileSync(new URL('../src/components/CreativeToolsShowcase.jsx', import.meta.url), 'utf8');
  const cards = readFileSync(new URL('../src/components/Cards.jsx', import.meta.url), 'utf8');
  const homeHero = readFileSync(new URL('../src/components/HomeHero.jsx', import.meta.url), 'utf8');
  const header = readFileSync(new URL('../src/components/Header.jsx', import.meta.url), 'utf8');
  const brandMarkPath = new URL('../src/components/BrandMark.jsx', import.meta.url);
  const brandMark = readFileSync(brandMarkPath, 'utf8');

  assert.ok(homeHero.includes('section-hero'), 'hero should keep its own layout hook');
  assert.ok(header.includes("'use client'"), 'header should stay as a client component');
  assert.ok(!header.includes('isNavHovered'), 'header should not keep hover-driven nav state');
  assert.ok(!header.includes('isNavPinned'), 'header should not keep click-pinned nav state');
  assert.ok(!header.includes('showNav'), 'header should not hide/show nav from component state');
  assert.ok(!header.includes('isAfterHero'), 'header brand should not hide after the hero');
  assert.ok(!header.includes("document.querySelector('.fluid-hero-fullscreen')"), 'header should not measure the hero to hide the logo');
  assert.ok(!header.includes('window.scrollY > heroHeight * 0.75'), 'header should not hide the logo after scrolling');
  assert.ok(!header.includes('setNavHovered'), 'logo/nav hover should not drive nav visibility');
  assert.ok(!header.includes('setNavPinned'), 'logo click should not pin or unpin the nav');
  assert.ok(header.includes('href="/"'), 'header brand should link to the home page');
  assert.ok(!header.includes('const logoOptions = ['), 'header should remove the prior five logo options');
  assert.ok(!header.includes("id: 'monogram'"), 'header should not keep logo option 1');
  assert.ok(!header.includes("id: 'fluid'"), 'header should not keep logo option 2');
  assert.ok(!header.includes("id: 'orbit'"), 'header should not keep logo option 3');
  assert.ok(!header.includes("id: 'pixel'"), 'header should not keep logo option 4');
  assert.ok(!header.includes("id: 'minimal'"), 'header should not keep logo option 5');
  assert.ok(!header.includes('const activeLogo = logoOptions[4]'), 'header should not select from removed logo options');
  assert.ok(existsSync(brandMarkPath), 'shared BrandMark component should exist');
  assert.ok(header.includes("import { BrandMark } from './BrandMark'"), 'header should reuse the shared AI logo mark');
  assert.ok(!header.includes('function BrandLogo'), 'header should not keep a private duplicate logo implementation');
  assert.ok(brandMark.includes('M7 42 22.3 7h9.5L16.5 42H7Z'), 'provided A mark should keep the left stroke separated at the top');
  assert.ok(brandMark.includes('M34 7 50.6 42H39.4L27.7 20.2 33.3 7H34Z'), 'provided A mark should keep the right stroke separated at the top');
  assert.ok(brandMark.includes('M60 7h10v35H60V7Z'), 'provided I mark should stay narrow and close to A');
  assert.ok(header.includes('brand-trigger'), 'logo button should use the new brand trigger layout');
  assert.ok(brandMark.includes('brand-mark-ai'), 'header should render the provided AI mark through the shared component');
  assert.ok(header.includes('brand-copy'), 'header should render stacked brand copy');
  assert.ok(header.includes('brand-cn'), 'header should render the Chinese brand line');
  assert.ok(header.includes('brand-en'), 'header should render the English brand line');
  assert.ok(header.includes("usePathname"), 'header should track the current route');
  assert.ok(header.includes("label: 'AI工具'"), 'header should group AI tool entries under one primary item');
  assert.ok(header.includes("label: '学习资源'"), 'header should group learning entries under one primary item');
  for (const href of ['/ai-tools', '/china-ai-tools', '/free-ai-tools', '/guides', '/videos', '/templates']) {
    assert.ok(header.includes(`href: '${href}'`), `header dropdowns should preserve ${href}`);
  }
  for (const label of ['工具总览', '国内工具', '免费工具']) {
    assert.ok(header.includes(`label: '${label}'`), `AI tools dropdown should include ${label}`);
  }
  assert.ok(header.includes("href: '/ai-tools'"), 'header should keep the AI model library as a primary link');
  assert.ok(header.includes("href: '/compare'"), 'header should keep tool comparison as a primary link');
  assert.ok(header.includes('aria-expanded={openDropdown === item.id}'), 'dropdown triggers should expose expanded state');
  assert.ok(header.includes('aria-controls={`site-nav-dropdown-${item.id}`}'), 'dropdown triggers should control a named menu');
  assert.ok(header.includes('aria-label={`打开${item.label}菜单`}'), 'dropdown triggers should have an accessible label');
  assert.ok(header.includes("event.key === 'ArrowDown'"), 'dropdown triggers should support ArrowDown keyboard entry');
  assert.ok(header.includes("document.addEventListener('pointerdown'"), 'open menus should close when clicking outside the header');
  assert.ok(header.includes("window.matchMedia('(min-width: 1180px)').matches"), 'dropdown hover behavior should only run in desktop mode');
  assert.ok(header.includes('onMouseEnter={() => handleDropdownMouseEnter(item.id)}'), 'desktop dropdowns should open on hover');
  assert.ok(header.includes("aria-current={isPrimaryCurrent(item.href) ? 'page' : undefined}"), 'primary navigation should expose an isolated current state');
  assert.ok(header.includes("aria-current={isChildCurrent(child.href) ? 'page' : undefined}"), 'dropdown navigation should expose the current child state');
  assert.ok(header.includes('aria-expanded={isMenuOpen}'), 'menu button should expose its expanded state');
  assert.ok(header.includes("event.key !== 'Escape'"), 'mobile menu should support Escape to close');
  assert.ok(brandMark.includes('site-logo-mark'), 'header should render a graphical AI logo');
  assert.ok(brandMark.includes('<svg'), 'AI logo should be a geometric SVG mark');
  assert.ok(brandMark.includes("'aria-label': 'AI'"), 'AI logo should expose the AI letters semantically when visible');
  assert.ok(!header.includes('site-logo-preview'), 'header should not render a preview row for removed logo options');
  assert.ok(header.includes('效率工具'), 'header should render the Chinese brand name');
  assert.ok(header.includes('EFFICIENCY TOOLS'), 'header should render the English brand descriptor without AI');
  assert.ok(!header.includes('AI Efficiency Tools'), 'header should remove the prior English AI prefix');
  assert.ok(header.includes('site-nav-panel'), 'header nav should be rendered persistently');
  assert.ok(!header.includes('aria-expanded={showNav}'), 'logo should not expose a removed hover-or-pinned nav state');
  assert.ok(!header.includes('SITE_NAME'), 'header should not render the old pure text site name');
  assert.ok(header.includes('bg-transparent') || header.includes('site-header'), 'header should be transparent over the hero');
  assert.ok(!header.includes('bg-white/60'), 'header should not have a visible white background');
  assert.ok(!header.includes('border-b'), 'header should not render a bottom border');
  assert.ok(page.includes('workflow-bento'), 'workflow area should keep a distinct bento grid');
  assert.ok(page.includes('section-minimal'), 'home page should use the same minimal section rhythm');
  assert.ok(page.includes('categories.slice(0, 9)'), 'workflow section should show exactly nine categories');
  assert.ok(page.includes('guides.slice(0, 6)'), 'guide section should show exactly six guides');
  assert.ok(page.includes('videos.slice(0, 9)'), 'video section should show exactly nine videos');
  assert.ok(page.includes('comparisons.slice(0, 9)'), 'compare section should keep exactly nine comparisons');
  assert.ok(page.includes('compareInsights'), 'compare section should use local quick-decision conclusion and tag mappings');
  assert.ok(page.includes('className="home-compare-grid compare-grid grid"'), 'compare section should use a home-specific decision grid hook');
  assert.ok(page.includes('className="compare-pair"') && page.includes('className="compare-conclusion"') && page.includes('className="compare-tags"'), 'compare cards should render pair, conclusion, and scenario tag areas');
  assert.ok(page.includes('guideLearningPath'), 'guide section should define the beginner learning path');
  assert.ok(page.includes('guides-section-layout') && page.includes('guide-learning-path'), 'guide section should render a learning path panel next to the tutorial grid');
  assert.ok(page.includes('新手学习路径'), 'guide section should show the beginner learning path title');
  assert.ok(page.includes('className="home-guides-grid guides-grid grid"'), 'guide grid should not keep conflicting Tailwind column utilities');
  assert.ok(page.includes('className="home-video-grid grid"'), 'video grid should not keep conflicting Tailwind column utilities');
  assert.ok(page.includes('homeGuideBriefs'), 'home guide section should use unique short learning copy instead of repeated placeholders');
  assert.ok(page.includes('homeGuideOutcomes'), 'home guide section should use unique short outcomes instead of repeated placeholders');
  assert.ok(!page.includes('guides.slice(0, 7)'), 'guide section should not keep the previous seven-card slice');
  assert.ok(!page.includes('videos.slice(0, 6)'), 'video section should not keep the previous six-card slice');
  assert.ok(page.includes('home-guides-grid'), 'guide section should use a home-specific compact grid hook');
  assert.ok(page.includes('home-video-grid'), 'video section should use a home-specific compact grid hook');
  assert.ok(page.includes('home-compare-grid'), 'compare section should use a home-specific compact grid hook');
  assert.ok(page.includes('section-cta home-section-container'), 'CTA should align to the same home section container');
  assert.ok(page.includes('className="cta-actions"'), 'Bottom CTA buttons should use the right-aligned CTA action group');
  assert.ok(page.includes('href="/free-ai-tools" className="home-section-action home-section-action-primary magnetic-button"'), 'Free tools CTA should keep its link and use the unified capsule action');
  assert.ok(page.includes('href="/videos" className="home-section-action home-section-action-secondary magnetic-button"'), 'Video explainer CTA should keep its link and use the unified capsule action');
  assert.ok(page.includes('查看全部教程') && page.includes('查看全部视频') && page.includes('浏览免费工具') && page.includes('查看视频解说'), 'Home view action copy should stay unchanged');
  assert.ok(!page.includes('homeFilters'), 'home page should not pass the removed secondary filter nav data');
  assert.ok(galleries.includes("import { CreativeToolsShowcase } from './CreativeToolsShowcase'"), 'creative tool section should import the dynamic showcase wall');
  assert.ok(galleries.includes('<CreativeToolsShowcase tools={creativeTools} />'), 'creative tool section should pass existing creative tools into the showcase');
  assert.ok(!galleries.includes('create-tools-grid'), 'creative tool section should stop rendering the old static grid');
  assert.ok(!galleries.includes('create-tool-card'), 'creative tool section should stop rendering the old static cards');
  assert.ok(!galleries.includes('createTools.slice(0, 6)'), 'creative tool section should no longer cap itself to six static cards');
  assert.ok(!galleries.includes('createToolBriefs'), 'creative tool section should not keep per-card copy maps inside the section wrapper');
  assert.ok(creativeShowcase.includes("'use client'"), 'CreativeToolsShowcase should run client-side for viewport and fallback state');
  assert.ok(creativeShowcase.includes('const rowConfigs') && creativeShowcase.includes("direction: 'right'") && creativeShowcase.includes("direction: 'left'"), 'CreativeToolsShowcase should define staggered row directions');
  assert.ok(creativeShowcase.includes('duration: ') && creativeShowcase.includes('offset: '), 'CreativeToolsShowcase should define different row speeds and offsets');
  assert.ok(creativeShowcase.includes('const iconSources') && creativeShowcase.includes("iconType: 'local'"), 'CreativeToolsShowcase should centralize real logo sources with explicit icon types');
  assert.ok(creativeShowcase.includes('/icons/ai-tools/midjourney.svg') && creativeShowcase.includes('/icons/ai-tools/canva-ai.svg') && creativeShowcase.includes('/icons/ai-tools/cursor.svg'), 'CreativeToolsShowcase should use existing local brand SVGs for overseas tools');
  assert.ok(creativeShowcase.includes('/brand-icons/current/jimeng-ai.png') && creativeShowcase.includes('/brand-icons/current/kling-ai.png') && creativeShowcase.includes('/brand-icons/current/tongyi-wanxiang.png') && creativeShowcase.includes('/brand-icons/current/capcut-ai.png'), 'CreativeToolsShowcase should use local brand assets for domestic creative tools');
  assert.ok(!creativeShowcase.includes('localIconSlugs'), 'CreativeToolsShowcase should not decide real icons from a slug-only allowlist');
  assert.ok(creativeShowcase.includes('IntersectionObserver') && creativeShowcase.includes('intersectionRatio > 0.15'), 'CreativeToolsShowcase should start immediately when the section enters the viewport');
  assert.ok(creativeShowcase.includes('const doubledTools = [...rowTools, ...rowTools]'), 'CreativeToolsShowcase should duplicate each row list for a seamless loop');
  assert.ok(creativeShowcase.includes('creative-tools-row') && creativeShowcase.includes('creative-tools-marquee'), 'CreativeToolsShowcase should render marquee row hooks');
  assert.ok(creativeShowcase.includes('<img') && creativeShowcase.includes('src={iconSource.icon}'), 'CreativeToolsShowcase should render local logos as lazy images');
  assert.ok(creativeShowcase.includes('loading="lazy"'), 'CreativeToolsShowcase logos should lazy load');
  assert.ok(creativeShowcase.includes('alt={tool.iconAlt || `${tool.name} logo`}'), 'CreativeToolsShowcase logos should include useful alt text');
  assert.ok(creativeShowcase.includes('onError') && creativeShowcase.includes('setBrokenIcons'), 'CreativeToolsShowcase should fall back gracefully when a local logo is unavailable');
  assert.ok(creativeShowcase.includes('href={`/ai-tools/${tool.slug}`}'), 'CreativeToolsShowcase cards should keep links to tool details');
  assert.ok(creativeShowcase.includes('查看教程'), 'CreativeToolsShowcase should reveal a compact tutorial action');
  assert.ok(!galleries.includes('visibleCreativeTools.map((tool) => <ToolCard'), 'creative tool section should not keep the generic tool list card');
  assert.ok(galleries.includes('GlobalToolsCarousel'), 'global tools section should use the focused stamp carousel');
  assert.ok(galleries.includes('href="/ai-tools" className="home-section-action magnetic-button"'), 'Global model action should point to the canonical tool overview');
  assert.ok(galleries.includes('href="/ai-tools" className="home-section-action magnetic-button"'), 'Creative tools action should keep its link and use the unified capsule action');
  assert.ok(galleries.includes('查看全部') && galleries.includes('查看工具库'), 'Tool gallery action copy should stay unchanged');
  assert.ok(galleries.includes('eyebrow="Model Gallery"'), 'global tools section eyebrow should be renamed to Model Gallery');
  assert.ok(galleries.includes('title="全球热门 AI 工具"'), 'global tools section title should describe the mixed AI tool collection');
  assert.ok(galleries.includes('精选全球主流 AI 工具，覆盖聊天、搜索、写作、设计、视频、办公和编程。'), 'global tools section should describe its actual categories');
  assert.ok(!galleries.includes('showAllGlobal'), 'global tools section should remove the show-more grid toggle');
  assert.ok(!galleries.includes('globalTools.slice(0, 6)'), 'global tools carousel should not cap itself to the old six-card grid');
  assert.ok(!galleries.includes('home-global-tools-grid'), 'global tools section should not keep the old grid hook');
  assert.ok(galleries.includes('home-section-first global-tools-section'), 'global tools section should expose a dedicated section hook without touching other sections');
  assert.ok(globalCarousel.includes('const [activeIndex, setActiveIndex] = useState(0)'), 'GlobalToolsCarousel should control focus with activeIndex');
  assert.ok(globalCarousel.includes('const [isInView, setInView] = useState(false)'), 'GlobalToolsCarousel should wait until the section is in view before autoplaying');
  assert.ok(globalCarousel.includes('const [isHovered, setHovered] = useState(false)'), 'GlobalToolsCarousel should pause autoplay through hover state');
  assert.ok(globalCarousel.includes('const [isUserPaused, setUserPaused] = useState(false)'), 'GlobalToolsCarousel should track user-paused autoplay');
  assert.ok(globalCarousel.includes('const isAutoPlaying = isInView && !isHovered && !isUserPaused'), 'GlobalToolsCarousel should derive autoplay from in-view, hover, and user pause state');
  assert.ok(globalCarousel.includes('IntersectionObserver') && globalCarousel.includes('intersectionRatio > 0.35'), 'GlobalToolsCarousel should start when the carousel enters the viewport');
  assert.ok(globalCarousel.includes('window.setTimeout') && globalCarousel.includes('180'), 'GlobalToolsCarousel should remove the long initial wait and start within 300ms');
  assert.ok(globalCarousel.includes('window.setInterval') && globalCarousel.includes('2600'), 'GlobalToolsCarousel should continue advancing automatically every 2600ms');
  assert.ok(globalCarousel.includes('onMouseEnter') && globalCarousel.includes('setInView(true)') && globalCarousel.includes('setHovered(true)'), 'GlobalToolsCarousel should prime autoplay when the mouse enters while preserving hover pause');
  assert.ok(globalCarousel.includes('onMouseLeave') && globalCarousel.includes('setHovered(false)'), 'GlobalToolsCarousel should resume autoplay after hover unless user-paused');
  assert.ok(globalCarousel.includes('function getRelativeOffset'), 'GlobalToolsCarousel should compute per-card offsets from stable tool indices');
  assert.ok(globalCarousel.includes('tools.map((tool, index)') && globalCarousel.includes('key={tool.slug}'), 'GlobalToolsCarousel should keep stable card nodes so the outer card moves instead of only swapping text');
  assert.ok(!globalCarousel.includes('key={`${tool.slug}-${offset}`}'), 'GlobalToolsCarousel should not key cards by offset because that swaps content instead of moving cards');
  assert.ok(globalCarousel.includes('global-tool-card is-active'), 'GlobalToolsCarousel should render active card state');
  assert.ok(globalCarousel.includes('global-tool-card is-prev1'), 'GlobalToolsCarousel should render prev1 card state');
  assert.ok(globalCarousel.includes('global-tool-card is-next1'), 'GlobalToolsCarousel should render next1 card state');
  assert.ok(globalCarousel.includes('global-tool-card is-prev2'), 'GlobalToolsCarousel should render prev2 card state');
  assert.ok(globalCarousel.includes('global-tool-card is-next2'), 'GlobalToolsCarousel should render next2 card state');
  assert.ok(globalCarousel.includes('global-tool-card is-prev3'), 'GlobalToolsCarousel should render prev3 card state');
  assert.ok(globalCarousel.includes('global-tool-card is-next3'), 'GlobalToolsCarousel should render next3 card state');
  assert.ok(globalCarousel.includes('global-tool-card is-prev4'), 'GlobalToolsCarousel should render prev4 card state');
  assert.ok(globalCarousel.includes('global-tool-card is-next4'), 'GlobalToolsCarousel should render next4 card state');
  assert.ok(globalCarousel.includes('global-tool-card is-hidden'), 'GlobalToolsCarousel should hide cards outside the nine-card stage');
  assert.ok(globalCarousel.includes('handlePrevious') && globalCarousel.includes('handleNext'), 'GlobalToolsCarousel should support arrow navigation');
  assert.ok(globalCarousel.includes('ArrowLeft') && globalCarousel.includes('ArrowRight'), 'GlobalToolsCarousel should support keyboard direction keys');
  assert.ok(globalCarousel.includes('onPointerDown') && globalCarousel.includes('onPointerUp'), 'GlobalToolsCarousel should support mobile swipe/pointer navigation');
  assert.ok(globalCarousel.includes('setUserPaused(true)'), 'GlobalToolsCarousel should lock autoplay after a card click or swipe');
  assert.ok(globalCarousel.includes('setActiveIndex(index)'), 'GlobalToolsCarousel should switch directly to a clicked side card');
  assert.ok(globalCarousel.includes('router.push(`/ai-tools/${tool.slug}`)'), 'Clicking the active global tool card should open its detail page');
  assert.ok(!globalCarousel.includes('global-carousel-controls'), 'GlobalToolsCarousel should remove bottom arrow controls');
  assert.ok(globalCarousel.includes('global-tool-details-full'), 'GlobalToolsCarousel should render full details for the active card');
  assert.ok(globalCarousel.includes('global-tool-details-compact'), 'GlobalToolsCarousel should render compact details for inactive cards');
  assert.ok(globalCarousel.includes('/icons/ai-tools/'), 'GlobalToolsCarousel should use real SVG icon assets from the AI tools icon directory');
  assert.ok(!globalCarousel.includes('galleryTags'), 'GlobalToolsCarousel should not render tag pills');
  assert.ok(!globalCarousel.includes('tool.logo'), 'GlobalToolsCarousel should not fall back to letter logo abbreviations');
  assert.ok(creativeShowcase.includes('const showcaseTools = useMemo(() => tools.slice(0, 10), [tools])'), 'creative showcase should keep the display list centralized and easy to replace');
  assert.ok(galleries.includes('className="home-section-first global-tools-section"'), 'global tools section should remain scoped to its own hook');
  assert.ok(galleries.includes('className="create-tools-section"'), 'creative tools section should expose a dedicated scoped hook');
  assert.ok(galleries.includes('section-accent-cyan'), 'global tools section should use cyan accents, not a cyan block');
  assert.ok(galleries.includes('section-accent-orange'), 'creative tools section should use warm accents, not a warm block');
  assert.ok(!galleries.includes('filter-bar-shell'), 'home tool galleries should remove the sticky secondary filter bar');
  assert.ok(!galleries.includes('filter-chip'), 'home tool galleries should remove the secondary filter chips');
  assert.ok(cards.includes('compact-tool-card'), 'tool cards should render compact product cards');
  assert.ok(cards.includes('guide-card'), 'guide cards should render the unified lightweight article card hook');
  assert.ok(cards.includes('video-card'), 'video cards should render the unified lightweight media card hook');
  assert.ok(cards.includes('video-duration-pill') && cards.includes('video-play-button') && cards.includes('video-card-description'), 'video cards should expose scoped hooks for the home video visual treatment');
  assert.ok(cards.includes('slice(0, 3)'), 'tool cards should show at most three gallery tags');
  assert.ok(cards.includes('const [activeDot, setActiveDot] = useState(null)'), 'Section headings should track the active dot locally');
  assert.ok(cards.includes('const [isEyebrowActive, setEyebrowActive] = useState(false)'), 'Section headings should track active eyebrow state locally');
  assert.ok(cards.includes("className={`section-dot section-dot-${dot}"), 'Section heading dots should render as individually colored buttons');
  assert.ok(cards.includes("activeDot === dot ? 'is-active' : ''"), 'Section heading dots should toggle an active scale state');
  assert.ok(cards.includes("className={`section-eyebrow ${isEyebrowActive ? 'is-active' : ''}`"), 'Section eyebrow should toggle an active scale state');
  assert.ok(!cards.includes('section-divider-line section-glow-soft'), 'Reusable Section should not attach divider-line classes');
  assert.ok(!page.includes('section-divider-line'), 'Home page should not attach divider-line classes to lower sections');

  assert.ok(!page.includes('section-soft-blue'), 'home page should not use large soft-blue section backgrounds');
  assert.ok(!page.includes('section-soft-warm'), 'home page should not use large warm section backgrounds');
  assert.ok(!page.includes('section-soft-cyan'), 'home page should not use large cyan section backgrounds');
  assert.ok(!page.includes('section-clean-white'), 'home page should not use boxed section backgrounds');
  assert.ok(!galleries.includes('section-soft-cyan'), 'tool galleries should not use large cyan section backgrounds');
  assert.ok(!galleries.includes('section-soft-warm'), 'tool galleries should not use large warm section backgrounds');
});

test('home hero interactive components exist with star map content', () => {
  const heroPath = new URL('../src/components/HeroIllustration.tsx', import.meta.url);
  const toastPath = new URL('../src/components/Toast.tsx', import.meta.url);
  const fluidPath = new URL('../src/components/FluidHeroScene.tsx', import.meta.url);
  const auraPath = new URL('../src/components/FluidAura.jsx', import.meta.url);
  const homeHeroPath = new URL('../src/components/HomeHero.jsx', import.meta.url);

  assert.ok(existsSync(heroPath), 'HeroIllustration.tsx should exist');
  assert.ok(existsSync(toastPath), 'Toast.tsx should exist');
  assert.ok(existsSync(fluidPath), 'FluidHeroScene.tsx should exist');
  assert.ok(existsSync(auraPath), 'FluidAura.jsx should exist');
  assert.ok(existsSync(homeHeroPath), 'HomeHero.jsx should exist');

  const hero = readFileSync(fluidPath, 'utf8');
  assert.ok(hero.includes('@react-three/fiber'), 'FluidHeroScene should use react-three-fiber');
  assert.ok(hero.includes('Canvas'), 'FluidHeroScene should render a Canvas');
  assert.ok(hero.includes('dpr={[1, 1.5]}'), 'FluidHeroScene should limit DPR');
  assert.ok(hero.includes('prefers-reduced-motion'), 'FluidHeroScene should handle reduced motion');
  assert.ok(hero.includes('shaderMaterial') || hero.includes('<shaderMaterial'), 'FluidHeroScene should use shader material');
  assert.ok(hero.includes('CatmullRomCurve3'), 'FluidHeroScene should use 3D curve paths for orbits');
  assert.ok(hero.includes('tubeGeometry'), 'FluidHeroScene should render orbit lines as 3D tubes');
  assert.ok(hero.includes('sphereGeometry args={[1.22, 128, 128]}'), 'Fluid core should use a high-segment sphere for smooth edges');
  assert.ok(hero.includes('0.052') || hero.includes('0.05'), 'Fluid core should have visibly stronger smooth liquid displacement');
  assert.ok(hero.includes('edgeFade'), 'Fluid shader should feather the core edge instead of keeping a hard rim');
  assert.ok(hero.includes('smoothstep(0.3, 0.84, facing)'), 'Fluid shader should fade harder at the edge so CSS blobs drive the visual');
  assert.ok(hero.includes('float alpha = (0.12 + facing * 0.1 + flow * 0.025) * edgeFade'), 'Fluid shader alpha should stay very light and diffuse');
  assert.ok(hero.includes('webglcontextlost'), 'FluidHeroScene should handle WebGL context loss');
  assert.ok(hero.includes('onSceneError'), 'FluidHeroScene should notify the fallback layer on scene errors');
  assert.ok(!hero.includes('Text'), 'FluidHeroScene should avoid async drei Text in WebGL for stability');
  assert.ok(!hero.includes('icosahedronGeometry'), 'FluidHeroScene should avoid polygonal low-smoothness core geometry');
  assert.ok(!hero.includes('ToolOrb'), 'Tool icons should not be rendered as 3D objects in Canvas');

  const aura = readFileSync(auraPath, 'utf8');
  assert.ok(aura.includes('<svg'), 'FluidAura should render an SVG');
  assert.ok(aura.includes('viewBox="0 0 1000 1000"'), 'FluidAura should use the requested SVG coordinate system');
  assert.ok(aura.includes('id="cyanGradient"'), 'FluidAura should define a cyan radial gradient');
  assert.ok(aura.includes('id="purpleGradient"'), 'FluidAura should define a purple radial gradient');
  assert.ok(aura.includes('id="yellowGradient"'), 'FluidAura should define a clean yellow radial gradient');
  assert.ok(aura.includes('id="fluidDisplace"'), 'FluidAura should define the displacement filter');
  assert.ok(aura.includes('<feTurbulence'), 'FluidAura should use feTurbulence');
  assert.ok(aura.includes('<feDisplacementMap'), 'FluidAura should use feDisplacementMap');
  assert.ok(aura.includes('<feGaussianBlur'), 'FluidAura should use a small Gaussian blur');
  assert.ok(aura.includes('stdDeviation="5"'), 'FluidAura blur should be reduced so colors stay distinct');
  assert.ok(aura.includes('hsl(184 96% 56% / 0.68)'), 'FluidAura should deepen cyan without overbrightening it');
  assert.ok(aura.includes('hsl(176 92% 54% / 0.50)'), 'FluidAura should give cyan a thicker teal midtone');
  assert.ok(aura.includes('hsl(178 88% 52% / 0.28)'), 'FluidAura should feather cyan with more depth');
  assert.ok(aura.includes('hsl(250 90% 60% / 0.66)'), 'FluidAura should deepen purple as a main color');
  assert.ok(aura.includes('hsl(238 86% 58% / 0.48)'), 'FluidAura should give purple a richer blue support');
  assert.ok(aura.includes('hsl(245 82% 56% / 0.26)'), 'FluidAura should feather purple with deeper color');
  assert.ok(aura.includes('hsl(48 96% 58% / 0.56)'), 'FluidAura should deepen yellow while keeping it clean');
  assert.ok(aura.includes('hsl(44 94% 56% / 0.38)'), 'FluidAura should use a thicker warm yellow midtone');
  assert.ok(aura.includes('hsl(42 90% 54% / 0.22)'), 'FluidAura should feather yellow without shifting orange');
  assert.ok(!aura.includes('rgba(0, 220, 255, 0.78)'), 'FluidAura should not keep the overbright cyan center');
  assert.ok(!aura.includes('rgba(249, 115, 22'), 'FluidAura should not keep the old orange-red color');
  assert.ok(aura.includes('dur="11s"'), 'Cyan blob should animate over 11 seconds');
  assert.ok(aura.includes('dur="14s"'), 'Purple blob should animate over 14 seconds');
  assert.ok(aura.includes('dur="17s"'), 'Yellow blob should animate over 17 seconds');
  assert.ok(aura.includes('animateTransform'), 'FluidAura blobs should animate with SVG transforms');
  assert.ok(aura.includes('values="-42 -20; -126 -94; -168 -30; -112 52; -70 -58; -42 -20"'), 'Cyan blob should flow from center-left toward left-up, left-middle, and left-down');
  assert.ok(aura.includes('values="0 -60; 26 -156; 92 -114; 70 -32; -58 -102; 0 -60"'), 'Purple blob should flow upward, right-up, right-middle, and left-up from the center');
  assert.ok(aura.includes('values="20 -60; 104 -108; 62 0; 138 -48; 12 -94; 20 -60"'), 'Yellow blob should flow from right-lower center toward right-up, lower, right-middle, and center-right');
  assert.ok(aura.includes('values="0.96; 1.12; 1.18; 1.08; 1.04; 0.96"'), 'Cyan blob should scale through a broader multi-direction route');
  assert.ok(aura.includes('values="0.96; 1.14; 1.1; 1.04; 1.12; 0.96"'), 'Purple blob should scale through a richer diagonal route');
  assert.ok(aura.includes('values="0.94; 1.08; 1.16; 1.04; 1.1; 0.94"'), 'Yellow blob should scale through a five-step route');
  assert.ok(aura.includes('baseFrequency'), 'FluidAura turbulence should animate baseFrequency');
  assert.ok(aura.includes('attributeName="scale"'), 'FluidAura displacement scale should animate');

  const homeHero = readFileSync(homeHeroPath, 'utf8');
  for (const label of ['ChatGPT', 'Claude', 'Gemini', 'DeepSeek', 'Midjourney', 'Runway', 'Kimi', 'Perplexity']) {
    assert.ok(homeHero.includes(label), `${label} should be rendered by the HTML icon layer`);
  }
  assert.ok(homeHero.includes("import { FluidAura } from './FluidAura'"), 'HomeHero should import the SVG fluid aura');
  assert.ok(homeHero.includes("import { BrandMark } from './BrandMark'"), 'HomeHero should reuse the shared AI logo mark in the Chinese subtitle');
  assert.ok(homeHero.includes("dynamic(() => import('./FluidHeroScene')"), 'HomeHero should dynamically import FluidHeroScene');
  assert.ok(homeHero.includes('ssr: false'), '3D scene should not SSR');
  assert.ok(homeHero.includes('fluid-scroll-hint'), 'HomeHero should render the scroll hint');
  assert.ok(!homeHero.includes("from('.fluid-scroll-hint'"), 'Scroll hint should not start hidden and wait for an intro animation');
  assert.ok(!homeHero.includes("to('.fluid-scroll-hint'"), 'Scroll hint should not be faded out by scroll animation');
  assert.ok(!homeHero.includes('scrollTween'), 'Scroll hint should not have a scroll-linked hiding tween');
  assert.ok(homeHero.includes('fluid-static-fallback'), 'HomeHero should provide a static fallback');
  assert.ok(homeHero.includes('<FluidAura'), 'HomeHero should render FluidAura for the center fluid visual');
  assert.ok(!homeHero.includes('fluid-field'), 'HomeHero should not render the old CSS blur blob field');
  assert.ok(!homeHero.includes('fluid-blob-cyan'), 'HomeHero should not render the old cyan CSS blob');
  assert.ok(!homeHero.includes('fluid-blob-purple'), 'HomeHero should not render the old purple CSS blob');
  assert.ok(!homeHero.includes('fluid-blob-orange'), 'HomeHero should not render the old orange CSS blob');
  assert.ok(homeHero.includes('const [isHeroOpen, setHeroOpen] = useState(false)'), 'HomeHero should keep click-to-expand state');
  assert.ok(homeHero.includes('const [isTitleAnimating, setTitleAnimating] = useState(false)'), 'HomeHero should keep title animation state');
  assert.ok(homeHero.includes('const [isBallFlying, setBallFlying] = useState(false)'), 'HomeHero should keep collision ball flight state');
  assert.ok(homeHero.includes('const [isSubtitlePlaying, setSubtitlePlaying] = useState(false)'), 'HomeHero should keep reverse subtitle animation state');
  assert.ok(homeHero.includes('const [ballFlightStyle, setBallFlightStyle] = useState'), 'HomeHero should keep measured ball flight coordinates in state');
  assert.ok(homeHero.includes('const finalTitleLetterRef = useRef(null)'), 'HomeHero should measure the final B as the flying piece origin');
  assert.ok(homeHero.includes('const subtitleRoomRef = useRef(null)'), 'HomeHero should measure the final subtitle character as the collision target');
  assert.ok(homeHero.includes('const ballAnimationFrameRef = useRef(null)'), 'HomeHero should keep a requestAnimationFrame handle for the ball');
  assert.ok(homeHero.includes('getBoundingClientRect()'), 'HomeHero should calculate the ball path from real element bounds');
  assert.ok(homeHero.includes('requestAnimationFrame'), 'HomeHero should animate the ball with requestAnimationFrame');
  assert.ok(homeHero.includes('cancelAnimationFrame'), 'HomeHero should cancel the ball animation frame on cleanup');
  assert.ok(homeHero.includes('const ballStart ='), 'HomeHero should calculate the ball start from the final B center');
  assert.ok(homeHero.includes('const groundY = subtitleBox.bottom - stackBox.top'), 'HomeHero should use the subtitle bottom edge as the first landing height');
  assert.ok(homeHero.includes('const rightWallX ='), 'HomeHero should calculate the Hero right-side boundary');
  assert.ok(homeHero.includes('const land1 ='), 'HomeHero should calculate the first landing point');
  assert.ok(homeHero.includes('(finalRightX + rightWallX) / 2'), 'HomeHero first landing x should be between B and the right wall');
  assert.ok(homeHero.includes('const target ='), 'HomeHero should calculate the final target from the last subtitle character');
  assert.ok(homeHero.includes('const reboundLand1 ='), 'HomeHero should add the first rebound landing after the right wall');
  assert.ok(homeHero.includes('const reboundLand2 ='), 'HomeHero should add the second rebound landing near the subtitle');
  assert.ok(homeHero.includes('wallHit.x + (target.x - wallHit.x) * 0.36'), 'First rebound landing should sit in the right-middle area');
  assert.ok(homeHero.includes('wallHit.x + (target.x - wallHit.x) * 0.72'), 'Second rebound landing should approach the final subtitle character');
  assert.ok(homeHero.includes('const jumpHeights = [90, 70, 70, 44, 22]'), 'HomeHero should keep pre-wall jumps and use 70/44/22 after the wall bounce');
  assert.ok(homeHero.includes('{ start: wallHit, end: reboundLand1, height: jumpHeights[2]'), 'Rebound step 1 should start at the wall and use the highest rebound height');
  assert.ok(homeHero.includes('{ start: reboundLand1, end: reboundLand2, height: jumpHeights[3]'), 'Rebound step 2 should continue toward the subtitle with a lower height');
  assert.ok(homeHero.includes('{ start: reboundLand2, end: target, height: jumpHeights[4]'), 'Rebound step 3 should low-bounce into the final subtitle character');
  assert.ok(!homeHero.includes('const middleLand ='), 'HomeHero should not keep the prior single middle rebound landing');
  assert.ok(homeHero.includes('Math.sin(Math.PI * easedT)'), 'HomeHero should calculate parabolic y motion with sine');
  assert.ok(homeHero.includes('heightRatio'), 'HomeHero should derive shadow weight from ball height');
  assert.ok(homeHero.includes("const titleLetters = heroTitle.split('')"), 'HomeHero should split the main title into visible letters');
  assert.ok(homeHero.includes("const getTitleBeatIndex = (targetIndex) => heroTitle.slice(0, targetIndex).replace(/\\s/g, '').length"), 'HomeHero should assign beat indexes while ignoring spaces');
  assert.ok(homeHero.includes("const titleBeatCount = heroTitle.replace(/\\s/g, '').length"), 'HomeHero should know the final non-space title beat');
  assert.ok(homeHero.includes('if (isTitleAnimating || isBallFlying || isSubtitlePlaying) return'), 'Repeated title clicks during the title, ball, or subtitle animation should be ignored');
  assert.ok(homeHero.includes('if (isReducedMotion) {'), 'Reduced motion should skip the collision ball and logo knockdown sequence');
  assert.ok(homeHero.includes('setSubtitlePlaying(true)'), 'Title click sequence should start reverse subtitle animation after the ball hits the final character');
  assert.ok(homeHero.includes('setTitleAnimating(true)'), 'Title click should start the sequential animation');
  assert.ok(homeHero.includes('startBallFlight()'), 'Title click should start the inertia ball flight after B recovers');
  assert.ok(homeHero.includes('window.setTimeout(() => {'), 'Title animation should reset after a fixed duration');
  assert.ok(homeHero.includes('}, 1650)'), 'Title animation should last long enough for the final B beat');
  assert.ok(!homeHero.includes('}, 5000)'), 'Collision ball should not use a fixed timeout in place of requestAnimationFrame');
  assert.ok(homeHero.includes('}, 1280)'), 'Reverse subtitle piano animation should have time to reach and recover the first character');
  assert.ok(homeHero.includes('const [activeTool, setActiveTool] = useState(null)'), 'HomeHero should keep click-to-enlarge state for tool icons');
  assert.ok(homeHero.includes('setActiveTool((value) => (value === toolSlug ? null : toolSlug))'), 'Clicking the same tool icon should toggle enlargement');
  assert.ok(homeHero.includes('hero-tool-row'), 'Hero tool icons should be rendered inside the title stack row');
  assert.ok(homeHero.includes("className={`hero-tool-button ${activeTool === tool.slug ? 'is-active' : ''}`}"), 'Active tool icon should expose a scale-up class');
  assert.ok(homeHero.includes('<span className="tool-icon-tooltip">{tool.name}</span>'), 'Tool icon tooltip should only show the tool name');
  assert.ok(homeHero.includes('aria-expanded={isHeroOpen}'), 'Hero title should expose expanded state');
  assert.ok(homeHero.includes('fluid-hero-fullscreen'), 'Hero should be a fullscreen stage');
  assert.ok(homeHero.includes('<h1'), 'Hero title should be HTML for SEO');
  assert.ok(homeHero.includes("className={`fluid-title-stack ${isBallFlying ? 'is-ball-flying' : ''}`}"), 'Hero title stack should expose the collision ball flight state');
  assert.ok(homeHero.includes('<span className="hero-bounce-orb" aria-hidden="true" style={ballFlightStyle}>'), 'Hero should render the collision ball wrapper with measured path variables');
  assert.ok(homeHero.includes('<span className="hero-bounce-ball" />'), 'Hero should render the inner gradient ball');
  assert.ok(homeHero.includes('<span className="hero-bounce-shadow" />'), 'Hero should render the ball landing shadow');
  assert.ok(homeHero.includes("className={`fluid-main-title ${isTitleAnimating ? 'is-playing' : ''}`}"), 'Hero h1 should receive the playing class for ordered letter animation');
  assert.ok(homeHero.includes('aria-label={heroTitle}'), 'Hero h1 should preserve the full accessible title');
  assert.ok(homeHero.includes('onClick={handleTitleClick}'), 'Clicking any title letter should start the full sequence');
  assert.ok(homeHero.includes('className="title-space"'), 'Hero title spaces should remain visible but non-animated');
  assert.ok(homeHero.includes("className={`title-letter ${beatIndex === titleBeatCount - 1 ? 'title-letter-final' : ''}`}"), 'Only the final B should receive the special final animation class');
  assert.ok(homeHero.includes("style={{ '--beat-index': beatIndex }}"), 'Each animated letter should expose its fixed beat index');
  assert.ok(homeHero.includes('aria-hidden="true"'), 'Split title letters should be hidden from assistive technology');
  assert.ok(homeHero.includes('fluid-center-subtitle hero-title-cn subtitle-title'), 'Hero should render the Chinese subtitle as a centered inline title group');
  assert.ok(homeHero.includes('aria-label={heroSubtitle}'), 'Hero Chinese subtitle should preserve the full accessible text');
  assert.ok(homeHero.includes("className={`fluid-center-subtitle hero-title-cn subtitle-title ${isSubtitlePlaying ? 'is-playing' : ''}`}"), 'Hero Chinese subtitle should expose the reverse playing class');
  assert.ok(homeHero.includes('className="subtitle-part subtitle-part-first"'), 'Hero Chinese subtitle should mark the first character for the final fall animation');
  assert.ok(homeHero.includes("style={{ '--beat-index': 5 }}"), 'The first subtitle character should receive the final reverse beat index');
  assert.ok(homeHero.includes("style={{ '--beat-index': 4 }}"), 'The second subtitle character should receive the next reverse beat index');
  assert.ok(homeHero.includes("className=\"hero-title-logo subtitle-part\""), 'The AI logo should be part of the reverse subtitle beat sequence');
  assert.ok(homeHero.includes("style={{ '--beat-index': 3 }}"), 'The AI logo should jump after the three trailing characters');
  assert.ok(homeHero.includes("style={{ '--beat-index': 2 }}"), 'The first lab character should receive reverse beat index 2');
  assert.ok(homeHero.includes("style={{ '--beat-index': 1 }}"), 'The second lab character should receive reverse beat index 1');
  assert.ok(homeHero.includes("style={{ '--beat-index': 0 }}"), 'The final room character should jump first');
  assert.ok(homeHero.includes('ref={subtitleRoomRef}'), 'The final subtitle character should be measured as the ball target');
  assert.ok(homeHero.includes('<BrandMark className="hero-title-logo-mark" ariaHidden />'), 'Hero Chinese subtitle should use the same shared AI mark component');
  assert.ok(!homeHero.includes('hero-logo-target-piece'), 'Hero Chinese AI logo should no longer include a target piece');
  assert.ok(!homeHero.includes('flying-logo-piece'), 'Hero should no longer render the old vertical flying piece');
  assert.ok(!homeHero.includes('isPieceFlying'), 'HomeHero should remove the old piece flight state');
  assert.ok(!homeHero.includes('pieceLanded'), 'HomeHero should remove the old landed piece state');
  assert.ok(!homeHero.includes('flying-logo-bar'), 'Hero should not render the old short horizontal bar');
  assert.ok(!homeHero.includes('hero-logo-target-bar'), 'Hero should not render the old horizontal target bar');
  assert.ok(!homeHero.includes('<span className="fluid-center-subtitle">{heroSubtitle}</span>'), 'Hero should not render the Chinese subtitle as plain AI text');
  assert.ok(homeHero.includes('AI FLUID LAB'), 'Hero should render the English title as the main title');
  assert.ok(homeHero.includes('fluid-hidden-panel'), 'Hero should keep the existing search panel hook');
  assert.ok(homeHero.includes('aria-hidden={false}'), 'Hero search panel should remain accessible while always visible');
  assert.ok(homeHero.includes('fluid-inline-search'), 'Hero search should render as a compact inline rail');
  assert.ok(!homeHero.includes('rounded-2xl border border-white/40 bg-white/70 p-2 backdrop-blur'), 'Expanded search should not keep the old card container classes');
  assert.ok(!homeHero.includes('bg-soft/80'), 'Expanded search input should not look like a nested card');
  assert.ok(!homeHero.includes('fluid-tool-icon-layer'), 'Hero should remove the old absolute orbit icon layer');
  assert.ok(!homeHero.includes('fluid-tool-icon-slot'), 'Hero should remove old orbit slot classes');
  assert.ok(!homeHero.includes('fluid-tool-icon'), 'Hero should remove old orbit icon classes');
  assert.ok(homeHero.includes('hero-tool-button'), 'Tool entries should render icon-only row buttons');
  assert.ok(homeHero.includes('fluid-core-toggle'), 'Hero should allow clicking the center ball area to expand');
  assert.ok(homeHero.includes('/icons/ai-tools/'), 'Hero tool icons should load local SVG assets');
  assert.ok(homeHero.includes("next/image"), 'Hero tool icons should use Next Image for local SVG assets');
  assert.ok(homeHero.includes('<Image'), 'Hero tool entries should render real icon images instead of text marks');
  assert.ok(!homeHero.includes('Math.cos'), 'Hero tool icons should not be positioned from orbit math');
  assert.ok(!homeHero.includes('radiusX') && !homeHero.includes('radiusY'), 'Hero tool icons should not calculate orbit radii');
  assert.ok(!homeHero.includes('Math.random'), 'Hero title animation should not use random timing or order');
  assert.ok(!homeHero.includes('isBehind'), 'Hero tool icons should not keep front/behind orbit logic');
  assert.ok(!homeHero.includes('data-orbit-tool'), 'Hero tool icons should not use orbit data attributes');
  assert.ok(homeHero.includes('const [activeTool, setActiveTool] = useState(null)'), 'Tool icons should keep click-to-enlarge state');
  assert.ok(homeHero.includes('handleToolIconClick'), 'Tool icons should handle click name previews');
  assert.ok(homeHero.includes('activeTool === tool.slug'), 'Clicked tool icon should expose only its active slug');
  assert.ok(homeHero.includes('tool-icon-tooltip'), 'Tool icons may show a name only on hover or active click');
  assert.ok(!homeHero.includes('fluid-node-card'), 'Expanded hero should not render white text tool cards');
  assert.ok(!homeHero.includes('tool-icon-shape'), 'Hero should not use CSS-drawn placeholder icon shapes');
  assert.ok(!homeHero.includes('data-orbit='), 'Hero icons should not use the old 3D orbit data attributes');
  assert.ok(!homeHero.includes('data-side='), 'Hero icons should not use the old split side-track data attributes');
  assert.ok(!homeHero.includes('dataset.side'), 'Hero icon motion should be a 360-degree planar orbit');
  assert.ok(!homeHero.includes('sideOffset'), 'Hero icon motion should not use left/right half-orbit offsets');
  assert.ok(!homeHero.includes('useToast'), 'Hero icon map should not expose favorite/compare toast actions');
  assert.ok(!homeHero.includes('收藏'), 'Hero should not render favorite text buttons');
  assert.ok(!homeHero.includes('对比'), 'Hero should not render compare text buttons');
  assert.ok(!homeHero.includes('ScrollTrigger.getAll'), 'Scroll hint should not rely on ScrollTrigger cleanup after removing scroll-linked hiding');
  assert.ok(!homeHero.includes('lg:grid-cols'), 'Fullscreen hero should not use the old two-column layout');

  const toast = readFileSync(toastPath, 'utf8');
  for (const message of ['已收藏到工具板', '已加入对比', '已保存到工作流']) {
    assert.ok(toast.includes(message), `${message} should be supported by toast interactions`);
  }
});

test('hero tool icon SVG assets exist and avoid text placeholders', () => {
  const iconTitles = {
    chatgpt: 'OpenAI',
    claude: 'Claude',
    gemini: 'Google Gemini',
    deepseek: 'DeepSeek',
    kimi: 'Moonshot AI',
    midjourney: 'Midjourney',
    runway: 'Runway',
    perplexity: 'Perplexity',
    elevenlabs: 'ElevenLabs',
    'canva-ai': 'Canva',
    'notion-ai': 'Notion',
    cursor: 'Cursor'
  };

  for (const [slug, title] of Object.entries(iconTitles)) {
    const iconPath = new URL(`../public/icons/ai-tools/${slug}.svg`, import.meta.url);
    assert.ok(existsSync(iconPath), `${slug}.svg should exist`);
    const svg = readFileSync(iconPath, 'utf8');
    assert.ok(svg.includes('<svg'), `${slug}.svg should be an SVG icon`);
    assert.ok(svg.includes(`<title>${title}</title>`), `${slug}.svg should carry the real brand title`);
    assert.ok(!svg.includes('<text'), `${slug}.svg should not use text as the visible icon`);
    assert.ok(!svg.includes('<circle cx="32" cy="32" r="30"'), `${slug}.svg should not keep the old round placeholder background`);
  }

  const brandIconTitles = {
    jimeng: 'Jimeng AI',
    kling: 'Kling AI',
    'tongyi-wanxiang': 'Tongyi Wanxiang',
    jianying: 'Jianying'
  };

  for (const [slug, title] of Object.entries(brandIconTitles)) {
    const iconPath = new URL(`../public/brand-icons/${slug}.svg`, import.meta.url);
    assert.ok(existsSync(iconPath), `${slug}.svg should exist in brand-icons`);
    const svg = readFileSync(iconPath, 'utf8');
    assert.ok(svg.includes('<svg'), `${slug}.svg should be an SVG icon`);
    assert.ok(svg.includes(`<title>${title}</title>`), `${slug}.svg should carry a brand title`);
    assert.ok(!svg.includes('<text'), `${slug}.svg should not use visible text as the icon`);
  }
});

test('fluid hero dependencies are declared', () => {
  const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
  for (const dep of ['three', '@react-three/fiber', '@react-three/drei', 'gsap']) {
    assert.ok(pkg.dependencies[dep], `${dep} should be installed as a runtime dependency`);
  }
});
