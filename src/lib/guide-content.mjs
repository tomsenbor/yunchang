import {
  comparisons,
  guides as sourceGuides,
  tools,
  videos
} from './site-data.mjs';
import { seoGuideSeeds } from './seo-guide-seeds.mjs';

export { seoGuideSeeds };

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
    slug: 'ai-office',
    name: 'AI办公',
    description: '学习使用 AI 完成会议纪要、演示大纲、表格分析和日常办公任务。',
    primaryKeyword: 'AI办公教程'
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
  },
  {
    slug: 'ai-tool-selection',
    name: 'AI工具选择',
    description: '按使用场景、任务类型和工作流要求选择合适的 AI 工具。',
    primaryKeyword: 'AI工具怎么选'
  }
];

const sourceCategoryMap = {
  'ai-assistant': 'ai-assistant',
  'ai-office': 'ai-office',
  'ai-writing': 'ai-writing',
  'ai-search': 'ai-search',
  'ai-image': 'ai-image',
  'ai-video': 'ai-video',
  'ai-subtitle': 'ai-video',
  'ai-coding': 'ai-coding',
  'ai-design': 'ai-design',
  'ai-voice': 'ai-audio',
  'domestic-ai': 'domestic-ai',
  'ai-tool-selection': 'ai-tool-selection'
};

const toolBySlug = new Map(tools.map((tool) => [tool.slug, tool]));
const guideCategoryBySlug = new Map(guideCategories.map((category) => [category.slug, category]));
const allSourceGuides = [...sourceGuides, ...seoGuideSeeds];

const GUIDE_AUTHOR = 'AI效率工具库编辑团队';
const GUIDE_REVIEWER = 'AI工具研究组';
const validSearchIntents = new Set(['learn', 'compare', 'choose', 'workflow']);

function normalizeSearchIntent(guide, contentCategorySlug) {
  if (validSearchIntents.has(guide.searchIntent)) return guide.searchIntent;

  const searchText = `${guide.slug} ${guide.title} ${guide.primaryKeyword || ''}`;
  if (/(?:\bvs\b|对比|区别|比较|哪个好)/i.test(searchText)) return 'compare';
  if (contentCategorySlug === 'ai-tool-selection' || /推荐|怎么选|选择|合集/.test(searchText)) return 'choose';
  if (/workflow|工作流|流程|会议|纪要|办公|PPT|表格|报告|字幕|商品图|海报|代码库|排查|开发|整理/i.test(searchText)) {
    return 'workflow';
  }

  return 'learn';
}

function buildIntentFaq(guide, searchIntent, primaryKeyword) {
  const topic = primaryKeyword || guide.title;
  const faqByIntent = {
    learn: [
      { question: `${topic}适合零基础用户吗？`, answer: '适合从一项小任务开始练习。建议先理解输入、输出和核查步骤，再逐步增加任务复杂度。' },
      { question: `学习${topic}前需要准备什么？`, answer: '准备明确的任务目标、必要的背景资料和期望输出格式；涉及事实或数据时还要保留原始来源。' },
      { question: `完成${topic}后怎样核查结果？`, answer: '对照原始资料检查事实、数字、引用和关键步骤，并用自己的真实任务再次验证。' }
    ],
    compare: [
      { question: `${topic}应该比较哪些维度？`, answer: '应比较目标场景、输入资料、输出质量、上手难度和工作流适配，不以单次回答作为唯一依据。' },
      { question: `${topic}的结论适用于所有人吗？`, answer: '不适用。工具表现会随任务、语言、资料类型和使用方式变化，比较结果仅用于缩小选择范围。' },
      { question: '怎样用自己的任务验证比较结果？', answer: '选择同一份脱敏资料、同一组要求和同一输出格式分别测试，再记录修改次数和核查成本。' }
    ],
    choose: [
      { question: `选择${topic}时应该先看什么？`, answer: '先明确主要任务和交付物，再看工具是否覆盖必要能力、使用门槛和后续编辑流程。' },
      { question: '选择AI工具时是否只看价格或热度？', answer: '不建议。还应核对使用限制、资料安全、输出质量、学习成本和是否适合现有工作流。' },
      { question: '怎样确认工具适合自己的工作流？', answer: '用一项高频真实任务完成从输入到交付的完整测试，并记录耗时、返工次数和人工核查量。' }
    ],
    workflow: [
      { question: `${topic}适合哪些工作场景？`, answer: `适合需要重复整理输入、生成结构化结果并进行人工复核的场景。具体使用时应结合任务目标判断。` },
      { question: `执行${topic}工作流前要准备什么？`, answer: '准备脱敏后的原始资料、明确的输出模板、核查标准和最终负责人，避免把关键判断完全交给AI。' },
      { question: `${topic}的结果应该怎样复核？`, answer: '逐项检查事实、数据、遗漏和格式，并保留原始材料与修改记录，重要结果需要人工确认。' }
    ]
  };
  const generatedFaq = faqByIntent[searchIntent];
  const existingFaq = (guide.faq || []).filter((item) => (
    item?.question
    && item?.answer
    && !/后续|预留|上线前|讲解位置/.test(`${item.question} ${item.answer}`)
  ));
  const seenQuestions = new Set();

  return [...generatedFaq, ...existingFaq].filter((item) => {
    if (seenQuestions.has(item.question)) return false;
    seenQuestions.add(item.question);
    return true;
  });
}

