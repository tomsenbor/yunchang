# AI 模型库 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在现有 Next.js 中文 AI 效率工具站中完成 `/ai-models`、22 个模型的数据底座、3 个完整示范详情页，以及卡片/表格筛选和页内 2–4 模型参数对比体验。

**Architecture:** 使用服务端页面负责 SEO、JSON-LD 和静态数据注入，客户端组件负责搜索、筛选、视图切换、移动抽屉、FAQ 与页内对比状态。模型事实数据与纯派生逻辑分离：`model-content.mjs` 只保存可追溯记录和未知值，`model-explorer.mjs` 提供无副作用的统计、搜索、筛选、排序和对比行生成函数，便于直接使用 Node 内置测试框架验证。

**Tech Stack:** Next.js 16 App Router、React 19、CSS Modules、现有全局样式与品牌组件、Node `node:test`、ESLint 9；不新增生产依赖或测试依赖。

## Global Constraints

- 唯一设计依据：`docs/superpowers/specs/2026-07-21-ai-models-design.md`，视觉基准为方向 3，不生成第四套方案。
- Phase 1 仅包含明确指定的 22 个模型；不为凑数量增加模型。
- 固定 10 个厂商，桌面严格 5×2；“查看全部厂商”在模块标题右侧，不创建占位卡。
- 默认模型数据库为卡片视图，桌面 3 列、移动端 1 列；表格只在自身容器内横向滚动。
- 不新增 `/ai-models/compare`；2–4 个模型在 `/ai-models` 内打开参数对比面板或弹层。
- 对比只使用模型记录已有字段，不输出主观综合总分。
- 公开基准或本站场景评分缺少可靠数据时隐藏数字展示，改为“当前暂无可核查的统一数据”。
- 禁止伪造参数、价格、基准、发布时间、分数、进度条、模板变量和绝对排名。
- 未确认字段只使用“未公开”“待核对”“以官方最新文档为准”。
- Hero 统计从 22 条模型记录和 10 条厂商记录动态派生，源码和页面均不得出现模板占位符。
- Hero 使用模型关系轨道和研究型构图，不复制 `/ai-tools` 的中央圆形光晕与具体排版。
- 复用现有 Header、Footer、BrandMark、SEO、JSON-LD 和字体；不修改 AI 工具业务数据。
- `package.json` 已确认存在 `lint: "eslint ."`，最终必须运行 `npm.cmd run lint`；不增加 lint 依赖。
- 不执行 Git commit、push、tag 或部署。所有任务用 `git diff` 和文件级反向补丁作为回退点。

---

## 文件结构锁定

### 新增文件

- `src/lib/model-content.mjs`：未知值常量、10 个厂商、22 个模型、6 个任务、8 个 FAQ、选择指南、详情内容和来源结构。
- `src/lib/model-explorer.mjs`：统计、全文搜索、筛选、排序、厂商/任务摘要、最多 4 个对比选择和对比行生成。
- `src/app/ai-models/page.js`：总览页 metadata、CollectionPage/ItemList/FAQ JSON-LD 和服务端数据注入。
- `src/app/ai-models/ai-models.module.css`：总览页所有作用域样式和响应式状态。
- `src/app/ai-models/[slug]/page.js`：详情页 metadata、静态参数、文档型内容和来源/未知状态渲染。
- `src/app/ai-models/[slug]/page.module.css`：详情页文档布局、吸顶目录和移动响应式。
- `src/components/ModelExplorer.jsx`：Hero、厂商、任务、内容模块和全页交互编排。
- `src/components/ModelDatabase.jsx`：数据库搜索、核心/更多筛选、视图切换、卡片、表格、移动筛选抽屉和无结果状态。
- `src/components/ModelComparison.jsx`：底部对比栏和页内参数对比弹层。
- `tests/ai-models-data.test.mjs`：22 条数据、10 厂商、未知值、来源结构、派生逻辑和对比逻辑。
- `tests/ai-models-pages.test.mjs`：导航、总览、详情、SEO、sitemap、内容和无 compare 路由约束。
- `tests/ai-models-ui.test.mjs`：卡片/表格、筛选抽屉、FAQ、对比弹层、响应式与无横向滚动的源码契约。

### 修改文件

- `src/components/Header.jsx`：修正“AI模型库”链接为 `/ai-models`，增加模型总览/详情的当前态和深色覆盖 Header 识别。
- `src/lib/site-data.mjs`：在 `navItems` 和 `staticRoutes` 中加入 `/ai-models`，不把模型记录混入 AI 工具数组。
- `src/app/sitemap.js`：导入 `modelRoutes` 并加入 22 个详情 URL。
- `src/app/methodology/page.js`：新增 `id="ai-models"` 的模型数据方法区，不改变现有工具评测方法。
- `tests/site.test.mjs`：更新导航/路由期望，保留并扩展现有断言。

### 明确不新增

- 不创建 `src/app/ai-models/compare/` 或任何 `/ai-models/compare` 页面。
- 不新增模型 Logo 素材。仅复用仓库中能可靠对应厂商的既有图标；其余使用需求允许的文字 fallback。
- 不修改 `package.json`、lockfile、部署文件、AI 工具内容文件或既有工具详情逻辑。

---

# Phase 1A：数据、路由、SEO 与页面基础

