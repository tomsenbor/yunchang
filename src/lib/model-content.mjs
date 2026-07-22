import {
  allAiModels,
  archivedAiModels,
  currentAiModels,
  getModelBySlug,
  getModelDataStats,
  modelRoutes,
  modelSources,
  modelVendors
} from './model-data.mjs';

export const MODEL_UNKNOWN = Object.freeze({
  unpublished: '官方未公开',
  pending: '待复核',
  official: '以官方最新文档为准'
});

export const MODEL_DATASET_UPDATED_AT = '2026-07-22';

export const modelTasks = [
  { id: 'reasoning', name: '推理推荐', description: '适合需要分步分析、问题拆解和复杂判断的任务。' },
  { id: 'coding', name: '编程推荐', description: '适合代码生成、重构、调试和项目级开发任务。' },
  { id: 'writing', name: '写作推荐', description: '适合内容起草、改写、总结与结构化表达。' },
  { id: 'chinese', name: '中文任务推荐', description: '适合中文理解、写作、资料整理和知识问答。' },
  { id: 'multimodal', name: '多模态推荐', description: '适合需要组合文本、图像或其他模态的任务。' },
  { id: 'value', name: '高性价比推荐', description: '从任务匹配和官方标准价格角度筛选候选模型。' }
];

export const modelSelectionSteps = [
  ['确定任务类型', '明确是推理、编程、写作、中文处理还是多模态任务。'],
  ['判断上下文需求', '根据单次输入材料的长度和连续对话需求选择。'],
  ['判断是否需要多模态', '确认是否需要处理图像、音频、视频或混合输入。'],
  ['判断 API、网页或本地部署', '根据集成方式、数据边界和维护成本选择访问方式。'],
  ['比较输入与输出价格', '分别查看标准、缓存、Batch 与长上下文价格。'],
  ['检查版本和核查日期', '核对模型 ID、生命周期、知识截止和字段核查日期。']
];

export const modelFaqs = [
  { question: 'AI 模型和 AI 工具有什么区别？', answer: 'AI 模型提供底层能力，AI 工具则把模型能力封装成面向用户的产品、界面或工作流。' },
  { question: '上下文窗口越大越好吗？', answer: '不一定。还要结合任务长度、有效利用率、延迟、价格和平台限制综合判断。' },
  { question: '开放权重是否等于完全开源？', answer: '不一定。权重可获取不代表训练数据、代码、许可证和全部开发过程都开放。' },
  { question: 'API 输入和输出价格如何比较？', answer: '应分别核对标准输入、缓存输入、输出、Batch 和长上下文分段费率，再结合实际 token 用量估算。' },
  { question: '多模态模型支持哪些输入？', answer: '不同模型支持范围不同，常见类型包括文本、图像、音频和视频；本站只展示已由官方页面核实的模态。' },
  { question: '为什么不同平台提供的同一模型表现不同？', answer: '系统提示、上下文管理、工具调用、采样参数和平台封装都可能改变实际体验。' },
  { question: '为什么部分参数显示官方未公开或待复核？', answer: '当官方资料没有公开、表述不一致或尚未完成字段级核验时，本站不会用推测值填充。' },
  { question: '模型数据多久更新一次？', answer: '模型列表、价格和弃用信息建议每 7 天复核；上下文每 14 天、知识截止与官方基准每 30 天复核。' }
];

export const aiModels = currentAiModels;
export const featuredDetailSlugs = ['gpt-5-6-sol', 'claude-sonnet-5', 'gemini-3-1-pro-preview'];

export {
  allAiModels,
  archivedAiModels,
  currentAiModels,
  getModelBySlug,
  getModelDataStats,
  modelRoutes,
  modelSources,
  modelVendors
};
