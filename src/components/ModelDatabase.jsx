'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import ModelLogo from './ModelLogo';
import { MODEL_UNKNOWN } from '../lib/model-content.mjs';
import {
  formatModelFact,
  formatStandardPrice,
  getLifecycleLabel
} from '../lib/model-explorer.mjs';
import styles from '../app/ai-models/ai-models.module.css';

const coreFilterKeys = ['vendorId', 'family', 'type', 'modality', 'apiAvailability', 'weightAvailability', 'lifecycleStatus'];
const moreFilterKeys = ['lifecycleStatus', 'contextBucket', 'priceBucket', 'releaseBucket', 'verificationStatus'];
const filterLabels = {
  taskId: '任务', vendorId: '厂商', family: '模型家族', type: '模型类型', modality: '支持模态',
  apiAvailability: 'API', weightAvailability: '开放状态', contextBucket: '上下文区间',
  lifecycleStatus: '生命周期', priceBucket: '价格状态', releaseBucket: '发布时间', verificationStatus: '核查状态'
};
const sortOptions = [
  ['recommended', '推荐'], ['latest', '最新发布'], ['verified', '最近核查'], ['context', '上下文长度'], ['price', '价格区间']
];

function uniqueValues(values) {
  return [...new Set(values.filter(Boolean))];
}

function FilterField({ label, name, value, options, onChange }) {
  return (
    <label className={styles.filterField}>
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(name, event.target.value)}>
        <option value="all">全部</option>
        {options.map((option) => {
          const [optionValue, optionLabel = optionValue] = Array.isArray(option) ? option : [option];
          return <option value={optionValue} key={optionValue}>{optionLabel}</option>;
        })}
      </select>
    </label>
  );
}

function FilterFields({ filters, options, onFilterChange, includeMore = false }) {
  return (
    <>
      <FilterField label="厂商" name="vendorId" value={filters.vendorId} options={options.vendors} onChange={onFilterChange} />
      <FilterField label="模型家族" name="family" value={filters.family} options={options.families} onChange={onFilterChange} />
      <FilterField label="模型类型" name="type" value={filters.type} options={options.types} onChange={onFilterChange} />
      <FilterField label="支持模态" name="modality" value={filters.modality} options={options.modalities} onChange={onFilterChange} />
      <FilterField label="API" name="apiAvailability" value={filters.apiAvailability} options={options.api} onChange={onFilterChange} />
      <FilterField label="开放状态" name="weightAvailability" value={filters.weightAvailability} options={options.weights} onChange={onFilterChange} />
      {includeMore ? (
        <>
          <FilterField label="生命周期" name="lifecycleStatus" value={filters.lifecycleStatus} options={options.lifecycle} onChange={onFilterChange} />
          <FilterField label="上下文区间" name="contextBucket" value={filters.contextBucket} options={options.contexts} onChange={onFilterChange} />
          <FilterField label="价格状态" name="priceBucket" value={filters.priceBucket} options={options.prices} onChange={onFilterChange} />
          <FilterField label="发布时间" name="releaseBucket" value={filters.releaseBucket} options={options.releases} onChange={onFilterChange} />
          <FilterField label="核查状态" name="verificationStatus" value={filters.verificationStatus} options={options.verification} onChange={onFilterChange} />
        </>
      ) : null}
    </>
  );
}

