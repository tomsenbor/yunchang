import { modelTasks, modelVendors } from './model-content.mjs';

const normalize = (value) => String(value ?? '').trim().toLocaleLowerCase('zh-CN');
const vendorById = new Map(modelVendors.map((vendor) => [vendor.id, vendor]));
const taskById = new Map(modelTasks.map((task) => [task.id, task]));

const FACT_LABELS = Object.freeze({
  'needs-review': '待复核',
  'official-unpublished': '官方未公开',
  unpublished: '官方尚未公开',
  'not-applicable': '不适用'
});

export function getOfficialModelIdValue(officialModelId) {
  return typeof officialModelId === 'string' ? officialModelId : officialModelId?.value ?? null;
}

export function formatOfficialModelId(officialModelId) {
  const value = getOfficialModelIdValue(officialModelId);
  return value || FACT_LABELS[officialModelId?.status] || '待复核';
}

const formatCompactNumber = (value) => {
  if (!Number.isFinite(value)) return String(value);
  if (value >= 1_000_000_000_000) return `${Number((value / 1_000_000_000_000).toFixed(2))}T`;
  if (value >= 1_000_000_000) return `${Number((value / 1_000_000_000).toFixed(2))}B`;
  if (value >= 1_000_000) return `${Number((value / 1_000_000).toFixed(2))}M`;
  if (value >= 1_000) return `${Number((value / 1_000).toFixed(2))}K`;
  return String(value);
};

export function formatModelFact(fact, { joiner = ' · ' } = {}) {
  if (!fact || fact.status !== 'verified' || fact.value === null || fact.value === undefined) {
    return FACT_LABELS[fact?.status] || '待复核';
  }
  if (Array.isArray(fact.value)) return fact.value.join(joiner);
  if (typeof fact.value === 'boolean') return fact.value ? '支持' : '不支持';
  if (typeof fact.value === 'number') {
    const value = formatCompactNumber(fact.value);
    if (fact.unit === 'tokens') return `${value} tokens`;
    if (fact.unit === 'parameters') return `${value} 参数`;
    if (fact.unit === 'experts') return `${value} experts`;
    return fact.unit ? `${value} ${fact.unit}` : value;
  }
  return String(fact.value);
}

const currencySymbol = (currency) => ({ USD: '$', CNY: '¥', EUR: '€' })[currency] || `${currency} `;

export function formatStandardPrice(pricing, key) {
  const value = pricing?.standard?.[key];
  if (typeof value !== 'number') return FACT_LABELS[pricing?.status] || '待复核';
  return `${currencySymbol(pricing.currency)}${value} / ${pricing.billingUnit}`;
}

export function formatPricingSummary(pricing) {
  if (typeof pricing?.standard?.input !== 'number' || typeof pricing?.standard?.output !== 'number') {
    return FACT_LABELS[pricing?.status] || '待复核';
  }
  return `输入 ${formatStandardPrice(pricing, 'input')} · 输出 ${formatStandardPrice(pricing, 'output')}`;
}

export function getLifecycleLabel(status) {
  return ({
    stable: '稳定', preview: '预览', experimental: '实验', deprecated: '已弃用',
    retired: '已退役', 'open-weight': '开放权重'
  })[status] || status;
}

export function getModelStats(models, vendors) {
  const reviewedCount = models.filter((model) => Boolean(model.lastVerifiedAt)).length;
  const pendingFieldCount = models.reduce((sum, model) => sum + Object.values(model).filter((value) => value?.status === 'needs-review').length, 0);
  return {
    modelCount: models.length,
    vendorCount: new Set(models.map((model) => model.vendorSlug)).size,
    familyCount: new Set(models.map((model) => model.family)).size,
    reviewedCount,
    pendingCount: pendingFieldCount,
    staleCount: models.filter((model) => model.nextReviewAt < '2026-07-22').length,
    updatedAt: models.map((model) => model.lastVerifiedAt).filter(Boolean).sort().at(-1) || null
  };
}

export function searchModels(models, query, { vendors = modelVendors, tasks = modelTasks } = {}) {
  const normalizedQuery = normalize(query);
  if (!normalizedQuery) return [...models];
  const vendorsById = new Map(vendors.map((vendor) => [vendor.id, vendor]));
  const tasksById = new Map(tasks.map((task) => [task.id, task]));

  return models.filter((model) => {
    const vendor = vendorsById.get(model.vendorSlug);
    const factValues = [
      model.inputModalities, model.outputModalities, model.reasoningModes, model.reasoningEffortLevels
    ].flatMap((fact) => Array.isArray(fact?.value) ? fact.value : [fact?.value]).filter(Boolean);
    const searchText = [
      model.name, getOfficialModelIdValue(model.officialModelId), model.family, model.summary, model.type,
      vendor?.name, ...(model.officialAliases || []), ...factValues,
      ...model.taskIds.map((taskId) => tasksById.get(taskId)?.name).filter(Boolean)
    ].map(normalize).join(' ');
    return searchText.includes(normalizedQuery);
  });
}

function contextBucket(model) {
  const value = model.contextWindow?.value;
  if (typeof value !== 'number') return 'unknown';
  if (value > 500000) return 'long';
  if (value > 128000) return 'medium';
  return 'standard';
}

