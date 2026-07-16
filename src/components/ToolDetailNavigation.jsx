'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

export default function ToolDetailNavigation({
  tocItems,
  relatedTools = [],
  toolName
}) {
  const [activeId, setActiveId] = useState(tocItems?.[0]?.[0] || '');
  const [query, setQuery] = useState('');

  useEffect(() => {
    const ids = tocItems.map(([id]) => id);
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (sections.length === 0) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target?.id) {
          setActiveId(visible.target.id);
        }
      },
      {
        rootMargin: '-22% 0px -62% 0px',
        threshold: [0.08, 0.18, 0.32]
      }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [tocItems]);

  const filteredTools = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) return relatedTools;
    return relatedTools.filter((tool) =>
      `${tool.name} ${tool.summary || ''}`.toLowerCase().includes(keyword)
    );
  }, [query, relatedTools]);

  return (
    <>
      <aside className="tool-doc-sidebar ai-tool-doc-left" aria-label={`${toolName} 文档导航`}>
        <label className="tool-doc-search">
          <span>搜索</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="搜索章节或工具..."
          />
        </label>

        {relatedTools.length > 0 ? (
          <div className="tool-doc-nav-group">
            <p>相关工具</p>
            <div className="tool-doc-related-list">
              {filteredTools.slice(0, 4).map((tool) => (
                <Link key={tool.slug} href={`/ai-tools/${tool.slug}`}>
                  <strong>{tool.name}</strong>
                  <span>{tool.summary}</span>
                </Link>
              ))}
            </div>
          </div>
        ) : null}
      </aside>

      <aside className="tool-doc-toc doc-toc ai-tool-doc-right ai-tool-doc-toc" aria-label="本页目录">
        <p>目录</p>
        <nav>
          {tocItems.map(([id, label]) => (
            <a
              key={id}
              href={`#${id}`}
              className={activeId === id ? 'is-active' : undefined}
            >
              {label}
            </a>
          ))}
        </nav>
      </aside>
    </>
  );
}
