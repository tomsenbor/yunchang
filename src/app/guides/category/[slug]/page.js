import { notFound } from 'next/navigation';
import { JsonLd } from '../../../../components/JsonLd.jsx';
import { Section } from '../../../../components/Cards.jsx';
import { GuideListShowcase } from '../../../../components/GuideListShowcase.jsx';
import {
  getGuideCategory,
  getGuidesByCategory,
  guideCategories
} from '../../../../lib/guide-content.mjs';
import { SITE_URL } from '../../../../lib/site-data.mjs';
import { breadcrumbJsonLd, pageMetadata } from '../../../../lib/seo.mjs';

export function generateStaticParams() {
  return guideCategories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const category = getGuideCategory(slug);
  if (!category) return {};

  return pageMetadata({
    title: `${category.name}教程`,
    description: category.description,
    path: `/guides/category/${category.slug}`
  });
}

export default async function GuideCategoryPage({ params }) {
  const { slug } = await params;
  const category = getGuideCategory(slug);
  if (!category) notFound();

  const categoryGuides = getGuidesByCategory(category.slug);
  const categoryPath = `/guides/category/${category.slug}`;

  const collectionJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${category.name}教程`,
    description: category.description,
    url: `${SITE_URL}${categoryPath}`,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: categoryGuides.map((guide, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: guide.title,
        url: `${SITE_URL}/guides/${guide.slug}`
      }))
    }
  };

  return (
    <>
      <JsonLd data={breadcrumbJsonLd([
        { name: '首页', href: '/' },
        { name: '教程', href: '/guides' },
        { name: category.name, href: categoryPath }
      ])} />
      <JsonLd data={collectionJsonLd} />
      <Section
        eyebrow="Guide category"
        title={`${category.name}教程`}
        description={`${category.description} 当前共收录 ${categoryGuides.length} 篇教程。`}
      >
        <GuideListShowcase guides={categoryGuides} />
      </Section>
    </>
  );
}
