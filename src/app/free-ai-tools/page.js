import { ToolCard, Section } from '../../components/Cards.jsx';
import { tools } from '../../lib/site-data.mjs';
import { pageMetadata } from '../../lib/seo.mjs';

const FREE_TOOL_REVIEW_DATE = '2026-07-15';

export const metadata = pageMetadata({
  title: '免费AI工具合集',
  description: '整理适合新手入门的免费 AI 写作、图片、视频、办公和字幕工具。',
  path: '/free-ai-tools'
});

export default function FreeAiToolsPage() {
  const freeTools = tools.filter((tool) => tool.pricing.includes('免费'));
  return (
    <Section eyebrow="Free Tools" title="免费AI工具合集" description="整理提供免费版本或免费使用入口的 AI 工具；免费额度、登录要求和套餐信息以官方实际页面为准。">
      <div className="site-page-grid tool-grid grid md:grid-cols-3">
        {freeTools.map((tool) => (
          <ToolCard
            key={tool.slug}
            tool={tool}
            freeDetails={{
              reviewDate: FREE_TOOL_REVIEW_DATE,
              freeLimit: '以官方实际页面为准',
              loginRequired: '待核对',
              officialUrl: tool.affiliateUrl,
              priceNote: '价格或套餐以官方实际页面为准'
            }}
          />
        ))}
      </div>
    </Section>
  );
}
