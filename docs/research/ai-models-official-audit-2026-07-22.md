# AI 模型官方资料审计（2026-07-22）

## 审计口径

- 只使用任务允许的厂商官方模型目录、模型页、API/价格文档、发布公告、技术报告和弃用页。
- 本次访问日期统一为 `2026-07-22`；未在官方页面直接确认的数字不进入正式数据。
- 主目录只收录截至核查日已由官方确认发布、当前仍向用户提供、属于对应厂商最新或主力产品线，且未标记为 Previous、Legacy、Deprecated、Retired 或 Shutdown 的条目。公开 API model ID 不是产品型模型进入主目录的前置条件。
- `*-latest`、兼容 alias、日期快照和 Preview snapshot 只保存在别名/快照字段，不生成独立详情页。
- Previous、Legacy、Deprecated、Retired、Shutdown 及已被同定位新版本替换的模型不参与主目录、搜索、筛选、统计、ItemList、sitemap 或详情页生成。
- 价格保留官方原币种、地区、计费单位和分段规则；限时活动价不作为永久标准价。

## 最终当前模型主目录

官方候选 31 个，最终确认 31 个。Kimi K3 已在 Moonshot 官网确认发布和产品可用，以“产品已发布、API 信息未公开”的状态进入当前目录。

| 厂商 | 当前模型数 | 当前模型 |
| --- | ---: | --- |
| OpenAI | 6 | GPT-5.6 Sol、GPT-5.6 Terra、GPT-5.6 Luna、GPT-5.3-Codex、gpt-oss-120b、gpt-oss-20b |
| Anthropic | 3 | Claude Sonnet 5、Claude Opus 4.8、Claude Haiku 4.5 |
| Google | 3 | Gemini 3.1 Pro Preview、Gemini 3.6 Flash、Gemini 3.5 Flash-Lite |
| DeepSeek | 2 | DeepSeek V4 Pro、DeepSeek V4 Flash |
| Alibaba Cloud | 3 | Qwen3.7 Max、Qwen3.7 Plus、Qwen3.6 Flash |
| Meta | 2 | Llama 4 Scout、Llama 4 Maverick |
| xAI | 2 | Grok 4.5、Grok Build 0.1 |
| Mistral AI | 7 | Mistral Medium 3.5、Mistral Small 4、Mistral Large 3、Ministral 3 14B、Ministral 3 8B、Ministral 3 3B、Codestral 25.08 |
| Moonshot AI | 1 | Kimi K3 |
| Zhipu AI | 2 | GLM-5.2、GLM-5V-Turbo |

## 字段级目录记录

表中来源 ID 均对应下方“官方来源登记”。`—` 表示官方页面未提供该项，不作推断。

### OpenAI

| displayName | officialModelId | aliases / snapshots | productLine | lifecycle / channel | releaseDate | model / pricing / release | inclusionReason |
| --- | --- | --- | --- | --- | --- | --- | --- |
| GPT-5.6 Sol | `gpt-5.6-sol` | alias `gpt-5.6` | gpt-5.6-sol | stable / stable | — | openai-model-catalog、openai-gpt-5-6-sol、openai-gpt-5-6-compare | 官方当前推荐 GPT-5.6 旗舰档 |
| GPT-5.6 Terra | `gpt-5.6-terra` | — | gpt-5.6-terra | stable / stable | — | openai-model-catalog、openai-gpt-5-6-sol、openai-gpt-5-6-compare | 官方当前 GPT-5.6 均衡档 |
| GPT-5.6 Luna | `gpt-5.6-luna` | — | gpt-5.6-luna | stable / stable | — | openai-model-catalog、openai-gpt-5-6-sol、openai-gpt-5-6-compare | 官方当前 GPT-5.6 低成本档 |
| GPT-5.3-Codex | `gpt-5.3-codex` | — | gpt-5.3-codex | stable / stable | — | openai-gpt-5-3-codex、openai-model-catalog | 官方当前 Codex 专用模型 |
| gpt-oss-120b | `gpt-oss-120b` | — | gpt-oss-120b | open-weight / stable | — | openai-gpt-oss-120b、openai-model-catalog | 官方当前大型开放权重档 |
| gpt-oss-20b | `gpt-oss-20b` | — | gpt-oss-20b | open-weight / stable | — | openai-gpt-oss-20b、openai-model-catalog | 官方当前低延迟开放权重档 |