## Task 1A-1：建立 10 厂商、22 模型和来源/未知值规则

**Files:**

- Create: `src/lib/model-content.mjs`
- Create: `tests/ai-models-data.test.mjs`

**Dependencies:**

- 数据依据：已确认规格中的厂商和 22 个模型名称。
- 可复用资产：`public/icons/ai-tools/*.svg|jpg` 与 `public/brand-icons/current/*`；只有准确对应厂商时设置 `logoPath`，否则 `logoPath: null` 并显示厂商名称文字 fallback。
- 不依赖 `src/lib/tool-content.mjs`，防止模型与工具概念耦合。

**Interfaces:**

- Produces: `MODEL_UNKNOWN`、`MODEL_DATASET_UPDATED_AT`、`modelVendors`、`aiModels`、`modelTasks`、`modelFaqs`、`modelSelectionSteps`、`featuredDetailSlugs`、`modelRoutes`、`getModelBySlug(slug)`。
- `MODEL_UNKNOWN` 固定为 `{ unpublished: '未公开', pending: '待核对', official: '以官方最新文档为准' }`。
- 每条模型记录至少包含：`slug`、`name`、`vendorId`、`family`、`aliases`、`summary`、`taskIds`、`type`、`contextWindow`、`maxOutput`、`inputModalities`、`outputModalities`、`apiAvailability`、`weightAvailability`、`pricing`、`releaseDate`、`verification`、`sources`。
- `verification` 结构固定为 `{ status, checkedAt }`；未核查记录使用 `status: '待核对'`、`checkedAt: null`。
- `sources` 项结构固定为 `{ label, url, kind, checkedAt }`；没有已核查来源时使用空数组，不伪造 URL。

**先写的测试:**

- [ ] 在 `tests/ai-models-data.test.mjs` 写入以下失败断言：

```js
test('phase 1 contains exactly 22 unique model records from 10 vendors', () => {
  assert.equal(aiModels.length, 22);
  assert.equal(modelVendors.length, 10);
  assert.equal(new Set(aiModels.map((model) => model.slug)).size, 22);
  assert.deepEqual(aiModels.map((model) => model.name), [
    'GPT-4o', 'GPT-4.1', 'o3', 'o4-mini',
    'Claude Sonnet', 'Claude Opus', 'Claude Haiku',
    'Gemini Pro', 'Gemini Flash', 'DeepSeek R1', 'DeepSeek V3',
    'Qwen Max', 'Qwen Coder', 'Qwen VL',
    'Llama 8B', 'Llama 70B', 'Llama 405B',
    'Grok', 'Mistral Large', 'Mixtral', 'Kimi', 'GLM'
  ]);
});

test('unknown facts use the approved neutral vocabulary', () => {
  const allowed = new Set(Object.values(MODEL_UNKNOWN));
  for (const model of aiModels) {
    for (const value of [model.type, model.contextWindow, model.maxOutput,
      model.apiAvailability, model.weightAvailability, model.pricing, model.releaseDate]) {
      assert.ok(allowed.has(value), `${model.slug} contains an unverified fact`);
    }
    assert.deepEqual(model.sources, []);
    assert.equal(model.verification.checkedAt, null);
  }
});
```

- [ ] 增加厂商 ID 完整性、模型 `vendorId` 引用存在、slug 唯一、来源结构可验证、`featuredDetailSlugs` 精确为 `gpt-4o`、`claude-sonnet`、`gemini-pro` 的断言。
- [ ] 增加禁止字段断言：记录中不得出现 `overallScore`、`benchmarkScore`、`rank`、`fakePrice`。

**实现内容:**

- [ ] 创建 10 个厂商记录：OpenAI、Anthropic、Google、DeepSeek、Alibaba Cloud、Meta、xAI、Mistral AI、Moonshot AI、Zhipu AI。
- [ ] 创建且仅创建规格列出的 22 个模型。名称和归属可填写；事实参数使用统一未知值。
- [ ] 为 3 个示范详情模型设置 `detailLevel: 'featured'`；其余为 `detailLevel: 'standard'`。
- [ ] `modelRoutes` 从 `aiModels.map(({ slug }) => `/ai-models/${slug}`)` 派生，禁止手写重复路由表。
- [ ] 任务与 FAQ 数据只包含中性、无绝对排名措辞；任务代表模型属于编辑候选，不带分数。

**验证命令:**

```powershell
node --test tests/ai-models-data.test.mjs
```

预期：全部数据测试 PASS，输出显示 22 条模型和 10 个厂商相关断言通过。

**验收标准:**

- 恰好 22 条模型、10 个厂商、22 个唯一 slug。
- 未核查事实没有数字、价格或日期伪值。
- 来源为空时 UI 有明确未知状态的数据基础。
- 数据模块不导入 AI 工具数据。

**回退点:**

- 本任务只新增两个文件。若审查不通过，将它们移动到 `tmp/ai-models-rollback/1a-1/`，不触碰现有文件、不运行 `git reset`。

## Task 1A-2：建立派生统计、搜索、筛选、排序与对比纯逻辑

**Files:**

- Create: `src/lib/model-explorer.mjs`
- Modify: `tests/ai-models-data.test.mjs`

**Dependencies:**

