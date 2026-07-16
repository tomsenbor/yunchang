'use client';

import Link from 'next/link';
import { Section } from './Cards.jsx';
import { CreativeToolsShowcase } from './CreativeToolsShowcase';
import { GlobalToolsCarousel } from './GlobalToolsCarousel';

type Tool = {
  slug: string;
  name: string;
  audience?: string;
  summary?: string;
  bestFor?: string;
  pricing?: string;
  pricingLabel?: string;
  rating?: number;
  logo?: string;
  categorySlug?: string;
  galleryTags?: string[];
  domestic?: boolean;
};

type HomeToolGalleriesProps = {
  globalTools: Tool[];
  creativeTools: Tool[];
};

export function HomeToolGalleries({ globalTools, creativeTools }: HomeToolGalleriesProps) {
  return (
    <>
      <Section
        eyebrow="Model Gallery"
        title="全球热门 AI 大模型"
        description="先从全球最常用、最值得学习的 AI 工具开始，覆盖聊天、搜索、写作、图片、视频、语音、办公和编程。"
        tone="section-accent-cyan"
        className="home-section-first global-tools-section"
        action={
          <Link href="/global-ai-tools" className="home-section-action magnetic-button">
            <span>查看全部</span>
            <span aria-hidden="true">→</span>
          </Link>
        }
      >
        <GlobalToolsCarousel tools={globalTools} />
      </Section>

      <Section
        eyebrow="Create"
        title="国内外创作工具"
        description="覆盖图片、视频、配音、设计、知识库和编程创作，国产工具和海外工具放在同一张地图里对照学习。"
        tone="section-accent-orange"
        className="create-tools-section"
        action={
          <Link href="/ai-tools" className="home-section-action magnetic-button">
            <span>查看工具库</span>
            <span aria-hidden="true">→</span>
          </Link>
        }
      >
        <CreativeToolsShowcase tools={creativeTools} />
      </Section>
    </>
  );
}
