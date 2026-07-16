import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from './site-data.mjs';

export function buildCanonicalUrl(path = '/') {
  const normalizedPath = path === '/' ? '/' : `/${path.replace(/^\/+/, '')}`;
  return new URL(normalizedPath, SITE_URL).toString();
}

export function pageMetadata({ title, description = SITE_DESCRIPTION, path = '/', image = '/og-image.svg', appendSiteName = true }) {
  const fullTitle = appendSiteName && title !== SITE_NAME ? `${title} | ${SITE_NAME}` : title;
  const canonical = buildCanonicalUrl(path);

  return {
    title: fullTitle,
    description,
    metadataBase: new URL(SITE_URL),
    alternates: { canonical },
    openGraph: {
      title: fullTitle,
      description,
      url: canonical,
      siteName: SITE_NAME,
      images: [{ url: image, width: 1200, height: 630, alt: fullTitle }],
      locale: 'zh_CN',
      type: 'website'
    }
  };
}

export function buildSitemapXml(routes) {
  const urls = routes
    .map((route) => {
      return [
        '  <url>',
        `    <loc>${buildCanonicalUrl(route)}</loc>`,
        '    <changefreq>weekly</changefreq>',
        '    <priority>0.7</priority>',
        '  </url>'
      ].join('\n');
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;
}

export function breadcrumbJsonLd(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: buildCanonicalUrl(item.href)
    }))
  };
}

export function articleJsonLd(article, path) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    author: { '@type': 'Organization', name: article.author || SITE_NAME },
    publisher: { '@type': 'Organization', name: SITE_NAME },
    datePublished: article.updatedAt,
    dateModified: article.updatedAt,
    mainEntityOfPage: buildCanonicalUrl(path)
  };
}

export function faqJsonLd(faq) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer }
    }))
  };
}

function toIsoDuration(duration = '') {
  const value = String(duration).trim();
  const colonMatch = value.match(/^(\d{1,2}):(\d{2})$/);
  if (colonMatch) {
    return `PT${Number(colonMatch[1])}M${Number(colonMatch[2])}S`;
  }

  const zhMatch = value.match(/(?:(\d+)\s*分)?\s*(?:(\d+)\s*秒)?/);
  if (zhMatch && (zhMatch[1] || zhMatch[2])) {
    return `PT${Number(zhMatch[1] || 0)}M${Number(zhMatch[2] || 0)}S`;
  }

  return undefined;
}

export function videoJsonLd(video, path) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: video.title,
    description: video.transcript,
    thumbnailUrl: [buildCanonicalUrl(video.thumbnail)],
    uploadDate: video.publishedAt,
    embedUrl: video.embedUrl || buildCanonicalUrl(path)
  };

  const duration = toIsoDuration(video.duration);
  if (duration) data.duration = duration;
  if (video.videoUrl) data.contentUrl = buildCanonicalUrl(video.videoUrl);

  return data;
}
