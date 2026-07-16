'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { getCategory } from '../lib/site-data.mjs';
import { useToast } from './Toast.tsx';

const sectionDots = ['purple', 'yellow', 'cyan'];

export function Section({ eyebrow, title, description, action, className = '', tone = '', children }) {
  const [activeDot, setActiveDot] = useState(null);
  const [isEyebrowActive, setEyebrowActive] = useState(false);
  const isHomeSection = Boolean(tone);
  const TitleTag = isHomeSection ? 'h2' : 'h1';
  const sectionClass = tone
    ? `section-minimal home-section-container ${tone} ${className}`
    : `page-shell site-page-container ${className}`;
  const headingClass = isHomeSection
    ? 'section-heading mb-6 flex flex-col gap-3 md:mb-7 md:flex-row md:items-end md:justify-between'
    : 'section-heading page-heading flex flex-col gap-3 md:flex-row md:items-end md:justify-between';
  const titleClass = isHomeSection
    ? 'mt-3 text-2xl font-black tracking-tight text-ink md:text-3xl'
    : 'page-title';
  const descriptionClass = isHomeSection
    ? 'section-description mt-2.5 text-sm leading-6 text-muted md:text-base'
    : 'page-description';

  return (
    <section className={sectionClass}>
      <div className={headingClass}>
        <div className={isHomeSection ? 'max-w-3xl' : 'page-heading-copy'}>
          <div className="section-kicker flex items-center gap-3">
            <span className="section-accent-dots">
              {sectionDots.map((dot) => (
                <button
                  key={dot}
                  type="button"
                  className={`section-dot section-dot-${dot} ${activeDot === dot ? 'is-active' : ''}`}
                  aria-label={`Toggle ${dot} section dot`}
                  aria-pressed={activeDot === dot}
                  onClick={() => setActiveDot((current) => (current === dot ? null : dot))}
                />
              ))}
            </span>
            {eyebrow ? (
              <button
                type="button"
                className={`section-eyebrow ${isEyebrowActive ? 'is-active' : ''}`}
                aria-pressed={isEyebrowActive}
                onClick={() => setEyebrowActive((current) => !current)}
              >
                {eyebrow}
              </button>
            ) : null}
          </div>
          <TitleTag className={titleClass}>{title}</TitleTag>
          {description ? <p className={descriptionClass}>{description}</p> : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
      {isHomeSection ? children : <div className="page-content">{children}</div>}
    </section>
  );
}

export function GuideCard({ guide, featured = false, index = 0 }) {
  const category = getCategory(guide.categorySlug);
  const { showToast, messages } = useToast();

  return (
    <article
      className={`guide-card gallery-card interactive-card fade-up stagger-item flex h-full flex-col overflow-hidden ${featured ? 'home-guide-featured' : ''}`}
      style={{ '--stagger-index': index }}
    >
      <div className="shine-effect border-b border-line bg-gradient-to-br from-cyan-50 via-white to-slate-50 p-4">
        <div className="flex flex-wrap items-center gap-2 text-xs font-black">
          <span className="rounded-full bg-white px-3 py-1 text-brand shadow-sm">{category?.name}</span>
          <span className="rounded-full bg-white px-3 py-1 text-muted shadow-sm">{guide.readTime}</span>
          <span className="rounded-full bg-white px-3 py-1 text-muted shadow-sm">{guide.updatedAt}</span>
        </div>
        <h3 className={`mt-4 font-black leading-tight text-ink ${featured ? 'text-xl md:text-2xl' : 'text-base md:text-lg'}`}>
          {guide.title}
        </h3>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <p className="line-clamp-2 text-sm leading-6 text-muted">{guide.excerpt}</p>
        <div className="guide-outcome mt-4 rounded-xl bg-soft p-3">
          <p className="text-xs font-black text-muted">学完能做什么</p>
          <p className="mt-1 text-sm font-bold leading-6 text-ink">{guide.outcome}</p>
        </div>
        <div className="mt-auto flex flex-wrap gap-3 pt-4">
          <Link href={`/guides/${guide.slug}`} className="magnetic-button inline-flex text-sm font-black text-brand hover:text-accent">
            <span>查看教程</span>
            <span aria-hidden="true">→</span>
          </Link>
          <button
            type="button"
            onClick={() => showToast(messages.workflow)}
            className="text-sm font-black text-slate-500 transition hover:text-brand"
          >
            保存到工作流
          </button>
        </div>
      </div>
    </article>
  );
}

export function ToolCard({ tool, freeDetails = null }) {
  const { showToast, messages } = useToast();

  return (
    <article className="compact-tool-card gallery-card interactive-card tool-card group flex h-full flex-col overflow-hidden">
      <div className="tool-cover shine-effect relative overflow-hidden px-3.5 pb-2.5 pt-3.5">
        <div className="flex items-start justify-between gap-3">
          <div className="tool-logo flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-sm font-black text-brand shadow-soft ring-1 ring-line">
            {tool.icon ? (
              <Image
                src={tool.icon}
                alt={tool.iconAlt || `${tool.name} logo`}
                width={28}
                height={28}
                className="h-7 w-7 object-contain"
              />
            ) : (
              tool.logo
            )}
          </div>
          <button
            type="button"
            onClick={() => showToast(messages.favorite)}
            aria-label={`收藏 ${tool.name}`}
            className="tool-action rounded-full border border-line bg-white/85 px-3 py-1.5 text-xs font-black text-slate-500 shadow-sm transition hover:border-brand hover:text-brand"
          >
            收藏
          </button>
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {tool.galleryTags?.slice(0, 3).map((tag) => (
            <span key={tag} className="rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-black text-slate-600 shadow-sm">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-1 flex-col px-3.5 pb-3.5 pt-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-[20px] font-black leading-tight text-ink">{tool.name}</h3>
            <p className="mt-1 text-xs font-black text-brand">{tool.pricingLabel || tool.pricing}</p>
          </div>
          <span className="score-pill rounded-full px-2.5 py-1 text-xs font-black">
            {tool.rating}分
          </span>
        </div>
        <div className="mt-2.5 rounded-xl bg-soft px-3 py-2">
          <p className="text-xs font-black text-muted">适合人群</p>
          <p className="mt-1 line-clamp-2 text-sm font-bold leading-5 text-ink">{tool.audience}</p>
        </div>
        <p className="mt-2.5 line-clamp-2 text-sm leading-5 text-muted">{tool.summary}</p>
        {freeDetails ? (
          <dl className="mt-3 grid gap-2 rounded-xl border border-line bg-white px-3 py-3 text-xs leading-5">
            <div className="flex items-start justify-between gap-3">
              <dt className="font-black text-muted">核查日期</dt>
              <dd className="text-right font-bold text-ink">{freeDetails.reviewDate}</dd>
            </div>
            <div className="flex items-start justify-between gap-3">
              <dt className="font-black text-muted">免费额度 / 限制</dt>
              <dd className="max-w-[65%] text-right font-bold text-ink">{freeDetails.freeLimit}</dd>
            </div>
            <div className="flex items-start justify-between gap-3">
              <dt className="font-black text-muted">是否需要登录</dt>
              <dd className="text-right font-bold text-ink">{freeDetails.loginRequired}</dd>
            </div>
            <div className="flex items-start justify-between gap-3">
              <dt className="font-black text-muted">官方来源</dt>
              <dd className="text-right font-bold">
                {freeDetails.officialUrl ? (
                  <a
                    href={freeDetails.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="text-brand hover:text-brandBright"
                  >
                    官方入口
                  </a>
                ) : (
                  <span className="text-ink">待核对</span>
                )}
              </dd>
            </div>
            <div className="flex items-start justify-between gap-3">
              <dt className="font-black text-muted">套餐说明</dt>
              <dd className="max-w-[65%] text-right font-bold text-ink">{freeDetails.priceNote}</dd>
            </div>
          </dl>
        ) : null}
        <div className="mt-auto grid grid-cols-2 gap-2 pt-3">
          <Link href={`/ai-tools/${tool.slug}`} className="magnetic-button h-9 justify-center rounded-lg bg-brand px-3 text-[13px] font-black text-white hover:bg-brandBright">
            <span>查看教程</span>
            <span aria-hidden="true">→</span>
          </Link>
          <button
            type="button"
            onClick={() => showToast(messages.compare)}
            className="magnetic-button h-9 justify-center rounded-lg border border-line bg-white px-3 text-[13px] font-black text-ink hover:border-brand hover:text-brand"
          >
            加入对比
          </button>
        </div>
      </div>
    </article>
  );
}

const videoThemeBySlug = {
  'chatgpt-3min-guide': 'chatgpt',
  'claude-user-fit-video': 'claude',
  'gemini-vs-chatgpt-video': 'gemini',
  'perplexity-research-video': 'perplexity',
  'deepseek-beginner-video': 'deepseek',
  'kimi-long-doc-video': 'kimi',
  'midjourney-image-video': 'midjourney',
  'runway-video-generation-video': 'runway',
  'elevenlabs-voice-video': 'elevenlabs',
  'cursor-ai-coding-video': 'cursor'
};

export function VideoCard({ video }) {
  const category = getCategory(video.categorySlug);
  const theme = videoThemeBySlug[video.slug] || 'default';
  const subtitle = video.description || video.transcript || '快速看懂这个 AI 工具的核心用法。';

  return (
    <article className={`gallery-card interactive-card video-card video-theme-${theme} overflow-hidden`}>
      <Link href={`/videos/${video.slug}`} className="block">
        <div className="video-cover relative aspect-video overflow-hidden">
          <Image
            src={video.thumbnail}
            alt=""
            fill
            sizes="(min-width: 768px) 33vw, 100vw"
            className="video-image object-cover opacity-[0.16]"
          />
          <div className="video-cover-gradient absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/10 to-transparent" />
          <div className="video-duration-pill absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-black text-brand shadow-sm">
            {video.duration}
          </div>
          <div className="video-play-shell absolute right-4 top-4 flex items-center justify-center">
            <div className="play-button video-play-button flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-lg font-black text-brand shadow-card">
              ▶
            </div>
          </div>
          <div className="video-overlay absolute inset-0 flex items-center justify-center gap-3 bg-slate-950/45 px-4 opacity-0">
            <span className="rounded-full bg-white px-3 py-2 text-xs font-black text-ink">查看视频</span>
            <span className="rounded-full border border-white/40 px-3 py-2 text-xs font-black text-white">查看文字教程</span>
          </div>
          <div className="video-caption absolute bottom-4 left-4 right-4">
            <p className="video-category text-xs font-black text-cyan-100">{category?.name}</p>
            <p className="video-card-title mt-1 line-clamp-2 text-xl font-black leading-tight text-white">{video.title}</p>
            <p className="video-card-subtitle mt-2 line-clamp-2 text-sm leading-5 text-white/80">{subtitle}</p>
          </div>
        </div>
      </Link>
      <div className="video-card-body p-4">
        <p className="video-card-description line-clamp-2 text-sm leading-6 text-muted">{video.description || video.transcript}</p>
      </div>
    </article>
  );
}