function ModelCard({ model, vendor, comparisonSlugs, onToggleComparison }) {
  const isCompared = comparisonSlugs.includes(model.slug);
  const limitReached = comparisonSlugs.length >= 4 && !isCompared;
  const lastChecked = model.verification.checkedAt || MODEL_UNKNOWN.pending;

  return (
    <article className={`${styles.modelCard} ${isCompared ? styles.modelCardCompared : ''}`}>
      <div className={styles.modelCardHeader}>
        <div className={styles.modelIdentity}>
          <ModelLogo model={model} vendor={vendor} frameSize={42} imageSize={30} className={styles.modelVendorLogo} decorative />
          <div><h3>{model.name}</h3><p>{vendor?.name || MODEL_UNKNOWN.pending} · {model.family} 家族</p></div>
        </div>
        <span className={styles.neutralBadge}>{getLifecycleLabel(model.lifecycleStatus)}</span>
      </div>

      <p className={styles.modelSummary}>{model.summary}</p>

      <dl className={styles.modelFacts}>
        <div><dt>模型类型</dt><dd>{model.type}</dd></div>
        <div><dt>上下文</dt><dd>{formatModelFact(model.contextWindow)}</dd></div>
        {model.parameterCount?.value !== null ? <div><dt>参数规模</dt><dd>{formatModelFact(model.parameterCount)}</dd></div> : null}
        <div><dt>最大输出</dt><dd>{formatModelFact(model.maxOutputTokens)}</dd></div>
        <div><dt>输入模态</dt><dd>{formatModelFact(model.inputModalities)}</dd></div>
        <div><dt>输出模态</dt><dd>{formatModelFact(model.outputModalities)}</dd></div>
        <div><dt>推理模式</dt><dd>{formatModelFact(model.reasoningModes)}</dd></div>
        <div><dt>API</dt><dd>{formatModelFact(model.apiAvailable)}</dd></div>
        {model.webAvailable?.value === true ? <div><dt>网页产品</dt><dd>{formatModelFact(model.webAvailable)}</dd></div> : null}
        <div><dt>开放权重</dt><dd>{formatModelFact(model.openWeights)}</dd></div>
        <div><dt>标准输入价格</dt><dd>{formatStandardPrice(model.pricing, 'input')}</dd></div>
        <div><dt>标准输出价格</dt><dd>{formatStandardPrice(model.pricing, 'output')}</dd></div>
        <div><dt>最后核查</dt><dd>{lastChecked}</dd></div>
      </dl>

      <div className={styles.modelActions}>
        <Link href={`/ai-models/${model.slug}`}>查看详情</Link>
        <button
          type="button"
          aria-pressed={isCompared}
          disabled={limitReached}
          onClick={() => onToggleComparison(model.slug)}
        >
          {isCompared ? '移出对比' : '加入对比'}
        </button>
        {model.sources[0] ? <a className={styles.officialSourceAction} href={model.sources[0].url} target="_blank" rel="noreferrer">查看官方来源</a> : null}
      </div>
    </article>
  );
}

