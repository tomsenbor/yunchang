'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import styles from '../app/ai-tools/ai-tools.module.css';
import { matchesExplorerTask } from '../lib/tool-explorer.mjs';

const normalize = (value) => String(value || '').trim().toLocaleLowerCase('zh-CN');
const featuredTabs = [
  ['all', '全部'],
  ['chatbot', 'AI助手'],
  ['image-ai', 'AI图片'],
  ['video-ai', 'AI视频'],
  ['coding-ai', 'AI编程']
];
const popularSearches = [
  ['ChatGPT', 'ChatGPT'],
  ['Cursor', 'Cursor'],
  ['Midjourney', 'Midjourney'],
  ['AI写作', '写作'],
  ['AI视频', '视频']
];
function getSearchText(tool) {
  return normalize(
    [
      tool.name,
      tool.summary,
      tool.categoryName,
      ...(tool.categoryNames || []),
      ...tool.capabilities,
      ...tool.useCases,
      ...tool.platforms
    ].join(' ')
  );
}

function matchesPricing(tool, pricingFilter) {
  if (pricingFilter === 'all') return true;
  const pricing = normalize(tool.pricing);
  const isFree = pricing.includes('免费') || pricing.includes('free');
  return pricingFilter === 'free' ? isFree : !isFree;
}

function ToolLogo({ tool, compact = false }) {
  return (
    <span className={`${styles.toolIcon} ${compact ? styles.toolIconCompact : ''}`} aria-hidden="true">
      {tool.logoType === 'image' ? (
        <img src={tool.logoValue} alt="" width={compact ? 30 : 38} height={compact ? 30 : 38} />
      ) : (
        <span className={styles.toolTextLogo}>{tool.logoValue}</span>
      )}
    </span>
  );
}

const categoryGlyphPaths = {
  chatbot: 'M7.5 6.5h9a3.5 3.5 0 0 1 3.5 3.5v3a3.5 3.5 0 0 1-3.5 3.5h-4.2L8 20v-3.5h-.5A3.5 3.5 0 0 1 4 13v-3a3.5 3.5 0 0 1 3.5-3.5Z M9 11.5h6',
  'image-ai': 'M5 6.5A2.5 2.5 0 0 1 7.5 4h9A2.5 2.5 0 0 1 19 6.5v11a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 5 17.5v-11Z M7.5 17l3.2-3.8 2.3 2.4 1.7-1.8 2.8 3.2 M15.8 8.2h.01',
  'video-ai': 'M5 7.5A2.5 2.5 0 0 1 7.5 5h7A2.5 2.5 0 0 1 17 7.5v9a2.5 2.5 0 0 1-2.5 2.5h-7A2.5 2.5 0 0 1 5 16.5v-9Z M17 10l3-2v8l-3-2 M9.5 9.2l4.5 2.8-4.5 2.8V9.2Z',
  'coding-ai': 'm9 8-4 4 4 4 M15 8l4 4-4 4 M13.5 5l-3 14'
};

function CategoryGlyph({ slug, index }) {
  return (
    <span className={`${styles.categoryIcon} ${styles[`categoryIcon${index + 1}`]}`} aria-hidden="true">
      <svg viewBox="0 0 24 24" focusable="false">
        <path d={categoryGlyphPaths[slug]} />
      </svg>
    </span>
  );
}

function TaskGlyph({ index }) {
  const glyphs = ['✦', '◫', '▶', '</>', '⌘', '♫', '◎'];
  return <span className={`${styles.taskGlyph} ${styles[`taskGlyph${index + 1}`]}`}>{glyphs[index]}</span>;
}

