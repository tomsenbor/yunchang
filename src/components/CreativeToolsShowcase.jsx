'use client';

/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';

const rowConfigs = [
  { id: 'creative-row-1', direction: 'right', duration: '28s', offset: 0 },
  { id: 'creative-row-2', direction: 'left', duration: '32s', offset: 3 },
  { id: 'creative-row-3', direction: 'right', duration: '36s', offset: 6 }
];

const categoryLabels = {
  'ai-image': '文生图',
  'ai-video': '视频生成',
  'ai-voice': '音频',
  'ai-design': '设计',
  'ai-office': '协作',
  'ai-coding': '编程',
  'ai-subtitle': '字幕'
};

const iconSources = {
  midjourney: { iconType: 'local', icon: '/icons/ai-tools/midjourney.svg' },
  runway: { iconType: 'local', icon: '/icons/ai-tools/runway.svg' },
  elevenlabs: { iconType: 'local', icon: '/icons/ai-tools/elevenlabs.svg' },
  'canva-ai': { iconType: 'local', icon: '/icons/ai-tools/canva-ai.svg' },
  'notion-ai': { iconType: 'local', icon: '/icons/ai-tools/notion-ai.svg' },
  cursor: { iconType: 'local', icon: '/icons/ai-tools/cursor.svg' },
  'jimeng-ai': { iconType: 'local', icon: '/brand-icons/current/jimeng-ai.png' },
  'kling-ai': { iconType: 'local', icon: '/brand-icons/current/kling-ai.png' },
  'tongyi-wanxiang': { iconType: 'local', icon: '/brand-icons/current/tongyi-wanxiang.png' },
  'capcut-ai': { iconType: 'local', icon: '/brand-icons/current/capcut-ai.png' }
};

function rotateTools(tools, offset) {
  if (!tools.length) return [];
  const normalizedOffset = offset % tools.length;
  return [...tools.slice(normalizedOffset), ...tools.slice(0, normalizedOffset)];
}

function getToolTag(tool) {
  if (categoryLabels[tool.categorySlug]) return categoryLabels[tool.categorySlug];
  if (tool.domestic) return '国内工具';
  return '海外工具';
}

function getToolSummary(tool) {
  return tool.bestFor || tool.summary || 'AI 创作工具';
}

function CreativeToolCard({ tool, brokenIcons, isClone = false, setBrokenIcons }) {
  const iconSource = tool.icon
    ? { iconType: 'local', icon: tool.icon }
    : iconSources[tool.slug];
  const hasLocalIcon = iconSource?.iconType === 'local' && !brokenIcons[tool.slug];
  const tag = getToolTag(tool);

  return (
    <Link
      href={`/ai-tools/${tool.slug}`}
      className={`creative-marquee-card ${isClone ? 'is-clone' : ''}`}
      aria-hidden={isClone ? 'true' : undefined}
      tabIndex={isClone ? -1 : undefined}
    >
      <span className="creative-card-highlight" aria-hidden="true" />
      <span className="creative-card-topline">
        <span className="creative-card-logo-wrap">
          {hasLocalIcon ? (
            <img
              src={iconSource.icon}
              alt={tool.iconAlt || `${tool.name} logo`}
              loading="lazy"
              className="creative-card-logo"
              onError={() => setBrokenIcons((current) => ({ ...current, [tool.slug]: true }))}
            />
          ) : (
            <span className="creative-card-letter" aria-hidden="true">
              {tool.logo || tool.name.slice(0, 1)}
            </span>
          )}
        </span>
        <span className="creative-card-tag">{tag}</span>
      </span>
      <span className="creative-card-name">{tool.name}</span>
      <span className="creative-card-summary">{getToolSummary(tool)}</span>
      <span className="creative-card-action">查看教程</span>
    </Link>
  );
}

export function CreativeToolsShowcase({ tools = [] }) {
  const showcaseRef = useRef(null);
  const [brokenIcons, setBrokenIcons] = useState({});
  const [isInView, setInView] = useState(() => typeof window !== 'undefined' && !('IntersectionObserver' in window));
  const showcaseTools = useMemo(() => tools.slice(0, 10), [tools]);

  useEffect(() => {
    const node = showcaseRef.current;
    if (!node) return undefined;

    if (!('IntersectionObserver' in window)) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting && entry.intersectionRatio > 0.15);
      },
      { threshold: [0, 0.15] }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  if (!showcaseTools.length) return null;

  return (
    <div
      ref={showcaseRef}
      className={`creative-tools-showcase ${isInView ? 'is-in-view' : ''}`}
      aria-label="AI 创作工具动态卡片墙"
    >
      {rowConfigs.map((config) => {
        const rowTools = rotateTools(showcaseTools, config.offset);
        const doubledTools = [...rowTools, ...rowTools];

        return (
          <div
            key={config.id}
            className={`creative-tools-row creative-tools-row-${config.direction}`}
            style={{ '--marquee-duration': config.duration }}
          >
            <div className="creative-tools-marquee">
              {doubledTools.map((tool, index) => (
                <CreativeToolCard
                  key={`${config.id}-${tool.slug}-${index}`}
                  tool={tool}
                  brokenIcons={brokenIcons}
                  isClone={index >= rowTools.length}
                  setBrokenIcons={setBrokenIcons}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