const enrichedGuides = allSourceGuides.map((guide) => {
  const contentCategorySlug = guide.contentCategorySlug || sourceCategoryMap[guide.categorySlug] || 'ai-assistant';
  const tool = toolBySlug.get(guide.toolSlug);
  const publishedAt = guide.publishedAt || guide.updatedAt;
  const summary = guide.summary || guide.excerpt;
  const primaryKeyword = guide.primaryKeyword || `${tool?.name || guide.title} 教程`;
  const searchIntent = normalizeSearchIntent(guide, contentCategorySlug);

  return {
    ...guide,
    summary,
    excerpt: guide.excerpt || summary,
    outcome: guide.outcome || summary,
    readTime: guide.readTime || '6分钟',
    author: GUIDE_AUTHOR,
    reviewer: GUIDE_REVIEWER,
    publishedAt,
    updatedAt: guide.updatedAt || publishedAt,
    level: guide.level || 'beginner',
    searchIntent,
    primaryKeyword,
    faq: buildIntentFaq(guide, searchIntent, primaryKeyword),
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

const videoBySlug = new Map(videos.map((video) => [video.slug, video]));
const comparisonBySlug = new Map(comparisons.map((comparison) => [comparison.slug, comparison]));
const enrichedGuideBySlug = new Map(enrichedGuides.map((guide) => [guide.slug, guide]));

function uniqueSlugs(slugs) {
  return [...new Set((slugs || []).filter(Boolean))];
}

function compareGuideRelations(guide, left, right) {
  const leftPriority = [
    left.contentCategorySlug === guide.contentCategorySlug,
    left.searchIntent === guide.searchIntent,
    Boolean(guide.toolSlug && left.toolSlug === guide.toolSlug)
  ];
  const rightPriority = [
    right.contentCategorySlug === guide.contentCategorySlug,
    right.searchIntent === guide.searchIntent,
    Boolean(guide.toolSlug && right.toolSlug === guide.toolSlug)
  ];

  for (let index = 0; index < leftPriority.length; index += 1) {
    if (leftPriority[index] !== rightPriority[index]) {
      return Number(rightPriority[index]) - Number(leftPriority[index]);
    }
  }

  return left.slug.localeCompare(right.slug, 'zh-CN');
}

function rankRelatedGuides(guide) {
  return enrichedGuides
    .filter((candidate) => candidate.slug !== guide.slug)
    .sort((left, right) => compareGuideRelations(guide, left, right))
    .map((candidate) => candidate.slug);
}

function buildGuideRelationships(guide) {
  const curatedGuideSlugs = uniqueSlugs(guide.relatedGuidesSlugs)
    .filter((slug) => slug !== guide.slug && enrichedGuideBySlug.has(slug));
  const relatedGuidesSlugs = uniqueSlugs([
    ...curatedGuideSlugs,
    ...rankRelatedGuides(guide)
  ]).slice(0, 3);
  const relatedGuideItems = relatedGuidesSlugs
    .map((slug) => enrichedGuideBySlug.get(slug))
    .filter(Boolean);

  const relatedToolsSlugs = uniqueSlugs([
    ...(guide.relatedToolsSlugs || []),
    guide.toolSlug,
    ...relatedGuideItems.flatMap((item) => item.relatedToolsSlugs || [item.toolSlug])
  ]).filter((slug) => toolBySlug.has(slug)).slice(0, 4);

  const inferredVideoSlugs = videos
    .filter((video) => relatedToolsSlugs.some((toolSlug) => video.slug.includes(toolSlug)))
    .map((video) => video.slug);
  const relatedVideosSlugs = uniqueSlugs([
    ...(guide.relatedVideosSlugs || []),
    ...relatedGuideItems.flatMap((item) => item.relatedVideosSlugs || []),
    ...inferredVideoSlugs
  ]).filter((slug) => videoBySlug.has(slug)).slice(0, 3);

  const inferredComparisonSlugs = comparisons
    .filter((comparison) => relatedToolsSlugs.some((toolSlug) => comparison.slug.includes(toolSlug)))
    .map((comparison) => comparison.slug);
  const relatedComparisonsSlugs = uniqueSlugs([
    ...(guide.relatedComparisonsSlugs || []),
    ...relatedGuideItems.flatMap((item) => item.relatedComparisonsSlugs || []),
    ...inferredComparisonSlugs
  ]).filter((slug) => comparisonBySlug.has(slug)).slice(0, 3);

  return {
    relatedGuidesSlugs,
    relatedToolsSlugs,
    relatedVideosSlugs,
    relatedComparisonsSlugs
  };
}

export const guides = enrichedGuides.map((guide) => ({
  ...guide,
  ...buildGuideRelationships(guide)
}));

const guideBySlug = new Map(guides.map((guide) => [guide.slug, guide]));

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