- Consumes: `aiModels`、`modelVendors`、`modelTasks`、`MODEL_UNKNOWN` from `src/lib/model-content.mjs`。
- 不依赖 React 或 DOM，确保 Node 测试可直接执行。

**Interfaces:**

- Produces: `getModelStats(models, vendors)`、`searchModels(models, query)`、`filterModels(models, filters)`、`sortModels(models, sortKey)`、`getVendorSummaries(models, vendors)`、`getTaskSummaries(models, tasks)`、`toggleComparisonSlug(current, slug, max = 4)`、`buildComparisonRows(models)`。
- `filters` 固定键：`vendorId`、`family`、`type`、`modality`、`apiAvailability`、`contextBucket`、`weightAvailability`、`priceBucket`、`releaseBucket`。
- `getModelStats` 返回 `{ modelCount, vendorCount, familyCount, reviewedCount, pendingCount }`，全部从输入数据计算。
- `buildComparisonRows` 仅允许：名称、厂商、家族、类型、上下文、最大输出、输入模态、输出模态、API、开放状态、价格状态、发布时间、核查状态。

**先写的测试:**

- [ ] 扩展 `tests/ai-models-data.test.mjs`：

```js
test('stats are derived from model records without template placeholders', () => {
  assert.deepEqual(getModelStats(aiModels, modelVendors), {
    modelCount: 22,
    vendorCount: 10,
    familyCount: new Set(aiModels.map((model) => model.family)).size,
    reviewedCount: 0,
    pendingCount: 22
  });
});

test('comparison selection is deterministic and capped at four', () => {
  let selected = [];
  for (const slug of ['gpt-4o', 'claude-sonnet', 'gemini-pro', 'deepseek-r1']) {
    selected = toggleComparisonSlug(selected, slug);
  }
  assert.equal(selected.length, 4);
  assert.deepEqual(toggleComparisonSlug(selected, 'qwen-coder'), selected);
  assert.deepEqual(toggleComparisonSlug(selected, 'gpt-4o'), selected.slice(1));
});
```

- [ ] 增加搜索可匹配名称、厂商、家族、别名和任务文本的断言。
- [ ] 增加组合筛选、清空筛选、排序稳定性、未知上下文/价格/发布时间不会被误当数字排序的断言。
- [ ] 增加对比行不包含 `score`、`rank`、`benchmark` 的断言。

**实现内容:**

- [ ] 所有查询先使用 `String(value || '').trim().toLocaleLowerCase('zh-CN')` 规范化。
- [ ] 搜索字段由显式白名单拼接，不序列化整个对象，避免把来源 URL 或内部状态当搜索关键词。
- [ ] 筛选函数逐键判断；值为 `all` 时跳过；未知区间使用 `unknown` bucket。
- [ ] 排序支持 `recommended`、`latest`、`verified`、`context`、`price`；无可核查数字时保持原始稳定顺序，不解析未知文本。
- [ ] 对比选择函数负责加入、移除和上限；UI 不重复实现限制逻辑。

**验证命令:**

```powershell
node --test tests/ai-models-data.test.mjs
```

预期：数据、搜索、筛选、统计和对比纯逻辑全部 PASS。

**验收标准:**

- Hero 数字全部可由 `getModelStats` 得到。
- 组合筛选无随机性，空查询返回全部 22 条。
- 第 5 个模型无法加入，对已选模型再次操作可以移除。
- 对比行仅使用现有记录字段。

**回退点:**

- 删除新增 `model-explorer.mjs`，并反向移除本任务追加的测试块；保留 Task 1A-1 数据文件。

## Task 1A-3：接入导航、总览路由、SEO、JSON-LD 与 sitemap

**Files:**

- Create: `src/app/ai-models/page.js`
- Create: `src/components/ModelExplorer.jsx`
- Create: `src/app/ai-models/ai-models.module.css`
- Create: `tests/ai-models-pages.test.mjs`
- Modify: `src/components/Header.jsx`
- Modify: `src/lib/site-data.mjs`
- Modify: `src/app/sitemap.js`
- Modify: `tests/site.test.mjs`

**Dependencies:**

- Consumes: model exports from Tasks 1A-1/1A-2。
- Reuses: `Header`、`BrandMark`、`Footer`、`JsonLd`、`pageMetadata`、`buildCanonicalUrl`。

**Interfaces:**

- `AiModelsPage` server component passes `{ models, vendors, tasks, faqs, selectionSteps, stats }` to `ModelExplorer`。
- `ModelExplorer` initially renders the complete section skeleton and exact single H1, while Phase 1B fills rich interaction components。
- `Header` introduces `isAiModelsLanding` and `isAiModelsRoute` without changing AI 工具分组判断。

**先写的测试:**

- [ ] 创建 `tests/ai-models-pages.test.mjs`，断言：

```js
test('AI models overview exposes canonical collection SEO and one H1', async () => {
  const page = await readFile(pagePath, 'utf8');
  const component = await readFile(componentPath, 'utf8');
  assert.match(page, /path: '\/ai-models'/);
  assert.match(page, /'@type': 'CollectionPage'/);
  assert.match(page, /numberOfItems: aiModels\.length/);
  assert.match(component, /<h1[^>]*>找到适合你的 AI 模型<\/h1>/);
  assert.equal((`${page}\n${component}`.match(/<h1\b/g) || []).length, 1);
  assert.doesNotMatch(`${page}\n${component}`, /\{\{[^}]+\}\}/);
});
```

