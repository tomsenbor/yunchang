import { JsonLd } from '../../components/JsonLd';
import ToolExplorer from '../../components/ToolExplorer';
import { buildCanonicalUrl, pageMetadata } from '../../lib/seo.mjs';
import { toolCategories, tools } from '../../lib/tool-content.mjs';
import {
  createExplorerCategories,
  createExplorerTasks,
  createExplorerTools,
  createFeaturedTools
} from '../../lib/tool-explorer.mjs';
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
const explorerTasks = createExplorerTasks(explorerTools);
const featuredTools = createFeaturedTools(explorerTools);

const collectionJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: pageTitle,
  description: pageDescription,
  url: buildCanonicalUrl('/ai-tools'),
  mainEntity: {
    '@type': 'ItemList',
    numberOfItems: explorerTools.length,
    itemListElement: explorerTools.map((tool, index) => ({
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
      <ToolExplorer
        tools={explorerTools}
        categories={explorerCategories}
        tasks={explorerTasks}
        featuredTools={featuredTools}
        stats={{ tools: tools.length, guides: 51, resources: 183 }}
      />
    </main>
  );
}
