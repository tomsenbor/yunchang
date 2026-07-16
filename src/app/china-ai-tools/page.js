import { Section, ToolCard } from '../../components/Cards.jsx';
import { getChinaTools } from '../../lib/site-data.mjs';
import { pageMetadata } from '../../lib/seo.mjs';

export const metadata = pageMetadata({
  title: '国产AI工具大全',
  description:
    '收录 DeepSeek、通义千问、豆包、Kimi、文心一言、腾讯元宝、讯飞星火、智谱清言、即梦AI、可灵AI、通义万相、剪映AI 等国内主流 AI 工具。',
  path: '/china-ai-tools'
});

export default function ChinaAiToolsPage() {
  const chinaTools = getChinaTools();

  return (
    <Section
      eyebrow="China AI Tools"
      title="国产AI工具大全"
      description="收录 DeepSeek、通义千问、豆包、Kimi、文心一言、腾讯元宝、讯飞星火、智谱清言、即梦AI、可灵AI、通义万相、剪映AI 等国内主流 AI 工具。"
    >
      <div className="site-page-grid tool-grid grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {chinaTools.map((tool) => <ToolCard key={tool.slug} tool={tool} />)}
      </div>
    </Section>
  );
}