function ToolCard({ tool, comparisonSlugs, onToggleComparison }) {
  const isCompared = comparisonSlugs.includes(tool.slug);
  const comparisonLimitReached = comparisonSlugs.length >= 2 && !isCompared;

  return (
    <article className={`${styles.toolCard} ${isCompared ? styles.toolCardCompared : ''}`}>
      <div className={styles.toolCardTop}>
        <div className={styles.toolIdentity}>
          <ToolLogo tool={tool} />
          <div>
            <h3>{tool.name}</h3>
            <span>{tool.developer}</span>
          </div>
        </div>
        <span className={styles.pricingBadge}>{tool.pricing}</span>
      </div>

      <p className={styles.toolSummary}>{tool.summary}</p>

      <div className={styles.capabilityList} aria-label={`${tool.name} 能力标签`}>
        {tool.capabilities.slice(0, 3).map((capability) => (
          <span key={capability}>{capability}</span>
        ))}
      </div>

      <dl className={styles.toolMeta}>
        <div>
          <dt>平台</dt>
          <dd>{tool.platforms.slice(0, 2).join(' / ') || '未公开'}</dd>
        </div>
        <div>
          <dt>价格</dt>
          <dd>{tool.pricing}</dd>
        </div>
        <div>
          <dt>更新</dt>
          <dd>{tool.updatedAt}</dd>
        </div>
      </dl>

      <div className={styles.toolActions}>
        <Link className={styles.primaryAction} href={`/ai-tools/${tool.slug}`}>
          查看详情
        </Link>
        <button
          className={styles.secondaryAction}
          type="button"
          aria-pressed={isCompared}
          disabled={comparisonLimitReached}
          onClick={() => onToggleComparison(tool.slug)}
        >
          {isCompared ? '已加入对比' : '加入对比'}
        </button>
      </div>
    </article>
  );
}

function FeaturedToolCard({ tool }) {
  return (
    <Link className={styles.featuredCard} href={`/ai-tools/${tool.slug}`}>
      <div className={styles.featuredCardTop}>
        <ToolLogo tool={tool} />
        <span>{tool.pricing}</span>
      </div>
      <h3>{tool.name}</h3>
      <p className={styles.featuredDeveloper}>{tool.developer}</p>
      <p className={styles.featuredSummary}>{tool.summary}</p>
      <div className={styles.featuredMeta}>
        <span>{tool.categoryName}</span>
        <span>{tool.platforms[0] || '多平台'}</span>
      </div>
    </Link>
  );
}

