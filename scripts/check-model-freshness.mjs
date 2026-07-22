import { fileURLToPath } from 'node:url';
import { basename } from 'node:path';
import { allAiModels } from '../src/lib/model-data.mjs';
import { modelSourceById } from '../src/lib/model-sources.mjs';

const isFact = (value) => value && typeof value === 'object' && !Array.isArray(value) && 'status' in value && 'verifiedAt' in value;

export function checkModelFreshness(models = allAiModels, { asOf = new Date().toISOString().slice(0, 10) } = {}) {
  const errors = [];
  const warnings = [];
  const slugs = new Set(models.map((model) => model.slug));
  let checkedFacts = 0;
  let staleModels = 0;

  for (const model of models) {
    if (model.nextReviewAt < asOf) {
      staleModels += 1;
      warnings.push(`${model.slug}: nextReviewAt ${model.nextReviewAt} 已过期`);
    }
    const officialModelIdIsPublished = typeof model.officialModelId === 'string' && model.officialModelId.trim();
    const officialModelIdIsUnpublished = model.officialModelId?.status === 'unpublished'
      && model.officialModelId.value === null
      && model.officialModelId.sourceId
      && model.officialModelId.verifiedAt;
    if (!officialModelIdIsPublished && !officialModelIdIsUnpublished) errors.push(`${model.slug}: officialModelId 缺少已发布值或可追溯的 unpublished 状态`);
    if (!model.sourceIds.length) errors.push(`${model.slug}: 没有官方来源`);
    for (const sourceId of model.sourceIds) if (!modelSourceById.has(sourceId)) errors.push(`${model.slug}: sourceId ${sourceId} 不存在`);
    if (model.lifecycleStatus === 'deprecated' && !model.deprecationSourceId) errors.push(`${model.slug}: deprecated 缺少弃用来源`);
    if (model.lifecycleStatus === 'retired' && !model.shutdownDate.value && !model.shutdownDate.note) errors.push(`${model.slug}: retired 缺少 shutdown 信息`);
    if (model.replacementModelSlug && !slugs.has(model.replacementModelSlug)) errors.push(`${model.slug}: replacement 不存在`);

    for (const [field, fact] of Object.entries(model)) {
      if (!isFact(fact)) continue;
      checkedFacts += 1;
      if (fact.status === 'verified') {
        if (!fact.sourceId || !modelSourceById.has(fact.sourceId)) errors.push(`${model.slug}.${field}: 精确值缺少有效 sourceId`);
        if (!/^\d{4}-\d{2}-\d{2}$/.test(fact.verifiedAt || '')) errors.push(`${model.slug}.${field}: 精确值缺少 verifiedAt`);
      }
      if (['contextWindow', 'maxOutputTokens', 'parameterCount', 'activeParameterCount'].includes(field) && typeof fact.value === 'string' && /以官方|待核对|待复核/.test(fact.value)) {
        errors.push(`${model.slug}.${field}: 数值字段使用模糊字符串`);
      }
    }
    const hasStandardPrice = Object.values(model.pricing.standard).some((value) => typeof value === 'number');
    if (hasStandardPrice && (!model.pricing.currency || !model.pricing.billingUnit || !model.pricing.sourceId)) errors.push(`${model.slug}: 价格缺少币种、单位或来源`);
  }

  return { errors, warnings, summary: { checkedModels: models.length, checkedFacts, staleModels, asOf } };
}

function main() {
  const result = checkModelFreshness();
  console.log(`模型新鲜度检查：${result.summary.checkedModels} 个模型，${result.summary.checkedFacts} 个字段，${result.summary.staleModels} 个过期模型。`);
  for (const warning of result.warnings) console.log(`WARN ${warning}`);
  for (const error of result.errors) console.error(`ERROR ${error}`);
  if (result.errors.length) process.exitCode = 1;
}

if (process.argv[1] && basename(process.argv[1]) === basename(fileURLToPath(import.meta.url))) main();
