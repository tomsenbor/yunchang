'use client';

import { useCallback, useState } from 'react';
import type { CSSProperties, PointerEvent } from 'react';

const nodes = [
  { label: 'ChatGPT', code: 'C', x: 20, y: 24, tone: 'cyan', depth: 1.1, delay: '0ms' },
  { label: 'Claude', code: 'CL', x: 48, y: 14, tone: 'slate', depth: 0.8, delay: '650ms' },
  { label: 'Gemini', code: 'G', x: 77, y: 27, tone: 'cyan', depth: 1, delay: '300ms' },
  { label: 'DeepSeek', code: 'DS', x: 18, y: 57, tone: 'orange', depth: 1.25, delay: '900ms' },
  { label: 'Midjourney', code: 'MJ', x: 78, y: 58, tone: 'slate', depth: 0.9, delay: '1100ms' },
  { label: 'Runway', code: 'RW', x: 61, y: 82, tone: 'orange', depth: 1.05, delay: '450ms' },
  { label: 'Kimi', code: 'K', x: 35, y: 82, tone: 'cyan', depth: 0.85, delay: '1200ms' },
  { label: 'Perplexity', code: 'PX', x: 50, y: 64, tone: 'slate', depth: 0.65, delay: '750ms' }
];

export function HeroIllustration() {
  const [pointer, setPointer] = useState({ x: 0, y: 0 });

  const handlePointerMove = useCallback((event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse') return;

    const rect = event.currentTarget.getBoundingClientRect();
    setPointer({
      x: (event.clientX - rect.left) / rect.width - 0.5,
      y: (event.clientY - rect.top) / rect.height - 0.5
    });
  }, []);

  const resetPointer = useCallback(() => setPointer({ x: 0, y: 0 }), []);

  return (
    <div
      className="hero-illustration gradient-border soft-glow"
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPointer}
    >
      <div className="hero-illustration-grid" />
      <div className="hero-illustration-glow hero-illustration-glow-cyan" />
      <div className="hero-illustration-glow hero-illustration-glow-orange" />

      <svg className="hero-star-lines" viewBox="0 0 100 100" aria-hidden="true">
        {nodes.map((node) => (
          <line key={`${node.label}-line`} x1="50" y1="50" x2={node.x} y2={node.y} className="hero-star-line" />
        ))}
        {nodes.map((node) => (
          <line key={`${node.label}-flow`} x1="50" y1="50" x2={node.x} y2={node.y} className="hero-star-line hero-star-line-flow" />
        ))}
      </svg>

      <div className="hero-core-anchor">
        <div className="hero-core">
          <span>AI Core</span>
          <strong>Global AI Map</strong>
        </div>
      </div>

      {nodes.map((node) => {
        const style = {
          left: `${node.x}%`,
          top: `${node.y}%`,
          '--node-delay': node.delay,
          '--node-x': `${pointer.x * node.depth * 12}px`,
          '--node-y': `${pointer.y * node.depth * 10}px`
        } as CSSProperties;

        return (
          <div key={node.label} className="hero-node-anchor" style={style}>
            <div className="hero-tool-node">
              <div className={`hero-node-card hero-node-card-${node.tone}`}>
                <span>{node.code}</span>
                <strong>{node.label}</strong>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
