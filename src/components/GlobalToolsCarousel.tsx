'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent, PointerEvent } from 'react';

type Tool = {
  slug: string;
  name: string;
  audience?: string;
  summary?: string;
  bestFor?: string;
  pricing?: string;
  pricingLabel?: string;
  rating?: number;
  icon?: string;
  iconAlt?: string;
};

type GlobalToolsCarouselProps = {
  tools: Tool[];
};

const stampColors = ['cyan', 'purple', 'yellow', 'pink', 'green', 'orange'];
const visibleOffsets = [-4, -3, -2, -1, 0, 1, 2, 3, 4];
const swipeThreshold = 42;

function getWrappedIndex(index: number, total: number) {
  return (index + total) % total;
}

function getCardClass(offset: number) {
  if (offset === 0) return 'global-tool-card is-active';
  if (offset === -1) return 'global-tool-card is-prev1';
  if (offset === 1) return 'global-tool-card is-next1';
  if (offset === -2) return 'global-tool-card is-prev2';
  if (offset === 2) return 'global-tool-card is-next2';
  if (offset === -3) return 'global-tool-card is-prev3';
  if (offset === 3) return 'global-tool-card is-next3';
  if (offset === -4) return 'global-tool-card is-prev4';
  if (offset === 4) return 'global-tool-card is-next4';
  return 'global-tool-card is-hidden';
}

function getRelativeOffset(index: number, activeIndex: number, total: number) {
  const rawOffset = index - activeIndex;
  const half = Math.floor(total / 2);

  if (rawOffset > half) return rawOffset - total;
  if (rawOffset < -half) return rawOffset + total;

  return rawOffset;
}

function getIconSrc(slug: string) {
  return `/icons/ai-tools/${slug}.svg`;
}

export function GlobalToolsCarousel({ tools }: GlobalToolsCarouselProps) {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isInView, setInView] = useState(false);
  const [isHovered, setHovered] = useState(false);
  const [isUserPaused, setUserPaused] = useState(false);
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const pointerStartX = useRef<number | null>(null);
  const total = tools.length;
  const isAutoPlaying = isInView && !isHovered && !isUserPaused;

  const handlePrevious = () => {
    setActiveIndex((current) => getWrappedIndex(current - 1, total));
  };

  const handleNext = () => {
    setActiveIndex((current) => getWrappedIndex(current + 1, total));
  };

  useEffect(() => {
    if (!isAutoPlaying || !total) return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) return;

    const startTimer = window.setTimeout(() => {
      setActiveIndex((current) => getWrappedIndex(current + 1, total));
    }, 180);

    const interval = window.setInterval(() => {
      setActiveIndex((current) => getWrappedIndex(current + 1, total));
    }, 2600);

    return () => {
      window.clearTimeout(startTimer);
      window.clearInterval(interval);
    };
  }, [isAutoPlaying, total]);

  useEffect(() => {
    const node = carouselRef.current;

    if (!node) return;

    if (!('IntersectionObserver' in window)) {
      const fallbackTimer = window.setTimeout(() => setInView(true), 0);
      return () => window.clearTimeout(fallbackTimer);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.intersectionRatio > 0.35);
      },
      {
        threshold: [0, 0.35, 0.6]
      }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      handlePrevious();
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault();
      handleNext();
    }
  };

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    pointerStartX.current = event.clientX;
  };

  const onPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (pointerStartX.current === null) return;

    const distance = event.clientX - pointerStartX.current;
    pointerStartX.current = null;

    if (Math.abs(distance) < swipeThreshold) return;

    setUserPaused(true);

    if (distance > 0) {
      handlePrevious();
    } else {
      handleNext();
    }
  };

  if (!total) return null;

  return (
    <div
      ref={carouselRef}
      id="global-tools-gallery"
      className="global-tools-carousel"
      role="region"
      aria-label="全球热门 AI 工具轮播"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onMouseEnter={() => {
        setInView(true);
        setHovered(true);
      }}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="global-tools-carousel-stage" aria-live="polite">
        <div className="global-tools-stage">
          {tools.map((tool, index) => {
            const offset = getRelativeOffset(index, activeIndex, total);
            const isActive = offset === 0;
            const isLeft = offset < 0;
            const isRight = offset > 0;
            const colorName = stampColors[index % stampColors.length];
            const rating = typeof tool.rating === 'number' ? tool.rating.toFixed(1) : '';

            return (
              <article
                key={tool.slug}
                className={`${getCardClass(offset)} stamp-${colorName} ${isLeft ? 'is-left' : ''} ${isRight ? 'is-right' : ''}`}
                aria-current={isActive ? 'true' : undefined}
                onClick={() => {
                  setUserPaused(true);

                  if (isActive) {
                    router.push(`/ai-tools/${tool.slug}`);
                    return;
                  }

                  setActiveIndex(index);
                }}
              >
                <div className="global-tool-card-inner">
                  <span className="global-tool-icon-shell">
                    <Image
                      src={tool.icon || getIconSrc(tool.slug)}
                      alt={tool.iconAlt || `${tool.name} logo`}
                      width={64}
                      height={64}
                      className="global-tool-icon-image"
                    />
                  </span>
                  <h3 className="global-tool-name">{tool.name}</h3>
                  <p className="global-tool-pricing">{tool.pricingLabel || tool.pricing}</p>

                  {isActive ? (
                    <div className="global-tool-details-full">
                      <p className="global-tool-purpose">{tool.bestFor || tool.summary}</p>
                      <p className="global-tool-audience">适合：{tool.audience}</p>
                      <p className="global-tool-rating">{rating ? `推荐指数 ${rating}` : '推荐指数以实际体验为准'}</p>
                      <Link
                        href={`/ai-tools/${tool.slug}`}
                        className="global-tool-entry-button magnetic-button"
                        onClick={(event) => event.stopPropagation()}
                      >
                        <span>进入工具</span>
                      </Link>
                    </div>
                  ) : (
                    <div className="global-tool-details-compact">
                      <p className="global-tool-rating">{rating ? `推荐指数 ${rating}` : '推荐指数以实际体验为准'}</p>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
