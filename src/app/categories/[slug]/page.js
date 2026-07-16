import Link from 'next/link';
import { notFound } from 'next/navigation';
import { GuideCard, ToolCard } from '../../../components/Cards.jsx';
import { categories, getCategory, guides, tools } from '../../../lib/site-data.mjs';
import { pageMetadata } from '../../../lib/seo.mjs';

export function generateStaticParams() {
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) return {};
  return pageMetadata({
    title: category.name,
    description: category.description,
    path: `/categories/${category.slug}`
  });
}

export default async function CategoryPage({ params }) {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();
  const categoryTools = tools.filter((tool) => tool.categorySlug === category.slug);
  const categoryGuides = guides.filter((guide) => guide.categorySlug === category.slug);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <p className="text-sm font-black text-accent">分类</p>
      <h1 className="mt-3 text-4xl font-black text-ink">{category.name}</h1>
      <p className="mt-4 max-w-3xl text-lg leading-8 text-muted">{category.description}</p>
      <div className="mt-8 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-black text-ink">相关工具</h2>
            <Link href="/ai-tools" className="text-sm font-bold text-brand">全部工具</Link>
          </div>
          <div className="grid gap-5">{categoryTools.map((tool) => <ToolCard key={tool.slug} tool={tool} />)}</div>
        </section>
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-black text-ink">相关教程</h2>
            <Link href="/guides" className="text-sm font-bold text-brand">全部教程</Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">{categoryGuides.map((guide) => <GuideCard key={guide.slug} guide={guide} />)}</div>
        </section>
      </div>
    </div>
  );
}