- [ ] 断言 Header 的“AI模型库”链接精确为 `/ai-models`，模型详情路径也激活当前态和深色覆盖 Header。
- [ ] 断言 `getAllRoutes()` 包含 `/ai-models`，sitemap 源码合并 `modelRoutes`，且不存在 `/ai-models/compare`。
- [ ] 修改 `tests/site.test.mjs` 中 `navItems` 期望，加入 `/ai-models`，不删除既有路由断言。

**实现内容:**

- [ ] 修正 Header 中当前错误的 `{ href: '/ai-tools', label: 'AI模型库' }` 为 `/ai-models`。
- [ ] 深色覆盖 Header 同时作用于 `/ai-tools` 总览和 `/ai-models` 总览；详情页使用浅色 Header。
- [ ] 总览 metadata 标题、描述和 canonical 明确使用“AI 模型”，不把模型称为工具。
- [ ] JSON-LD 使用 `CollectionPage` + `ItemList`，数量为 `aiModels.length`；FAQ 数据通过现有 `faqJsonLd` 生成。
- [ ] `site-data.mjs` 只添加总览静态路由；详情路由由 `sitemap.js` 导入 `modelRoutes` 合并，避免把模型混入工具数据。
- [ ] 页面骨架按最终顺序提供语义 section 和锚点：Hero、vendors、tasks、database、guide、difference、faq、methodology、cta。
- [ ] CSS 先建立颜色变量、最大宽度、深色 Hero、轨道背景层、弧形过渡和浅色页面背景；不复制 `.heroGlow`。

**验证命令:**

```powershell
node --test tests/ai-models-pages.test.mjs
npm.cmd test
```

预期：新页面/导航/SEO 测试 PASS，完整既有测试套件无回归。

**验收标准:**

- `/ai-models` 可访问，Header 链接和当前态正确。
- 页面只有一个 H1，源码无模板变量。
- sitemap 包含总览与 22 个详情 URL，不包含 compare 路由。
- AI 工具路由与导航分组保持原行为。

**回退点:**

- 新增文件可整体移入 `tmp/ai-models-rollback/1a-3/`。
- 现有文件只回退本任务的 `/ai-models` 行和判断分支，不覆盖用户同期修改；先查看 `git diff -- src/components/Header.jsx src/lib/site-data.mjs src/app/sitemap.js tests/site.test.mjs`。

## Task 1A-4：完成 3 个示范详情页与通用安全回退模板

**Files:**

- Create: `src/app/ai-models/[slug]/page.js`
- Create: `src/app/ai-models/[slug]/page.module.css`
- Modify: `src/lib/model-content.mjs`
- Modify: `tests/ai-models-pages.test.mjs`

**Dependencies:**

- Consumes: `getModelBySlug`、`aiModels`、`featuredDetailSlugs`、`MODEL_UNKNOWN`、`pageMetadata`、`breadcrumbJsonLd`、`JsonLd`。
- 三个完整示范：GPT-4o、Claude Sonnet、Gemini Pro。

**Interfaces:**

- `generateStaticParams()` 返回 22 个 slug，保证总览卡片的详情链接均有响应。
- `generateMetadata({ params })` 使用模型名、厂商、家族和安全摘要构造 canonical。
- `getDetailSections(model)` 返回固定 12 节内容；没有可靠数据的公开基准/评分节返回统一空态文案。

**先写的测试:**

- [ ] 在 `tests/ai-models-pages.test.mjs` 增加：

```js
test('detail template exposes all 22 routes and three featured records', () => {
  assert.equal(modelRoutes.length, 22);
  assert.deepEqual(featuredDetailSlugs, ['gpt-4o', 'claude-sonnet', 'gemini-pro']);
  for (const slug of featuredDetailSlugs) assert.ok(getModelBySlug(slug));
});
```

- [ ] 静态断言详情页包含 12 个结构标题、右侧目录、`generateMetadata`、`generateStaticParams`、`notFound()`。
- [ ] 断言详情页包含“当前暂无可核查的统一数据”和“本站编辑评价，仅用于场景选择参考”，且不包含假分数、`overallScore` 或百分比进度条。
- [ ] 断言每个模型详情 canonical 为 `/ai-models/${model.slug}`。

**实现内容:**

- [ ] 使用浅色文档型 Hero、主内容 + 右侧吸顶目录；`aside` 在小于 1024px 时回归普通文档流。
- [ ] 三个 featured 模型完整展示所有节标题、字段和空态；不填未经核查的参数。
- [ ] 其余 19 个模型使用相同路由模板和记录字段，缺失内容显示安全空态，保证“查看详情”不失效。
- [ ] 官方入口仅在 `sources` 存在可核查官方 URL 时渲染链接，否则显示不可点击的“官方入口待核对”。
- [ ] 公开基准和本站场景评分不渲染数字、雷达图、进度条或综合分。

**验证命令:**

```powershell
node --test tests/ai-models-pages.test.mjs
npm.cmd test
```

预期：详情路由、SEO 和无假数据测试 PASS。

**验收标准:**

