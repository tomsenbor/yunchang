import { MODEL_AUDIT_DATE, modelSourceById, modelSources } from './model-sources.mjs';

export const MODEL_LIFECYCLE_STATUSES = Object.freeze([
  'stable', 'preview', 'experimental', 'deprecated', 'retired', 'open-weight'
]);

export const MODEL_FACT_STATUSES = Object.freeze([
  'verified', 'needs-review', 'official-unpublished', 'unpublished', 'not-applicable'
]);

export const verifiedFact = (value, sourceId, unit = null, note = null) => ({
  value, unit, status: 'verified', sourceId, verifiedAt: MODEL_AUDIT_DATE, note
});

export const unpublishedFact = (note = '官方未公开', sourceId = null) => ({
  value: null, unit: null, status: 'official-unpublished', sourceId, verifiedAt: MODEL_AUDIT_DATE, note
});

export const reviewFact = (note = '待复核', sourceId = null) => ({
  value: null, unit: null, status: 'needs-review', sourceId, verifiedAt: MODEL_AUDIT_DATE, note
});

export const notApplicableFact = (note, sourceId = null) => ({
  value: null, unit: null, status: 'not-applicable', sourceId, verifiedAt: MODEL_AUDIT_DATE, note
});

const moonshotVerifiedFact = (value, unit = null, note = null) => ({
  ...verifiedFact(value, 'moonshot-kimi-k3', unit, note),
  verificationMethod: 'manual-official-page-review'
});

const moonshotUnpublishedFact = (note) => ({
  value: null,
  unit: null,
  status: 'unpublished',
  sourceId: 'moonshot-kimi-k3',
  verifiedAt: MODEL_AUDIT_DATE,
  note,
  verificationMethod: 'manual-official-page-review'
});

const isFact = (value) => value && typeof value === 'object' && !Array.isArray(value) && 'status' in value && 'verifiedAt' in value;
const asFact = (value, sourceId, unit = null, note = null) => isFact(value) ? value : verifiedFact(value, sourceId, unit, note);

export const modelVendors = [
  { id: 'openai', name: 'OpenAI', families: ['GPT-5.6', 'Codex', 'gpt-oss'], positioning: '前沿推理、智能编程与开放权重模型。', logoPath: null },
  { id: 'anthropic', name: 'Anthropic', families: ['Claude'], positioning: '面向复杂工作、编程与低延迟任务的 Claude 家族。', logoPath: null },
  { id: 'google', name: 'Google', families: ['Gemini'], positioning: '原生多模态与长上下文 Gemini 模型。', logoPath: null },
  { id: 'deepseek', name: 'DeepSeek', families: ['DeepSeek V4'], positioning: '开放权重的长上下文推理与高吞吐模型。', logoPath: '/icons/ai-tools/deepseek.svg' },
  { id: 'alibaba-cloud', name: 'Alibaba Cloud', families: ['Qwen'], positioning: '覆盖旗舰、均衡、低成本和全模态的千问模型。', logoPath: '/icons/ai-tools/tongyi-qianwen.svg' },
  { id: 'meta', name: 'Meta', families: ['Llama 4'], positioning: '面向本地与自托管部署的开放权重多模态模型。', logoPath: '/icons/ai-tools/meta-ai.svg' },
  { id: 'xai', name: 'xAI', families: ['Grok'], positioning: '通用推理、编程与 agentic 工作负载模型。', logoPath: null },
  { id: 'mistral-ai', name: 'Mistral AI', families: ['Mistral', 'Ministral', 'Codestral'], positioning: '开放权重通用、轻量与代码模型组合。', logoPath: '/icons/ai-tools/mistral-le-chat.svg' },
  { id: 'moonshot-ai', name: 'Moonshot AI', families: ['Kimi'], positioning: '面向长程编程、知识工作与深度推理的多模态 Kimi 模型。', logoPath: '/icons/ai-tools/kimi.svg' },
  { id: 'zhipu-ai', name: 'Zhipu AI', families: ['GLM'], positioning: '长上下文、工具调用与多模态 GLM 模型。', logoPath: '/icons/ai-tools/zhipu-qingyan.svg' }
];

const emptyPricing = (status = 'official-unpublished', note = '官方公开价格未完成字段级核对', sourceId = null) => ({
  status,
  currency: null,
  billingUnit: null,
  standard: { input: null, cachedInput: null, output: null },
  batch: { input: null, output: null },
  longContext: { threshold: null, input: null, cachedInput: null, output: null },
  priority: { input: null, output: null },
  freeTier: null,
  region: null,
  sourceId,
  verifiedAt: MODEL_AUDIT_DATE,
  note
});

const tokenPricing = ({
  input, output, cachedInput = null, currency = 'USD', batchInput = null, batchOutput = null,
  threshold = null, longInput = null, longCachedInput = null, longOutput = null,
  priorityInput = null, priorityOutput = null, region = 'global', freeTier = null, sourceId, note = null
}) => ({
  status: 'verified',
  currency,
  billingUnit: '1M tokens',
  standard: { input, cachedInput, output },
  batch: { input: batchInput, output: batchOutput },
  longContext: { threshold, input: longInput, cachedInput: longCachedInput, output: longOutput },
  priority: { input: priorityInput, output: priorityOutput },
  freeTier,
  region,
  sourceId,
  verifiedAt: MODEL_AUDIT_DATE,
  note
});

const commercialDefaults = (sourceId) => ({
  functionCalling: verifiedFact(true, sourceId),
  toolCalling: verifiedFact(true, sourceId),
  structuredOutput: verifiedFact(true, sourceId),
  apiAvailable: verifiedFact(true, sourceId),
  webAvailable: unpublishedFact('官方网页产品可用性未作统一核对', sourceId),
  openWeights: verifiedFact(false, sourceId),
  localDeployment: notApplicableFact('官方未提供可本地部署权重', sourceId)
});

