import Link from 'next/link';
import { Section } from '../../components/Cards.jsx';
import { comparisons } from '../../lib/site-data.mjs';
import { pageMetadata } from '../../lib/seo.mjs';

export const metadata = pageMetadata({
  title: 'AI工具对比',
  description: '对比 ChatGPT、Claude、Gemini、Canva AI 等工具的适合场景、优缺点和选择建议。',
  path: '/compare'
});

export default function ComparePage() {
  return (
    <Section eyebrow="Compare" title="AI工具对比" description="从适用场景、使用门槛、功能侧重和工作流适配等维度整理 AI 工具选型参考。">
      <div className="site-page-grid compare-grid grid md:grid-cols-3">
        {comparisons.map((item) => (
          <Link key={item.slug} href={`/compare/${item.slug}`} className="rounded-lg border border-line bg-white p-5 shadow-soft hover:border-brand">
            <p className="text-xs font-black text-accent">{item.tools.join(' vs ')}</p>
            <h2 className="mt-2 text-xl font-black text-ink">{item.title}</h2>
            <p className="mt-3 text-sm leading-6 text-muted">{item.summary}</p>
          </Link>
        ))}
      </div>
    </Section>
  );
}