当前推荐：GPT-5.6 Sol。当前稳定：GPT-5.6 Sol/Terra/Luna、GPT-5.3-Codex。当前开放权重：gpt-oss-120b/20b。GPT-4o、GPT-4.1、o3、o4-mini 等旧代不进入主目录；官方弃用证据见 `openai-deprecations`。

### Anthropic

| displayName | officialModelId | aliases / snapshots | productLine | lifecycle / channel | releaseDate | model / pricing / release | inclusionReason |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Claude Sonnet 5 | `claude-sonnet-5` | — | claude-sonnet-5 | stable / stable | 2026-06-30 | anthropic-sonnet-5、anthropic-sonnet-5-release、anthropic-model-overview、anthropic-model-ids、anthropic-pricing | 当前 Sonnet 档 |
| Claude Opus 4.8 | `claude-opus-4-8` | — | claude-opus-4-8 | stable / stable | 2026-05-28 | anthropic-opus-4-8-release、anthropic-model-overview、anthropic-model-ids、anthropic-pricing | 当前 Opus 档 |
| Claude Haiku 4.5 | `claude-haiku-4-5-20251001` | alias `claude-haiku-4-5`；snapshot 同 fixed ID | claude-haiku-4-5 | stable / stable | 2025-10-15 | anthropic-haiku-4-5-release、anthropic-model-overview、anthropic-model-ids、anthropic-pricing | 当前 Haiku 档 |

当前推荐/稳定：Sonnet 5、Opus 4.8、Haiku 4.5。当前开放权重：无。Sonnet 4.x、Opus 4.7 及更早版本、Haiku 3.x 不进入主目录；弃用/退役证据见 `anthropic-deprecations`。

### Google

| displayName | officialModelId | aliases / snapshots | productLine | lifecycle / channel | releaseDate | model / pricing / release | inclusionReason |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Gemini 3.1 Pro Preview | `gemini-3.1-pro-preview` | compatibility alias `gemini-pro-latest` | gemini-3.1-pro-preview | preview / preview | 2026-02-19 | google-gemini-3、google-pricing、google-changelog | 当前 Pro 产品线仍可用的最新 Preview |
| Gemini 3.6 Flash | `gemini-3.6-flash` | — | gemini-3.6-flash | stable / stable | — | google-latest-models、google-gemini-3-6-flash、google-pricing | 最新稳定 Flash，替代 3.5 Flash |
| Gemini 3.5 Flash-Lite | `gemini-3.5-flash-lite` | — | gemini-3.5-flash-lite | stable / stable | — | google-latest-models、google-gemini-3-5-flash-lite、google-pricing | 最新稳定 Flash-Lite，替代 3.1 Flash-Lite |

Gemini 3.1 Pro 必须显示“预览版”，不得显示 Stable/GA。Gemini 3.5 Flash、Gemini 3.1 Flash-Lite、Gemini 3 Flash Preview 与 Gemini 2.x 不进入主目录；替换/关闭关系见 `google-changelog` 与 `google-deprecations`。

### DeepSeek

| displayName | officialModelId | aliases / snapshots | productLine | lifecycle / channel | releaseDate | model / pricing / release | inclusionReason |
| --- | --- | --- | --- | --- | --- | --- | --- |
| DeepSeek V4 Pro | `deepseek-v4-pro` | — | deepseek-v4-pro | preview / preview | 2026-04-24 | deepseek-v4-release、deepseek-v4-pricing、deepseek-changelog | 当前 V4 高性能开放权重档；开放状态由独立字段记录 |
| DeepSeek V4 Flash | `deepseek-v4-flash` | deprecated compatibility aliases `deepseek-chat`、`deepseek-reasoner` | deepseek-v4-flash | preview / preview | 2026-04-24 | deepseek-v4-release、deepseek-v4-pricing、deepseek-changelog | 当前 V4 高吞吐开放权重档；开放状态由独立字段记录 |

