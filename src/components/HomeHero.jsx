'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { Component, useEffect, useRef, useState } from 'react';
import { BrandMark } from './BrandMark';
import { FluidAura } from './FluidAura';

const heroTools = [
  { name: 'ChatGPT', slug: 'chatgpt', iconSrc: '/icons/ai-tools/chatgpt.svg' },
  { name: 'Claude', slug: 'claude', iconSrc: '/icons/ai-tools/claude.svg' },
  { name: 'Gemini', slug: 'gemini', iconSrc: '/icons/ai-tools/gemini.svg' },
  { name: 'DeepSeek', slug: 'deepseek', iconSrc: '/icons/ai-tools/deepseek.svg' },
  { name: 'Kimi', slug: 'kimi', iconSrc: '/icons/ai-tools/kimi.svg' },
  { name: 'Midjourney', slug: 'midjourney', iconSrc: '/icons/ai-tools/midjourney.svg' },
  { name: 'Runway', slug: 'runway', iconSrc: '/icons/ai-tools/runway.svg' },
  { name: 'Perplexity', slug: 'perplexity', iconSrc: '/icons/ai-tools/perplexity.svg' }
];

function useHeroCapability() {
  const [state, setState] = useState({
    isReady: false,
    isMobile: false,
    isReducedMotion: false
  });

  useEffect(() => {
    const mobileQuery = window.matchMedia('(max-width: 760px)');
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const update = () => {
      setState({
        isReady: true,
        isMobile: mobileQuery.matches,
        isReducedMotion: motionQuery.matches
      });
    };

    update();
    mobileQuery.addEventListener('change', update);
    motionQuery.addEventListener('change', update);

    return () => {
      mobileQuery.removeEventListener('change', update);
      motionQuery.removeEventListener('change', update);
    };
  }, []);

  return {
    ...state,
    canRenderCanvas: state.isReady && !state.isMobile && !state.isReducedMotion
  };
}

function FluidStaticFallback({ isOpen = false, compact = false }) {
  return (
    <div className={`fluid-static-fallback ${isOpen ? 'fluid-fallback-open' : ''}`} aria-hidden="true">
      <FluidAura isOpen={isOpen} compact={compact} />
      <div className="fluid-fallback-orbit fluid-fallback-orbit-a" />
      <div className="fluid-fallback-orbit fluid-fallback-orbit-b" />
    </div>
  );
}

const FluidHeroScene = dynamic(() => import('./FluidHeroScene'), {
  ssr: false,
  loading: () => <FluidStaticFallback />
});

class FluidSceneBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    this.props.onSceneError?.();
  }

  render() {
    if (this.state.failed) return <FluidStaticFallback isOpen={this.props.isOpen} />;
    return this.props.children;
  }
}

