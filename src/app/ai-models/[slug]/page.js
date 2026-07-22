import Link from 'next/link';
import { notFound } from 'next/navigation';
import { JsonLd } from '../../../components/JsonLd';
import ModelLogo from '../../../components/ModelLogo';
import {
  currentAiModels,
  getModelBySlug,
  modelTasks,
  modelVendors
} from '../../../lib/model-content.mjs';
import { modelSourceById } from '../../../lib/model-sources.mjs';
import {
  formatModelFact,
  formatOfficialModelId,
  formatStandardPrice,
  getOfficialModelIdValue,
  getLifecycleLabel
} from '../../../lib/model-explorer.mjs';
import { breadcrumbJsonLd, buildCanonicalUrl, pageMetadata } from '../../../lib/seo.mjs';
import styles from './page.module.css';

const sectionLinks = [
  ['intro', '模型简介'], ['parameters', '基础参数'], ['modalities', '支持模态'],
  ['capabilities', '能力与适用任务'], ['access', 'API 和访问方式'], ['pricing', '价格'],
  ['benchmarks', '公开基准测试'], ['limits', '优点与限制'], ['versions', '版本差异'],
  ['related-models', '相关模型'], ['related-content', '相关工具与教程'], ['sources', '官方来源与核查记录']
];

const factStatusLabel = (status) => ({
  verified: '已核实', 'needs-review': '待复核', 'official-unpublished': '官方未公开', unpublished: '官方尚未公开', 'not-applicable': '不适用'
})[status] || '待复核';

function getVendor(model) {
  return modelVendors.find((vendor) => vendor.id === model.vendorSlug);
}

export function getDetailSections(model) {
  return sectionLinks.map(([id, title]) => ({ id, title, modelSlug: model.slug }));
}

