'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import styles from '../app/ai-tools/ai-tools.module.css';

const taskOptions = [
  { id: 'writing', label: '写作', keywords: ['写作', '文案', '润色', '内容', '文章', '总结'] },
  { id: 'image', label: '图片', categories: ['image-ai'], keywords: ['图片', '图像', '设计', '视觉', '海报', '素材'] },
  { id: 'video', label: '视频', categories: ['video-ai'], keywords: ['视频', '短视频', '字幕', '数字人'] },
  { id: 'coding', label: '编程', categories: ['coding-ai'], keywords: ['编程', '代码', '开发', '调试', 'IDE'] },
  { id: 'office', label: '办公', keywords: ['办公', '会议', '文档', '表格', 'PPT', '演示', '知识库'] },
  { id: 'music', label: '音乐', keywords: ['音乐', '音频', '语音', '配音', '声音', '歌曲'] },
  { id: 'learning', label: '学习', keywords: ['学习', '研究', '搜索', '问答', '资料', '总结'] }
];

const normalize = (value) => String(value || '').trim().toLocaleLowerCase('zh-CN');

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

function matchesTask(tool, taskId) {
  if (taskId === 'all') return true;

  const task = taskOptions.find((option) => option.id === taskId);
  if (!task) return true;

  if (task.categories?.some((category) => tool.categorySlugs.includes(category))) return true;

  const searchText = getSearchText(tool);
  return task.keywords.some((keyword) => searchText.includes(normalize(keyword)));
}

function matchesPricing(tool, pricingFilter) {
  if (pricingFilter === 'all') return true;

  const pricing = normalize(tool.pricing);
  if (pricingFilter === 'free') return pricing.includes('免费');
  if (pricingFilter === 'paid') return pricing.includes('付费');
  return true;
}