function createModel({
  slug, name, officialModelId, officialAliases = [], snapshotId = null, snapshotIds = [], vendorSlug,
  family, familySlug, productLine = slug, version, lifecycleStatus = 'stable', releaseChannel = 'stable',
  releaseDate = unpublishedFact(), deprecationDate = unpublishedFact(), shutdownDate = unpublishedFact(),
  replacementModelSlug = null, deprecationSourceId = null, summary, positioning = null, taskIds = [], type = '通用模型',
  knowledgeCutoff = unpublishedFact(), contextWindow = unpublishedFact(), maxOutputTokens = unpublishedFact(),
  inputModalities, outputModalities, reasoningModes = unpublishedFact(), reasoningEffortLevels = unpublishedFact(),
  features = {}, apiAvailable = undefined, webAvailable = undefined, openWeights = undefined,
  license = unpublishedFact(), parameterCount = unpublishedFact(), activeParameterCount = unpublishedFact(),
  localDeployment = undefined, regions = unpublishedFact(), pricing = emptyPricing(), sourceIds,
  benchmarks = [], limitations = [], recommendedScenarios = [], versionRelations = [], detailLevel = 'standard'
}) {
  const resolvedSourceIds = [...new Set(sourceIds)];
  const resolvedSnapshotIds = [...new Set([snapshotId, ...snapshotIds].filter(Boolean))];
  const primarySourceId = resolvedSourceIds[0];
  const defaults = commercialDefaults(primarySourceId);
  const resolved = {
    functionCalling: features.functionCalling ?? defaults.functionCalling,
    toolCalling: features.toolCalling ?? defaults.toolCalling,
    structuredOutput: features.structuredOutput ?? defaults.structuredOutput,
    webSearch: features.webSearch ?? unpublishedFact('官方模型页未明确统一支持状态', primarySourceId),
    fileSearch: features.fileSearch ?? unpublishedFact('官方模型页未明确统一支持状态', primarySourceId),
    computerUse: features.computerUse ?? unpublishedFact('官方模型页未明确统一支持状态', primarySourceId),
    codeExecution: features.codeExecution ?? unpublishedFact('官方模型页未明确统一支持状态', primarySourceId),
    fineTuning: features.fineTuning ?? unpublishedFact('官方模型页未明确统一支持状态', primarySourceId),
    batchApi: features.batchApi ?? unpublishedFact('官方模型页未明确统一支持状态', primarySourceId),
    promptCaching: features.promptCaching ?? unpublishedFact('官方模型页未明确统一支持状态', primarySourceId),
    apiAvailable: apiAvailable ?? defaults.apiAvailable,
    webAvailable: webAvailable ?? defaults.webAvailable,
    openWeights: openWeights ?? defaults.openWeights,
    localDeployment: localDeployment ?? defaults.localDeployment
  };
  const facts = [
    officialModelId, positioning, releaseDate, knowledgeCutoff, contextWindow, maxOutputTokens, inputModalities, outputModalities,
    reasoningModes, reasoningEffortLevels, ...Object.values(resolved), license, parameterCount,
    activeParameterCount, regions
  ];
  const verifiedCount = facts.filter((fact) => fact?.status === 'verified').length;
  const unknownCount = facts.filter((fact) => ['official-unpublished', 'unpublished'].includes(fact?.status)).length;

  return {
    slug, name, displayName: name, officialModelId, officialAliases: [...new Set(officialAliases)],
    snapshotId: resolvedSnapshotIds[0] || null, snapshotIds: resolvedSnapshotIds,
    vendorSlug, vendorId: vendorSlug, family, familySlug, productLine, version,
    lifecycleStatus, releaseChannel, releaseDate,
    deprecationDate, shutdownDate, replacementModelSlug, deprecationSourceId,
    knowledgeCutoff, contextWindow, maxOutputTokens, inputModalities, outputModalities,
    reasoningModes, reasoningEffortLevels, ...resolved, license, parameterCount,
    activeParameterCount, localDeployment: resolved.localDeployment, regions,
    lastVerifiedAt: MODEL_AUDIT_DATE, nextReviewAt: '2026-07-29', sourceIds: resolvedSourceIds,
    pricing, summary, positioning, taskIds, type, benchmarks, limitations, recommendedScenarios,
    versionRelations, detailLevel,
    aliases: [...new Set(officialAliases)],
    verification: {
      status: unknownCount ? '部分核实' : '已核实',
      checkedAt: MODEL_AUDIT_DATE,
      nextReviewAt: '2026-07-29',
      confidence: unknownCount ? 'partial' : 'verified',
      verifiedFieldCount: verifiedCount,
      sourceCount: resolvedSourceIds.length
    },
    sources: resolvedSourceIds.map((id) => modelSourceById.get(id)).filter(Boolean)
  };
}

const oaFeatures = (sourceId) => ({
  functionCalling: verifiedFact(true, sourceId), toolCalling: verifiedFact(true, sourceId),
  structuredOutput: verifiedFact(true, sourceId), webSearch: verifiedFact(true, sourceId),
  fileSearch: verifiedFact(true, sourceId), computerUse: verifiedFact(true, sourceId),
  codeExecution: verifiedFact(true, sourceId), fineTuning: verifiedFact(false, sourceId),
  batchApi: verifiedFact(true, sourceId), promptCaching: verifiedFact(true, sourceId)
});

const gpt56 = ({ slug, name, id, aliases = [], priceIn, priceCached, priceOut, detailLevel = 'standard' }) => createModel({
  slug, name, officialModelId: id, officialAliases: aliases, vendorSlug: 'openai', family: 'GPT-5.6',
  familySlug: 'gpt-5-6', version: '5.6', summary: `${name} 是 GPT-5.6 家族的当前模型，支持长上下文、可配置推理与工具调用。`,
  taskIds: ['reasoning', 'coding', 'writing', 'multimodal'], type: '推理 / 多模态', detailLevel,
  contextWindow: verifiedFact(1050000, 'openai-gpt-5-6-compare', 'tokens'),
  maxOutputTokens: verifiedFact(128000, 'openai-gpt-5-6-compare', 'tokens'),
  knowledgeCutoff: verifiedFact('2026-02-16', 'openai-gpt-5-6-compare', 'date'),
  inputModalities: verifiedFact(['text', 'image'], 'openai-model-catalog'),
  outputModalities: verifiedFact(['text'], 'openai-model-catalog'),
  reasoningModes: verifiedFact(['standard', 'pro'], 'openai-gpt-5-6-sol'),
  reasoningEffortLevels: verifiedFact(['none', 'low', 'medium', 'high', 'xhigh', 'max'], 'openai-model-catalog'),
  features: oaFeatures('openai-gpt-5-6-sol'),
  regions: verifiedFact(['supported OpenAI API regions'], 'openai-model-catalog'),
  pricing: tokenPricing({ input: priceIn, cachedInput: priceCached, output: priceOut, threshold: 272000, longInput: priceIn * 2, longCachedInput: priceCached * 2, longOutput: priceOut * 1.5, sourceId: 'openai-gpt-5-6-sol', note: '超过 272K 输入时，整次请求按长上下文费率计费；cache write 另有规则。' }),
  sourceIds: ['openai-model-catalog', 'openai-gpt-5-6-sol', 'openai-gpt-5-6-compare']
});

