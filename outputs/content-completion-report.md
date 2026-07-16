# 详情页内容补全报告

生成时间：2026-06-22

## 覆盖范围

- 工具详情页：25 个 `/ai-tools/:slug`
- 教程详情页：24 个 `/guides/:slug`
- 对比详情页：9 个 `/compare/:slug`
- 视频详情页：10 个 `/videos/:slug`

## 新增字段和内容承载

### 工具详情页

工具页继续读取已有字段和 fallback：

- `overview`
- `useCases`
- `quickStart`
- `scenarios`
- `pros`
- `cons`
- `promptExamples`
- `tutorialOutline`
- `alternatives`
- `flow`

本次新增轻量工作流展示：`FlowBlock`。重点工具使用专属流程，例如 ChatGPT、Claude、Perplexity、Midjourney、Runway、Cursor；其它工具按分类 fallback。

### 教程详情页

教程页保持“可跟做教程页”结构：

- 教程概览
- 本篇你会完成什么
- 准备工作
- 跟做步骤
- 提示词示例
- 常见错误
- 完成检查
- 下一步学习

本次清理了步骤中的前台占位说明，改为操作记录提示。

### 对比详情页

对比页补齐决策内容：

- 一句话结论
- 适合谁
- 核心维度表
- 轻量能力对比图
- 推荐结论
- 不推荐场景

本次为 9 个对比详情页新增了专属结论、维度、评分条和不推荐场景映射。

### 视频详情页

视频页补齐观看后续内容：

- 视频概览
- 本视频你会学到
- 章节时间轴
- 文字稿 / 重点摘要
- 观看建议
- 相关教程和工具

缺少真实视频地址时，前台显示可读摘要，不显示“待补”文案。

## 新增组件

- `src/components/DetailContentBlocks.jsx`
  - `FlowBlock`
  - `ComparisonBars`

## 流程图添加清单

- `/ai-tools/chatgpt`
- `/ai-tools/claude`
- `/ai-tools/gemini`
- `/ai-tools/deepseek`
- `/ai-tools/kimi`
- `/ai-tools/perplexity`
- `/ai-tools/midjourney`
- `/ai-tools/runway`
- `/ai-tools/elevenlabs`
- `/ai-tools/cursor`
- 其它工具按分类流程 fallback 显示

## 对比图添加清单

- `/compare/chatgpt-vs-claude`
- `/compare/gemini-vs-chatgpt`
- `/compare/perplexity-vs-google-search`
- `/compare/deepseek-vs-chatgpt-chinese`
- `/compare/kimi-vs-claude-long-doc`
- `/compare/midjourney-vs-tongyi-wanxiang`
- `/compare/runway-vs-kling-video`
- `/compare/elevenlabs-vs-china-ai-voice`
- `/compare/cursor-vs-claude-code`

## 占位词残留

- 前台详情页内容中的明显占位文案已清理。
- `scripts/` 和 `tests/` 中保留的 `placeholder` 是审计/测试语义，不属于前台展示内容。
- `HomeHero`、`ToolDetailNavigation` 中的 HTML `placeholder` 是搜索输入提示，保留。

## 仍需人工确认

见 `outputs/content-confirmation-needed.md`。

## 验证结果

- `npm.cmd test`：通过，16/16
- `npm.cmd run build`：通过，生成 96 个静态页面
