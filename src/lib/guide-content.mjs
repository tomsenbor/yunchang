import {
  comparisons,
  guides as sourceGuides,
  tools,
  videos
} from './site-data.mjs';

export const guideCategories = [
  {
    slug: 'ai-assistant',
    name: 'AI助手',
    description: '学习 ChatGPT、Claude 等 AI 助手的基础用法、办公流程和日常效率实践。',
    primaryKeyword: 'AI助手教程'
  },
  {
    slug: 'ai-writing',
    name: 'AI写作',
    description: '整理 AI 写作、长文处理、内容润色和文档总结的实用教程。',
    primaryKeyword: 'AI写作教程'
  },
  {
    slug: 'ai-search',
    name: 'AI搜索',
    description: '学习使用 AI 搜索工具完成资料检索、来源核验和研究整理。',
    primaryKeyword: 'AI搜索教程'
  },
  {
    slug: 'ai-image',
    name: 'AI图片',
    description: '覆盖 AI 图片生成、提示词编写、风格控制和常见视觉工作流。',
    primaryKeyword: 'AI图片生成教程'
  },
  {
    slug: 'ai-video',
    name: 'AI视频',
    description: '学习 AI 视频生成、分镜设计、字幕处理和短视频制作流程。',
    primaryKeyword: 'AI视频教程'
  },
  {
    slug: 'ai-coding',
    name: 'AI编程',
    description: '学习使用 AI 阅读代码、排查错误、开发功能和整理技术方案。',
    primaryKeyword: 'AI编程教程'
  },
  {
    slug: 'ai-design',
    name: 'AI设计',
    description: '整理 AI 设计、演示文稿、海报和品牌视觉辅助工具的使用方法。',
    primaryKeyword: 'AI设计教程'
  },
  {
    slug: 'ai-audio',
    name: 'AI音频',
    description: '学习 AI 配音、语音生成、口播脚本和音频内容制作流程。',
    primaryKeyword: 'AI音频教程'
  },
  {
    slug: 'domestic-ai',
    name: '国产AI',
    description: '整理国产 AI 工具的中文使用教程、功能实践和工作流案例。',
    primaryKeyword: '国产AI工具教程'
  }
];

const sourceCategoryMap = {
  'ai-assistant': 'ai-assistant',
  'ai-office': 'ai-assistant',
  'ai-writing': 'ai-writing',
  'ai-search': 'ai-search',
  'ai-image': 'ai-image',
  'ai-video': 'ai-video',
  'ai-subtitle': 'ai-video',
  'ai-coding': 'ai-coding',
  'ai-design': 'ai-design',
  'ai-voice': 'ai-audio',
  'domestic-ai': 'domestic-ai'
};

const toolBySlug = new Map(tools.map((tool) => [tool.slug, tool]));

const enrichedGuides = sourceGuides.map((guide) => {
  const contentCategorySlug = sourceCategoryMap[guide.categorySlug] || 'ai-assistant';
  const tool = toolBySlug.get(guide.toolSlug);
  const publishedAt = guide.publishedAt || guide.updatedAt;

  return {
    ...guide,
    publishedAt,
    updatedAt: guide.updatedAt || publishedAt,
    level: guide.level || 'beginner',
    searchIntent: guide.searchIntent || 'informational-how-to',
    primaryKeyword: guide.primaryKeyword || `${tool?.name || guide.title} 教程`,
    topicSlugs: guide.topicSlugs || [contentCategorySlug, guide.toolSlug].filter(Boolean),
    contentCategorySlug,
    relatedToolsSlugs: guide.relatedToolsSlugs || [guide.toolSlug].filter(Boolean),
    relatedVideosSlugs: guide.relatedVideosSlugs || videos
      .filter((video) => video.toolSlug === guide.toolSlug || video.slug.includes(guide.toolSlug))
      .map((video) => video.slug)
      .slice(0, 3),
    relatedComparisonsSlugs: guide.relatedComparisonsSlugs || comparisons
      .filter((comparison) => comparison.slug.includes(guide.toolSlug))
      .map((comparison) => comparison.slug)
      .slice(0, 3)
  };
});

export const guides = enrichedGuides.map((guide) => ({
  ...guide,
  relatedGuidesSlugs: guide.relatedGuidesSlugs || enrichedGuides
    .filter((candidate) => (
      candidate.slug !== guide.slug
      && candidate.contentCategorySlug === guide.contentCategorySlug
    ))
    .slice(0, 3)
    .map((candidate) => candidate.slug)
}));

const guideBySlug = new Map(guides.map((guide) => [guide.slug, guide]));
const guideCategoryBySlug = new Map(guideCategories.map((category) => [category.slug, category]));
const videoBySlug = new Map(videos.map((video) => [video.slug, video]));
const comparisonBySlug = new Map(comparisons.map((comparison) => [comparison.slug, comparison]));

function resolveSlugs(slugs, index) {
  return (slugs || []).map((slug) => index.get(slug)).filter(Boolean);
}

export const guideCategoryRoutes = guideCategories.map((category) => `/guides/category/${category.slug}`);

export function getGuide(slug) {
  return guideBySlug.get(slug);
}

export function getGuideCategory(slug) {
  return guideCategoryBySlug.get(slug);
}

export function getGuidesByCategory(categorySlug) {
  return guides.filter((guide) => guide.contentCategorySlug === categorySlug);
}

export function getRelatedGuides(guide) {
  return resolveSlugs(guide.relatedGuidesSlugs, guideBySlug).filter((item) => item.slug !== guide.slug);
}

export function getGuideContext(guide) {
  return {
    category: getGuideCategory(guide.contentCategorySlug),
    relatedGuides: getRelatedGuides(guide),
    relatedTools: resolveSlugs(guide.relatedToolsSlugs, toolBySlug),
    relatedVideos: resolveSlugs(guide.relatedVideosSlugs, videoBySlug),
    relatedComparisons: resolveSlugs(guide.relatedComparisonsSlugs, comparisonBySlug)
  };
}

export function getGuideCategoryUpdatedAt(categorySlug) {
  return getGuidesByCategory(categorySlug)
    .map((guide) => guide.updatedAt)
    .filter(Boolean)
    .sort()
    .at(-1);
}