- 三个示范详情页结构完整；所有 22 个 slug 都能获得安全模板。
- 右侧目录吸顶且链接到 12 个 section。
- 没有可靠基准时只显示空态，不显示任何演示数字。
- 未知参数统一中性呈现。

**回退点:**

- 移除 `[slug]` 新增目录和 Task 1A-4 添加的数据字段/测试块；总览与 22 条基础数据保持可用。

## Phase 1A 完成检查

- [ ] 运行 `npm.cmd test`，确认数据、路由、SEO 和既有测试全部通过。
- [ ] 运行 `npm.cmd run lint`，确认 Phase 1A 无 ESLint 错误。
- [ ] 运行 `npm.cmd run build`，确认 22 个模型详情参数可构建。
- [ ] 检查 `git diff --stat` 和 `git status --short`，确认没有 compare 路由、依赖文件、部署文件或无关变更。

---

# Phase 1B：数据库交互、对比与完整视觉

## Task 1B-1：完成 10 个厂商入口和 6 个任务入口

**Files:**

- Modify: `src/components/ModelExplorer.jsx`
- Modify: `src/app/ai-models/ai-models.module.css`
- Modify: `src/lib/model-content.mjs`
- Modify: `src/lib/model-explorer.mjs`
- Modify: `tests/ai-models-data.test.mjs`
- Create: `tests/ai-models-ui.test.mjs`

**Dependencies:**

- Consumes: `getVendorSummaries`、`getTaskSummaries`、10 厂商、6 任务和 22 模型。
- Reuses exact existing local logos only where matched; otherwise textual fallback。

**先写的测试:**

- [ ] 数据测试断言厂商摘要精确 10 条、数量来自 22 条模型分组，总和为 22。
- [ ] UI 测试断言厂商网格存在 10 个 `article`，源码使用 `getVendorSummaries`，标题右侧存在“查看全部厂商”，且不存在“更多厂商”卡。
- [ ] UI 测试断言 6 个任务名齐全，推荐声明包含“仅作为选型参考”且源码不含“最强”“第一名”“绝对性能排名”。

**实现内容:**

- [ ] 厂商卡桌面严格 `grid-template-columns: repeat(5, minmax(0, 1fr))`，平板降为 3/2 列，390px 保持 2 列并精简定位说明。
- [ ] 卡片显示厂商名、家族、动态模型数、定位、最多 3 个代表模型和入口按钮。
- [ ] “查看全部厂商”滚动/聚焦当前厂商网格，不创建新路由或占位卡。
- [ ] 任务卡显示线性图标、任务说明、动态候选数、3 个代表名称和“查看相关模型”；点击后设置数据库 `taskId` 筛选并滚动到数据库。
- [ ] 推荐声明明确来源和核查边界，不产生评分。

**验证命令:**

```powershell
node --test tests/ai-models-data.test.mjs tests/ai-models-ui.test.mjs
```

预期：10 厂商、6 任务、动态数量和中性措辞断言 PASS。

**验收标准:**

- 厂商桌面 5×2，无第 11 张卡。
- 数量由真实数据派生。
- 任务入口能驱动数据库筛选，不是无响应按钮。
- 不出现绝对排名语句。

**回退点:**

- 反向移除 `ModelExplorer` 中 vendors/tasks 两个 section 的本任务实现，保留 Phase 1A 的语义骨架和数据函数。

## Task 1B-2：完成默认模型卡片视图和专业表格视图

**Files:**

- Create: `src/components/ModelDatabase.jsx`
- Modify: `src/components/ModelExplorer.jsx`
- Modify: `src/app/ai-models/ai-models.module.css`
- Modify: `tests/ai-models-ui.test.mjs`

**Dependencies:**

- Consumes: 22 个模型、未知值常量、`searchModels`、`filterModels`、`sortModels`。
- Produces callbacks: `onToggleComparison(slug)`、`onOpenFilters()`、`onFiltersChange(nextFilters)`。

**先写的测试:**

- [ ] UI 测试断言默认 state 为 `viewMode = 'cards'`，切换按钮含 `aria-pressed` 和“卡片视图/表格视图”。
- [ ] 断言卡片展示 13 类必要信息和 `/ai-models/${model.slug}` 详情链接。
- [ ] 断言表头精确包含模型、厂商、家族、模型类型、上下文、最大输出、输入模态、API、开放状态、价格、发布时间、核查日期、操作。
- [ ] CSS 断言 `.modelTableScroller { overflow-x: auto; }`，页面根容器包含 `overflow-x: clip` 或 `hidden`，表格存在最小宽度且不扩大页面。

**实现内容:**

- [ ] 默认渲染 3 列模型卡；卡片只展示摘要参数，完整说明引导详情页。
- [ ] 未知字段直接渲染模型记录中的中性文案，不转换为 `0`、`-` 或红色警告。
- [ ] 表格视图使用语义 `<table>`，表头轻量吸顶、行 Hover、数值/参数列使用 tabular numbers。
- [ ] 表格操作列提供“详情”和“加入对比”，两个按钮都有效。
- [ ] 表格外层唯一 `.modelTableScroller` 负责横向滚动；页面级容器不允许 `width: max-content`。

**验证命令:**