const currentModels = [
  gpt56({ slug: 'gpt-5-6-sol', name: 'GPT-5.6 Sol', id: 'gpt-5.6-sol', aliases: ['gpt-5.6'], priceIn: 5, priceCached: 0.5, priceOut: 30, detailLevel: 'featured' }),
  gpt56({ slug: 'gpt-5-6-terra', name: 'GPT-5.6 Terra', id: 'gpt-5.6-terra', priceIn: 2.5, priceCached: 0.25, priceOut: 15 }),
  gpt56({ slug: 'gpt-5-6-luna', name: 'GPT-5.6 Luna', id: 'gpt-5.6-luna', priceIn: 1, priceCached: 0.1, priceOut: 6 }),
  createModel({
    slug: 'gpt-5-3-codex', name: 'GPT-5.3-Codex', officialModelId: 'gpt-5.3-codex', vendorSlug: 'openai', family: 'Codex', familySlug: 'codex', version: '5.3',
    summary: '面向 agentic 编程任务的 Codex 专用模型，支持文本与图像输入及可配置推理。', taskIds: ['coding', 'reasoning'], type: '编程 / 推理',
    contextWindow: verifiedFact(400000, 'openai-gpt-5-3-codex', 'tokens'), maxOutputTokens: verifiedFact(128000, 'openai-gpt-5-3-codex', 'tokens'),
    knowledgeCutoff: verifiedFact('2025-08-31', 'openai-gpt-5-3-codex', 'date'), inputModalities: verifiedFact(['text', 'image'], 'openai-gpt-5-3-codex'), outputModalities: verifiedFact(['text'], 'openai-gpt-5-3-codex'),
    reasoningModes: verifiedFact(['reasoning'], 'openai-gpt-5-3-codex'), reasoningEffortLevels: verifiedFact(['low', 'medium', 'high', 'xhigh'], 'openai-gpt-5-3-codex'),
    features: oaFeatures('openai-gpt-5-3-codex'), pricing: tokenPricing({ input: 1.75, cachedInput: 0.175, output: 14, sourceId: 'openai-gpt-5-3-codex' }),
    regions: verifiedFact(['supported OpenAI API regions'], 'openai-model-catalog'), sourceIds: ['openai-gpt-5-3-codex', 'openai-model-catalog']
  }),
  createModel({
    slug: 'gpt-oss-120b', name: 'gpt-oss-120b', officialModelId: 'gpt-oss-120b', vendorSlug: 'openai', family: 'gpt-oss', familySlug: 'gpt-oss', version: '120b', lifecycleStatus: 'open-weight', releaseChannel: 'stable',
    summary: 'OpenAI 的 Apache 2.0 开放权重推理模型，可在单张 H100 级 GPU 上部署。', taskIds: ['reasoning', 'coding', 'value'], type: '开放权重 / 推理',
    knowledgeCutoff: verifiedFact('2024-06-01', 'openai-gpt-oss-120b', 'date'), contextWindow: verifiedFact(131072, 'openai-gpt-oss-120b', 'tokens'), maxOutputTokens: verifiedFact(131072, 'openai-gpt-oss-120b', 'tokens'),
    inputModalities: verifiedFact(['text'], 'openai-gpt-oss-120b'), outputModalities: verifiedFact(['text'], 'openai-gpt-oss-120b'), reasoningModes: verifiedFact(['reasoning'], 'openai-gpt-oss-120b'),
    reasoningEffortLevels: verifiedFact(['low', 'medium', 'high'], 'openai-gpt-oss-120b'), features: { ...oaFeatures('openai-gpt-oss-120b'), fineTuning: verifiedFact(true, 'openai-gpt-oss-120b') },
    apiAvailable: verifiedFact(false, 'openai-gpt-oss-120b'), openWeights: verifiedFact(true, 'openai-gpt-oss-120b'), license: verifiedFact('Apache-2.0', 'openai-gpt-oss-120b'),
    parameterCount: verifiedFact(117000000000, 'openai-gpt-oss-120b', 'parameters'), activeParameterCount: verifiedFact(5100000000, 'openai-gpt-oss-120b', 'parameters'),
    localDeployment: verifiedFact('单张 H100 级 GPU', 'openai-gpt-oss-120b'), regions: notApplicableFact('开放权重本地部署不受托管 API 地区字段限制', 'openai-gpt-oss-120b'),
    pricing: emptyPricing('not-applicable', '开放权重模型没有 OpenAI 统一托管 token 单价', 'openai-gpt-oss-120b'), sourceIds: ['openai-gpt-oss-120b', 'openai-model-catalog']
  }),
  createModel({
    slug: 'gpt-oss-20b', name: 'gpt-oss-20b', officialModelId: 'gpt-oss-20b', vendorSlug: 'openai', family: 'gpt-oss', familySlug: 'gpt-oss', version: '20b', lifecycleStatus: 'open-weight', releaseChannel: 'stable',
    summary: 'OpenAI 面向低延迟、本地和专用场景的中型开放权重推理模型。', taskIds: ['reasoning', 'coding', 'value'], type: '开放权重 / 推理',
    knowledgeCutoff: verifiedFact('2024-06-01', 'openai-gpt-oss-20b', 'date'), contextWindow: verifiedFact(131072, 'openai-gpt-oss-20b', 'tokens'), maxOutputTokens: verifiedFact(131072, 'openai-gpt-oss-20b', 'tokens'),
    inputModalities: verifiedFact(['text'], 'openai-gpt-oss-20b'), outputModalities: verifiedFact(['text'], 'openai-gpt-oss-20b'), reasoningModes: verifiedFact(['reasoning'], 'openai-gpt-oss-20b'),
    reasoningEffortLevels: verifiedFact(['low', 'medium', 'high'], 'openai-gpt-oss-20b'), features: { ...oaFeatures('openai-gpt-oss-20b'), fineTuning: verifiedFact(true, 'openai-gpt-oss-20b') },
    apiAvailable: verifiedFact(false, 'openai-gpt-oss-20b'), openWeights: verifiedFact(true, 'openai-gpt-oss-20b'), license: verifiedFact('Apache-2.0', 'openai-gpt-oss-20b'),
    parameterCount: verifiedFact(21000000000, 'openai-gpt-oss-20b', 'parameters'), activeParameterCount: verifiedFact(3600000000, 'openai-gpt-oss-20b', 'parameters'),
    localDeployment: verifiedFact('官方提供开放权重，面向本地与专用部署', 'openai-gpt-oss-20b'), regions: notApplicableFact('开放权重本地部署不受托管 API 地区字段限制', 'openai-gpt-oss-20b'),
    pricing: emptyPricing('not-applicable', '开放权重模型没有 OpenAI 统一托管 token 单价', 'openai-gpt-oss-20b'), sourceIds: ['openai-gpt-oss-20b', 'openai-model-catalog']
  }),

  ...[
    ['claude-sonnet-5', 'Claude Sonnet 5', 'claude-sonnet-5', null, 1000000, 128000, '2026-01', 3, 15, 'anthropic-sonnet-5', '2026-06-30', 'anthropic-sonnet-5-release', ['reasoning', 'coding', 'writing'], 'featured'],
    ['claude-opus-4-8', 'Claude Opus 4.8', 'claude-opus-4-8', null, 1000000, 128000, '2026-01', 5, 25, 'anthropic-model-overview', '2026-05-28', 'anthropic-opus-4-8-release', ['reasoning', 'coding'], 'standard'],
    ['claude-haiku-4-5', 'Claude Haiku 4.5', 'claude-haiku-4-5-20251001', 'claude-haiku-4-5', 200000, 64000, '2025-02', 1, 5, 'anthropic-model-overview', '2025-10-15', 'anthropic-haiku-4-5-release', ['writing', 'value'], 'standard']
  ].map(([slug, name, id, alias, context, output, cutoff, inputPrice, outputPrice, sourceId, released, releaseSourceId, taskIds, detailLevel]) => createModel({
    slug, name, officialModelId: id, officialAliases: alias ? [alias] : [], snapshotId: slug === 'claude-haiku-4-5' ? id : null,
    vendorSlug: 'anthropic', family: 'Claude', familySlug: 'claude', version: name.replace('Claude ', ''), summary: `${name} 是 Anthropic 当前 Claude 模型之一，支持文本与图像输入。`,
    taskIds, type: '通用 / 多模态', detailLevel, releaseDate: verifiedFact(released, releaseSourceId, 'date'),
    contextWindow: verifiedFact(context, sourceId, 'tokens'), maxOutputTokens: verifiedFact(output, sourceId, 'tokens'), knowledgeCutoff: verifiedFact(cutoff, sourceId, 'month'),
    inputModalities: verifiedFact(['text', 'image'], sourceId), outputModalities: verifiedFact(['text'], sourceId), reasoningModes: verifiedFact(['adaptive thinking'], sourceId),
    reasoningEffortLevels: unpublishedFact('各模型思考参数支持方式不同，按模型文档设置', sourceId), features: { functionCalling: verifiedFact(true, sourceId), toolCalling: verifiedFact(true, sourceId), promptCaching: verifiedFact(true, 'anthropic-pricing'), batchApi: verifiedFact(true, 'anthropic-pricing') },
    pricing: tokenPricing({ input: inputPrice, output: outputPrice, cachedInput: inputPrice / 10, batchInput: inputPrice / 2, batchOutput: outputPrice / 2, sourceId: 'anthropic-pricing' }),
    regions: verifiedFact(['Claude API', 'AWS', 'Google Cloud', 'Microsoft Foundry'], 'anthropic-model-overview'), sourceIds: [sourceId, releaseSourceId, 'anthropic-model-overview', 'anthropic-model-ids', 'anthropic-pricing']
  })),

  createModel({
    slug: 'gemini-3-1-pro-preview', name: 'Gemini 3.1 Pro Preview', officialModelId: 'gemini-3.1-pro-preview', officialAliases: ['gemini-pro-latest'], vendorSlug: 'google', family: 'Gemini 3', familySlug: 'gemini-3', version: '3.1 Pro', lifecycleStatus: 'preview', releaseChannel: 'preview',
    summary: '面向复杂多模态推理、agentic 与编程任务的 Gemini Pro 预览模型。', taskIds: ['reasoning', 'coding', 'multimodal'], type: '推理 / 多模态', detailLevel: 'featured',
    releaseDate: verifiedFact('2026-02-19', 'google-changelog', 'date'), contextWindow: verifiedFact(1048576, 'google-gemini-3', 'tokens'), maxOutputTokens: verifiedFact(65536, 'google-gemini-3', 'tokens'), knowledgeCutoff: verifiedFact('2025-01', 'google-gemini-3', 'month'),
    inputModalities: verifiedFact(['text', 'image', 'video', 'audio'], 'google-gemini-3'), outputModalities: verifiedFact(['text'], 'google-gemini-3'), reasoningModes: verifiedFact(['thinking'], 'google-gemini-3'),
    pricing: tokenPricing({ input: 2, output: 12, threshold: 200000, longInput: 4, longOutput: 18, sourceId: 'google-pricing' }), sourceIds: ['google-models', 'google-gemini-3', 'google-pricing', 'google-changelog']
  }),
  createModel({
    slug: 'gemini-3-6-flash', name: 'Gemini 3.6 Flash', officialModelId: 'gemini-3.6-flash', vendorSlug: 'google', family: 'Gemini 3', familySlug: 'gemini-3', version: '3.6 Flash',
    summary: 'Google 当前稳定的高性能 Flash 模型，面向快速 agentic、编程和空间推理任务。', taskIds: ['coding', 'multimodal', 'value'], type: '通用 / 多模态',
    contextWindow: verifiedFact(1048576, 'google-gemini-3-6-flash', 'tokens'), maxOutputTokens: verifiedFact(65536, 'google-gemini-3-6-flash', 'tokens'),
    inputModalities: verifiedFact(['text', 'image', 'video', 'audio', 'pdf'], 'google-gemini-3-6-flash'), outputModalities: verifiedFact(['text'], 'google-gemini-3-6-flash'), reasoningModes: verifiedFact(['thinking'], 'google-gemini-3-6-flash'),
    features: { functionCalling: verifiedFact(true, 'google-gemini-3-6-flash'), toolCalling: verifiedFact(true, 'google-gemini-3-6-flash'), structuredOutput: verifiedFact(true, 'google-gemini-3-6-flash'), webSearch: verifiedFact(true, 'google-gemini-3-6-flash'), fileSearch: verifiedFact(true, 'google-gemini-3-6-flash'), computerUse: verifiedFact(true, 'google-gemini-3-6-flash', null, 'Preview'), codeExecution: verifiedFact(true, 'google-gemini-3-6-flash'), batchApi: verifiedFact(true, 'google-gemini-3-6-flash'), promptCaching: verifiedFact(true, 'google-gemini-3-6-flash') },
    pricing: tokenPricing({ input: 1.5, output: 7.5, sourceId: 'google-latest-models' }), sourceIds: ['google-latest-models', 'google-gemini-3-6-flash', 'google-pricing']
  }),
  createModel({
    slug: 'gemini-3-5-flash-lite', name: 'Gemini 3.5 Flash-Lite', officialModelId: 'gemini-3.5-flash-lite', vendorSlug: 'google', family: 'Gemini 3', familySlug: 'gemini-3', version: '3.5 Flash-Lite',
    summary: '面向高吞吐、低延迟与成本敏感型子代理和文档解析任务的稳定轻量模型。', taskIds: ['multimodal', 'value'], type: '轻量 / 多模态',
    contextWindow: verifiedFact(1048576, 'google-gemini-3-5-flash-lite', 'tokens'), maxOutputTokens: verifiedFact(65536, 'google-gemini-3-5-flash-lite', 'tokens'),
    inputModalities: verifiedFact(['text', 'image', 'video', 'audio', 'pdf'], 'google-gemini-3-5-flash-lite'), outputModalities: verifiedFact(['text'], 'google-gemini-3-5-flash-lite'), reasoningModes: verifiedFact(['thinking'], 'google-gemini-3-5-flash-lite'),
    features: { functionCalling: verifiedFact(true, 'google-gemini-3-5-flash-lite'), toolCalling: verifiedFact(true, 'google-gemini-3-5-flash-lite'), structuredOutput: verifiedFact(true, 'google-gemini-3-5-flash-lite'), webSearch: verifiedFact(true, 'google-gemini-3-5-flash-lite'), fileSearch: verifiedFact(true, 'google-gemini-3-5-flash-lite'), computerUse: verifiedFact(false, 'google-gemini-3-5-flash-lite'), codeExecution: verifiedFact(true, 'google-gemini-3-5-flash-lite'), batchApi: verifiedFact(true, 'google-gemini-3-5-flash-lite'), promptCaching: verifiedFact(true, 'google-gemini-3-5-flash-lite') },
    pricing: tokenPricing({ input: 0.3, output: 2.5, sourceId: 'google-latest-models' }), sourceIds: ['google-latest-models', 'google-gemini-3-5-flash-lite', 'google-pricing']
  }),

  ...[
    ['deepseek-v4-pro', 'DeepSeek V4 Pro', 1600000000000, 49000000000, 0.435, 0.003625, 0.87, ['reasoning', 'coding', 'chinese']],
    ['deepseek-v4-flash', 'DeepSeek V4 Flash', 284000000000, 13000000000, 0.14, 0.0028, 0.28, ['reasoning', 'coding', 'chinese', 'value']]
  ].map(([slug, name, params, active, input, cached, output, taskIds]) => createModel({
    slug, name, officialModelId: slug, officialAliases: slug === 'deepseek-v4-flash' ? ['deepseek-chat', 'deepseek-reasoner'] : [], vendorSlug: 'deepseek', family: 'DeepSeek V4', familySlug: 'deepseek-v4', version: name.endsWith('Pro') ? 'V4 Pro' : 'V4 Flash', lifecycleStatus: 'preview', releaseChannel: 'preview',
    releaseDate: verifiedFact('2026-04-24', 'deepseek-v4-release', 'date'), summary: `${name} 是 DeepSeek V4 预览系列的开放权重长上下文模型。`, taskIds, type: '推理 / 开放权重',
    contextWindow: verifiedFact(1000000, 'deepseek-v4-pricing', 'tokens'), maxOutputTokens: verifiedFact(384000, 'deepseek-v4-pricing', 'tokens'), inputModalities: verifiedFact(['text'], 'deepseek-v4-pricing'), outputModalities: verifiedFact(['text'], 'deepseek-v4-pricing'),
    reasoningModes: verifiedFact(['thinking', 'non-thinking'], 'deepseek-v4-pricing'), reasoningEffortLevels: verifiedFact(['high', 'max'], 'deepseek-v4-release'), features: { functionCalling: verifiedFact(true, 'deepseek-v4-pricing'), toolCalling: verifiedFact(true, 'deepseek-v4-pricing'), structuredOutput: verifiedFact(true, 'deepseek-v4-pricing'), promptCaching: verifiedFact(true, 'deepseek-v4-pricing') },
    openWeights: verifiedFact(true, 'deepseek-v4-release'), parameterCount: verifiedFact(params, 'deepseek-v4-release', 'parameters'), activeParameterCount: verifiedFact(active, 'deepseek-v4-release', 'parameters'), localDeployment: verifiedFact('官方提供开放权重，硬件要求见技术报告', 'deepseek-v4-release'),
    pricing: tokenPricing({ input, cachedInput: cached, output, sourceId: 'deepseek-v4-pricing' }), regions: verifiedFact(['DeepSeek official API'], 'deepseek-v4-pricing'), sourceIds: ['deepseek-v4-release', 'deepseek-v4-pricing', 'deepseek-changelog']
  })),

  ...[
    ['qwen3-7-max', 'Qwen3.7 Max', 'qwen3.7-max', 'qwen3.7-max-2026-06-08', ['reasoning', 'coding', 'chinese'], '旗舰 / 推理', 12, 36, null, null, null, ['text']],
    ['qwen3-7-plus', 'Qwen3.7 Plus', 'qwen3.7-plus', 'qwen3.7-plus-2026-05-26', ['reasoning', 'chinese', 'value', 'multimodal'], '通用 / 推理', 2, 8, 256000, 6, 24, ['text', 'image', 'video']],
    ['qwen3-6-flash', 'Qwen3.6 Flash', 'qwen3.6-flash', 'qwen3.6-flash-2026-04-16', ['chinese', 'value', 'multimodal'], '轻量 / 推理', 1.2, 7.2, 256000, 4.8, 28.8, ['text', 'image', 'video']]
  ].map(([slug, name, id, snapshot, taskIds, type, inputPrice, outputPrice, threshold, longInput, longOutput, modalities]) => createModel({
    slug, name, officialModelId: id, snapshotIds: snapshot ? [snapshot] : [],
    vendorSlug: 'alibaba-cloud', family: 'Qwen', familySlug: 'qwen', version: name.replace('Qwen', ''), summary: `${name} 是阿里云百炼当前可用的千问模型。`, taskIds, type,
    releaseDate: slug === 'qwen3-7-max' ? unpublishedFact('mutable model ID 的正式发布日期未单独标注；固定版本 ID 仅作为版本关系保留', 'alibaba-models') : verifiedFact(snapshot.slice(-10), 'alibaba-models', 'date', '固定版本 ID 日期'),
    contextWindow: verifiedFact(1000000, 'alibaba-pricing', 'tokens'),
    inputModalities: verifiedFact(modalities, modalities.length > 1 ? 'alibaba-vision' : 'alibaba-models'), outputModalities: verifiedFact(['text'], 'alibaba-models'),
    reasoningModes: verifiedFact(['thinking', 'non-thinking'], slug === 'qwen3-7-max' ? 'alibaba-overview' : 'alibaba-models'), apiAvailable: verifiedFact(true, 'alibaba-models'),
    features: { batchApi: verifiedFact(true, 'alibaba-pricing'), promptCaching: verifiedFact(true, 'alibaba-pricing') },
    regions: verifiedFact(['cn-beijing', 'ap-southeast-1', 'ap-northeast-1', 'eu-central-1', 'us-east-1'], 'alibaba-models'),
    pricing: tokenPricing({
      input: inputPrice,
      output: outputPrice,
      currency: 'CNY',
      batchInput: threshold ? inputPrice / 2 : null,
      batchOutput: threshold ? outputPrice / 2 : null,
      threshold,
      longInput,
      longOutput,
      region: 'global',
      sourceId: 'alibaba-pricing',
      note: threshold
        ? '全球部署原价；长上下文费率适用于输入超过 256K tokens，Batch 数值为基础分段的 50%；不采用限时优惠价。'
        : '全球部署原价；不采用限时优惠价。'
    }),
    sourceIds: ['alibaba-models', 'alibaba-overview', 'alibaba-rate-limits', 'alibaba-pricing', ...(modalities.length > 1 ? ['alibaba-vision'] : [])]
  })),

  ...[
    ['llama-4-scout', 'Llama 4 Scout', 'Llama-4-Scout-17B-16E-Instruct', 10000000, 16, '单张 H100 80GB（INT4）；BF16 至少 4 GPU'],
    ['llama-4-maverick', 'Llama 4 Maverick', 'Llama-4-Maverick-17B-128E-Instruct', 1000000, 128, '单台 H100 主机级配置']
  ].map(([slug, name, id, context, experts, deployment]) => createModel({
    slug, name, officialModelId: id, vendorSlug: 'meta', family: 'Llama 4', familySlug: 'llama-4', version: name.replace('Llama ', ''), lifecycleStatus: 'open-weight', releaseChannel: 'stable', releaseDate: verifiedFact('2025-04-05', 'meta-llama-4-release', 'date'),
    summary: `${name} 是 Meta 发布的原生多模态开放权重 MoE 模型。`, taskIds: ['multimodal', 'value'], type: '开放权重 / 多模态',
    contextWindow: verifiedFact(context, 'meta-llama-models', 'tokens'), inputModalities: verifiedFact(['text', 'image'], 'meta-llama-4-release'), outputModalities: verifiedFact(['text'], 'meta-llama-4-release'),
    parameterCount: verifiedFact(experts, 'meta-llama-4-release', 'experts', '模型名称中的 expert 数量'), activeParameterCount: verifiedFact(17000000000, 'meta-llama-4-release', 'parameters'),
    openWeights: verifiedFact(true, 'meta-llama-models'), license: verifiedFact('Llama 4 Community License', 'meta-llama-models'), apiAvailable: verifiedFact(false, 'meta-llama-models', null, 'Meta 官方权重下载；不记录第三方 API'),
    localDeployment: verifiedFact(deployment, 'meta-llama-models'), regions: notApplicableFact('开放权重本地部署', 'meta-llama-models'), pricing: emptyPricing('not-applicable', 'Meta 未发布统一托管 API token 标准价', 'meta-llama-models'),
    sourceIds: ['meta-llama-4-release', 'meta-llama-models']
  })),

  createModel({
    slug: 'grok-4-5', name: 'Grok 4.5', officialModelId: 'grok-4.5', officialAliases: ['grok-4.5-latest'], vendorSlug: 'xai', family: 'Grok', familySlug: 'grok', version: '4.5',
    releaseDate: verifiedFact('2026-07-08', 'xai-release-notes', 'date'), summary: 'xAI 当前面向编程、agentic 与知识工作的前沿模型。', taskIds: ['reasoning', 'coding', 'multimodal'], type: '推理 / 多模态',
    knowledgeCutoff: verifiedFact('2026-02-01', 'xai-grok-4-5', 'date'), contextWindow: verifiedFact(500000, 'xai-grok-4-5', 'tokens'), inputModalities: verifiedFact(['text', 'image'], 'xai-grok-4-5'), outputModalities: verifiedFact(['text'], 'xai-grok-4-5'),
    reasoningModes: verifiedFact(['reasoning'], 'xai-grok-4-5'), reasoningEffortLevels: verifiedFact(['low', 'medium', 'high'], 'xai-grok-4-5'), features: { functionCalling: verifiedFact(true, 'xai-grok-4-5'), structuredOutput: verifiedFact(true, 'xai-grok-4-5'), webSearch: verifiedFact(true, 'xai-grok-4-5'), codeExecution: verifiedFact(true, 'xai-grok-4-5'), promptCaching: verifiedFact(true, 'xai-grok-4-5') },
    pricing: tokenPricing({ input: 2, cachedInput: 0.3, output: 6, threshold: 200000, longInput: 4, longCachedInput: 0.6, longOutput: 12, sourceId: 'xai-pricing' }), regions: verifiedFact(['us-east-1', 'us-west-2'], 'xai-grok-4-5'), sourceIds: ['xai-grok-4-5', 'xai-pricing', 'xai-release-notes']
  }),
  createModel({
    slug: 'grok-build-0-1', name: 'Grok Build 0.1', officialModelId: 'grok-build-0.1', officialAliases: ['grok-build-latest', 'grok-code-fast-1', 'grok-code-fast', 'grok-code-fast-1-0825'], vendorSlug: 'xai', family: 'Grok Build', familySlug: 'grok-build', version: '0.1', lifecycleStatus: 'preview', releaseChannel: 'preview',
    releaseDate: verifiedFact('2026-05-19', 'xai-release-notes', 'date'), summary: '面向 agentic 软件工程与工作流任务的 Grok Build 早期访问模型。', taskIds: ['coding', 'value'], type: '编程 / 推理', contextWindow: verifiedFact(256000, 'xai-grok-build', 'tokens'),
    inputModalities: verifiedFact(['text', 'image'], 'xai-grok-build'), outputModalities: verifiedFact(['text'], 'xai-grok-build'), reasoningModes: verifiedFact(['reasoning'], 'xai-grok-build'), features: { functionCalling: verifiedFact(true, 'xai-grok-build'), structuredOutput: verifiedFact(true, 'xai-grok-build'), promptCaching: verifiedFact(true, 'xai-grok-build') },
    pricing: tokenPricing({ input: 1, cachedInput: 0.2, output: 2, sourceId: 'xai-pricing' }), regions: verifiedFact(['us-east-1', 'us-west-2'], 'xai-grok-build'), sourceIds: ['xai-grok-build', 'xai-pricing', 'xai-release-notes']
  }),

  ...[
    ['mistral-medium-3-5', 'Mistral Medium 3.5', 'mistral-medium-3-5', '26.04', ['reasoning', 'coding', 'multimodal'], 1.5, 7.5, 128000000000, 128000000000, '2026-04-28'],
    ['mistral-small-4', 'Mistral Small 4', 'mistral-small-2603', '26.03', ['reasoning', 'coding', 'value'], 0.15, 0.6, 119000000000, 6500000000, '2026-03'],
    ['mistral-large-3', 'Mistral Large 3', 'mistral-large-2512', '25.12', ['reasoning', 'coding', 'multimodal'], 0.5, 1.5, 675000000000, 41000000000, '2025-12'],
    ['ministral-3-14b', 'Ministral 3 14B', 'ministral-14b-2512', '25.12', ['multimodal', 'value'], 0.2, 0.2, 14000000000, 14000000000, '2025-12'],
    ['ministral-3-8b', 'Ministral 3 8B', 'ministral-8b-2512', '25.12', ['multimodal', 'value'], 0.15, 0.15, 8000000000, 8000000000, '2025-12'],
    ['ministral-3-3b', 'Ministral 3 3B', 'ministral-3b-2512', '25.12', ['multimodal', 'value'], 0.1, 0.1, 3000000000, 3000000000, '2025-12'],
    ['codestral-25-08', 'Codestral 25.08', 'codestral-2508', '25.08', ['coding'], null, null, null, null, '2025-07']
  ].map(([slug, name, id, version, taskIds, input, output, params, active, released]) => createModel({
    slug, name, officialModelId: id, vendorSlug: 'mistral-ai', family: slug.startsWith('ministral') ? 'Ministral' : slug.startsWith('codestral') ? 'Codestral' : 'Mistral', familySlug: slug.startsWith('ministral') ? 'ministral' : slug.startsWith('codestral') ? 'codestral' : 'mistral', version,
    lifecycleStatus: slug.startsWith('codestral') ? 'stable' : 'open-weight', releaseChannel: 'stable', releaseDate: verifiedFact(released, slug === 'mistral-medium-3-5' ? 'mistral-medium-3-5' : 'mistral-selection-guide', released.length === 10 ? 'date' : 'month'),
    summary: `${name} 是 Mistral 官方当前模型目录中的${slug.startsWith('codestral') ? '代码专用' : '开放权重'}模型。`, taskIds, type: slug.startsWith('codestral') ? '编程模型' : '开放权重 / 多模态',
    contextWindow: verifiedFact(slug.startsWith('codestral') ? 128000 : 256000, 'mistral-known-limitations', 'tokens'),
    inputModalities: verifiedFact(slug.startsWith('codestral') ? ['text'] : ['text', 'image'], 'mistral-selection-guide'), outputModalities: verifiedFact(['text'], 'mistral-selection-guide'), openWeights: verifiedFact(!slug.startsWith('codestral'), 'mistral-selection-guide'),
    license: slug === 'mistral-medium-3-5' ? verifiedFact('Modified MIT', 'mistral-selection-guide') : slug.startsWith('codestral') ? unpublishedFact('当前官方总览未列出开放权重许可证', 'mistral-model-overview') : verifiedFact('Apache-2.0', 'mistral-selection-guide'),
    parameterCount: params === null ? unpublishedFact('官方未公开', 'mistral-model-overview') : verifiedFact(params, 'mistral-selection-guide', 'parameters'), activeParameterCount: active === null ? unpublishedFact('官方未公开', 'mistral-model-overview') : verifiedFact(active, 'mistral-selection-guide', 'parameters'),
    localDeployment: slug.startsWith('codestral') ? notApplicableFact('官方当前目录将其列为托管代码模型', 'mistral-model-overview') : verifiedFact('官方提供模型权重；硬件要求见模型卡', 'mistral-selection-guide'),
    pricing: input === null ? emptyPricing('needs-review', '官方模型卡未在本次核查中确认标准 token 单价', 'mistral-pricing') : tokenPricing({ input, output, sourceId: 'mistral-selection-guide' }), regions: verifiedFact(slug.startsWith('codestral') ? ['Mistral API'] : ['Mistral API', 'self-hosted'], 'mistral-selection-guide'),
    sourceIds: ['mistral-model-overview', 'mistral-selection-guide', 'mistral-known-limitations', 'mistral-pricing']
  })),

  createModel({
    slug: 'kimi-k3',
    name: 'Kimi K3',
    officialModelId: moonshotUnpublishedFact('Moonshot AI 已确认模型发布和产品可用，但尚未在允许的官方开发者来源中确认公开 API model ID。'),
    vendorSlug: 'moonshot-ai',
    family: 'Kimi',
    familySlug: 'kimi',
    productLine: 'kimi-k3',
    version: 'K3',
    lifecycleStatus: 'stable',
    releaseChannel: 'official-product',
    releaseDate: moonshotVerifiedFact('2026-07-16', 'date'),
    summary: 'Moonshot AI 当前旗舰模型，面向长程编程、知识工作与深度推理。',
    positioning: moonshotVerifiedFact('长程编程、知识工作和深度推理'),
    taskIds: ['reasoning', 'coding', 'writing', 'multimodal'],
    type: '旗舰 / 原生多模态',
    knowledgeCutoff: moonshotUnpublishedFact('Moonshot AI 官方 Kimi K3 页面未公开知识截止日期。'),
    contextWindow: moonshotVerifiedFact(1000000, 'tokens'),
    maxOutputTokens: moonshotUnpublishedFact('Moonshot AI 官方 Kimi K3 页面未公开最大输出。'),
    inputModalities: moonshotVerifiedFact(['原生多模态'], null, '官方页面确认原生多模态，未在本次允许来源中拆分声明具体输入类型。'),
    outputModalities: moonshotUnpublishedFact('Moonshot AI 官方 Kimi K3 页面未单独公开输出模态。'),
    reasoningModes: moonshotUnpublishedFact('Moonshot AI 官方 Kimi K3 页面未公开 API 推理模式。'),
    reasoningEffortLevels: moonshotUnpublishedFact('Moonshot AI 官方 Kimi K3 页面未公开 API reasoning effort 级别。'),
    features: {
      functionCalling: moonshotUnpublishedFact('API 工具能力尚未在允许来源中确认。'),
      toolCalling: moonshotUnpublishedFact('API 工具能力尚未在允许来源中确认。'),
      structuredOutput: moonshotUnpublishedFact('Structured Output 尚未在允许来源中确认。'),
      webSearch: moonshotUnpublishedFact('Web Search 尚未在允许来源中确认。'),
      fileSearch: moonshotUnpublishedFact('File Search 尚未在允许来源中确认。'),
      computerUse: moonshotUnpublishedFact('Computer Use 尚未在允许来源中确认。'),
      codeExecution: moonshotUnpublishedFact('Code Execution 尚未在允许来源中确认。'),
      fineTuning: moonshotUnpublishedFact('微调能力尚未在允许来源中确认。'),
      batchApi: moonshotUnpublishedFact('Batch API 尚未在允许来源中确认。'),
      promptCaching: moonshotUnpublishedFact('Prompt Caching 尚未在允许来源中确认。')
    },
    apiAvailable: moonshotUnpublishedFact('Moonshot AI 已确认产品可用，但 API 发布状态尚未在允许来源中确认。'),
    webAvailable: moonshotVerifiedFact(true),
    openWeights: moonshotUnpublishedFact('Moonshot AI 官方 Kimi K3 页面未声明开放权重状态。'),
    license: moonshotUnpublishedFact('Moonshot AI 官方 Kimi K3 页面未公开模型许可证。'),
    parameterCount: moonshotVerifiedFact(2800000000000, 'parameters'),
    activeParameterCount: moonshotUnpublishedFact('Moonshot AI 官方 Kimi K3 页面未公开激活参数规模。'),
    localDeployment: moonshotUnpublishedFact('Moonshot AI 官方 Kimi K3 页面未公开本地部署方式。'),
    regions: moonshotUnpublishedFact('Moonshot AI 官方 Kimi K3 页面未公开服务地区。'),
    pricing: emptyPricing('unpublished', 'Moonshot AI 官方 Kimi K3 页面未公开 API 价格。', 'moonshot-kimi-k3'),
    recommendedScenarios: ['长程编程', '知识工作', '深度推理'],
    sourceIds: ['moonshot-kimi-k3']
  }),

  ...[
    ['glm-5-2', 'GLM-5.2', 'glm-5.2', 'zhipu-glm-5-2', 1000000, 128000, ['reasoning', 'coding', 'chinese']],
    ['glm-5v-turbo', 'GLM-5V-Turbo', 'glm-5v-turbo', 'zhipu-glm-5v-turbo', null, null, ['coding', 'chinese', 'multimodal']]
  ].map(([slug, name, id, sourceId, context, output, taskIds]) => createModel({
    slug, name, officialModelId: id, vendorSlug: 'zhipu-ai', family: 'GLM 5', familySlug: 'glm-5', version: name.replace('GLM-', ''), summary: `${name} 是智谱开放平台当前推荐的${slug.includes('5v') ? '多模态 Coding' : '长任务与工具调用'}模型。`, taskIds, type: slug.includes('5v') ? '多模态 / 编程' : '推理 / 编程',
    contextWindow: context ? verifiedFact(context, sourceId, 'tokens') : unpublishedFact('官方概览未在同一条目公开上下文', sourceId), maxOutputTokens: output ? verifiedFact(output, sourceId, 'tokens') : unpublishedFact('官方概览未在同一条目公开最大输出', sourceId),
    inputModalities: verifiedFact(slug.includes('5v') ? ['text', 'image'] : ['text'], sourceId), outputModalities: verifiedFact(['text'], sourceId), reasoningModes: verifiedFact(['thinking', 'non-thinking'], 'zhipu-thinking'),
    reasoningEffortLevels: slug === 'glm-5-2' ? verifiedFact(['none', 'minimal', 'low', 'medium', 'high', 'xhigh', 'max'], 'zhipu-thinking') : unpublishedFact('reasoning effort 仅对部分模型公开', 'zhipu-thinking'),
    features: { functionCalling: verifiedFact(true, sourceId), toolCalling: verifiedFact(true, sourceId), structuredOutput: verifiedFact(true, sourceId), promptCaching: verifiedFact(true, sourceId) },
    pricing: emptyPricing('needs-review', 'API 标准按量价格待从官方价格页逐项核对；未使用 Coding Plan 抵扣系数', sourceId), regions: verifiedFact(['Zhipu official API'], sourceId), sourceIds: [sourceId, 'zhipu-model-overview', 'zhipu-thinking', 'zhipu-migration']
  }))
];