DeepSeek V3、R1、`deepseek-chat`、`deepseek-reasoner` 不生成独立条目；兼容 alias 迁移信息见 `deepseek-changelog`。

### Alibaba Cloud / Qwen

| displayName | officialModelId | aliases / snapshots | productLine | lifecycle / channel | releaseDate | model / pricing / release | inclusionReason |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Qwen3.7 Max | `qwen3.7-max` | snapshot `qwen3.7-max-2026-06-08` | qwen3.7-max | stable / stable | — | alibaba-models、alibaba-overview、alibaba-pricing | 当前旗舰 Max 档；mutable ID 的发布日期未单独标注 |
| Qwen3.7 Plus | `qwen3.7-plus` | snapshot `qwen3.7-plus-2026-05-26` | qwen3.7-plus | stable / stable | 2026-05-26 | alibaba-models、alibaba-overview、alibaba-pricing、alibaba-vision | 当前 Plus 档 |
| Qwen3.6 Flash | `qwen3.6-flash` | snapshot `qwen3.6-flash-2026-04-16` | qwen3.6-flash | stable / stable | 2026-04-16 | alibaba-models、alibaba-overview、alibaba-pricing、alibaba-vision | 当前 Flash 档 |

Qwen3.5 系列、Qwen3 Max、旧 Qwen Coder/VL 不进入主目录。日期快照只保存在 `snapshotIds`，不生成页面。当前数据保存全球部署人民币原价：Max 为输入 ¥12 / 输出 ¥36；Plus 基础分段为 ¥2 / ¥8，超过 256K 输入后为 ¥6 / ¥24；Flash 基础分段为 ¥1.2 / ¥7.2，超过 256K 输入后为 ¥4.8 / ¥28.8，单位均为每百万 tokens。Batch 基础分段按官方 50% 规则保存；不采用限时 Token Plan 折扣替代标准价，也不换算美元。

### Meta

| displayName | officialModelId | aliases / snapshots | productLine | lifecycle / channel | releaseDate | model / pricing / release | inclusionReason |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Llama 4 Scout | `Llama-4-Scout-17B-16E-Instruct` | — | llama-4-scout | open-weight / stable | 2025-04-05 | meta-llama-models、meta-llama-4-release | 当前 Scout 开放权重档 |
| Llama 4 Maverick | `Llama-4-Maverick-17B-128E-Instruct` | — | llama-4-maverick | open-weight / stable | 2025-04-05 | meta-llama-models、meta-llama-4-release | 当前 Maverick 开放权重档 |

Llama 3.x 不进入主目录。Meta 未提供统一官方托管 token 标准价，价格状态为不适用，不使用第三方平台价格。

### xAI

| displayName | officialModelId | aliases / snapshots | productLine | lifecycle / channel | releaseDate | model / pricing / release | inclusionReason |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Grok 4.5 | `grok-4.5` | alias `grok-4.5-latest` | grok-4.5 | stable / stable | 2026-07-08 | xai-grok-4-5、xai-pricing、xai-release-notes | 当前 Grok 通用/编程档 |
| Grok Build 0.1 | `grok-build-0.1` | alias `grok-build-latest`；兼容 IDs 仅作别名记录 | grok-build-0-1 | preview / preview | 2026-05-19 | xai-grok-build、xai-pricing、xai-release-notes | 当前早期访问编码产品线 |

Grok 4.3、Grok 4.20、Grok 3 不进入主目录。`grok-build-latest` 不单独建页。

### Mistral AI