function priceBucket(model) {
  if (model.pricing.status === 'not-applicable') return 'not-applicable';
  if (typeof model.pricing.standard.input !== 'number') return 'unknown';
  return model.pricing.standard.input <= 1 ? 'low' : model.pricing.standard.input <= 3 ? 'medium' : 'high';
}

export function filterModels(models, filters = {}) {
  return models.filter((model) => {
    if (filters.taskId && filters.taskId !== 'all' && !model.taskIds.includes(filters.taskId)) return false;
    if (filters.vendorId && filters.vendorId !== 'all' && model.vendorSlug !== filters.vendorId) return false;
    if (filters.family && filters.family !== 'all' && model.family !== filters.family) return false;
    if (filters.type && filters.type !== 'all' && model.type !== filters.type) return false;
    if (filters.lifecycleStatus === 'current' && ['deprecated', 'retired'].includes(model.lifecycleStatus)) return false;
    if (filters.lifecycleStatus && !['all', 'current'].includes(filters.lifecycleStatus) && model.lifecycleStatus !== filters.lifecycleStatus) return false;
    if (filters.modality && filters.modality !== 'all') {
      const modalities = [...(model.inputModalities.value || []), ...(model.outputModalities.value || [])];
      if (!modalities.includes(filters.modality)) return false;
    }
    if (filters.apiAvailability && filters.apiAvailability !== 'all' && String(model.apiAvailable.value) !== filters.apiAvailability) return false;
    if (filters.contextBucket && filters.contextBucket !== 'all' && contextBucket(model) !== filters.contextBucket) return false;
    if (filters.weightAvailability && filters.weightAvailability !== 'all' && String(model.openWeights.value) !== filters.weightAvailability) return false;
    if (filters.priceBucket && filters.priceBucket !== 'all' && priceBucket(model) !== filters.priceBucket) return false;
    if (filters.releaseBucket && filters.releaseBucket !== 'all') {
      const year = String(model.releaseDate.value || '').slice(0, 4) || 'unknown';
      if (year !== filters.releaseBucket) return false;
    }
    if (filters.verificationStatus && filters.verificationStatus !== 'all' && model.verification.status !== filters.verificationStatus) return false;
    return true;
  });
}

export function sortModels(models, sortKey = 'recommended') {
  if (sortKey === 'recommended') return [...models];
  const valueFor = {
    latest: (model) => Date.parse(model.releaseDate.value || '') || null,
    verified: (model) => Date.parse(model.lastVerifiedAt || '') || null,
    context: (model) => typeof model.contextWindow.value === 'number' ? model.contextWindow.value : null,
    price: (model) => typeof model.pricing.standard.input === 'number' ? model.pricing.standard.input : null
  }[sortKey];
  if (!valueFor) return [...models];
  return models.map((model, index) => ({ model, index })).sort((left, right) => {
    const leftValue = valueFor(left.model);
    const rightValue = valueFor(right.model);
    if (leftValue === null && rightValue !== null) return 1;
    if (leftValue !== null && rightValue === null) return -1;
    if (leftValue === null || rightValue === null || leftValue === rightValue) return left.index - right.index;
    return sortKey === 'price' ? leftValue - rightValue : rightValue - leftValue;
  }).map(({ model }) => model);
}

export function getVendorSummaries(models, vendors) {
  return vendors.map((vendor) => {
    const vendorModels = models.filter((model) => model.vendorSlug === vendor.id);
    return { ...vendor, modelCount: vendorModels.length, representativeModels: vendorModels.slice(0, 3).map((model) => model.name) };
  });
}

export function getTaskSummaries(models, tasks) {
  return tasks.map((task) => {
    const taskModels = models.filter((model) => model.taskIds.includes(task.id));
    return { ...task, modelCount: taskModels.length, representativeModels: taskModels.slice(0, 3).map((model) => model.name) };
  });
}

export function toggleComparisonSlug(current, slug, max = 4) {
  if (current.includes(slug)) return current.filter((item) => item !== slug);
  if (current.length >= max) return current;
  return [...current, slug];
}

export function buildComparisonRows(models) {
  const rows = [
    ['模型', (model) => model.name],
    ['官方模型 ID', (model) => formatOfficialModelId(model.officialModelId)],
    ['厂商', (model) => vendorById.get(model.vendorSlug)?.name || model.vendorSlug],
    ['家族', (model) => model.family],
    ['生命周期', (model) => getLifecycleLabel(model.lifecycleStatus)],
    ['模型类型', (model) => model.type],
    ['上下文', (model) => formatModelFact(model.contextWindow)],
    ['最大输出', (model) => formatModelFact(model.maxOutputTokens)],
    ['输入模态', (model) => formatModelFact(model.inputModalities)],
    ['输出模态', (model) => formatModelFact(model.outputModalities)],
    ['推理模式', (model) => formatModelFact(model.reasoningModes)],
    ['API', (model) => formatModelFact(model.apiAvailable)],
    ['开放权重', (model) => formatModelFact(model.openWeights)],
    ['标准输入价格', (model) => formatStandardPrice(model.pricing, 'input')],
    ['标准输出价格', (model) => formatStandardPrice(model.pricing, 'output')],
    ['最后核查', (model) => model.lastVerifiedAt]
  ];
  return rows.map(([label, getValue]) => ({ label, values: models.map(getValue) }));
}

export function getVendorName(vendorId) {
  return vendorById.get(vendorId)?.name || vendorId;
}

export function getTaskName(taskId) {
  return taskById.get(taskId)?.name || taskId;
}