const archivedModels = [
  ['gpt-4o', 'GPT-4o', 'gpt-5-6-sol', '官方目录已列为旧模型或弃用模型。', ['openai-deprecations', 'openai-model-catalog']],
  ['claude-sonnet-4', 'Claude Sonnet 4', 'claude-sonnet-5', '官方已退役的上一代 Sonnet。', ['anthropic-deprecations']],
  ['deepseek-chat', 'DeepSeek Chat（兼容 alias）', 'deepseek-v4-flash', '兼容 alias 不作为独立模型条目。', ['deepseek-changelog']],
  ['gemini-3-5-flash', 'Gemini 3.5 Flash', 'gemini-3-6-flash', '同定位 Flash 产品线已有更新的稳定版本。', ['google-latest-models']],
  ['gemini-3-1-flash-lite', 'Gemini 3.1 Flash-Lite', 'gemini-3-5-flash-lite', '同定位 Flash-Lite 产品线已有更新的稳定版本。', ['google-latest-models']],
  ['qwen3-5-omni-plus', 'Qwen3.5 Omni Plus', 'qwen3-7-plus', '主目录只保留当前最新 Qwen 产品线。', ['alibaba-models']],
  ['grok-4-3', 'Grok 4.3', 'grok-4-5', '同定位 Grok 产品线已有更新的当前模型。', ['xai-grok-4-5', 'xai-pricing']],
  ['codestral-25-01', 'Codestral 25.01', 'codestral-25-08', 'Mistral 官方已将 25.01 列入 Legacy/Deprecated。', ['mistral-model-overview']],
  ['kimi-k2-5', 'Kimi K2.5', null, 'Kimi K3 已成为官方最新产品，旧代不进入主目录。', ['moonshot-kimi-k3', 'moonshot-kimi-k2-5']],
  ['kimi-k2-instruct', 'Kimi K2 Instruct', null, 'Kimi K3 已成为官方最新产品，旧代不进入主目录。', ['moonshot-kimi-k3', 'moonshot-kimi-k2']],
  ['glm-5-turbo', 'GLM-5-Turbo', 'glm-5-2', '同定位 GLM 产品线已有更新的当前旗舰。', ['zhipu-glm-5-2', 'zhipu-model-overview']]
].map(([slug, name, replacementModelSlug, exclusionReason, sourceIds]) => ({
  slug,
  name,
  replacementModelSlug,
  exclusionReason,
  sourceIds,
  wasPublished: false
}));