| displayName | officialModelId | aliases / snapshots | productLine | lifecycle / channel | releaseDate | model / pricing / release | inclusionReason |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Mistral Medium 3.5 | `mistral-medium-3-5` | — | mistral-medium-3-5 | open-weight / stable | 2026-04-28 | mistral-medium-3-5、mistral-selection-guide、mistral-pricing | 当前 Medium 档 |
| Mistral Small 4 | `mistral-small-2603` | — | mistral-small-4 | open-weight / stable | 2026-03 | mistral-model-overview、mistral-selection-guide、mistral-pricing | 当前 Small 档 |
| Mistral Large 3 | `mistral-large-2512` | — | mistral-large-3 | open-weight / stable | 2025-12 | mistral-model-overview、mistral-selection-guide、mistral-pricing | 当前 Large 开放权重档 |
| Ministral 3 14B | `ministral-14b-2512` | — | ministral-3-14b | open-weight / stable | 2025-12 | mistral-model-overview、mistral-selection-guide、mistral-pricing | 当前 14B 边缘档 |
| Ministral 3 8B | `ministral-8b-2512` | — | ministral-3-8b | open-weight / stable | 2025-12 | mistral-model-overview、mistral-selection-guide、mistral-pricing | 当前 8B 边缘档 |
| Ministral 3 3B | `ministral-3b-2512` | — | ministral-3-3b | open-weight / stable | 2025-12 | mistral-model-overview、mistral-selection-guide、mistral-pricing | 当前 3B 边缘档 |
| Codestral 25.08 | `codestral-2508` | — | codestral-25-08 | stable / stable | 2025-07 | mistral-model-overview、mistral-known-limitations、mistral-pricing | 当前 Codestral 代码档 |

Codestral 25.01、Mistral Medium 3.1、Mistral Small 3.x、Mixtral 与旧 Ministral 不进入主目录；Legacy 证据见 `mistral-model-overview`。

### Moonshot AI

Kimi K3 已由 Moonshot 官网于 2026-07-16 确认发布并标注“现已可用”。官网同时确认 2.8 万亿参数、原生多模态、1M token 上下文，以及长程编程、知识工作和深度推理定位。该模型以 `stable / official-product` 进入当前目录并生成详情页、sitemap URL、ItemList 条目和搜索结果；公开 API model ID、API 价格、最大输出、API 工具能力与知识截止日期维持 `unpublished`，不作推断。Kimi K2/K2.5/K2.6 属于旧代，不回填主目录。

| displayName | officialModelId | aliases / snapshots | productLine | lifecycle / channel | releaseDate | model / pricing / release | inclusionReason |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Kimi K3 | 官方尚未公开 | — | kimi-k3 | stable / official-product | 2026-07-16 | moonshot-kimi-k3 / API 价格未公开 / moonshot-kimi-k3 | 当前旗舰产品；网页可用，API ID 不作为收录前置条件 |

### Zhipu AI

| displayName | officialModelId | aliases / snapshots | productLine | lifecycle / channel | releaseDate | model / pricing / release | inclusionReason |
| --- | --- | --- | --- | --- | --- | --- | --- |
| GLM-5.2 | `glm-5.2` | — | glm-5-2 | stable / stable | — | zhipu-glm-5-2、zhipu-model-overview、zhipu-thinking | 当前文本/编码旗舰 |
| GLM-5V-Turbo | `glm-5v-turbo` | — | glm-5v-turbo | stable / stable | — | zhipu-glm-5v-turbo、zhipu-model-overview、zhipu-thinking | 当前多模态 GLM 档 |

GLM-5.1、GLM-5-Turbo 与 GLM-4.x 不进入主目录。

## 排除、归档与 alias 合并记录

这些记录保留在 `archivedAiModels` 或本报告中，但 `wasPublished` 均为 `false`，因此不需要生产重定向。

