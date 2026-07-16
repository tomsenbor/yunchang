import { pageMetadata } from '../../lib/seo.mjs';

export const metadata = pageMetadata({ title: '关于我们', path: '/about' });

export default function AboutPage() {
  return (
    <div className="static-page static-page-container about-page">
      <h1 className="text-4xl font-black text-ink">关于我们</h1>
      <div className="prose-lite mt-6 rounded-lg border border-line bg-white p-6 shadow-soft">
        <p>AI效率工具库是面向中文用户的 AI 工具教程和视频解说项目，重点服务新手、自媒体人、学生、办公人群和独立站卖家。</p>
        <p>本站内容结构强调人工测试、截图、视频演示和真实使用体验，不以低质量采集内容填充页面。</p>
      </div>
    </div>
  );
}
