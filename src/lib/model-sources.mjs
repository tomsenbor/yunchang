export const MODEL_AUDIT_DATE = '2026-07-22';

export const OFFICIAL_SOURCE_HOSTS = Object.freeze([
  'developers.openai.com', 'platform.openai.com', 'openai.com',
  'anthropic.com', 'docs.anthropic.com',
  'ai.google.dev', 'cloud.google.com',
  'api-docs.deepseek.com', 'deepseek.com',
  'help.aliyun.com', 'qwenlm.github.io', 'github.com',
  'ai.meta.com',
  'docs.x.ai', 'x.ai',
  'docs.mistral.ai', 'mistral.ai',
  'moonshot.cn', 'platform.moonshot.cn',
  'open.bigmodel.cn', 'docs.bigmodel.cn'
]);

export function isAllowedOfficialSource(url) {
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname.toLowerCase();
    if (hostname === 'github.com') {
      const owner = parsed.pathname.split('/').filter(Boolean)[0]?.toLowerCase();
      return ['qwenlm', 'meta-llama', 'moonshotai', 'thudm'].includes(owner);
    }
    return OFFICIAL_SOURCE_HOSTS.some((allowed) => hostname === allowed || hostname.endsWith(`.${allowed}`));
  } catch {
    return false;
  }
}

const source = ({
  id, vendorSlug, title, url, kind, publishedAt = null, updatedAt = null,
  crossChecked = true, note = null
}) => ({
  id, vendorSlug, title, url, kind, publishedAt, updatedAt,
  accessedAt: MODEL_AUDIT_DATE, crossChecked, note
});

