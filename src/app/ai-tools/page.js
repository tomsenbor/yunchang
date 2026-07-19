import { JsonLd } from '../../components/JsonLd';
import ToolExplorer from '../../components/ToolExplorer';
import { buildCanonicalUrl, pageMetadata } from '../../lib/seo.mjs';
import { toolCategories, tools } from '../../lib/tool-content.mjs';
import { createExplorerCategories, createExplorerTools } from '../../lib/tool-explorer.mjs';
import styles from './ai-tools.module.css';

const pageTitle = '全球 AI 工具库';
const pageDescription =
  '探索100+精选AI工具，按聊天、写作、图片、视频、编程和办公任务筛选，查看工具能力、适用场景、平台、定价说明及相关教程。';

export const metadata = pageMetadata({
  title: pageTitle,
  description: pageDescription,
  path: '/ai-tools'
});

const explorerTools = createExplorerTools(tools, toolCategories);
const explorerCategories = createExplorerCategories(explorerTools, toolCategories);

const collectionJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: pageTitle,
  description: pageDescription,
  url: buildCanonicalUrl('/ai-tools'),
  mainEntity: {
    '@type': 'ItemList',
    numberOfItems: tools.length,
    itemListElement: tools.map((tool, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: tool.name,
      url: buildCanonicalUrl(`/ai-tools/${tool.slug}`)
    }))
  }
};

export default function AiToolsPage() {
  return (
    <main className={styles.explorerPage}>
      <JsonLd data={collectionJsonLd} />

      <section className={styles.hero} aria-labelledby="ai-tools-title">
        <div className={styles.heroEyebrow}>AI TOOL EXPLORER</div>
        <h1 id="ai-tools-title">全球 AI 工具库</h1>
        <p className={styles.heroDescription}>
          探索100+精选AI工具，覆盖聊天、写作、图片、视频、编程和办公场景。
        </p>

        <dl className={styles.stats} aria-label="工具库数据概览">
          <div className={styles.statItem}>
            <dt>{tools.length}+</dt>
            <dd>AI工具</dd>
          </div>
          <div className={styles.statItem}>
            <dt>51+</dt>
            <dd>教程</dd>
          </div>
          <div className={styles.statItem}>
            <dt>183+</dt>
            <dd>资源页面</dd>
          </div>
        </dl>
      </section>

      <ToolExplorer tools={explorerTools} categories={explorerCategories} />
    </main>
  );
}
