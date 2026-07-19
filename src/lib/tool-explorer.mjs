const imageLogoPattern = /^(?:https?:\/\/|\/|data:image\/)/i;

export function resolveToolLogo(tool) {
  const icon = String(tool.icon || '').trim();

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
      summary: tool.seoDescription || tool.summary || tool.description || '',
      pricing: tool.pricing || '以官方实际页面为准',
      platforms: tool.platforms || [],
      capabilities: tool.capabilities || [],
      useCases: tool.useCases || [],
      updatedAt: tool.updatedAt || '',
      rating: Number(tool.rating || 0),
      categorySlugs: memberships.map((category) => category.slug),
      categoryNames: memberships.map((category) => category.name),
      categoryName: memberships[0]?.name || '其他 AI 工具',
      ...logo
    };
  });
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