| excluded entry | exclusionReason | replacementModel | official lifecycle/replacement source | wasPublished |
| --- | --- | --- | --- | --- |
| GPT-4o | Deprecated/旧代 | GPT-5.6 Sol | openai-deprecations | false |
| Claude Sonnet 4 | Retired | Claude Sonnet 5 | anthropic-deprecations | false |
| `deepseek-chat` / `deepseek-reasoner` | 兼容 alias，不是独立当前模型 | DeepSeek V4 Flash | deepseek-changelog | false |
| Gemini 3.5 Flash | 同定位已有新稳定版 | Gemini 3.6 Flash | google-latest-models、google-changelog | false |
| Gemini 3.1 Flash-Lite | 同定位已有新稳定版 | Gemini 3.5 Flash-Lite | google-latest-models、google-changelog | false |
| Qwen3.5 Omni Plus | 上一代 Qwen 产品线 | Qwen3.7 Plus（仅作主目录入口，不声称等价替代） | alibaba-models | false |
| Grok 4.3 | 同定位已有新版本 | Grok 4.5 | xai-grok-4-5、xai-pricing | false |
| Codestral 25.01 | Legacy | Codestral 25.08 | mistral-model-overview | false |
| Kimi K2.5 / Kimi K2 Instruct | Kimi K3 已成为最新代 | Kimi K3（产品目录替代，不声称 API 兼容） | moonshot-kimi-k3 | false |
| GLM-5-Turbo | 同定位不再作为最新主目录条目 | GLM-5.2 | zhipu-glm-5-2、zhipu-model-overview | false |

## 官方来源登记

所有来源本次访问日期均为 `2026-07-22`。页面未标注发布时间/更新时间时记为“未标注”。