export function HomeHero({ hero }) {
  const [isHeroOpen, setHeroOpen] = useState(false);
  const [isTitleAnimating, setTitleAnimating] = useState(false);
  const [isBallFlying, setBallFlying] = useState(false);
  const [isSubtitlePlaying, setSubtitlePlaying] = useState(false);
  const [ballFlightStyle, setBallFlightStyle] = useState({});
  const [activeTool, setActiveTool] = useState(null);
  const [sceneFailed, setSceneFailed] = useState(false);
  const heroRef = useRef(null);
  const titleStackRef = useRef(null);
  const finalTitleLetterRef = useRef(null);
  const heroSubtitleRef = useRef(null);
  const subtitleRoomRef = useRef(null);
  const titleAnimationTimerRef = useRef(null);
  const ballAnimationFrameRef = useRef(null);
  const subtitleAnimationTimerRef = useRef(null);
  const { canRenderCanvas, isMobile, isReducedMotion } = useHeroCapability();

  const heroTitle = hero.title || 'AI FLUID LAB';
  const titleLetters = heroTitle.split('');
  const titleBeatCount = heroTitle.replace(/\s/g, '').length;
  const getTitleBeatIndex = (targetIndex) => heroTitle.slice(0, targetIndex).replace(/\s/g, '').length;

  useEffect(() => {
    return () => {
      if (titleAnimationTimerRef.current) {
        window.clearTimeout(titleAnimationTimerRef.current);
      }
      if (ballAnimationFrameRef.current) {
        window.cancelAnimationFrame(ballAnimationFrameRef.current);
      }
      if (subtitleAnimationTimerRef.current) {
        window.clearTimeout(subtitleAnimationTimerRef.current);
      }
    };
  }, []);
  const heroSubtitle = hero.badge || '全球 AI 实验室';

  const toggleHero = () => {
    setActiveTool(null);
    setHeroOpen((value) => !value);
  };

  const getBallPathMetrics = () => {
    const stackBox = titleStackRef.current?.getBoundingClientRect();
    const finalBox = finalTitleLetterRef.current?.getBoundingClientRect();
    const subtitleBox = heroSubtitleRef.current?.getBoundingClientRect();
    const roomBox = subtitleRoomRef.current?.getBoundingClientRect();
    const heroBox = heroRef.current?.getBoundingClientRect();

    if (!stackBox || !finalBox || !subtitleBox || !roomBox) {
      return null;
    }

    const ballStart = {
      x: finalBox.left + finalBox.width / 2 - stackBox.left,
      y: finalBox.top + finalBox.height / 2 - stackBox.top
    };
    const groundY = subtitleBox.bottom - stackBox.top;
    const rightWallX = (heroBox?.right ?? window.innerWidth) - stackBox.left - 18;
    const finalRightX = finalBox.right - stackBox.left;
    const land1 = { x: (finalRightX + rightWallX) / 2, y: groundY };
    const target = {
      x: roomBox.left + roomBox.width / 2 - stackBox.left,
      y: roomBox.top + roomBox.height * 0.55 - stackBox.top
    };
    const wallHit = {
      x: rightWallX,
      y: Math.max(ballStart.y + 64, groundY - 44)
    };
    const reboundLand1 = {
      x: wallHit.x + (target.x - wallHit.x) * 0.36,
      y: groundY - 6
    };
    const reboundLand2 = {
      x: wallHit.x + (target.x - wallHit.x) * 0.72,
      y: groundY - 2
    };
    const jumpHeights = [90, 70, 70, 44, 22];
    const segments = [
      { start: ballStart, end: land1, height: jumpHeights[0], duration: 900 },
      { start: land1, end: wallHit, height: jumpHeights[1], duration: 820 },
      { start: wallHit, end: reboundLand1, height: jumpHeights[2], duration: 760 },
      { start: reboundLand1, end: reboundLand2, height: jumpHeights[3], duration: 680 },
      { start: reboundLand2, end: target, height: jumpHeights[4], duration: 620 }
    ];

    return { ballStart, groundY, rightWallX, land1, target, segments };
  };

  const startBallFlight = () => {
    const path = getBallPathMetrics();

    if (!path) {
      setBallFlying(false);
      setSubtitlePlaying(true);
      subtitleAnimationTimerRef.current = window.setTimeout(() => {
        setSubtitlePlaying(false);
        subtitleAnimationTimerRef.current = null;
      }, 1280);
      return;
    }

    const ballRadius = 13;
    const totalDuration = path.segments.reduce((sum, segment) => sum + segment.duration, 0);
    let segmentStartTime = 0;
    setBallFlying(true);

    const setBallFrame = (x, y, lift, heightRatio, opacity = 1) => {
      const shadowOpacity = Math.max(0.16, 0.85 - heightRatio * 0.68);
      const shadowScale = Math.max(0.54, 1.14 - heightRatio * 0.54);
      setBallFlightStyle({
        '--ball-x': `${(x - ballRadius).toFixed(2)}px`,
        '--ball-y': `${(y - ballRadius).toFixed(2)}px`,
        '--ball-lift': `${(-lift).toFixed(2)}px`,
        '--ball-opacity': opacity,
        '--ball-shadow-opacity': shadowOpacity.toFixed(3),
        '--ball-shadow-scale': shadowScale.toFixed(3)
      });
    };

    const completeBallFlight = () => {
      const lastSegment = path.segments[path.segments.length - 1];
      setBallFrame(lastSegment.end.x, lastSegment.end.y, 0, 0, 0);
      setBallFlying(false);
      setSubtitlePlaying(true);
      ballAnimationFrameRef.current = null;

      subtitleAnimationTimerRef.current = window.setTimeout(() => {
        setSubtitlePlaying(false);
        subtitleAnimationTimerRef.current = null;
      }, 1280);
    };

    const animateBall = (startedAt) => {
      const tick = (now) => {
        const elapsed = now - startedAt;
        let accumulated = 0;
        let activeSegment = path.segments[path.segments.length - 1];

        for (const segment of path.segments) {
          if (elapsed <= accumulated + segment.duration) {
            activeSegment = segment;
            segmentStartTime = accumulated;
            break;
          }
          accumulated += segment.duration;
        }

        const localT = Math.min(1, Math.max(0, (elapsed - segmentStartTime) / activeSegment.duration));
        const easedT = localT;
        const x = activeSegment.start.x + (activeSegment.end.x - activeSegment.start.x) * easedT;
        const baseY = activeSegment.start.y + (activeSegment.end.y - activeSegment.start.y) * easedT;
        const lift = activeSegment.height * Math.sin(Math.PI * easedT);
        const heightRatio = activeSegment.height ? lift / activeSegment.height : 0;
        setBallFrame(x, baseY, lift, heightRatio);

        if (elapsed < totalDuration) {
          ballAnimationFrameRef.current = window.requestAnimationFrame(tick);
          return;
        }

        completeBallFlight();
      };

      ballAnimationFrameRef.current = window.requestAnimationFrame(tick);
    };

    ballAnimationFrameRef.current = window.requestAnimationFrame((startedAt) => {
      setBallFrame(path.ballStart.x, path.ballStart.y, 0, 0);
      animateBall(startedAt);
    });
  };

  const handleTitleClick = () => {
    if (isTitleAnimating || isBallFlying || isSubtitlePlaying) return;

    if (isReducedMotion) {
      setBallFlying(false);
      setSubtitlePlaying(false);
      return;
    }

    setSubtitlePlaying(false);
    setBallFlying(false);
    setTitleAnimating(true);

    titleAnimationTimerRef.current = window.setTimeout(() => {
      setTitleAnimating(false);
      startBallFlight();
      titleAnimationTimerRef.current = null;
    }, 1650);
  };

  const handlePanelClick = (event) => {
    event.stopPropagation();
  };

  const handleToolIconClick = (event, toolSlug) => {
    event.preventDefault();
    event.stopPropagation();
    setActiveTool((value) => (value === toolSlug ? null : toolSlug));
  };

  return (
    <section
      ref={heroRef}
      className={`section-hero fluid-hero-fullscreen ${isHeroOpen ? 'is-open' : ''}`}
      data-motion={isReducedMotion ? 'reduced' : 'motion'}
      data-scene-failed={sceneFailed ? 'true' : 'false'}
    >
      <div className="fluid-hero-background" aria-hidden="true" />
      <div className="fluid-canvas-layer" aria-hidden="true">
        <FluidStaticFallback isOpen={isHeroOpen} compact={isMobile || isReducedMotion} />
        {canRenderCanvas && !sceneFailed ? (
          <FluidSceneBoundary isOpen={isHeroOpen} onSceneError={() => setSceneFailed(true)}>
            <FluidHeroScene
              isOpen={isHeroOpen}
              reducedMotion={isReducedMotion}
              onSceneError={() => setSceneFailed(true)}
            />
          </FluidSceneBoundary>
        ) : null}
      </div>

      <button
        type="button"
        className="fluid-core-toggle"
        aria-expanded={isHeroOpen}
        aria-controls="fluid-hero-details"
        aria-label={isHeroOpen ? '收起中心流体实验室' : '展开中心流体实验室'}
        onClick={toggleHero}
      />

      <div className="fluid-center-overlay">
        <div
          ref={titleStackRef}
          className={`fluid-title-stack ${isBallFlying ? 'is-ball-flying' : ''}`}
        >
          <span className="hero-bounce-orb" aria-hidden="true" style={ballFlightStyle}>
            <span className="hero-bounce-ball" />
            <span className="hero-bounce-shadow" />
          </span>
          <button
            type="button"
            className="fluid-center-button"
            aria-expanded={isHeroOpen}
            aria-controls="fluid-hero-details"
            aria-label={isHeroOpen ? '收起 AI 工具星图' : '展开 AI 工具星图'}
            onClick={toggleHero}
          >
            <h1
              className={`fluid-main-title ${isTitleAnimating ? 'is-playing' : ''}`}
              aria-label={heroTitle}
              onClick={handleTitleClick}
            >
              <span className="sr-only">AI效率工具库｜全球AI工具教程、评测与工作流</span>
              {titleLetters.map((char, index) => {
                if (char === ' ') {
                  return (
                    <span className="title-space" aria-hidden="true" key={`title-space-${index}`}>
                      {' '}
                    </span>
                  );
                }

                const beatIndex = getTitleBeatIndex(index);

                return (
                  <span
                    className={`title-letter ${beatIndex === titleBeatCount - 1 ? 'title-letter-final' : ''}`}
                    ref={beatIndex === titleBeatCount - 1 ? finalTitleLetterRef : undefined}
                    style={{ '--beat-index': beatIndex }}
                    aria-hidden="true"
                    key={`title-letter-${index}`}
                  >
                    {char}
                  </span>
                );
              })}
            </h1>
          </button>

          <div className="hero-tool-row" aria-label="AI 工具图标">
            {heroTools.map((tool) => (
              <button
                key={tool.name}
                type="button"
                className={`hero-tool-button ${activeTool === tool.slug ? 'is-active' : ''}`}
                aria-label={tool.name}
                title={tool.name}
                onClick={(event) => handleToolIconClick(event, tool.slug)}
              >
                <Image src={tool.iconSrc} alt="" width={44} height={44} unoptimized />
                <span className="tool-icon-tooltip">{tool.name}</span>
              </button>
            ))}
          </div>

          <h2
            ref={heroSubtitleRef}
            className={`fluid-center-subtitle hero-title-cn subtitle-title ${isSubtitlePlaying ? 'is-playing' : ''}`}
            aria-label={heroSubtitle}
          >
            <span className="subtitle-part subtitle-part-first" style={{ '--beat-index': 5 }} aria-hidden="true">
              全
            </span>
            <span className="subtitle-part" style={{ '--beat-index': 4 }} aria-hidden="true">
              球
            </span>
            <span className="hero-title-logo subtitle-part" style={{ '--beat-index': 3 }} aria-hidden="true">
              <BrandMark className="hero-title-logo-mark" ariaHidden />
            </span>
            <span className="subtitle-part" style={{ '--beat-index': 2 }} aria-hidden="true">
              实
            </span>
            <span className="subtitle-part" style={{ '--beat-index': 1 }} aria-hidden="true">
              验
            </span>
            <span
              ref={subtitleRoomRef}
              className="subtitle-part"
              style={{ '--beat-index': 0 }}
              aria-hidden="true"
            >
              室
            </span>
          </h2>
        </div>
      </div>

      <div
        id="fluid-hero-details"
        className="fluid-hidden-panel"
        aria-hidden={false}
        onClick={handlePanelClick}
      >
        <p>{hero.subtitle}</p>
        <div className="hero-search fluid-inline-search">
          <label className="sr-only" htmlFor="home-ai-search">搜索全球 AI 工具</label>
          <input
            id="home-ai-search"
            type="search"
            placeholder={hero.searchPlaceholder}
            className="fluid-inline-input"
          />
          <Link href="/global-ai-tools" className="fluid-inline-action magnetic-button">
            <span>进入工具库</span>
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>

      <div className="fluid-scroll-hint" aria-hidden="true">Scroll to explore</div>
    </section>
  );
}
