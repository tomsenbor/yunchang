const imageLogoPattern = /^(?:https?:\/\/|\/|data:image\/)/i;

export const explorerTaskDefinitions = [
  {
    id: 'writing',
    name: '写文章和文案',
    description: '起草文章、营销文案，完成润色、改写与内容总结。',
    keywords: ['写作', '文案', '润色', '内容', '文章', '总结']
  },
  {
    id: 'image',
    name: '生成图片',
    description: '生成和编辑图片，制作海报、插图与视觉素材。',
    categories: ['image-ai'],
    keywords: ['图片', '图像', '设计', '视觉', '海报', '素材']
  },
  {
    id: 'video',
    name: '制作视频',
    description: '完成文生视频、数字人、字幕与短视频制作。',
    categories: ['video-ai'],
    keywords: ['视频', '短视频', '字幕', '数字人']
  },
  {
    id: 'coding',
    name: '编写代码',
    description: '辅助代码生成、项目理解、调试和开发工作流。',
    categories: ['coding-ai'],
    keywords: ['编程', '代码', '开发', '调试', 'IDE']
  },
  {
    id: 'office',
    name: '办公和整理资料',
    description: '整理文档、会议、表格、演示和知识库内容。',
    keywords: ['办公', '会议', '文档', '表格', 'PPT', '演示', '知识库']
  },
  {
    id: 'music',
    name: '生成音乐与配音',
    description: '生成音乐、语音、配音和声音素材。',
    keywords: ['音乐', '音频', '语音', '配音', '声音', '歌曲']
  },
  {
    id: 'learning',
    name: '学习与研究',
    description: '用于资料搜索、知识问答、总结和研究分析。',
    keywords: ['学习', '研究', '搜索', '问答', '资料', '总结']
  }
];

const normalize = (value) => String(value || '').trim().toLocaleLowerCase('zh-CN');

function getExplorerSearchText(tool) {
  return normalize(
    [
      tool.name,
      tool.developer,
      tool.summary,
      tool.categoryName,
      ...(tool.categoryNames || []),
      ...(tool.capabilities || []),
      ...(tool.useCases || []),
      ...(tool.platforms || [])
    ].join(' ')
  );
}

export function matchesExplorerTask(tool, taskId) {
  if (taskId === 'all') return true;

  const task = explorerTaskDefinitions.find((item) => item.id === taskId);
  if (!task) return true;

  if (task.categories?.some((category) => tool.categorySlugs.includes(category))) {
    return true;
  }

  const searchText = getExplorerSearchText(tool);
  return task.keywords.some((keyword) => searchText.includes(normalize(keyword)));
}

export function resolveToolLogo(tool) {
  const icon = String(TOOL_LOGO_PATHS[tool.slug] || tool.icon || '').trim();

  if (icon && imageLogoPattern.test(icon)) {
    return {
      logoType: 'image',
      logoValue: icon
    };
  }

  return {
    logoType: 'text',
    logoValue: icon || String(tool.name || 'AI').slice(0, 2).toUpperCase()
  };
}

export function createExplorerTools(toolList, categories) {
  const membershipsByToolSlug = new Map();

  for (const category of categories) {
    for (const toolSlug of category.toolSlugs) {
      const memberships = membershipsByToolSlug.get(toolSlug) || [];
      memberships.push({ slug: category.slug, name: category.name });
      membershipsByToolSlug.set(toolSlug, memberships);
    }
  }

  return toolList.map((tool) => {
    const memberships = membershipsByToolSlug.get(tool.slug) || [];
    const logo = resolveToolLogo(tool);

    return {
      name: tool.name,
      slug: tool.slug,
      developer: tool.developer || '待核对',
      summary: tool.seoDescription || tool.summary || tool.description || '',
      pricing: tool.pricing || '以官方实际页面为准',
      platforms: tool.platforms || [],
      capabilities: tool.capabilities || [],
      useCases: tool.useCases || [],
      updatedAt: tool.updatedAt || '',
      rating: Number(tool.rating || 0),
      featured: tool.featured === true,
      featuredRank: Number(tool.featuredRank ?? Number.MAX_SAFE_INTEGER),
      categorySlugs: memberships.map((category) => category.slug),
      categoryNames: memberships.map((category) => category.name),
      categoryName: memberships[0]?.name || '其他 AI 工具',
      ...logo
    };
  });
}

export function createExplorerTasks(explorerTools) {
  return explorerTaskDefinitions.map((task) => {
    const matchingTools = explorerTools.filter((tool) =>
      matchesExplorerTask(tool, task.id)
    );

    return {
      ...task,
      count: matchingTools.length,
      representatives: matchingTools.slice(0, 3).map((tool) => tool.name)
    };
  });
}

export function createFeaturedTools(explorerTools) {
  return explorerTools
    .filter((tool) => tool.featured)
    .sort((left, right) => left.featuredRank - right.featuredRank);
}

export function createExplorerCategories(explorerTools, categories) {
  return categories.map((category) => {
    const matchingTools = explorerTools.filter((tool) =>
      tool.categorySlugs.includes(category.slug)
    );

    return {
      slug: category.slug,
      name: category.name,
      description: category.description,
      count: matchingTools.length,
      representatives: matchingTools.slice(0, 5).map((tool) => tool.name)
    };
  });
}
import { TOOL_LOGO_PATHS } from './tool-logo-map.mjs';