```powershell
node --test tests/ai-models-ui.test.mjs
npm.cmd test
```

预期：卡片/表格契约和全套测试 PASS。

**验收标准:**

- 初次进入为卡片视图。
- 切换后保留同一搜索/筛选结果。
- 表格所有列完整，操作按钮有响应。
- 只有表格容器横向滚动。

**回退点:**

- 移除 `ModelDatabase.jsx` 并将 `ModelExplorer` 恢复到数据库骨架；数据、路由和上方模块不回退。

## Task 1B-3：完成更多筛选、搜索状态和移动端底部抽屉

**Files:**

- Modify: `src/components/ModelDatabase.jsx`
- Modify: `src/components/ModelExplorer.jsx`
- Modify: `src/app/ai-models/ai-models.module.css`
- Modify: `tests/ai-models-data.test.mjs`
- Modify: `tests/ai-models-ui.test.mjs`

**Dependencies:**

- Consumes: `filterModels`、`sortModels`、`searchModels`；Task 1B-2 的视图容器。
- Filter state shape: `{ query, taskId, vendorId, family, type, modality, apiAvailability, contextBucket, weightAvailability, priceBucket, releaseBucket, sortKey }`。

**先写的测试:**

- [ ] 数据测试覆盖多条件组合、清除单个条件、清除全部和无结果。
- [ ] UI 测试断言核心筛选、更多筛选按钮、已选条件标签、清除全部、结果数和搜索词状态都存在。
- [ ] UI 测试断言移动抽屉使用 `role="dialog"`、`aria-modal="true"`、关闭按钮和“查看 N 个模型”。
- [ ] 断言无结果状态包含“清除搜索词”“减少筛选条件”“查看全部模型”“浏览模型厂商”四个恢复入口。

**实现内容:**

- [ ] 桌面首行只展示搜索、厂商、家族、排序和更多筛选，避免后台表单墙。
- [ ] 展开区展示类型、模态、API、上下文、开放状态、价格、发布时间。
- [ ] 选中条件生成可移除 chip；移除或清空后结果实时恢复。
- [ ] 移动端核心区域只显示结果数、排序和筛选按钮；筛选项在底部抽屉中呈现。
- [ ] 抽屉打开时锁定页面滚动，Escape/遮罩/关闭按钮均可关闭，关闭后焦点返回筛选按钮。
- [ ] “查看 N 个模型”关闭抽屉并聚焦结果标题。

**验证命令:**

```powershell
node --test tests/ai-models-data.test.mjs tests/ai-models-ui.test.mjs
```

预期：筛选纯逻辑与 UI 可访问性契约 PASS。

**验收标准:**

- 搜索结果、组合筛选、单项移除、清除全部和无结果恢复均可操作。
- 移动抽屉不会导致页面横向滚动或正文误触。
- 所有按钮点击区域至少 44px。

**回退点:**

- 仅回退 `ModelDatabase` 的 advanced/mobile filter 区块和相关 CSS/测试；保留卡片/表格基础视图。

## Task 1B-4：完成最多 4 个模型的页内对比栏与参数对比弹层

**Files:**

- Create: `src/components/ModelComparison.jsx`
- Modify: `src/components/ModelExplorer.jsx`
- Modify: `src/components/ModelDatabase.jsx`
- Modify: `src/app/ai-models/ai-models.module.css`
- Modify: `tests/ai-models-data.test.mjs`
- Modify: `tests/ai-models-ui.test.mjs`

**Dependencies:**

- Consumes: `toggleComparisonSlug`、`buildComparisonRows`、22 个模型。
- Produces: fixed comparison bar and in-page modal state; no route navigation。

**先写的测试:**

- [ ] 数据测试断言 0–1 个模型不能生成可开始的比较状态，2–4 个可以，第 5 个被拒绝。
- [ ] UI 测试断言“开始对比”调用本地 `setIsComparisonOpen(true)`，不含 `href="/ai-models/compare"`、`router.push('/ai-models/compare')` 或无响应空 handler。
- [ ] 断言弹层有 `role="dialog"`、标题、关闭按钮、对比字段表和“当前暂无可核查的统一数据”空态。
- [ ] 断言源码不含 `overallScore`、`综合总分`、百分比评分进度条。

**实现内容:**

- [ ] 任一卡片/表格“加入对比”更新同一 selection state；已选状态可再次移除。
- [ ] 选择后显示底部固定栏，桌面显示模型标签、清空、折叠和开始对比；移动端只显示数量和主操作。
- [ ] 少于 2 个时“开始对比”禁用并显示明确提示；2–4 个时打开页内弹层。
- [ ] 弹层列为已选模型、行为 `buildComparisonRows` 白名单字段；未知值原样显示。
- [ ] 弹层支持 Escape、遮罩和关闭按钮，关闭后焦点返回“开始对比”。
- [ ] 页面根容器根据对比栏高度增加安全底部 padding，CTA 不被遮挡。

**验证命令:**

```powershell
node --test tests/ai-models-data.test.mjs tests/ai-models-ui.test.mjs
npm.cmd test
```

预期：对比上限、字段白名单、无 compare 路由和 UI 契约 PASS。

**验收标准:**

