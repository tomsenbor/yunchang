'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import ModelDatabase from './ModelDatabase';
import ModelComparison from './ModelComparison';
import ModelLogo from './ModelLogo';
import styles from '../app/ai-models/ai-models.module.css';
import {
  filterModels,
  getTaskSummaries,
  getVendorSummaries,
  searchModels,
  sortModels,
  toggleComparisonSlug
} from '../lib/model-explorer.mjs';

const popularSearches = ['GPT', 'Claude', 'Gemini', 'DeepSeek', 'Qwen', 'Llama'];
const quickTasks = ['推理', '编程', '写作', '中文', '多模态', '长上下文', '低成本'];
const taskIconNames = ['reasoning', 'code', 'writing', 'language', 'multimodal', 'value'];
const initialFilters = {
  taskId: 'all',
  vendorId: 'all',
  family: 'all',
  type: 'all',
  modality: 'all',
  apiAvailability: 'all',
  weightAvailability: 'all',
  lifecycleStatus: 'current',
  contextBucket: 'all',
  priceBucket: 'all',
  releaseBucket: 'all',
  verificationStatus: 'all'
};

function TaskIcon({ name }) {
  const iconProps = {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '1.7',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': 'true'
  };
  const paths = {
    reasoning: <><path d="M9 4.5a4 4 0 0 0-4 4v1.2a4.5 4.5 0 0 0 1.8 3.6V17h4v-3.4" /><path d="M15 4.5a4 4 0 0 1 4 4v1.2a4.5 4.5 0 0 1-1.8 3.6V17h-4v-3.4M8 20h8" /></>,
    code: <><path d="m8 7-5 5 5 5M16 7l5 5-5 5M14 4l-4 16" /></>,
    writing: <><path d="M4 19.5h5L20 8.5a2.1 2.1 0 0 0-3-3l-11 11Z" /><path d="m14.5 8 3 3" /></>,
    language: <><path d="M4 5h10M9 3v2M6 9c1.4 2.7 3.4 4.7 6.5 6M13 9c-1 3.7-3.4 6.1-7 7.5M15 19l3-7 3 7M16.2 16h3.6" /></>,
    multimodal: <><rect x="3.5" y="4" width="17" height="16" rx="3" /><circle cx="9" cy="9" r="1.5" /><path d="m5.5 17 4-4 3 3 2.5-2.5 3.5 3.5" /></>,
    value: <><path d="M12 3v18M16.5 7.2A4.5 4.5 0 0 0 12 5c-2.5 0-4.5 1.4-4.5 3.2s2 3.1 4.5 3.8 4.5 2 4.5 3.8S14.5 19 12 19a5.5 5.5 0 0 1-5-2.5" /></>
  };

  return <svg {...iconProps}>{paths[name]}</svg>;
}

