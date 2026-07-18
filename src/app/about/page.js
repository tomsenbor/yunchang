import Link from 'next/link';
import { pageMetadata } from '../../lib/seo.mjs';

export const metadata = pageMetadata({ title: '关于我们', path: '/about' });

export default function AboutPage() {
  return (
    <div className="static-page static-page-container about-page">
      <h1 className="text-4xl font-black text-ink">关于我们</h1>
      <div className="prose-lite mt-6 rounded-lg border border-line bg-white p-6 shadow-soft">
        <p>AI效率工具库是面向中文用户的 AI 工具教程和视频解说项目，重点服务新手、自媒体人、学生、办公人群和独立站卖家。</p>
        <p>本站内容结构强调人工测试、截图、视频演示和真实使用体验，不以低质量采集内容填充页面。</p>
        <section>
          <h2>编辑原则</h2>
          <p>我们通过实际体验、功能测试和资料核验整理 AI 工具信息，帮助用户快速选择适合自己的 AI 工具。</p>
        </section>
        <section>
          <h2>更新机制</h2>
          <p>工具价格、功能和版本变化后会持续更新页面信息。</p>
        </section>
        <p>
          详细测试维度、评分标准和商业合作说明请查看
          <Link href="/methodology" className="font-bold text-brand hover:text-brandBright">AI工具评测方法</Link>。
        </p>
      </div>
    </div>
  );
}
