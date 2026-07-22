import { JsonLd } from '../../components/JsonLd';
import ModelExplorer from '../../components/ModelExplorer';
import {
  aiModels,
  getModelDataStats,
  modelFaqs,
  modelSelectionSteps,
  modelTasks,
  modelVendors
} from '../../lib/model-content.mjs';
import { getModelStats } from '../../lib/model-explorer.mjs';
import { buildCanonicalUrl, faqJsonLd, pageMetadata } from '../../lib/seo.mjs';
import styles from './ai-models.module.css';

const pageTitle = '全球 AI 模型库';
const pageDescription = `按模型厂商、家族、任务、生命周期和官方价格探索 ${aiModels.length} 个当前 AI 模型，并查看字段级官方来源。`;

export const metadata = pageMetadata({
  title: pageTitle,
  description: pageDescription,
  path: '/ai-models'
});

const collectionJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: pageTitle,
  description: pageDescription,
  url: buildCanonicalUrl('/ai-models'),
  mainEntity: {
    '@type': 'ItemList',
    numberOfItems: aiModels.length,
    itemListElement: aiModels.map((model, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: model.name,
      url: buildCanonicalUrl(`/ai-models/${model.slug}`)
    }))
  }
};

export default function AiModelsPage() {
  const stats = getModelStats(aiModels, modelVendors);
  const dataStats = getModelDataStats(aiModels);

  return (
    <div className={styles.explorerPage}>
      <JsonLd data={collectionJsonLd} />
      <JsonLd data={faqJsonLd(modelFaqs)} />
      <ModelExplorer
        models={aiModels}
        catalogModels={aiModels}
        vendors={modelVendors}
        tasks={modelTasks}
        faqs={modelFaqs}
        selectionSteps={modelSelectionSteps}
        stats={stats}
        dataStats={dataStats}
      />
    </div>
  );
}