export default function ModelExplorer({ models, catalogModels = models, vendors, tasks, faqs, selectionSteps, stats, dataStats }) {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState(initialFilters);
  const [sortKey, setSortKey] = useState('recommended');
  const [comparisonSlugs, setComparisonSlugs] = useState([]);
  const [openFaqIndex, setOpenFaqIndex] = useState(0);
  const vendorSummaries = useMemo(
    () => getVendorSummaries(models, vendors),
    [models, vendors]
  );
  const taskSummaries = useMemo(
    () => getTaskSummaries(models, tasks),
    [models, tasks]
  );
  const visibleModels = useMemo(
    () => sortModels(filterModels(searchModels(catalogModels, query, { vendors, tasks }), filters), sortKey),
    [catalogModels, filters, query, sortKey, tasks, vendors]
  );

  const taskId = filters.taskId;
  const vendorId = filters.vendorId;

  function setTaskId(valueOrUpdater) {
    setFilters((current) => ({
      ...current,
      taskId: typeof valueOrUpdater === 'function' ? valueOrUpdater(current.taskId) : valueOrUpdater
    }));
  }

  function setVendorId(valueOrUpdater) {
    setFilters((current) => ({
      ...current,
      vendorId: typeof valueOrUpdater === 'function' ? valueOrUpdater(current.vendorId) : valueOrUpdater
    }));
  }

  function scrollToDatabase() {
    const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
    window.requestAnimationFrame(() => {
      document.getElementById('model-database-title')?.scrollIntoView({ behavior, block: 'start' });
    });
  }

  function submitSearch(event) {
    event.preventDefault();
    scrollToDatabase();
  }

  function applyTaskFilter(nextTaskId) {
    setTaskId((current) => current === nextTaskId ? 'all' : nextTaskId);
    scrollToDatabase();
  }

  function applyVendorFilter(nextVendorId) {
    setVendorId((current) => current === nextVendorId ? 'all' : nextVendorId);
    scrollToDatabase();
  }

  function toggleComparison(modelSlug) {
    setComparisonSlugs((current) => toggleComparisonSlug(current, modelSlug));
  }

  function updateFilter(key, value) {
    setFilters((current) => ({ ...current, [key]: value }));
  }

  function clearAllFilters() {
    setQuery('');
    setFilters(initialFilters);
    setSortKey('recommended');
  }

  function scrollQuickTasks(event) {
    const direction = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
    if (!direction) return;

    event.preventDefault();
    const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
    event.currentTarget.scrollBy({
      left: direction * Math.max(120, event.currentTarget.clientWidth * 0.65),
      behavior
    });
  }

  return (
    <div className={`${styles.explorerShell} ${comparisonSlugs.length ? styles.explorerShellCompared : ''}`}>
      <section className={styles.hero} aria-labelledby="ai-models-title">
        <div className={styles.heroTrack} aria-hidden="true">
          <span className={styles.trackNodeOne} />
          <span className={styles.trackNodeTwo} />
          <span className={styles.trackNodeThree} />
        </div>
        <div className={styles.heroInner}>
          <p className={styles.heroEyebrow}>全球 AI 模型库</p>
          <h1 id="ai-models-title">
            <span>找到适合你的</span>
            <span className={styles.heroTitleLine}> AI 模型</span>
          </h1>
          <p className={styles.heroDescription}>
            按模型家族、能力、上下文、价格和开放方式，快速比较主流 AI 模型。
          </p>

          <form className={styles.heroSearch} onSubmit={submitSearch} role="search">
            <label htmlFor="model-hero-search">搜索模型</label>
            <input
              id="model-hero-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="搜索模型、厂商、能力或使用场景"
            />
            <button type="submit" aria-label="查看模型搜索结果">→</button>
          </form>

          <div className={styles.popularSearches} aria-label="热门搜索">
            <span>热门搜索</span>
            {popularSearches.map((item) => (
              <button key={item} type="button" onClick={() => setQuery(item)}>{item}</button>
            ))}
          </div>

          <div className={styles.quickTasksViewport}>
            <div className={styles.quickTasks} role="region" aria-label="快速任务" tabIndex={0} onKeyDown={scrollQuickTasks}>
              {quickTasks.map((item) => <span key={item}>{item}</span>)}
            </div>
          </div>

          <dl className={styles.heroStats}>
            <div><dt>{stats.modelCount}</dt><dd>核心模型</dd></div>
            <div><dt>{stats.vendorCount}</dt><dd>模型厂商</dd></div>
            <div><dt>{stats.familyCount}</dt><dd>模型家族</dd></div>
            <div><dt>{taskSummaries.length}</dt><dd>任务维度</dd></div>
          </dl>
          <p className={styles.dynamicNote}>模型信息持续核查更新</p>
        </div>
      </section>

      <div className={styles.lightCanvas}>
        <div className={styles.contentShell}>
          <section id="model-vendors" className={styles.section} aria-labelledby="model-vendors-title">
            <header className={styles.sectionHeader}>
              <div><p>MODEL MAKERS</p><h2 id="model-vendors-title">按模型厂商探索</h2></div>
              <a href="#model-vendors">查看全部厂商</a>
            </header>
            <p className={styles.sectionLead}>从主流模型厂商入手，了解模型路线、代表版本与适用方向。</p>
            <div className={styles.vendorGrid}>
              {vendorSummaries.map((vendor) => (
                <article className={styles.vendorCard} key={vendor.id}>
                  <div className={styles.vendorCardTop}>
                    <ModelLogo vendor={vendor} frameSize={46} imageSize={30} className={styles.vendorLogo} decorative />
                    <span className={styles.vendorCount}>{vendor.modelCount} 个模型</span>
                  </div>
                  <h3>{vendor.name}</h3>
                  <p className={styles.vendorFamilies}>{vendor.families.join(' · ')}</p>
                  <p className={styles.vendorPositioning}>{vendor.positioning}</p>
                  <div className={styles.representativeModels} aria-label={`${vendor.name} 代表模型`}>
                    {vendor.representativeModels.length
                      ? vendor.representativeModels.map((modelName) => <span key={modelName}>{modelName}</span>)
                      : <span>当前候选待完成官方 ID 复核</span>}
                  </div>
                  <button
                    type="button"
                    aria-pressed={vendorId === vendor.id}
                    onClick={() => applyVendorFilter(vendor.id)}
                  >
                    {vendorId === vendor.id ? '取消筛选' : '查看模型'} <span aria-hidden="true">→</span>
                  </button>
                </article>
              ))}
            </div>
          </section>

          <section className={styles.section} aria-labelledby="model-tasks-title">
            <header className={styles.sectionHeader}>
              <div><p>FIND BY TASK</p><h2 id="model-tasks-title">按任务快速选模型</h2></div>
            </header>
            <p className={styles.sectionLead}>先确定实际需求，再查看更适合的模型候选。</p>
            <div className={styles.taskGrid}>
              {taskSummaries.map((task, index) => (
                <article className={`${styles.taskCard} ${taskId === task.id ? styles.taskCardActive : ''}`} key={task.id}>
                  <div className={styles.taskCardTop}>
                    <span className={styles.taskIcon}><TaskIcon name={taskIconNames[index]} /></span>
                    <span>{task.modelCount} 个模型</span>
                  </div>
                  <h3>{task.name}</h3>
                  <p>{task.description}</p>
                  <div className={styles.taskModels}>
                    {task.representativeModels.map((modelName) => <span key={modelName}>{modelName}</span>)}
                  </div>
                  <button
                    type="button"
                    aria-pressed={taskId === task.id}
                    onClick={() => applyTaskFilter(task.id)}
                  >
                    {taskId === task.id ? '取消筛选' : '查看相关模型'} <span aria-hidden="true">→</span>
                  </button>
                </article>
              ))}
            </div>
            <p className={styles.recommendationNote}>
              推荐结果基于本站设定的使用场景、公开资料和核查日期，仅作为选型参考，不代表官方排名或所有场景下的性能结论。
            </p>
          </section>

          <section className={styles.databaseSkeleton} aria-labelledby="model-database-title">
            <header className={styles.sectionHeader}>
              <div><p>MODEL DATABASE</p><h2 id="model-database-title">完整模型数据库</h2></div>
            </header>
            <p className={styles.sectionLead}>按厂商、家族、任务、开放方式和核查状态探索模型。</p>
            <p className={styles.resultSummary}>
              {query ? `“${query}”找到 ${visibleModels.length} 个模型` : `当前收录 ${visibleModels.length} 个模型`}
            </p>
            <ModelDatabase
              models={visibleModels}
              allModels={catalogModels}
              vendors={vendors}
              tasks={tasks}
              query={query}
              filters={filters}
              sortKey={sortKey}
              onQueryChange={setQuery}
              onFilterChange={updateFilter}
              onSortChange={setSortKey}
              onClearAll={clearAllFilters}
              comparisonSlugs={comparisonSlugs}
              onToggleComparison={toggleComparison}
            />
          </section>

          <section className={styles.section} aria-labelledby="model-guide-title">
            <header className={styles.sectionHeader}><div><p>SELECTION GUIDE</p><h2 id="model-guide-title">如何选择 AI 模型</h2></div></header>
            <p className={styles.sectionLead}>从真实任务、输入规模、访问方式和使用成本出发，逐步缩小候选范围。</p>
            <ol className={styles.selectionGuide}>
              {selectionSteps.map(([title, description], index) => (
                <li key={title}><span>{String(index + 1).padStart(2, '0')}</span><div><h3>{title}</h3><p>{description}</p></div></li>
              ))}
            </ol>
          </section>

          <section className={styles.section} aria-labelledby="model-difference-title">
            <header className={styles.sectionHeader}><div><p>MODEL OR TOOL</p><h2 id="model-difference-title">AI 模型和 AI 工具有何不同？</h2></div></header>
            <div className={styles.differenceGrid}>
              <article><p>AI MODEL</p><h3>AI 模型</h3><strong>底层能力系统</strong><span>提供语言、推理、视觉或生成等基础能力。</span><div>GPT · Claude · Gemini · DeepSeek · Qwen · Llama</div></article>
              <div className={styles.differenceVs} aria-hidden="true">VS</div>
              <article><p>AI PRODUCT</p><h3>AI 工具</h3><strong>基于模型构建的产品或应用</strong><span>通过界面、工作流和服务封装模型能力。</span><div>ChatGPT · Cursor · Notion AI · Midjourney · Runway</div></article>
            </div>
            <Link className={styles.differenceLink} href="/ai-tools">浏览 AI 工具库</Link>
          </section>

          <section className={styles.section} aria-labelledby="model-faq-title">
            <header className={styles.sectionHeader}><div><p>FAQ</p><h2 id="model-faq-title">AI 模型常见问题</h2></div></header>
            <div className={styles.faqList}>
              {faqs.map((faq, index) => (
                <article key={faq.question}>
                  <button type="button" aria-expanded={openFaqIndex === index} aria-controls={`model-faq-answer-${index}`} onClick={() => setOpenFaqIndex(index)}>
                    <span>{faq.question}</span><span aria-hidden="true">{openFaqIndex === index ? '−' : '+'}</span>
                  </button>
                  <div id={`model-faq-answer-${index}`} hidden={openFaqIndex !== index}><p>{faq.answer}</p></div>
                </article>
              ))}
            </div>
          </section>

          <section className={styles.section} aria-labelledby="model-methodology-title">
            <header className={styles.sectionHeader}><div><p>TRUST &amp; SOURCES</p><h2 id="model-methodology-title">数据来源与评测方法</h2></div></header>
            <div className={styles.methodologyLayout}>
              <div>
                <p className={styles.sectionLead}>本站模型信息优先参考可追溯的一手资料，并保留每个字段的核查边界。</p>
                <ul><li>官方模型文档</li><li>官方 API 与价格页面</li><li>官方发布公告</li><li>官方技术报告</li><li>可追溯的公开基准测试</li><li>最后核查日期</li></ul>
                <p className={styles.methodologyRule}>无法确认的信息统一标记为“未公开”“待核对”或“以官方最新文档为准”。</p>
                <Link className={styles.textLink} href="/methodology#ai-models">查看完整评测方法</Link>
              </div>
              <dl className={styles.methodologyStats}>
                <div><dt>{dataStats.updatedAt}</dt><dd>数据更新时间</dd></div>
                <div><dt>{dataStats.verifiedModelCount}</dt><dd>最近核查模型</dd></div>
                <div><dt>{dataStats.staleFieldCount}</dt><dd>过期数据</dd></div>
                <div><dt>{dataStats.pendingReviewFieldCount}</dt><dd>待复核字段</dd></div>
              </dl>
            </div>
          </section>
        </div>
      </div>

      <section className={styles.finalCta} aria-labelledby="model-cta-title">
        <div aria-hidden="true" className={styles.ctaTrack} />
        <div>
          <p>MODEL DECISION CENTER</p>
          <h2 id="model-cta-title">开始比较适合你的 AI 模型</h2>
          <span>从任务、参数和使用成本出发，找到更适合你的模型选择。</span>
          <div className={styles.ctaActions}>
            <a href="#model-database-title">浏览全部模型</a>
            <button type="button" onClick={scrollToDatabase}>开始模型对比</button>
          </div>
        </div>
      </section>
      <ModelComparison
        selectedModels={comparisonSlugs.map((slug) => catalogModels.find((model) => model.slug === slug)).filter(Boolean)}
        onRemove={toggleComparison}
        onClear={() => setComparisonSlugs([])}
        onAddModel={scrollToDatabase}
      />
    </div>
  );
}