- 2–4 个模型可以打开对比弹层，按钮绝不无响应。
- 第 5 个模型不能加入，并有可理解的限制提示。
- 不导航到新路由，不展示任何主观总分。
- 移动端对比栏不遮挡筛选抽屉或主要操作。

**回退点:**

- 移除 `ModelComparison.jsx` 和两个调用点；卡片/表格继续可浏览，详情链接不受影响。

## Task 1B-5：完成选择指南、模型/工具区别、FAQ、方法论和 CTA

**Files:**

- Modify: `src/components/ModelExplorer.jsx`
- Modify: `src/app/ai-models/ai-models.module.css`
- Modify: `src/app/methodology/page.js`
- Modify: `tests/ai-models-pages.test.mjs`
- Modify: `tests/ai-models-ui.test.mjs`

**Dependencies:**

- Consumes: `modelSelectionSteps`、`modelFaqs`、动态统计、现有 `/ai-tools` 与 `/methodology` 路由。
- Reuses: `faqJsonLd` already emitted by overview server page。

**先写的测试:**

- [ ] 页面测试断言六个选择步骤标题齐全、模型/工具示例明确分列、`浏览 AI 工具库` 指向 `/ai-tools`。
- [ ] UI 测试断言 FAQ 精确 8 项、初始展开索引为 0、每次仅一个 `aria-expanded="true"`。
- [ ] 页面测试断言方法论链接为 `/methodology#ai-models`，方法页存在 `id="ai-models"`。
- [ ] 断言方法论统计来自 `stats`，不存在硬编码模型数量、假基准或模板变量。

**实现内容:**

- [ ] 六步选择指南按桌面横向/两栏、移动单列展示，每步控制 2–4 行。
- [ ] 模型与工具区别使用两张对比卡：底层能力系统 vs 基于模型构建的产品；示例只用需求给定名称。
- [ ] FAQ 使用单选手风琴状态，按钮具备 `aria-controls` 和键盘焦点样式。
- [ ] 方法论展示官方文档、API/价格页、公告、技术报告、可追溯基准、核查日期和未知值规则；动态数字来自数据层。
- [ ] `/methodology` 在原工具方法下新增独立模型方法 section，不重写工具评分内容。
- [ ] 深色 CTA 使用轨道线和轻微光晕，按钮分别滚动到数据库和打开/聚焦对比选择区。

**验证命令:**

```powershell
node --test tests/ai-models-pages.test.mjs tests/ai-models-ui.test.mjs
npm.cmd test
```

预期：内容结构、FAQ、方法论锚点和 CTA 契约 PASS。

**验收标准:**

- 页面内容结构达到方向 1 的完整度，同时保持方向 3 的视觉基准。
- FAQ 初始仅一项展开且可切换。
- 方法论不与工具评测混淆。
- CTA 的两个操作均有实际响应。

**回退点:**

- 回退 `ModelExplorer` 的五个内容 section 和 `methodology` 新增锚点；数据库与详情功能保持可用。

## Task 1B-6：完成响应式、动效可访问性和浏览器视觉验收

**Files:**

- Modify: `src/app/ai-models/ai-models.module.css`
- Modify: `src/app/ai-models/[slug]/page.module.css`
- Modify: `src/components/ModelExplorer.jsx`
- Modify: `src/components/ModelDatabase.jsx`
- Modify: `src/components/ModelComparison.jsx`
- Modify: `tests/ai-models-ui.test.mjs`
- Optional generated evidence only: `outputs/ai-models-design/ai-models-desktop-1440.png`
- Optional generated evidence only: `outputs/ai-models-design/ai-models-mobile-390.png`
- Optional generated evidence only: `outputs/ai-models-design/ai-model-detail-desktop.png`

**Dependencies:**

- Consumes all Phase 1A/1B components and the existing local dev server on port 3001。
- Browser surface: Codex in-app browser；不使用独立 Playwright CLI。

**先写的测试:**

- [ ] UI 测试断言 CSS 含 `@media (max-width: 639px)`、`@media (min-width: 640px) and (max-width: 1023px)`、`@media (min-width: 1024px)`、`@media (prefers-reduced-motion: reduce)`。
- [ ] 断言移动按钮最小高度 44px、移动厂商 2 列、模型卡 1 列、桌面厂商 5 列、桌面模型卡 3 列。
- [ ] 断言 `.modelTableScroller` 局部滚动、`.explorerPage` 无页面级横向溢出、焦点样式存在。

**实现内容:**

- [ ] 对照方向 3 截图调整 1440px：深色 Hero 研究感轨道、弧形过渡、10 厂商 5×2、6 任务、数据库三列和浮动对比栏。
- [ ] 390px 顺序严格为：导航、Hero、搜索、热门、任务横滑、统计、厂商 2 列、任务、数据库控制、筛选、模型卡、指南、FAQ、方法论、CTA。
- [ ] Hero 轨道只使用低透明 CSS 背景/装饰线，不使用中央圆形光晕、Logo 云或大面积粒子动画。
- [ ] Hover 位移在 reduced-motion 下关闭；所有交互具有 `:focus-visible`。
- [ ] 对长厂商名、未知状态文本、4 个对比标签和表格宽列做溢出检查。

**验证命令:**

```powershell
npm.cmd test
npm.cmd run lint
npm.cmd run build
npm.cmd run dev
```

