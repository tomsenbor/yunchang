# AI 模型库 Design QA

## Evidence

- source visual truth path: `outputs/ai-models-design/ai-models-direction-3-signal-map.png`
- browser-rendered implementation screenshot: `outputs/ai-models-design/ai-models-hero-final-1440.png`
- mobile implementation screenshot: `outputs/ai-models-design/ai-models-hero-final-390.png`
- final Hero comparison evidence: `outputs/ai-models-design/ai-models-hero-final-qa-comparison.png`
- full-view comparison evidence: `outputs/ai-models-design/ai-models-design-qa-comparison.png`
- focused database comparison evidence: `outputs/ai-models-design/ai-models-database-qa-comparison.png`
- additional state evidence:
  - `outputs/ai-models-design/ai-models-table-1440.png`
  - `outputs/ai-models-design/ai-models-comparison-1440.png`
  - `outputs/ai-models-design/ai-models-filter-drawer-390.png`
  - `outputs/ai-models-design/ai-model-detail-gpt-4o-1440.png`
- viewport: desktop `1440 × 1024`; mobile `390 × 844`
- state: `/ai-models` 默认卡片视图、表格视图、移动筛选抽屉、搜索结果、无结果恢复、四项对比面板、FAQ 单项展开；`/ai-models/gpt-4o` 详情模板

## Findings

- 当前没有未解决的 P0、P1 或 P2 设计问题。
- 字体与层级：桌面 Hero、模块标题、正文和参数文本形成清晰层级；移动端 H1 在 390px 下稳定显示为“找到适合你的 / AI 模型”，桌面保持单行。
- 间距与布局：桌面 5×2 厂商网格、3×2 任务网格和 3 列模型卡片符合锁定结构；移动端厂商 2 列、模型卡片 1 列，页面无横向溢出。
- 颜色与视觉令牌：深海军蓝、低透明度青色轨道、浅灰内容画布、白色数据容器和中性未知值标签与 Signal Map 方向一致。
- 图片与资产：使用项目现有 Logo；缺少可靠 Logo 时使用统一文字 fallback。Hero 轨道为用户明确授权的页面作用域 CSS 非语义装饰，不替代厂商品牌图形。
- 文案与数据：22 个模型、10 个厂商和家族统计来自真实记录派生；未确认字段统一使用“未公开”“待核对”“以官方最新文档为准”，没有模板占位符、假分数或绝对排名。
- 交互与可访问性：卡片/表格切换、更多筛选、移动抽屉、搜索无结果恢复、最多四项对比、FAQ 单项展开均可操作；焦点样式、44px 移动目标和 reduced-motion 已覆盖。

## Comparison History

### Iteration 1

- earlier finding: `[P2]` 390px Hero 的横向任务标签显示浏览器原生滚动条，削弱深色首屏的克制感。证据：`outputs/ai-models-design/ai-models-mobile-hero-390.png`。
- fix made: 在页面作用域移动端样式中为 `.quickTasks` 增加 `scrollbar-width: none` 与 `::-webkit-scrollbar { display: none; }`，保留横向滑动能力；同时增加专项测试。
- post-fix visual evidence: `outputs/ai-models-design/ai-models-mobile-390.png`。滚动条已隐藏，任务标签仍可横向滚动，页面级横向溢出为 0。

### Iteration 2

- earlier finding: `[P2]` 390px 标题第二行只有“模型”；快速任务最右文字出现硬裁切；Hero 弧形与厂商模块之间留白偏深；第四项统计暴露“待核查条目”；辅助文字对比度偏低。
- fix made: 仅在移动端将 H1 控制为“找到适合你的 / AI 模型”；第四项统计改为 `taskSummaries.length` 派生的“任务维度”；任务标签使用完整胶囊、32px 右侧渐隐、44px 末端安全区、触摸横滑和方向键滚动；弧形可见高度由 62px 收至 46px，厂商内容上移 42px；辅助文字 alpha 提升约 10%–15%。
- post-fix visual evidence: `outputs/ai-models-design/ai-models-hero-final-1440.png` 与 `outputs/ai-models-design/ai-models-hero-final-390.png`。1440px H1 两个 span 顶部同为 175px；390px 两行顶部分别为 155px 和 203px；方向键从 0 滚动到最大 163px，末项右边界 331px，位于 343px 渐隐安全边界内；页面 `scrollWidth === clientWidth`。

## Primary Interactions Tested

- 卡片视图与表格视图切换；表格保持在容器内。
- 更多筛选展开；移动端筛选抽屉显示“查看 22 个模型”。
- 搜索 `GPT-4o` 返回 1 项；无匹配搜索显示四个恢复入口；“查看全部模型”恢复 22 项。
- 连续选择 4 个模型后，第 5 个对比按钮禁用；“开始对比”在 `/ai-models` 内打开 13 行参数面板，没有综合总分。
- FAQ 从第一项切换到第二项时始终只展开一项。
- 移动导航、移动对比栏、桌面与移动端页面级横向溢出。
- GPT-4o、Claude Sonnet、Gemini Pro 和 Llama 70B 详情页；目录吸顶、canonical 与 JSON-LD。

## Console and Resource Checks

- 页面控制台：0 errors，0 warnings。
- `/`、`/ai-tools`、`/ai-tools/chatgpt`、`/guides`、`/methodology`、`/ai-models`、四个模型详情页及 `/sitemap.xml`：HTTP 200。
- `/ai-models` 发现的 13 个 JS/CSS 资源：0 个 404。

## Open Questions

- 无。

## Implementation Checklist

- [x] 参考图与桌面实现同屏比较
- [x] 数据库重点区域同屏比较
- [x] 390px P2 滚动条问题修复并复核
- [x] Hero 最终五项视觉收敛与 1440px / 390px 复核
- [x] 桌面、移动、筛选、表格、对比、FAQ 和详情页验收
- [x] 控制台、资源、SEO 与路由回归

## Follow-up Polish

- 无阻塞交付的 P3 项。

final result: passed