export default function ToolExplorer({ tools, categories, tasks, featuredTools, stats }) {
  const [query, setQuery] = useState('');
  const [task, setTask] = useState('all');
  const [category, setCategory] = useState('all');
  const [pricing, setPricing] = useState('all');
  const [platform, setPlatform] = useState('all');
  const [sort, setSort] = useState('popular');
  const [featuredCategory, setFeaturedCategory] = useState('all');
  const [comparisonSlugs, setComparisonSlugs] = useState([]);

  const platformOptions = useMemo(
    () => [...new Set(tools.flatMap((tool) => tool.platforms))].sort((a, b) => a.localeCompare(b, 'zh-CN')),
    [tools]
  );

  const introTools = useMemo(
    () => ['chatgpt', 'midjourney', 'cursor'].map((slug) => tools.find((tool) => tool.slug === slug)).filter(Boolean),
    [tools]
  );

  const visibleFeaturedTools = useMemo(
    () => featuredTools.filter(
      (tool) => featuredCategory === 'all' || tool.categorySlugs.includes(featuredCategory)
    ),
    [featuredCategory, featuredTools]
  );

  const visibleTools = useMemo(() => {
    const normalizedQuery = normalize(query);

    return tools
      .filter((tool) => !normalizedQuery || getSearchText(tool).includes(normalizedQuery))
      .filter((tool) => category === 'all' || tool.categorySlugs.includes(category))
      .filter((tool) => matchesExplorerTask(tool, task))
      .filter((tool) => matchesPricing(tool, pricing))
      .filter((tool) => platform === 'all' || tool.platforms.includes(platform))
      .sort((left, right) => {
        if (sort === 'latest') {
          const dateDifference = Date.parse(right.updatedAt || 0) - Date.parse(left.updatedAt || 0);
          if (dateDifference !== 0) return dateDifference;
        }
        const ratingDifference = Number(right.rating || 0) - Number(left.rating || 0);
        if (ratingDifference !== 0) return ratingDifference;
        return left.name.localeCompare(right.name, 'zh-CN');
      });
  }, [category, platform, pricing, query, sort, task, tools]);

  const hasActiveFilters = Boolean(
    query || task !== 'all' || category !== 'all' || pricing !== 'all' || platform !== 'all'
  );

  function scrollToSection(id) {
    window.requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
        block: 'start'
      });
    });
  }

  function applySearch(value) {
    setQuery(value);
    scrollToSection('all-tools-title');
  }

  function applyTask(value) {
    setTask(value);
    scrollToSection('all-tools-title');
  }

  function applyCategory(value) {
    setCategory(value);
    scrollToSection('all-tools-title');
  }

  function resetFilters() {
    setQuery('');
    setTask('all');
    setCategory('all');
    setPricing('all');
    setPlatform('all');
    setSort('popular');
  }

  function toggleComparison(toolSlug) {
    setComparisonSlugs((current) => {
      if (current.includes(toolSlug)) return current.filter((slug) => slug !== toolSlug);
      if (current.length >= 2) return current;
      return [...current, toolSlug];
    });
  }

  return (
    <div className={styles.explorerShell}>
      <section className={styles.immersiveHero} aria-labelledby="ai-tools-title">
        <div className={styles.heroGlow} aria-hidden="true" />
        <div className={styles.heroContent}>
          <div className={styles.heroHeadingGroup}>
            <p className={styles.heroEyebrow}>AI 工具探索中心</p>
            <h1 id="ai-tools-title">探索适合你的 AI 工具</h1>
          </div>

          <div className={styles.heroSearchGroup}>
            <p className={styles.heroDescription}>
              根据任务、平台和价格，从 {stats.tools}+ AI 工具中快速找到合适选择。
            </p>

            <label className={styles.heroSearch}>
              <span className={styles.visuallyHidden}>搜索 AI 工具</span>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="m21 21-4.35-4.35m2.35-5.15a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z" />
              </svg>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(event) => event.key === 'Enter' && scrollToSection('all-tools-title')}
                placeholder="搜索工具名称、分类、标签或使用场景"
                aria-label="搜索工具名称、分类、标签或使用场景"
              />
              {query ? (
                <button type="button" onClick={() => setQuery('')} aria-label="清空搜索">清除</button>
              ) : (
                <button type="button" onClick={() => scrollToSection('all-tools-title')} aria-label="查看搜索结果">
                  <span aria-hidden="true">→</span>
                </button>
              )}
            </label>
          </div>

          <div className={styles.heroMetaGroup}>
            <div className={styles.popularSearches} aria-label="热门搜索">
              <span>热门搜索</span>
              {popularSearches.map(([label, value]) => (
                <button key={label} type="button" onClick={() => applySearch(value)}>{label}</button>
              ))}
            </div>

            <dl className={styles.heroStats} aria-label="工具库数据概览">
              <div><dt>{stats.tools}+</dt><dd>AI工具</dd></div>
              <div><dt>{stats.guides}+</dt><dd>教程</dd></div>
              <div><dt>{stats.resources}+</dt><dd>资源页面</dd></div>
            </dl>
          </div>
        </div>

        <button className={styles.scrollCue} type="button" onClick={() => scrollToSection('platform-intro-title')} aria-label="继续了解工具库">
          <span />
        </button>
      </section>

      <section className={styles.platformIntro} aria-labelledby="platform-intro-title">
        <div className={styles.platformInner}>
          <div className={styles.introDeck} aria-label="代表工具">
            {introTools.map((tool, index) => (
              <div key={tool.slug} className={`${styles.introCard} ${styles[`introCard${index + 1}`]}`}>
                <ToolLogo tool={tool} />
                <span><strong>{tool.name}</strong><small>{tool.categoryName}</small></span>
              </div>
            ))}
          </div>
          <div className={styles.introCopy}>
            <p className={styles.darkKicker}>ONE LIBRARY, MORE POSSIBILITIES</p>
            <h2 id="platform-intro-title">100+ AI 工具，<br />覆盖你的创作与工作流程</h2>
            <ul>
              <li>从写作、图片、视频到编程开发</li>
              <li>根据任务快速找到合适工具</li>
              <li>减少试错和重复订阅成本</li>
            </ul>
            <button type="button" onClick={() => scrollToSection('tool-task-title')}>开始探索 <span aria-hidden="true">→</span></button>
          </div>
        </div>
      </section>

      <div className={styles.lightCanvas}>
        <div className={styles.explorerContent}>
          <section className={styles.taskSection} aria-labelledby="tool-task-title">
            <div className={styles.sectionHeading}>
              <div><p className={styles.sectionKicker}>FIND BY TASK</p><h2 id="tool-task-title">按任务找 AI 工具</h2></div>
              <p>先选择你要完成的事情，再查看适合的工具。</p>
            </div>
            <div className={styles.taskGrid}>
              {tasks.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  className={`${styles.taskCard} ${task === item.id ? styles.taskCardActive : ''}`}
                  aria-pressed={task === item.id}
                  onClick={() => applyTask(task === item.id ? 'all' : item.id)}
                >
                  <TaskGlyph index={index} />
                  <span className={styles.taskCount}>{item.count} 款工具</span>
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                  <span className={styles.taskRepresentatives}>{item.representatives.join(' · ')}</span>
                  <span className={styles.taskArrow} aria-hidden="true">→</span>
                </button>
              ))}
            </div>
          </section>

          <section className={styles.featuredSection} aria-labelledby="featured-tools-title">
            <div className={styles.featuredHeader}>
              <div><p className={styles.sectionKicker}>EDITOR&apos;S PICKS</p><h2 id="featured-tools-title">热门 AI 工具</h2></div>
              <div className={styles.featuredTabs} aria-label="热门工具分类">
                {featuredTabs.map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    className={featuredCategory === value ? styles.featuredTabActive : ''}
                    aria-pressed={featuredCategory === value}
                    onClick={() => setFeaturedCategory(value)}
                  >{label}</button>
                ))}
              </div>
            </div>
            <div className={styles.featuredGrid}>
              {visibleFeaturedTools.map((tool) => <FeaturedToolCard key={tool.slug} tool={tool} />)}
            </div>
          </section>

          <section className={styles.categorySection} aria-labelledby="tool-category-title">
            <div className={styles.sectionHeading}>
              <div><p className={styles.sectionKicker}>BROWSE BY CATEGORY</p><h2 id="tool-category-title">AI 工具分类</h2></div>
              <p>按核心能力进入分类，比较同类工具与代表产品。</p>
            </div>
            <div className={styles.categoryGrid}>
              {categories.map((item, index) => (
                <article key={item.slug} className={`${styles.categoryCard} ${category === item.slug ? styles.categoryCardActive : ''}`}>
                  <CategoryGlyph slug={item.slug} index={index} />
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                  <span className={styles.categoryCount}>{item.count} 款工具</span>
                  <div className={styles.representatives}><small>代表工具</small><strong>{item.representatives.join(' · ')}</strong></div>
                  <div className={styles.categoryActions}>
                    <button type="button" aria-pressed={category === item.slug} onClick={() => applyCategory(category === item.slug ? 'all' : item.slug)}>
                      {category === item.slug ? '取消筛选' : '筛选工具'}
                    </button>
                    <Link href={`/ai-tools/category/${item.slug}`}>进入分类 <span aria-hidden="true">→</span></Link>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className={styles.toolsDatabase} aria-labelledby="all-tools-title">
            <div className={styles.toolsHeader}>
              <div><p className={styles.sectionKicker}>ALL TOOLS</p><h2 id="all-tools-title">全部 AI 工具</h2><p className={styles.resultCount}>实时找到 {visibleTools.length} 款工具</p></div>
              <div className={styles.sortControl} aria-label="工具排序方式">
                <span>排序</span>
                <button type="button" className={sort === 'popular' ? styles.sortActive : ''} aria-pressed={sort === 'popular'} onClick={() => setSort('popular')}>热门</button>
                <button type="button" className={sort === 'latest' ? styles.sortActive : ''} aria-pressed={sort === 'latest'} onClick={() => setSort('latest')}>最新</button>
              </div>
            </div>

            {comparisonSlugs.length ? (
              <div className={styles.comparisonStatus} role="status">
                <span>已加入对比：{comparisonSlugs.map((slug) => tools.find((tool) => tool.slug === slug)?.name).filter(Boolean).join('、')}（{comparisonSlugs.length}/2）</span>
                <button type="button" onClick={() => setComparisonSlugs([])}>清空选择</button>
              </div>
            ) : null}

            <div className={styles.filterBar}>
              <label><span>分类</span><select value={category} onChange={(event) => setCategory(event.target.value)}><option value="all">全部分类</option>{categories.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}</select></label>
              <label><span>定价</span><select value={pricing} onChange={(event) => setPricing(event.target.value)}><option value="all">全部价格</option><option value="free">免费</option><option value="paid">付费</option></select></label>
              <label><span>平台</span><select value={platform} onChange={(event) => setPlatform(event.target.value)}><option value="all">全部平台</option>{platformOptions.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
              {hasActiveFilters ? <button className={styles.resetButton} type="button" onClick={resetFilters}>清除全部</button> : null}
            </div>

            {hasActiveFilters ? (
              <div className={styles.activeFilters} aria-label="已选条件">
                <span>已选条件</span>
                {query ? <button type="button" onClick={() => setQuery('')}>搜索：{query} ×</button> : null}
                {task !== 'all' ? <button type="button" onClick={() => setTask('all')}>任务：{tasks.find((item) => item.id === task)?.name} ×</button> : null}
                {category !== 'all' ? <button type="button" onClick={() => setCategory('all')}>分类：{categories.find((item) => item.slug === category)?.name} ×</button> : null}
                {pricing !== 'all' ? <button type="button" onClick={() => setPricing('all')}>价格：{pricing === 'free' ? '免费' : '付费'} ×</button> : null}
                {platform !== 'all' ? <button type="button" onClick={() => setPlatform('all')}>平台：{platform} ×</button> : null}
              </div>
            ) : null}

            {visibleTools.length ? (
              <div className={styles.toolGrid}>{visibleTools.map((tool) => <ToolCard key={tool.slug} tool={tool} comparisonSlugs={comparisonSlugs} onToggleComparison={toggleComparison} />)}</div>
            ) : (
              <div className={styles.emptyState}><h3>暂未找到匹配工具</h3><p>尝试缩短关键词或清除部分筛选条件。</p><button type="button" onClick={resetFilters}>查看全部工具</button></div>
            )}
          </section>

          <section className={styles.editorialSection} aria-labelledby="selection-guide-title">
            <div className={styles.editorialIntro}>
              <p className={styles.sectionKicker}>MAKE A BETTER CHOICE</p>
              <h2 id="selection-guide-title">少试错，更快找到合适工具</h2>
              <p>从任务、预算、平台与使用频率出发，建立适合自己的 AI 工作流。</p>
              <Link href="/methodology">查看收录与评测方法 <span aria-hidden="true">→</span></Link>
            </div>
            <div className={styles.guideLinks}>
              <Link href="/guides"><span>01</span><strong>AI 工具选择指南</strong><small>从入门教程开始建立使用方法</small></Link>
              <Link href="/compare"><span>02</span><strong>热门工具对比</strong><small>按场景、价格和能力减少试错</small></Link>
              <details><summary><span>03</span><strong>常见问题</strong></summary><p>工具信息会根据官方资料与实际体验持续更新，价格及套餐以官方页面为准。</p></details>
            </div>
          </section>
        </div>
      </div>

      <section className={styles.finalCta} aria-labelledby="ai-tools-cta-title">
        <div className={styles.ctaOrb} aria-hidden="true" />
        <div className={styles.ctaGrid} aria-hidden="true" />
        <div className={styles.ctaContent}>
          <p>BUILD YOUR AI WORKFLOW</p>
          <h2 id="ai-tools-cta-title">开始探索你的 AI 工作流</h2>
          <span>找到适合你的工具，减少试错，更快完成任务。</span>
          <div>
            <a href="#all-tools-title">浏览全部工具</a>
            <Link href="/compare">查看热门对比</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