export const modelSources = [
  source({ id: 'openai-model-catalog', vendorSlug: 'openai', title: 'Models | OpenAI API', url: 'https://developers.openai.com/api/docs/models', kind: 'catalog' }),
  source({ id: 'openai-gpt-5-6-sol', vendorSlug: 'openai', title: 'GPT-5.6 Sol Model', url: 'https://developers.openai.com/api/docs/models/gpt-5.6-sol', kind: 'model-card' }),
  source({ id: 'openai-gpt-5-6-compare', vendorSlug: 'openai', title: 'Compare models', url: 'https://developers.openai.com/api/docs/models/compare', kind: 'model-card' }),
  source({ id: 'openai-gpt-5-3-codex', vendorSlug: 'openai', title: 'GPT-5.3-Codex Model', url: 'https://developers.openai.com/api/docs/models/gpt-5.3-codex', kind: 'model-card' }),
  source({ id: 'openai-gpt-oss-120b', vendorSlug: 'openai', title: 'gpt-oss-120b Model', url: 'https://developers.openai.com/api/docs/models/gpt-oss-120b', kind: 'model-card' }),
  source({ id: 'openai-gpt-oss-20b', vendorSlug: 'openai', title: 'gpt-oss-20b Model', url: 'https://developers.openai.com/api/docs/models/gpt-oss-20b', kind: 'model-card' }),
  source({ id: 'openai-deprecations', vendorSlug: 'openai', title: 'Deprecations', url: 'https://developers.openai.com/api/docs/deprecations', kind: 'deprecation' }),

  source({ id: 'anthropic-model-overview', vendorSlug: 'anthropic', title: 'Models overview', url: 'https://docs.anthropic.com/en/docs/about-claude/models/overview', kind: 'catalog' }),
  source({ id: 'anthropic-sonnet-5', vendorSlug: 'anthropic', title: "What's new in Claude Sonnet 5", url: 'https://docs.anthropic.com/en/docs/about-claude/models/whats-new-sonnet-5', kind: 'model-card' }),
  source({ id: 'anthropic-sonnet-5-release', vendorSlug: 'anthropic', title: 'Introducing Claude Sonnet 5', url: 'https://www.anthropic.com/news/claude-sonnet-5', kind: 'release', publishedAt: '2026-06-30' }),
  source({ id: 'anthropic-opus-4-8-release', vendorSlug: 'anthropic', title: 'Introducing Claude Opus 4.8', url: 'https://www.anthropic.com/news/claude-opus-4-8', kind: 'release', publishedAt: '2026-05-28' }),
  source({ id: 'anthropic-haiku-4-5-release', vendorSlug: 'anthropic', title: 'Introducing Claude Haiku 4.5', url: 'https://www.anthropic.com/news/claude-haiku-4-5', kind: 'release', publishedAt: '2025-10-15' }),
  source({ id: 'anthropic-model-ids', vendorSlug: 'anthropic', title: 'Model IDs and versioning', url: 'https://docs.anthropic.com/en/docs/about-claude/models/model-ids-and-versions', kind: 'model-card' }),
  source({ id: 'anthropic-pricing', vendorSlug: 'anthropic', title: 'Pricing', url: 'https://docs.anthropic.com/en/docs/about-claude/pricing', kind: 'pricing' }),
  source({ id: 'anthropic-deprecations', vendorSlug: 'anthropic', title: 'Model deprecations', url: 'https://docs.anthropic.com/en/docs/about-claude/model-deprecations', kind: 'deprecation' }),

  source({ id: 'google-models', vendorSlug: 'google', title: 'Models | Gemini API', url: 'https://ai.google.dev/gemini-api/docs/models', kind: 'catalog', updatedAt: '2026-07-20' }),
  source({ id: 'google-latest-models', vendorSlug: 'google', title: 'Latest Gemini models', url: 'https://ai.google.dev/gemini-api/docs/latest-model', kind: 'catalog', updatedAt: '2026-07-21' }),
  source({ id: 'google-gemini-3', vendorSlug: 'google', title: 'Gemini 3 Developer Guide', url: 'https://ai.google.dev/gemini-api/docs/gemini-3', kind: 'model-card' }),
  source({ id: 'google-gemini-3-6-flash', vendorSlug: 'google', title: 'Gemini 3.6 Flash', url: 'https://ai.google.dev/gemini-api/docs/models/gemini-3.6-flash', kind: 'model-card', updatedAt: '2026-07-21' }),
  source({ id: 'google-gemini-3-5-flash-lite', vendorSlug: 'google', title: 'Gemini 3.5 Flash-Lite', url: 'https://ai.google.dev/gemini-api/docs/models/gemini-3.5-flash-lite', kind: 'model-card', updatedAt: '2026-07-21' }),
  source({ id: 'google-changelog', vendorSlug: 'google', title: 'Gemini API release notes', url: 'https://ai.google.dev/gemini-api/docs/changelog', kind: 'release', updatedAt: '2026-07-16' }),
  source({ id: 'google-pricing', vendorSlug: 'google', title: 'Gemini Developer API pricing', url: 'https://ai.google.dev/gemini-api/docs/pricing', kind: 'pricing', updatedAt: '2026-07-09' }),
  source({ id: 'google-deprecations', vendorSlug: 'google', title: 'Gemini deprecations', url: 'https://ai.google.dev/gemini-api/docs/deprecations', kind: 'deprecation' }),

  source({ id: 'deepseek-v4-release', vendorSlug: 'deepseek', title: 'DeepSeek V4 Preview Release', url: 'https://api-docs.deepseek.com/news/news260424/', kind: 'release', publishedAt: '2026-04-24' }),
  source({ id: 'deepseek-v4-pricing', vendorSlug: 'deepseek', title: 'Models & Pricing', url: 'https://api-docs.deepseek.com/quick_start/pricing', kind: 'pricing' }),
  source({ id: 'deepseek-changelog', vendorSlug: 'deepseek', title: 'Change Log', url: 'https://api-docs.deepseek.com/updates', kind: 'deprecation', updatedAt: '2026-04-24' }),

  source({ id: 'alibaba-models', vendorSlug: 'alibaba-cloud', title: '选择模型', url: 'https://help.aliyun.com/zh/model-studio/models', kind: 'catalog' }),
  source({ id: 'alibaba-rate-limits', vendorSlug: 'alibaba-cloud', title: 'Rate limiting', url: 'https://help.aliyun.com/en/model-studio/rate-limit', kind: 'model-card' }),
  source({ id: 'alibaba-pricing', vendorSlug: 'alibaba-cloud', title: '模型调用计费', url: 'https://help.aliyun.com/zh/model-studio/model-pricing', kind: 'pricing', crossChecked: false }),
  source({ id: 'alibaba-vision', vendorSlug: 'alibaba-cloud', title: '视觉理解模型', url: 'https://help.aliyun.com/zh/model-studio/vision-model/', kind: 'model-card' }),
  source({ id: 'alibaba-overview', vendorSlug: 'alibaba-cloud', title: 'What is Model Studio', url: 'https://help.aliyun.com/en/model-studio/what-is-model-studio', kind: 'catalog', updatedAt: '2026-07-10' }),

  source({ id: 'meta-llama-4-release', vendorSlug: 'meta', title: 'The Llama 4 herd', url: 'https://ai.meta.com/blog/llama-4-multimodal-intelligence/', kind: 'release', publishedAt: '2025-04-05' }),
  source({ id: 'meta-llama-models', vendorSlug: 'meta', title: 'meta-llama/llama-models', url: 'https://github.com/meta-llama/llama-models', kind: 'model-card' }),

  source({ id: 'xai-grok-4-5', vendorSlug: 'xai', title: 'Grok 4.5', url: 'https://docs.x.ai/developers/models/grok-4.5', kind: 'model-card', updatedAt: '2026-07-16' }),
  source({ id: 'xai-pricing', vendorSlug: 'xai', title: 'Pricing', url: 'https://docs.x.ai/developers/pricing', kind: 'pricing', updatedAt: '2026-07-08' }),
  source({ id: 'xai-grok-build', vendorSlug: 'xai', title: 'Grok Build 0.1', url: 'https://docs.x.ai/developers/models/grok-build-0.1', kind: 'model-card' }),
  source({ id: 'xai-release-notes', vendorSlug: 'xai', title: 'Release Notes', url: 'https://docs.x.ai/developers/release-notes', kind: 'release', updatedAt: '2026-07-08' }),

  source({ id: 'mistral-model-overview', vendorSlug: 'mistral-ai', title: 'Models Overview', url: 'https://docs.mistral.ai/models/overview', kind: 'catalog' }),
  source({ id: 'mistral-selection-guide', vendorSlug: 'mistral-ai', title: 'Model Selection Guide', url: 'https://docs.mistral.ai/models/model-selection-guide', kind: 'model-card' }),
  source({ id: 'mistral-medium-3-5', vendorSlug: 'mistral-ai', title: 'Mistral Medium 3.5', url: 'https://docs.mistral.ai/models/model-cards/mistral-medium-3-5-26-04', kind: 'model-card', publishedAt: '2026-04-28' }),
  source({ id: 'mistral-known-limitations', vendorSlug: 'mistral-ai', title: 'Known limitations', url: 'https://docs.mistral.ai/resources/known-limitations', kind: 'model-card' }),
  source({ id: 'mistral-pricing', vendorSlug: 'mistral-ai', title: 'Mistral pricing', url: 'https://mistral.ai/pricing', kind: 'pricing', crossChecked: false }),

  source({ id: 'moonshot-kimi-k3', vendorSlug: 'moonshot-ai', title: 'Kimi K3 | Moonshot AI', url: 'https://www.moonshot.cn/', kind: 'release', publishedAt: '2026-07-16', crossChecked: false, note: '官方站确认 Kimi K3 发布、产品可用、2.8 万亿参数、原生多模态与 1M token 上下文；API model ID 和 API 价格未从本轮允许的开发者来源写入。' }),
  source({ id: 'moonshot-kimi-k2-5', vendorSlug: 'moonshot-ai', title: 'MoonshotAI/Kimi-K2.5', url: 'https://github.com/MoonshotAI/Kimi-K2.5', kind: 'model-card' }),
  source({ id: 'moonshot-kimi-k2-5-deploy', vendorSlug: 'moonshot-ai', title: 'Kimi K2.5 deployment guide', url: 'https://github.com/MoonshotAI/Kimi-K2.5/blob/master/docs/deploy_guidance.md', kind: 'deployment' }),
  source({ id: 'moonshot-kimi-k2', vendorSlug: 'moonshot-ai', title: 'MoonshotAI/Kimi-K2', url: 'https://github.com/MoonshotAI/Kimi-K2', kind: 'model-card' }),
  source({ id: 'moonshot-kimi-k2-license', vendorSlug: 'moonshot-ai', title: 'Kimi K2 License', url: 'https://github.com/MoonshotAI/Kimi-K2/blob/main/LICENSE', kind: 'license' }),

  source({ id: 'zhipu-model-overview', vendorSlug: 'zhipu-ai', title: '模型概览', url: 'https://docs.bigmodel.cn/cn/guide/start/model-overview', kind: 'catalog' }),
  source({ id: 'zhipu-glm-5-2', vendorSlug: 'zhipu-ai', title: 'GLM-5.2', url: 'https://docs.bigmodel.cn/cn/guide/models/text/glm-5.2', kind: 'model-card' }),
  source({ id: 'zhipu-glm-5v-turbo', vendorSlug: 'zhipu-ai', title: 'GLM-5V-Turbo', url: 'https://open.bigmodel.cn/', kind: 'model-card' }),
  source({ id: 'zhipu-glm-5-turbo', vendorSlug: 'zhipu-ai', title: 'GLM-5-Turbo', url: 'https://docs.bigmodel.cn/cn/guide/models/text/glm-5-turbo', kind: 'model-card' }),
  source({ id: 'zhipu-thinking', vendorSlug: 'zhipu-ai', title: '深度思考', url: 'https://docs.bigmodel.cn/cn/guide/capabilities/thinking', kind: 'capability' }),
  source({ id: 'zhipu-migration', vendorSlug: 'zhipu-ai', title: '迁移至 GLM-5.2', url: 'https://docs.bigmodel.cn/cn/guide/start/migrate-to-glm-new', kind: 'migration' })
];

export const modelSourceById = new Map(modelSources.map((item) => [item.id, item]));
