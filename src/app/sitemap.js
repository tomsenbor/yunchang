import { getAllRoutes, SITE_URL } from '../lib/site-data.mjs';

export default function sitemap() {
  return getAllRoutes().map((route) => ({
    url: `${SITE_URL}${route === '/' ? '' : route}`,
    lastModified: new Date('2026-06-17'),
    changeFrequency: 'weekly',
    priority: route === '/' ? 1 : 0.7
  }));
}
