import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Section } from '../../../../components/Cards.jsx';
import { JsonLd } from '../../../../components/JsonLd.jsx';
import {
  getToolCategory,
  getToolsByCategory,
  toolCategories
} from '../../../../lib/tool-content.mjs';
import { breadcrumbJsonLd, pageMetadata } from '../../../../lib/seo.mjs';

export function generateStaticParams() {
  return toolCategories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const category = getToolCategory(slug);
  if (!category) return {};
  return pageMetadata({
    title: `${category.name}推荐与教程`,
    description: category.description,
    path: `/ai-tools/category/${category.slug}`
  });
}

export default async function ToolCategoryPage({ params }) {
  const { slug } = await params;
  const category = getToolCategory(slug);
  if (!category) notFound();
  const categoryTools = getToolsByCategory(slug);

  return (
    <Section eyebrow="AI Tool Category" title={category.name} description={category.description}>
      <JsonLd data={breadcrumbJsonLd([
        { name: '首页', href: '/' },
        { name: 'AI 工具库', href: '/ai-tools' },
        { name: category.name, href: `/ai-tools/category/${category.slug}` }
      ])} />

      <nav className="mb-6 flex flex-wrap gap-2" aria-label="AI 工具分类">
        {toolCategories.map((item) => (
          <Link
            key={item.slug}
            href={`/ai-tools/category/${item.slug}`}
            aria-current={item.slug === category.slug ? 'page' : undefined}
            className={`rounded-full border px-4 py-2 text-sm font-semibold ${
              item.slug === category.slug
                ? 'border-brand bg-cyan-50 text-brand'
                : 'border-line bg-white text-muted hover:border-brand hover:text-brand'
            }`}
          >
            {item.name}
          </Link>
        ))}
      </nav>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {categoryTools.map((tool) => (
          <article key={tool.slug} className="rounded-2xl border border-line bg-white p-5 shadow-sm">
            <Link href={`/ai-tools/${tool.slug}`} className="block h-full">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold text-brand">{tool.developer}</p>
                  <h2 className="mt-2 text-xl font-black text-ink">{tool.name}</h2>
                </div>
                <span className="rounded-full bg-slate-50 px-3 py-1 text-xs font-semibold text-muted">
                  {tool.pricing}
                </span>
              </div>
              <p className="mt-4 text-sm leading-6 text-muted">{tool.summary}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {tool.capabilities.slice(0, 4).map((capability) => (
                  <span key={capability} className="rounded-full border border-line px-3 py-1 text-xs font-semibold text-muted">
                    {capability}
                  </span>
                ))}
              </div>
              <span className="mt-5 inline-flex text-sm font-bold text-brand">查看工具详情 →</span>
            </Link>
          </article>
        ))}
      </div>
    </Section>
  );
}