export function generateStaticParams() {
  return currentAiModels.map((model) => ({ slug: model.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const model = getModelBySlug(slug);
  if (!model) notFound();
  const vendor = getVendor(model);
  return pageMetadata({
    title: `${model.name} 模型参数、价格与官方来源`,
    description: `${model.name} 是 ${vendor?.name || '厂商'} 的 ${model.family} 模型。查看官方模型 ID、生命周期、已核实参数、价格与字段级来源。`,
    path: `/ai-models/${model.slug}`
  });
}

function FactValue({ fact }) {
  const source = fact?.sourceId ? modelSourceById.get(fact.sourceId) : null;
  return (
    <div className={styles.factValue}>
      <span>{formatModelFact(fact)}</span>
      <small>
        数据状态：{factStatusLabel(fact?.status)}
        {fact?.verifiedAt ? <> · 核查日期：{fact.verifiedAt}</> : null}
        {source ? <> · <a href={source.url} rel="noreferrer" target="_blank">官方来源</a></> : null}
      </small>
      {fact?.note ? <em>{fact.note}</em> : null}
    </div>
  );
}

function DefinitionList({ items }) {
  return (
    <dl className={styles.definitionGrid}>
      {items.map(([term, value]) => (
        <div className={styles.definitionItem} key={term}>
          <dt>{term}</dt>
          <dd>{value && typeof value === 'object' && 'status' in value ? <FactValue fact={value} /> : value ?? '官方未公开'}</dd>
        </div>
      ))}
    </dl>
  );
}

function PricingValue({ model, label, value, note = null }) {
  const pricing = model.pricing;
  const source = pricing.sourceId ? modelSourceById.get(pricing.sourceId) : null;
  return (
    <div className={styles.definitionItem}>
      <dt>{label}</dt>
      <dd>
        <div className={styles.factValue}>
          <span>{value}</span>
          <small>
            数据状态：{factStatusLabel(pricing.status)} · 核查日期：{pricing.verifiedAt}
            {source ? <> · <a href={source.url} rel="noreferrer" target="_blank">官方来源</a></> : null}
          </small>
          {note ? <em>{note}</em> : null}
        </div>
      </dd>
    </div>
  );
}

const rawPrice = (pricing, value) => typeof value === 'number'
  ? `${({ USD: '$', CNY: '¥', EUR: '€' })[pricing.currency] || `${pricing.currency} `}${value} / ${pricing.billingUnit}`
  : factStatusLabel(pricing.status);

function EmptyState({ children }) {
  return <p className={styles.emptyState}>{children}</p>;
}

export default async function AiModelDetailPage({ params }) {
  const { slug } = await params;
  const model = getModelBySlug(slug);
  if (!model) notFound();
  const vendor = getVendor(model);
  const taskNames = model.taskIds.map((taskId) => modelTasks.find((task) => task.id === taskId)?.name).filter(Boolean);
  const relatedModels = currentAiModels.filter((candidate) => candidate.slug !== model.slug && (
    candidate.vendorSlug === model.vendorSlug || candidate.familySlug === model.familySlug
  )).slice(0, 3);
  const officialSource = model.sources[0];
  const sections = getDetailSections(model);
  const replacement = model.replacementModelSlug ? getModelBySlug(model.replacementModelSlug) : null;
  const pricing = model.pricing;
  const officialModelIdValue = getOfficialModelIdValue(model.officialModelId);
  const longContextValue = typeof pricing.longContext.threshold === 'number'
    ? `超过 ${pricing.longContext.threshold.toLocaleString('en-US')} tokens：输入 ${rawPrice(pricing, pricing.longContext.input)}；缓存输入 ${rawPrice(pricing, pricing.longContext.cachedInput)}；输出 ${rawPrice(pricing, pricing.longContext.output)}`
    : factStatusLabel(pricing.status);

  const modelJsonLd = {
    '@context': 'https://schema.org', '@type': 'TechArticle',
    headline: `${model.name} 模型参数、价格与官方来源`, description: model.summary,
    dateModified: model.lastVerifiedAt,
    mainEntityOfPage: buildCanonicalUrl(`/ai-models/${model.slug}`),
    about: {
      '@type': 'Thing',
      name: model.name,
      ...(officialModelIdValue ? { identifier: formatOfficialModelId(model.officialModelId) } : {})
    }
  };

  return (
    <main className={styles.detailPage}>
      <JsonLd data={modelJsonLd} />
      <JsonLd data={breadcrumbJsonLd([
        { name: '首页', href: '/' }, { name: 'AI 模型库', href: '/ai-models' },
        { name: model.name, href: `/ai-models/${model.slug}` }
      ])} />

      <section className={styles.detailHero}>
        <div className={styles.container}>
          <nav className={styles.breadcrumb} aria-label="面包屑"><Link href="/ai-models">AI 模型库</Link><span aria-hidden="true">/</span><span>{model.name}</span></nav>
          <div className={styles.heroContent}>
            <ModelLogo model={model} vendor={vendor} imageSize={32} className={styles.vendorMark} priority />
            <div className={styles.heroCopy}>
              <p className={styles.eyebrow}>{vendor?.name} · {model.family}</p>
              <h1>{model.name}</h1><p className={styles.summary}>{model.summary}</p>
              <div className={styles.statusRow}>
                <span className={styles.statusBadge}>{getLifecycleLabel(model.lifecycleStatus)}</span>
                <span>{model.verification.status}</span><span>最后核查：{model.lastVerifiedAt}</span><span>下次建议核查：{model.nextReviewAt}</span>
              </div>
            </div>
            <div className={styles.heroActions}>
              <Link className={styles.secondaryButton} href="/ai-models#model-database-title">加入对比</Link>
              <a className={styles.primaryButton} href={officialSource.url} rel="noreferrer" target="_blank">官方入口</a>
            </div>
          </div>
        </div>
      </section>

      <div className={`${styles.container} ${styles.detailShell}`}>
        <article className={styles.document}>
          <section id="intro" className={styles.contentSection}>
            <p className={styles.sectionIndex}>01</p><h2>模型简介</h2><p>{model.summary}</p>
            <DefinitionList items={[
              ['官方模型 ID', model.officialModelId], ['Aliases', model.officialAliases.length ? model.officialAliases.join(' · ') : '无公开 alias'],
              ...(model.positioning ? [['官方定位', model.positioning]] : []),
              ['固定版本 ID', model.snapshotIds.length ? model.snapshotIds.join(' · ') : '官方未公开'], ['当前生命周期', getLifecycleLabel(model.lifecycleStatus)],
              ['发布渠道', model.releaseChannel], ['数据可信度', model.verification.status], ['数据来源数量', String(model.sourceIds.length)]
            ]} />
            <p className={styles.dataNotice}>该数据可能发生变化，请以每个字段标注的官方来源和核查日期为准。</p>
          </section>

          <section id="parameters" className={styles.contentSection}>
            <p className={styles.sectionIndex}>02</p><h2>基础参数</h2>
            <DefinitionList items={[
              ['发布时间', model.releaseDate], ['知识截止日期', model.knowledgeCutoff], ['上下文窗口', model.contextWindow],
              ['最大输出', model.maxOutputTokens], ['参数规模', model.parameterCount], ['激活参数规模', model.activeParameterCount]
            ]} />
          </section>

          <section id="modalities" className={styles.contentSection}>
            <p className={styles.sectionIndex}>03</p><h2>支持模态</h2>
            <DefinitionList items={[
              ['输入模态', model.inputModalities], ['输出模态', model.outputModalities], ['推理模式', model.reasoningModes], ['Reasoning effort', model.reasoningEffortLevels]
            ]} />
          </section>

          <section id="capabilities" className={styles.contentSection}>
            <p className={styles.sectionIndex}>04</p><h2>能力与适用任务</h2>
            <div className={styles.tagList}>{taskNames.map((task) => <span key={task}>{task}</span>)}</div>
            <DefinitionList items={[
              ['Function Calling', model.functionCalling], ['工具调用', model.toolCalling], ['Structured Output', model.structuredOutput],
              ['Web Search', model.webSearch], ['File Search', model.fileSearch], ['Computer Use', model.computerUse],
              ['Code Execution', model.codeExecution], ['Prompt Caching', model.promptCaching], ['Batch API', model.batchApi], ['微调支持', model.fineTuning]
            ]} />
            <h3>官方推荐场景</h3>
            {model.recommendedScenarios.length ? <ul>{model.recommendedScenarios.map((item) => <li key={item}>{item}</li>)}</ul> : <EmptyState>当前官方资料未提供可直接结构化的统一场景清单。</EmptyState>}
            <div className={styles.editorialNote}><strong>本站场景说明</strong><p>本站编辑评价，仅用于场景选择参考。当前不提供跨模型统一汇总评分。</p></div>
          </section>

          <section id="access" className={styles.contentSection}>
            <p className={styles.sectionIndex}>05</p><h2>API 和访问方式</h2>
            <DefinitionList items={[
              ['API 接入方式', model.apiAvailable], ['网页可用性', model.webAvailable], ['开放权重', model.openWeights],
              ['开放权重与许可证', model.license], ['本地部署要求', model.localDeployment], ['地区差异', model.regions]
            ]} />
          </section>

          <section id="pricing" className={styles.contentSection}>
            <p className={styles.sectionIndex}>06</p><h2>价格</h2>
            <dl className={styles.definitionGrid}>
              <PricingValue model={model} label="标准价格" value={`输入 ${formatStandardPrice(pricing, 'input')} · 输出 ${formatStandardPrice(pricing, 'output')}`} />
              <PricingValue model={model} label="缓存价格" value={rawPrice(pricing, pricing.standard.cachedInput)} />
              <PricingValue model={model} label="Batch 价格" value={`输入 ${rawPrice(pricing, pricing.batch.input)} · 输出 ${rawPrice(pricing, pricing.batch.output)}`} />
              <PricingValue model={model} label="长上下文价格" value={longContextValue} />
              <PricingValue model={model} label="Priority 价格" value={`输入 ${rawPrice(pricing, pricing.priority.input)} · 输出 ${rawPrice(pricing, pricing.priority.output)}`} />
              <PricingValue model={model} label="地区与币种" value={`${pricing.region || '官方未公开'} · ${pricing.currency || '官方未公开'}`} note={pricing.note} />
            </dl>
          </section>

          <section id="benchmarks" className={styles.contentSection}>
            <p className={styles.sectionIndex}>07</p><h2>公开基准测试</h2>
            <p className={styles.dataNotice}>以下成绩来自厂商公开测试，测试条件可能不同，不宜直接视为统一排行榜。</p>
            {model.benchmarks.length ? (
              <div className={styles.benchmarkTable}><table><thead><tr><th>测试</th><th>分数</th><th>版本与条件</th><th>来源</th></tr></thead><tbody>{model.benchmarks.map((benchmark) => {
                const source = modelSourceById.get(benchmark.sourceId);
                return <tr key={`${benchmark.benchmarkName}-${benchmark.evaluationVariant}`}><td>{benchmark.benchmarkName}</td><td>{benchmark.score} {benchmark.unit}</td><td>{benchmark.evaluationVariant} · {benchmark.testConditions}</td><td><a href={source.url} target="_blank" rel="noreferrer">官方来源</a></td></tr>;
              })}</tbody></table></div>
            ) : <EmptyState>当前暂无可核查的统一数据</EmptyState>}
          </section>

          <section id="limits" className={styles.contentSection}>
            <p className={styles.sectionIndex}>08</p><h2>优点与限制</h2><h3>已知限制</h3>
            {model.limitations.length ? <ul>{model.limitations.map((item) => <li key={item}>{item}</li>)}</ul> : <EmptyState>当前官方资料没有可结构化的统一限制清单。</EmptyState>}
          </section>

          <section id="versions" className={styles.contentSection}>
            <p className={styles.sectionIndex}>09</p><h2>版本差异</h2>
            <DefinitionList items={[
              ['版本关系', model.versionRelations.length ? model.versionRelations.join(' · ') : '官方未公开'],
              ['弃用和替代信息', replacement ? `建议替代为 ${replacement.name}` : ['deprecated', 'retired'].includes(model.lifecycleStatus) ? '官方未提供有效替代模型' : '当前模型未标记弃用'],
              ['弃用日期', model.deprecationDate], ['停止服务日期', model.shutdownDate]
            ]} />
          </section>

          <section id="related-models" className={styles.contentSection}>
            <p className={styles.sectionIndex}>10</p><h2>相关模型</h2>
            <div className={styles.relatedGrid}>
              {relatedModels.map((related) => (
                <Link key={related.slug} href={`/ai-models/${related.slug}`}>
                  <ModelLogo model={related} frameSize={40} imageSize={25} className={styles.relatedModelLogo} decorative />
                  <span className={styles.relatedModelCopy}>
                    <strong>{related.name}</strong>
                    <span>{getLifecycleLabel(related.lifecycleStatus)} · {related.family}</span>
                  </span>
                </Link>
              ))}
            </div>
          </section>

          <section id="related-content" className={styles.contentSection}>
            <p className={styles.sectionIndex}>11</p><h2>相关工具与教程</h2><EmptyState>当前暂无已完成字段级核查的相关内容。</EmptyState>
          </section>

          <section id="sources" className={styles.contentSection}>
            <p className={styles.sectionIndex}>12</p><h2>官方来源与核查记录</h2>
            <ul className={styles.sourceList}>{model.sources.map((source) => <li key={source.id}><a href={source.url} rel="noreferrer" target="_blank">{source.title}</a><span>{source.kind} · 访问 {source.accessedAt} · {source.crossChecked ? '已交叉核对' : '单页核对'}</span></li>)}</ul>
            <h3>最后核查记录</h3>
            <p className={styles.supportingCopy}>最后核查日期：{model.lastVerifiedAt} · 下次建议核查日期：{model.nextReviewAt} · 数据来源数量：{model.sourceIds.length} · 数据可信度：{model.verification.status} · 模型生命周期：{getLifecycleLabel(model.lifecycleStatus)}</p>
          </section>
        </article>

        <aside className={styles.detailToc} aria-label="页面目录"><p>页面目录</p><nav>{sections.map((section) => <a href={`#${section.id}`} key={section.id}>{section.title}</a>)}</nav><Link href="/ai-models">返回模型库</Link></aside>
      </div>
    </main>
  );
}
