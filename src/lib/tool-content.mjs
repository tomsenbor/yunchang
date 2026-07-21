import { comparisons, tools as sourceTools, videos } from './site-data.mjs';
import { guides } from './guide-content.mjs';
import { toolExpansionSeeds } from './tool-expansion-seeds.mjs';
import { coreToolQualityProfiles } from './tool-quality-profiles.mjs';

const priorityToolMetadata = {
  chatgpt: { developer: 'OpenAI', platforms: ['Web', 'iOS', 'Android'] },
  claude: { developer: 'Anthropic', platforms: ['Web', 'iOS', 'Android'] },
  gemini: { developer: 'Google', platforms: ['Web', 'iOS', 'Android'] },
  kimi: { developer: '月之暗面', platforms: ['Web', 'iOS', 'Android'] },
  deepseek: { developer: 'DeepSeek', platforms: ['Web', 'iOS', 'Android'] },
  cursor: { developer: 'Anysphere', platforms: ['Windows', 'macOS', 'Linux'] },
  'canva-ai': { developer: 'Canva', platforms: ['Web', 'Windows', 'macOS', 'iOS', 'Android'] },
  runway: { developer: 'Runway', platforms: ['Web'] },
  elevenlabs: { developer: 'ElevenLabs', platforms: ['Web'] }
};

const featuredToolSlugs = [
  'chatgpt',
  'claude',
  'gemini',
  'deepseek',
  'kimi',
  'perplexity',
  'cursor',
  'midjourney',
  'runway',
  'kling-ai'
];

const featuredToolRanks = new Map(
  featuredToolSlugs.map((slug, index) => [slug, index])
);

const explicitVideoRelations = {
  chatgpt: ['chatgpt-3min-guide', 'gemini-vs-chatgpt-video'],
  claude: ['claude-user-fit-video'],
  gemini: ['gemini-vs-chatgpt-video'],
  kimi: ['kimi-long-doc-video'],
  deepseek: ['deepseek-beginner-video'],
  cursor: ['cursor-ai-coding-video'],
  runway: ['runway-video-generation-video'],
  elevenlabs: ['elevenlabs-voice-video']
};

const explicitComparisonRelations = {
  chatgpt: ['chatgpt-vs-claude', 'gemini-vs-chatgpt', 'deepseek-vs-chatgpt-chinese'],
  claude: ['chatgpt-vs-claude', 'kimi-vs-claude-long-doc'],
  gemini: ['gemini-vs-chatgpt'],
  kimi: ['kimi-vs-claude-long-doc'],
  deepseek: ['deepseek-vs-chatgpt-chinese'],
  cursor: ['cursor-vs-claude-code'],
  runway: ['runway-vs-kling-video'],
  elevenlabs: ['elevenlabs-vs-china-ai-voice']
};

const categoryDefinitions = [
  {
    slug: 'chatbot',
    name: 'AI 对话助手',
    description: '查找适合问答、写作、资料整理、学习和日常办公的 AI 对话工具。',
    toolSlugs: ['chatgpt', 'claude', 'gemini', 'kimi', 'deepseek', 'doubao', 'perplexity']
  },
  {
    slug: 'image-ai',
    name: 'AI 图片工具',
    description: '查找适合图片生成、设计排版、视觉创意和素材制作的 AI 工具。',
    toolSlugs: ['midjourney', 'canva-ai', 'tongyi-wanxiang', 'ideogram', 'adobe-firefly']
  },
  {
    slug: 'video-ai',
    name: 'AI 视频工具',
    description: '查找适合文生视频、图生视频、视频编辑和短视频制作的 AI 工具。',
    toolSlugs: ['runway', 'kling', 'jimeng', 'vidu', 'capcut']
  },
  {
    slug: 'coding-ai',
    name: 'AI 编程工具',
    description: '查找适合代码补全、项目理解、调试和开发工作流的 AI 编程工具。',
    toolSlugs: ['cursor', 'github-copilot', 'claude-code', 'deepseek']
  }
];

const legacyCategoryBySearchCategory = {
  chatbot: 'ai-assistant',
  'image-ai': 'ai-image',
  'video-ai': 'ai-video',
  'coding-ai': 'ai-coding',
  'audio-ai': 'ai-voice'
};

function normalizeText(value) {
  return String(value || '').trim().toLocaleLowerCase();
}

function recordMatchesTool(record, tool) {
  const slug = normalizeText(tool.slug);
  const name = normalizeText(tool.name);
  const text = normalizeText([
    record.slug,
    record.title,
    record.name,
    record.primaryKeyword,
    record.description
  ].filter(Boolean).join(' '));

  return text.includes(slug) || (name.length > 1 && text.includes(name));
}

function uniqueExistingSlugs(candidates, records, limit) {
  const available = new Set(records.map((record) => record.slug));
  return [...new Set(candidates)].filter((slug) => available.has(slug)).slice(0, limit);
}

function buildGuideRelations(tool) {
  const matches = guides
    .map((guide) => {
      let score = Number.POSITIVE_INFINITY;
      if (guide.toolSlug === tool.slug) score = 0;
      else if (guide.relatedToolsSlugs?.includes(tool.slug)) score = 1;
      else if (recordMatchesTool(guide, tool)) score = 2;
      return { guide, score };
    })
    .filter(({ score }) => Number.isFinite(score))
    .sort((left, right) => left.score - right.score || left.guide.slug.localeCompare(right.guide.slug));

  return uniqueExistingSlugs(matches.map(({ guide }) => guide.slug), guides, 6);
}