| sourceId | 官方来源标题 | URL | 官方发布/更新 | 交叉核对 |
| --- | --- | --- | --- | --- |
| openai-model-catalog | Models \| OpenAI API | https://developers.openai.com/api/docs/models | 当前目录 | 是 |
| openai-gpt-5-6-sol | GPT-5.6 Sol Model | https://developers.openai.com/api/docs/models/gpt-5.6-sol | 未标注 | 是 |
| openai-gpt-5-6-compare | Compare models | https://developers.openai.com/api/docs/models/compare | 未标注 | 是 |
| openai-gpt-5-3-codex | GPT-5.3-Codex Model | https://developers.openai.com/api/docs/models/gpt-5.3-codex | 未标注 | 是 |
| openai-gpt-oss-120b | gpt-oss-120b Model | https://developers.openai.com/api/docs/models/gpt-oss-120b | 未标注 | 是 |
| openai-gpt-oss-20b | gpt-oss-20b Model | https://developers.openai.com/api/docs/models/gpt-oss-20b | 未标注 | 是 |
| openai-deprecations | Deprecations | https://developers.openai.com/api/docs/deprecations | 当前弃用表 | 是 |
| anthropic-model-overview | Models overview | https://docs.anthropic.com/en/docs/about-claude/models/overview | 当前目录 | 是 |
| anthropic-sonnet-5 | What's new in Claude Sonnet 5 | https://docs.anthropic.com/en/docs/about-claude/models/whats-new-sonnet-5 | 当前 | 是 |
| anthropic-sonnet-5-release | Introducing Claude Sonnet 5 | https://www.anthropic.com/news/claude-sonnet-5 | 2026-06-30 | 是 |
| anthropic-opus-4-8-release | Introducing Claude Opus 4.8 | https://www.anthropic.com/news/claude-opus-4-8 | 2026-05-28 | 是 |
| anthropic-haiku-4-5-release | Introducing Claude Haiku 4.5 | https://www.anthropic.com/news/claude-haiku-4-5 | 2025-10-15 | 是 |
| anthropic-model-ids | Model IDs and versioning | https://docs.anthropic.com/en/docs/about-claude/models/model-ids-and-versions | 当前 | 是 |
| anthropic-pricing | Pricing | https://docs.anthropic.com/en/docs/about-claude/pricing | 当前 | 是 |
| anthropic-deprecations | Model deprecations | https://docs.anthropic.com/en/docs/about-claude/model-deprecations | 当前 | 是 |
| google-latest-models | Latest Gemini models | https://ai.google.dev/gemini-api/docs/latest-model | 2026-07-21 | 是 |
| google-gemini-3 | Gemini 3 Developer Guide | https://ai.google.dev/gemini-api/docs/gemini-3 | 2026-07 | 是 |
| google-gemini-3-6-flash | Gemini 3.6 Flash | https://ai.google.dev/gemini-api/docs/models/gemini-3.6-flash | 2026-07-21 | 是 |
| google-gemini-3-5-flash-lite | Gemini 3.5 Flash-Lite | https://ai.google.dev/gemini-api/docs/models/gemini-3.5-flash-lite | 2026-07-21 | 是 |
| google-pricing | Gemini Developer API pricing | https://ai.google.dev/gemini-api/docs/pricing | 当前 | 是 |
| google-changelog | Gemini API release notes | https://ai.google.dev/gemini-api/docs/changelog | 2026-07 | 是 |
| google-deprecations | Gemini deprecations | https://ai.google.dev/gemini-api/docs/deprecations | 当前 | 是 |
| deepseek-v4-release | DeepSeek V4 Preview Release | https://api-docs.deepseek.com/news/news260424/ | 2026-04-24 | 是 |
| deepseek-v4-pricing | Models & Pricing | https://api-docs.deepseek.com/quick_start/pricing | 当前 | 是 |
| deepseek-changelog | Change Log | https://api-docs.deepseek.com/updates | 2026-04-24 后持续更新 | 是 |
| alibaba-models | 选择模型 | https://help.aliyun.com/zh/model-studio/models | 当前 | 是 |
| alibaba-overview | Model Studio overview | https://help.aliyun.com/en/model-studio/what-is-model-studio | 2026-07 | 是 |
| alibaba-pricing | 模型调用计费 | https://help.aliyun.com/zh/model-studio/model-pricing | 当前 | 是 |
| alibaba-vision | 视觉理解模型 | https://help.aliyun.com/zh/model-studio/vision-model/ | 当前 | 是 |
| meta-llama-4-release | The Llama 4 herd | https://ai.meta.com/blog/llama-4-multimodal-intelligence/ | 2025-04-05 | 是 |
| meta-llama-models | meta-llama/llama-models | https://github.com/meta-llama/llama-models | 当前仓库 | 是 |
| xai-grok-4-5 | Grok 4.5 | https://docs.x.ai/developers/models/grok-4.5 | 2026-07 | 是 |
| xai-grok-build | Grok Build 0.1 | https://docs.x.ai/developers/models/grok-build-0.1 | 2026-05 | 是 |
| xai-pricing | Pricing | https://docs.x.ai/developers/pricing | 2026-07 | 是 |
| xai-release-notes | Release Notes | https://docs.x.ai/developers/release-notes | 2026-07 | 是 |
| mistral-model-overview | Models Overview | https://docs.mistral.ai/models/overview | 当前 | 是 |
| mistral-selection-guide | Model Selection Guide | https://docs.mistral.ai/models/model-selection-guide | 当前 | 是 |
| mistral-known-limitations | Known limitations | https://docs.mistral.ai/resources/known-limitations | 当前 | 是 |
| mistral-pricing | Mistral pricing | https://mistral.ai/pricing | 当前 | 是 |
| moonshot-kimi-k3 | Kimi K3 \| Moonshot AI | https://www.moonshot.cn/ | 2026-07-16 | 否，产品发布、可用性、参数规模、原生多模态与上下文来自同一官方页面；API 字段保持未公开 |
| zhipu-model-overview | 模型概览 | https://docs.bigmodel.cn/cn/guide/start/model-overview | 当前 | 是 |
| zhipu-glm-5-2 | GLM-5.2 | https://docs.bigmodel.cn/cn/guide/models/text/glm-5.2 | 当前 | 是 |
| zhipu-glm-5v-turbo | GLM-5V-Turbo | https://open.bigmodel.cn/ | 当前 | 是 |
| zhipu-thinking | 深度思考 | https://docs.bigmodel.cn/cn/guide/capabilities/thinking | 当前 | 是 |

## 审计周期与结论

- 模型列表、价格、弃用信息：每 7 天复核。
- 上下文与最大输出：每 14 天复核。
- 知识截止与官方基准：每 30 天复核。
- 精确字段必须同时具有 `sourceId` 与 `verifiedAt`；离线审计脚本只报告问题，不自动覆盖人工确认数据。
- 官方基准只可来自模型卡、系统卡、技术报告或正式发布文章，并明确标注厂商测试条件不构成统一排行榜。
