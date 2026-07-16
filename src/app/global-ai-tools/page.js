import { Section, ToolCard } from '../../components/Cards.jsx';
import { getGlobalTools } from '../../lib/site-data.mjs';
import { pageMetadata } from '../../lib/seo.mjs';

export const metadata = pageMetadata({
  title: '全球AI工具大全',
  description:
    '收录 ChatGPT、Claude、Gemini、Perplexity、Copilot、Midjourney、Runway、ElevenLabs、Cursor、Canva、Notion AI、DeepSeek、Kimi、豆包、通义千问等国内外主流 AI 工具，提供教程、评测、对比和视频解说。',
  path: '/global-ai-tools'
});

export default function GlobalAiToolsPage() {
  const globalTools = getGlobalTools();

  return (
    <Section
      eyebrow="Global AI Tools"
      title="全球AI工具大全"
      description="收录 ChatGPT、Claude、Gemini、Perplexity、Copilot、Midjourney、Runway、ElevenLabs、Cursor、Canva、Notion AI、DeepSeek、Kimi、豆包、通义千问等国内外主流 AI 工具，提供教程、评测、对比和视频解说。"
    >
      <div className="site-page-grid tool-grid grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {globalTools.map((tool) => <ToolCard key={tool.slug} tool={tool} />)}
      </div>
    </Section>
  );
}