function buildVideoRelations(tool) {
  const discovered = videos.filter((video) => recordMatchesTool(video, tool)).map((video) => video.slug);
  return uniqueExistingSlugs([...(explicitVideoRelations[tool.slug] || []), ...discovered], videos, 4);
}

function buildComparisonRelations(tool) {
  const discovered = comparisons
    .filter((comparison) => recordMatchesTool(comparison, tool))
    .map((comparison) => comparison.slug);
  return uniqueExistingSlugs(
    [...(explicitComparisonRelations[tool.slug] || []), ...discovered],
    comparisons,
    4
  );
}

export const tools = [...sourceTools, ...toolExpansionSeeds].map((tool) => {
  const priorityMetadata = priorityToolMetadata[tool.slug] || {};
  const qualityProfile = coreToolQualityProfiles[tool.slug];
  const capabilities = Array.isArray(qualityProfile?.capabilities)
    ? [...qualityProfile.capabilities]
    : Array.isArray(tool.capabilities)
    ? [...tool.capabilities]
    : Array.isArray(tool.features) ? [...tool.features] : [];
  const useCases = Array.isArray(qualityProfile?.useCases)
    ? [...qualityProfile.useCases]
    : Array.isArray(tool.useCases) ? [...tool.useCases] : [];
  const relatedGuides = uniqueExistingSlugs(
    [...(qualityProfile?.relatedGuides || []), ...(tool.relatedGuides || []), ...buildGuideRelations(tool)],
    guides,
    6
  );
  const relatedVideos = uniqueExistingSlugs(
    [...(qualityProfile?.relatedVideos || []), ...(tool.relatedVideos || []), ...buildVideoRelations(tool)],
    videos,
    4
  );
  const relatedComparisons = uniqueExistingSlugs(
    [...(qualityProfile?.relatedComparisons || []), ...(tool.relatedComparisons || []), ...buildComparisonRelations(tool)],
    comparisons,
    4
  );

  return {
    ...tool,
    summary: qualityProfile?.metaDescription || tool.summary,
    seoDescription: qualityProfile?.seoDescription || tool.seoDescription || tool.summary,
    metaDescription: qualityProfile?.metaDescription || tool.metaDescription || tool.summary,
    developer: tool.developer || priorityMetadata.developer || '待核对',
    officialUrl: tool.officialUrl || tool.affiliateUrl || '',
    affiliateUrl: tool.affiliateUrl || tool.officialUrl || '',
    pricing: tool.pricing || '以官方实际页面为准',
    pricingLabel: tool.pricingLabel || tool.pricing || '以官方实际页面为准',
    platforms: tool.platforms || priorityMetadata.platforms || ['以官方实际页面为准'],
    capabilities,
    features: Array.isArray(tool.features) ? tool.features : capabilities,
    useCases,
    pros: qualityProfile?.pros || tool.pros || [],
    cons: qualityProfile?.cons || tool.cons || [],
    updatedAt: qualityProfile?.updatedAt || tool.updatedAt || '2026-06-17',
    searchKeywords: Array.isArray(tool.searchKeywords) ? [...tool.searchKeywords] : [tool.name],
    categorySlug: tool.categorySlug || legacyCategoryBySearchCategory[tool.category],
    audience: tool.audience || useCases.join('、'),
    bestFor: tool.bestFor || useCases[0] || tool.summary,
    icon: tool.icon || tool.name.slice(0, 2),
    iconAlt: tool.iconAlt || `${tool.name} 标识`,
    region: tool.region || 'global',
    domestic: tool.domestic ?? false,
    featured: featuredToolRanks.has(tool.slug),
    featuredRank: featuredToolRanks.get(tool.slug) ?? Number.MAX_SAFE_INTEGER,
    relatedGuides,
    relatedVideos,
    relatedComparisons
  };
});

export const toolCategories = categoryDefinitions.map((category) => ({
  ...category,
  toolSlugs: [...new Set([
    ...category.toolSlugs,
    ...tools.filter((tool) => tool.category === category.slug).map((tool) => tool.slug)
  ])].filter((slug) => tools.some((tool) => tool.slug === slug))
}));

export const toolCategoryRoutes = toolCategories.map((category) => `/ai-tools/category/${category.slug}`);
export const toolRoutes = tools.map((tool) => `/ai-tools/${tool.slug}`);

export function getTool(slug) {
  return tools.find((tool) => tool.slug === slug);
}

export function getToolCategory(slug) {
  return toolCategories.find((category) => category.slug === slug);
}

export function getToolsByCategory(slug) {
  const category = getToolCategory(slug);
  if (!category) return [];
  const positions = new Map(category.toolSlugs.map((toolSlug, index) => [toolSlug, index]));
  return tools
    .filter((tool) => positions.has(tool.slug))
    .sort((left, right) => positions.get(left.slug) - positions.get(right.slug));
}

export function getToolRelations(slug) {
  const tool = getTool(slug);
  if (!tool) return { guides: [], videos: [], comparisons: [] };
  const guideMap = new Map(guides.map((guide) => [guide.slug, guide]));
  const videoMap = new Map(videos.map((video) => [video.slug, video]));
  const comparisonMap = new Map(comparisons.map((comparison) => [comparison.slug, comparison]));

  return {
    guides: tool.relatedGuides.map((relatedSlug) => guideMap.get(relatedSlug)).filter(Boolean),
    videos: tool.relatedVideos.map((relatedSlug) => videoMap.get(relatedSlug)).filter(Boolean),
    comparisons: tool.relatedComparisons
      .map((relatedSlug) => comparisonMap.get(relatedSlug))
      .filter(Boolean)
  };
}