export const currentAiModels = currentModels;
export const archivedAiModels = archivedModels;
export const allAiModels = currentAiModels;
export const modelRoutes = currentAiModels.map((model) => `/ai-models/${model.slug}`);

export function getModelBySlug(slug) {
  return currentAiModels.find((model) => model.slug === slug);
}

export function getModelDataStats(models = currentAiModels, sources = modelSources) {
  const facts = models.flatMap((model) => Object.values(model).filter(isFact));
  const pricingComplete = models.filter((model) => (
    typeof model.pricing.standard.input === 'number' && typeof model.pricing.standard.output === 'number'
  )).length;
  return {
    currentModelCount: models.length,
    vendorCount: new Set(models.map((model) => model.vendorSlug)).size,
    familyCount: new Set(models.map((model) => model.familySlug)).size,
    apiModelCount: models.filter((model) => model.apiAvailable.value === true).length,
    openWeightModelCount: models.filter((model) => model.openWeights.value === true).length,
    previewModelCount: models.filter((model) => model.releaseChannel === 'preview').length,
    sitemapUrlCount: models.length + 1,
    verifiedModelCount: models.filter((model) => model.lastVerifiedAt === MODEL_AUDIT_DATE).length,
    verifiedFieldCount: facts.filter((fact) => fact.status === 'verified').length,
    officialUnpublishedFieldCount: facts.filter((fact) => ['official-unpublished', 'unpublished'].includes(fact.status)).length,
    pendingReviewFieldCount: facts.filter((fact) => fact.status === 'needs-review').length,
    staleFieldCount: models.filter((model) => model.nextReviewAt < MODEL_AUDIT_DATE).length,
    priceCompleteModelCount: pricingComplete,
    deprecatedModelCount: models.filter((model) => ['deprecated', 'retired'].includes(model.lifecycleStatus)).length,
    sourceCount: sources.length,
    updatedAt: MODEL_AUDIT_DATE
  };
}

export { modelSources };
