# 内容人工确认清单

生成时间：2026-06-22

## 需要人工确认

### 视频真实播放地址

以下视频详情页目前没有真实 `embedUrl`。前台已使用视频概览、章节时间轴、重点摘要和观看建议承接，不显示“待补”或“占位”文案；上线真实视频后建议补充真实播放地址。

- `/videos/chatgpt-3min-guide`
- `/videos/claude-user-fit-video`
- `/videos/gemini-vs-chatgpt-video`
- `/videos/perplexity-research-video`
- `/videos/deepseek-beginner-video`
- `/videos/kimi-long-doc-video`
- `/videos/midjourney-image-video`
- `/videos/runway-video-generation-video`
- `/videos/elevenlabs-voice-video`
- `/videos/cursor-ai-coding-video`

### 价格和额度

所有工具涉及价格、额度、授权和商用范围时，页面文案保持“以官网为准”的原则。上线前如需要展示具体价格，请人工核对各工具官网。

### 外部链接披露

工具详情页外部官网链接已加 `rel="sponsored nofollow noopener"`。如果后续接入联盟参数，请人工确认披露文案和链接跳转是否符合实际合作关系。

## 占位词处理结果

- 前台可见的“截图占位 / 后续补充 / 待补充 / 人工教程占位 / 视频链接”等文案已移除或替换为可读说明。
- `scripts/` 和 `tests/` 中仍保留 `placeholder` 等词作为审计规则和测试说明，不属于前台内容。
- 搜索框的 HTML `placeholder` 属性保留，属于输入框提示能力，不是内容占位稿。