export default function ToolExplorer({ tools, categories }) {
  const [query, setQuery] = useState('');
  const [task, setTask] = useState('all');
  const [category, setCategory] = useState('all');
  const [pricing, setPricing] = useState('all');
  const [platform, setPlatform] = useState('all');
  const [sort, setSort] = useState('popular');

  const platformOptions = useMemo(
    () =>
      [...new Set(tools.flatMap((tool) => tool.platforms))]
        .filter((item) => item && item !== '以官方实际页面为准')
        .sort((left, right) => left.localeCompare(right, 'zh-CN')),
    [tools]
  );

  const visibleTools = useMemo(() => {
    const normalizedQuery = normalize(query);

    return tools
      .filter((tool) => !normalizedQuery || getSearchText(tool).includes(normalizedQuery))
      .filter((tool) => category === 'all' || tool.categorySlugs.includes(category))
      .filter((tool) => matchesTask(tool, task))
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

  const hasActiveFilters =
    query || task !== 'all' || category !== 'all' || pricing !== 'all' || platform !== 'all';

  function resetFilters() {
    setQuery('');
    setTask('all');
    setCategory('all');
    setPricing('all');
    setPlatform('all');
    setSort('popular');
  }

  return (
    <div className={styles.explorerContent}>
      <section className={styles.searchPanel} aria-labelledby="tool-search-title">
        <div className={styles.sectionHeading}>
          <div>
            <p className={styles.sectionKicker}>SEARCH &amp; DISCOVER</p>
            <h2 id="tool-search-title">搜索与筛选</h2>
          </div>
          <p>按名称、分类、能力标签或实际使用场景快速定位工具。</p>
        </div>

        <label className={styles.searchField}>
          <span className={styles.visuallyHidden}>搜索 AI 工具</span>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="m21 21-4.35-4.35m2.35-5.15a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="搜索工具名称、分类、标签或使用场景"
          />
          {query ? (
            <button type="button" onClick={() => setQuery('')} aria-label="清空搜索">
              清除
            </button>
          ) : null}
        </label>

        <div className={styles.taskFinder}>
          <div className={styles.filterLabel}>按任务找工具</div>
          <div className={styles.taskList} aria-label="按任务筛选">
            {taskOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                className={task === option.id ? styles.taskActive : ''}
                aria-pressed={task === option.id}
                onClick={() => setTask((current) => (current === option.id ? 'all' : option.id))}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.categorySection} aria-labelledby="tool-category-title">
        <div className={styles.sectionHeading}>
          <div>
            <p className={styles.sectionKicker}>BROWSE BY CATEGORY</p>
            <h2 id="tool-category-title">工具分类</h2>
          </div>
          <p>从主要能力方向进入，查看同类工具和代表产品。</p>
        </div>

        <div className={styles.categoryGrid}>
          {categories.map((item) => (
            <article
              key={item.slug}
              className={`${styles.categoryCard} ${category === item.slug ? styles.categoryCardActive : ''}`}
            >
              <div className={styles.categoryTopline}>
                <h3>{item.name}</h3>
                <span>{item.count} 款</span>
              </div>
              <p>{item.description}</p>
              <div className={styles.representatives}>
                <span>代表工具</span>
                <strong>{item.representatives.join(' · ')}</strong>
              </div>
              <div className={styles.categoryActions}>
                <button
                  type="button"
                  aria-pressed={category === item.slug}
                  onClick={() => setCategory((current) => (current === item.slug ? 'all' : item.slug))}
                >
                  {category === item.slug ? '取消筛选' : '筛选工具'}
                </button>
                <Link href={`/ai-tools/category/${item.slug}`}>进入分类 <span aria-hidden="true">→</span></Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.toolsSection} aria-labelledby="all-tools-title">
        <div className={styles.toolsHeader}>
          <div>
            <p className={styles.sectionKicker}>ALL TOOLS</p>
            <h2 id="all-tools-title">全部 AI 工具</h2>
            <p className={styles.resultCount}>找到 {visibleTools.length} 款工具</p>
          </div>

          <div className={styles.sortControl} aria-label="工具排序方式">
            <span>排序</span>
            <button
              type="button"
              className={sort === 'popular' ? styles.sortActive : ''}
              aria-pressed={sort === 'popular'}
              onClick={() => setSort('popular')}
            >
              热门
            </button>
            <button
              type="button"
              className={sort === 'latest' ? styles.sortActive : ''}
              aria-pressed={sort === 'latest'}
              onClick={() => setSort('latest')}
            >
              最新
            </button>
          </div>
        </div>

        <div className={styles.filterBar}>
          <label>
            <span>定价</span>
            <select value={pricing} onChange={(event) => setPricing(event.target.value)}>
              <option value="all">全部</option>
              <option value="free">免费</option>
              <option value="paid">付费</option>
            </select>
          </label>

          <label>
            <span>平台</span>
            <select value={platform} onChange={(event) => setPlatform(event.target.value)}>
              <option value="all">全部平台</option>
              {platformOptions.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </label>

          <label>
            <span>分类</span>
            <select value={category} onChange={(event) => setCategory(event.target.value)}>
              <option value="all">全部分类</option>
              {categories.map((item) => (
                <option key={item.slug} value={item.slug}>{item.name}</option>
              ))}
            </select>
          </label>

          {hasActiveFilters ? (
            <button className={styles.resetButton} type="button" onClick={resetFilters}>
              重置筛选
            </button>
          ) : null}
        </div>

        {visibleTools.length ? (
          <div className={styles.toolGrid}>
            {visibleTools.map((tool) => (
              <article key={tool.slug} className={styles.toolCard}>
                <div className={styles.toolCardTop}>
                  <div className={styles.toolIdentity}>
                    <span className={styles.toolIcon}>
                      {tool.logoType === 'image' ? (
                        <img src={tool.logoValue} alt="" width="48" height="48" loading="lazy" />
                      ) : (
                        <span className={styles.toolTextLogo} aria-hidden="true">
                          {tool.logoValue}
                        </span>
                      )}
                    </span>
                    <div>
                      <h3>{tool.name}</h3>
                      <span>{tool.categoryName}</span>
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

                <div className={styles.toolFooter}>
                  <span>{tool.platforms.slice(0, 3).join(' · ') || '平台以官方页面为准'}</span>
                  <Link href={`/ai-tools/${tool.slug}`} aria-label={`查看 ${tool.name} 详情`}>
                    查看详情 <span aria-hidden="true">↗</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <h3>暂未找到匹配工具</h3>
            <p>尝试缩短关键词或清除部分筛选条件。</p>
            <button type="button" onClick={resetFilters}>查看全部工具</button>
          </div>
        )}
      </section>
    </div>
  );
}