预期：测试、lint、build 均退出码 0；开发服务在 `http://127.0.0.1:3001` 可访问。

**浏览器验收步骤:**

- [ ] 1440×1024 打开 `/ai-models`，截取完整长页；确认 Header 不遮挡 Hero，轨道与 `/ai-tools` 构图明显不同。
- [ ] 切换表格视图，检查 `document.documentElement.scrollWidth === document.documentElement.clientWidth`；横向滚动只发生在表格容器。
- [ ] 展开更多筛选，执行有结果搜索和无结果搜索，逐项恢复。
- [ ] 选择 4 个模型，验证第 5 个被阻止；打开对比弹层，检查所有字段来自记录且无总分。
- [ ] 展开不同 FAQ，确认始终只有一个答案展开。
- [ ] 390×844 打开 `/ai-models`，截取完整长页；检查筛选抽屉、对比栏、44px 点击区和页面无横向滚动。
- [ ] 1440×1024 打开 `/ai-models/gpt-4o`、`/ai-models/claude-sonnet`、`/ai-models/gemini-pro`；检查详情目录、未知值、基准空态和官方入口状态。
- [ ] 读取浏览器控制台，确认无 React hydration、key、资源 404 或交互错误。

**验收标准:**

- 1440px、390px 和详情模板视觉完整，页面级无横向滚动。
- 所有关键交互状态实际可操作，不只有静态外观。
- 无编造数字、模板变量、绝对排名、假图表或假进度条。
- 三张验收截图仅作为本地证据，不加入生产页面引用。

**回退点:**

- 本任务仅回退响应式/动效调整和验收截图，不回退功能代码。
- 对样式使用文件级 diff 反向补丁；不执行全仓库格式化、`git reset` 或覆盖式 checkout。

---

## 最终验证与交付检查

- [ ] `npm.cmd test`：所有既有和新增 Node 测试通过。
- [ ] `npm.cmd run lint`：项目已配置 lint，必须实际运行并记录真实结果。
- [ ] `npm.cmd run build`：Next.js 生产构建成功。
- [ ] 浏览器完成 1440px、390px、三示范详情、卡片、表格、筛选、无结果、FAQ 和页内对比验收。
- [ ] `git status --short`：列出所有改动；确认无 commit、push、部署和 lockfile 变化。
- [ ] `git diff --check`：无空白错误。
- [ ] `git diff -- package.json package-lock.json Dockerfile docker-compose.yml next.config.mjs`：预期无输出。
- [ ] 确认磁盘上不存在 `src/app/ai-models/compare`。

## 任务顺序摘要

1. Phase 1A：模型数据与未知值规则。
2. Phase 1A：派生统计、搜索、筛选、排序和对比纯逻辑。
3. Phase 1A：Header、总览、SEO、JSON-LD、sitemap 和页面骨架。
4. Phase 1A：3 个完整示范详情与 19 个安全通用详情模板。
5. Phase 1B：10 厂商与 6 任务入口。
6. Phase 1B：默认卡片视图和专业表格视图。
7. Phase 1B：更多筛选、搜索状态与移动底部抽屉。
8. Phase 1B：最多 4 个模型的页内对比栏与弹层。
9. Phase 1B：六步指南、模型/工具区别、FAQ、方法论和 CTA。
10. Phase 1B：响应式、无障碍、测试、构建和完整浏览器视觉验收。

## 预计新增路由

- `/ai-models`
- `/ai-models/gpt-4o`
- `/ai-models/gpt-4-1`
- `/ai-models/o3`
- `/ai-models/o4-mini`
- `/ai-models/claude-sonnet`
- `/ai-models/claude-opus`
- `/ai-models/claude-haiku`
- `/ai-models/gemini-pro`
- `/ai-models/gemini-flash`
- `/ai-models/deepseek-r1`
- `/ai-models/deepseek-v3`
- `/ai-models/qwen-max`
- `/ai-models/qwen-coder`
- `/ai-models/qwen-vl`
- `/ai-models/llama-8b`
- `/ai-models/llama-70b`
- `/ai-models/llama-405b`
- `/ai-models/grok`
- `/ai-models/mistral-large`
- `/ai-models/mixtral`
- `/ai-models/kimi`
- `/ai-models/glm`

明确不新增 `/ai-models/compare`。

## 主要风险与控制

- **真实性风险：** 22 条记录只有名称和归属可确认；参数字段统一未知，来源为空时禁用官方入口，避免为了视觉填数字。
- **信息密度风险：** 卡片只留摘要字段，完整结构进详情；表格使用局部滚动，不压缩到不可读。
- **导航回归风险：** Header 当前把 AI模型库错误指向 `/ai-tools`；用现有测试加新断言修正，并保留 AI工具分组行为。
- **比较按钮失效风险：** 对比 state、上限和对比行全部由纯函数测试；2–4 个模型打开页内弹层。
- **移动遮挡风险：** 筛选抽屉和对比栏分别管理层级与安全底部间距，390px 实机尺寸验收。
- **构建风险：** 详情参数与静态生成可能暴露 slug/metadata 错误；Phase 1A 结束即运行 build，不拖到最终。
- **范围膨胀风险：** 不新增依赖、不补充第 23 个模型、不创建 compare 路由、不改 AI 工具业务数据。