export default function ModelDatabase({
  models,
  allModels,
  vendors,
  tasks,
  query,
  filters,
  sortKey,
  onQueryChange,
  onFilterChange,
  onSortChange,
  onClearAll,
  comparisonSlugs,
  onToggleComparison
}) {
  const [viewMode, setViewMode] = useState('cards');
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const vendorsById = new Map(vendors.map((vendor) => [vendor.id, vendor]));
  const options = useMemo(() => ({
    vendors: vendors.map((vendor) => [vendor.id, vendor.name]),
    families: uniqueValues(allModels.map((model) => model.family)),
    types: uniqueValues(allModels.map((model) => model.type)),
    modalities: uniqueValues(allModels.flatMap((model) => [...(model.inputModalities.value || []), ...(model.outputModalities.value || [])])),
    api: [['true', 'API 可用'], ['false', '无官方 API']],
    weights: [['true', '开放权重'], ['false', '闭源']],
    lifecycle: [['current', '当前模型'], ['stable', '稳定'], ['preview', '预览'], ['experimental', '实验'], ['open-weight', '开放权重'], ['deprecated', '已弃用'], ['retired', '已退役']],
    contexts: [['standard', '≤ 128K'], ['medium', '128K–500K'], ['long', '> 500K'], ['unknown', MODEL_UNKNOWN.unpublished]],
    prices: [['low', '≤ 1 / 1M tokens'], ['medium', '1–3 / 1M tokens'], ['high', '> 3 / 1M tokens'], ['unknown', '待复核'], ['not-applicable', '不适用']],
    releases: uniqueValues(allModels.map((model) => String(model.releaseDate.value || '').slice(0, 4)).filter(Boolean)),
    verification: uniqueValues(allModels.map((model) => model.verification.status))
  }), [allModels, vendors]);
  const activeFilters = Object.entries(filters).filter(([key, value]) => (
    value && value !== 'all' && !(key === 'lifecycleStatus' && value === 'current')
  ));
  const activeCount = activeFilters.length + (query ? 1 : 0);

  function filterValueLabel(key, value) {
    if (key === 'vendorId') return vendorsById.get(value)?.name || value;
    if (key === 'taskId') return tasks.find((task) => task.id === value)?.name || value;
    const optionGroups = {
      family: options.families, type: options.types, modality: options.modalities, apiAvailability: options.api,
      weightAvailability: options.weights, contextBucket: options.contexts, priceBucket: options.prices,
      lifecycleStatus: options.lifecycle, releaseBucket: options.releases, verificationStatus: options.verification
    };
    const option = optionGroups[key]?.find((item) => (Array.isArray(item) ? item[0] : item) === value);
    return Array.isArray(option) ? option[1] : option || value;
  }

  return (
    <div className={styles.modelDatabase}>
      <div className={styles.desktopFilters}>
        <div className={styles.filterGrid}>
          <label className={`${styles.filterField} ${styles.databaseSearch}`}>
            <span>搜索</span>
            <input type="search" value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder="搜索模型、厂商、家族或任务" />
          </label>
          <FilterFields filters={filters} options={options} onFilterChange={onFilterChange} />
          <button className={styles.moreFiltersButton} type="button" aria-expanded={showMoreFilters} onClick={() => setShowMoreFilters((open) => !open)}>
            {showMoreFilters ? '收起筛选' : '更多筛选'}
          </button>
        </div>
        {showMoreFilters ? (
          <div className={styles.moreFilters}>
            {moreFilterKeys.map((key) => {
              const optionKey = { lifecycleStatus: 'lifecycle', contextBucket: 'contexts', priceBucket: 'prices', releaseBucket: 'releases', verificationStatus: 'verification' }[key];
              return <FilterField key={key} label={filterLabels[key]} name={key} value={filters[key]} options={options[optionKey]} onChange={onFilterChange} />;
            })}
          </div>
        ) : null}
      </div>

      <div className={styles.mobileDatabaseControls}>
        <button type="button" onClick={() => setIsFilterDrawerOpen(true)}>筛选 <span>{activeCount}</span></button>
        <label><span>排序</span><select value={sortKey} onChange={(event) => onSortChange(event.target.value)}>{sortOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
      </div>

      {activeCount ? (
        <div className={styles.activeFilterBar} aria-label="已选条件">
          <span>已选条件：</span>
          {query ? <button type="button" onClick={() => onQueryChange('')}>搜索：{query} ×</button> : null}
          {activeFilters.map(([key, value]) => (
            <button type="button" key={key} onClick={() => onFilterChange(key, 'all')}>{filterLabels[key]}：{filterValueLabel(key, value)} ×</button>
          ))}
          <button className={styles.clearFiltersButton} type="button" onClick={onClearAll}>清除全部</button>
        </div>
      ) : null}

      <div className={styles.databaseToolbar}>
        <p role="status">当前显示 <strong>{models.length}</strong> 个模型</p>
        <div className={styles.databaseActions}>
          <label className={styles.sortSelect}><span>排序</span><select value={sortKey} onChange={(event) => onSortChange(event.target.value)}>{sortOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
          <div className={styles.viewSwitch} aria-label="数据库视图">
            <button type="button" aria-pressed={viewMode === 'cards'} onClick={() => setViewMode('cards')}>卡片视图</button>
            <button type="button" aria-pressed={viewMode === 'table'} onClick={() => setViewMode('table')}>表格视图</button>
          </div>
        </div>
      </div>

      {!models.length ? (
        <div className={styles.modelEmptyState}>
          <p>NO MATCHING MODELS</p>
          <h3>未找到符合条件的模型</h3>
          <span>尝试清除搜索词或减少筛选条件，也可以重新浏览全部条目。</span>
          <div>
            <button type="button" onClick={() => onQueryChange('')}>清除搜索词</button>
            <button type="button" onClick={() => coreFilterKeys.forEach((key) => onFilterChange(key, 'all'))}>减少筛选条件</button>
            <button type="button" onClick={onClearAll}>查看全部模型</button>
            <a href="#model-vendors">浏览模型厂商</a>
          </div>
        </div>
      ) : viewMode === 'cards' ? (
        <div className={styles.modelGrid}>
          {models.map((model) => (
            <ModelCard
              key={model.slug}
              model={model}
              vendor={vendorsById.get(model.vendorSlug)}
              comparisonSlugs={comparisonSlugs}
              onToggleComparison={onToggleComparison}
            />
          ))}
        </div>
      ) : (
        <div className={styles.modelTableScroller} tabIndex="0" aria-label="模型参数表格，可横向滚动">
          <table className={styles.modelTable}>
            <thead>
              <tr>
                <th>模型</th><th>厂商</th><th>家族</th><th>生命周期</th><th>模型类型</th><th>上下文</th><th>最大输出</th>
                <th>输入模态</th><th>API</th><th>开放状态</th><th>标准输入</th><th>标准输出</th><th>发布时间</th><th>核查日期</th><th>操作</th>
              </tr>
            </thead>
            <tbody>
              {models.map((model) => {
                const vendor = vendorsById.get(model.vendorSlug);
                const isCompared = comparisonSlugs.includes(model.slug);
                const limitReached = comparisonSlugs.length >= 4 && !isCompared;
                return (
                  <tr key={model.slug}>
                    <td><Link href={`/ai-models/${model.slug}`}><ModelLogo model={model} vendor={vendor} frameSize={30} imageSize={22} className={styles.modelVendorLogoCompact} decorative /><strong>{model.name}</strong></Link></td>
                    <td>{vendor?.name || MODEL_UNKNOWN.pending}</td>
                    <td>{model.family}</td>
                    <td><span className={styles.neutralBadge}>{getLifecycleLabel(model.lifecycleStatus)}</span></td>
                    <td><span className={styles.neutralBadge}>{model.type}</span></td>
                    <td>{formatModelFact(model.contextWindow)}</td>
                    <td>{formatModelFact(model.maxOutputTokens)}</td>
                    <td>{formatModelFact(model.inputModalities)}</td>
                    <td>{formatModelFact(model.apiAvailable)}</td>
                    <td>{formatModelFact(model.openWeights)}</td>
                    <td>{formatStandardPrice(model.pricing, 'input')}</td>
                    <td>{formatStandardPrice(model.pricing, 'output')}</td>
                    <td>{formatModelFact(model.releaseDate)}</td>
                    <td>{model.verification.checkedAt || MODEL_UNKNOWN.pending}</td>
                    <td>
                      <div className={styles.tableActions}>
                        <Link href={`/ai-models/${model.slug}`}>详情</Link>
                        <button type="button" aria-pressed={isCompared} disabled={limitReached} onClick={() => onToggleComparison(model.slug)}>
                          {isCompared ? '移出' : '对比'}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {isFilterDrawerOpen ? (
        <div className={styles.filterDrawerBackdrop} onMouseDown={(event) => event.target === event.currentTarget && setIsFilterDrawerOpen(false)}>
          <section className={styles.filterDrawer} role="dialog" aria-modal="true" aria-labelledby="mobile-filter-title">
            <header><div><p id="mobile-filter-title">筛选</p><span>已选 {activeCount} 项</span></div><button type="button" onClick={() => setIsFilterDrawerOpen(false)} aria-label="关闭筛选">关闭</button></header>
            <div className={styles.filterDrawerBody}>
              <label className={`${styles.filterField} ${styles.databaseSearch}`}><span>搜索</span><input type="search" value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder="搜索模型、厂商或任务" /></label>
              <FilterFields filters={filters} options={options} onFilterChange={onFilterChange} includeMore />
            </div>
            <button className={styles.filterDrawerAction} type="button" onClick={() => setIsFilterDrawerOpen(false)}>查看 {models.length} 个模型</button>
          </section>
        </div>
      ) : null}
    </div>
  );
}
