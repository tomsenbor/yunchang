import { Section } from '../../components/Cards.jsx';
import { GuideListShowcase } from '../../components/GuideListShowcase.jsx';
import { guides } from '../../lib/guide-content.mjs';
import { pageMetadata } from '../../lib/seo.mjs';

export const metadata = pageMetadata({
  title: 'AI工具教程',
  description: 'ChatGPT、Claude、Gemini、AI写作、AI办公、AI视频和AI编程教程合集。',
  path: '/guides'
});

export default function GuidesPage() {
  return (
    <Section eyebrow="Guides" title="AI工具教程" description="提供 ChatGPT、Claude、Gemini 及国内外 AI 工具的中文教程，内容持续更新。">
      <GuideListShowcase guides={guides} />
    </Section>
  );
}
