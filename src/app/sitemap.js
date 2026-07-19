import { getAllRoutes, SITE_URL } from '../lib/site-data.mjs';
import {
  getGuideCategoryUpdatedAt,
  guideCategories,
  guideCategoryRoutes,
  guides
} from '../lib/guide-content.mjs';
import { toolCategoryRoutes, toolRoutes } from '../lib/tool-content.mjs';

const guideUpdatedAtByRoute = new Map(
  guides.map((guide) => [`/guides/${guide.slug}`, guide.updatedAt])
);

const categoryUpdatedAtByRoute = new Map(
  guideCategories.map((category) => [
    `/guides/category/${category.slug}`,
    getGuideCategoryUpdatedAt(category.slug)
  ])
);

export default function sitemap() {
  const routes = [...new Set([
    ...getAllRoutes(),
    ...guideCategoryRoutes,
    ...toolCategoryRoutes,
    ...toolRoutes
  ])];

  return routes.map((route) => ({
    url: `${SITE_URL}${route === '/' ? '' : route}`,
    lastModified: new Date(
      guideUpdatedAtByRoute.get(route)
      || categoryUpdatedAtByRoute.get(route)
      || '2026-06-17'
    ),
    changeFrequency: 'weekly',
    priority: route === '/'
      ? 1
      : route.startsWith('/guides/category/') || route.startsWith('/ai-tools/category/')
        ? 0.8
        : 0.7
  }));
}
