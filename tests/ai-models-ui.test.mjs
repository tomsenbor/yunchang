import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

import { aiModels, modelFaqs, modelTasks, modelVendors } from '../src/lib/model-content.mjs';
import { getTaskSummaries, getVendorSummaries } from '../src/lib/model-explorer.mjs';

const componentUrl = new URL('../src/components/ModelExplorer.jsx', import.meta.url);
const stylesUrl = new URL('../src/app/ai-models/ai-models.module.css', import.meta.url);
const databaseUrl = new URL('../src/components/ModelDatabase.jsx', import.meta.url);
const comparisonUrl = new URL('../src/components/ModelComparison.jsx', import.meta.url);

test('vendor cards are exactly ten data-derived entries in a desktop five-column grid', async () => {
  const component = await readFile(componentUrl, 'utf8');
  const styles = await readFile(stylesUrl, 'utf8');
  const summaries = getVendorSummaries(aiModels, modelVendors);

  assert.equal(summaries.length, 10);
  assert.equal(summaries.reduce((sum, vendor) => sum + vendor.modelCount, 0), aiModels.length);
  assert.ok(summaries.filter((vendor) => vendor.modelCount > 0).every((vendor) => vendor.representativeModels.length >= 1));
  assert.equal(summaries.find((vendor) => vendor.id === 'moonshot-ai').modelCount, 1);
  assert.match(component, /getVendorSummaries/);
  assert.match(component, /vendorSummaries\.map\(\(vendor\) => \(/);
  assert.match(component, /<article[^>]*className=\{styles\.vendorCard\}/);
  assert.match(component, /查看全部厂商/);
  assert.doesNotMatch(component, /更多厂商/);
  assert.match(styles, /\.vendorGrid[^}]*grid-template-columns:\s*repeat\(5,\s*minmax\(0,\s*1fr\)\)/s);
});

test('task cards are six data-derived filters that update the database result set', async () => {
  const component = await readFile(componentUrl, 'utf8');
  const styles = await readFile(stylesUrl, 'utf8');
  const summaries = getTaskSummaries(aiModels, modelTasks);

  assert.equal(summaries.length, 6);
  assert.ok(summaries.every((task) => task.modelCount > 0));
  assert.match(component, /getTaskSummaries/);
  assert.match(component, /taskSummaries\.map\(\(task/);
  assert.match(component, /onClick=\{\(\) => applyTaskFilter\(task\.id\)\}/);
  assert.match(component, /setTaskId/);
  assert.match(component, /filterModels/);
  assert.match(component, /scrollIntoView/);
  assert.match(styles, /\.taskGrid[^}]*grid-template-columns:\s*repeat\(3,\s*minmax\(0,\s*1fr\)\)/s);
});

test('task recommendations retain neutral methodology language', async () => {
  const component = await readFile(componentUrl, 'utf8');

  assert.match(component, /仅作为选型参考/);
  assert.doesNotMatch(component, /绝对最强|第一名|绝对性能排名/);
});

test('hero final convergence keeps responsive title, dynamic task stats and complete mobile chips', async () => {
  const component = await readFile(componentUrl, 'utf8');
  const styles = await readFile(stylesUrl, 'utf8');

  assert.match(component, /<h1 id="ai-models-title">\s*<span>找到适合你的<\/span>\s*<span className=\{styles\.heroTitleLine\}> AI 模型<\/span>\s*<\/h1>/s);
  assert.match(styles, /\.heroTitleLine[^}]*display:\s*inline/s);
  assert.match(styles, /@media \(max-width: 639px\)[\s\S]*\.heroTitleLine[^}]*display:\s*block/s);
  assert.match(styles, /@media \(max-width: 639px\)[\s\S]*\.heroInner h1[^}]*font-size:\s*clamp\(40px,[^,]+,\s*42px\)[^}]*line-height:\s*1\.05/s);

  assert.match(component, /<dt>\{taskSummaries\.length\}<\/dt><dd>任务维度<\/dd>/);
  assert.doesNotMatch(component, /<dt>\{stats\.pendingCount\}<\/dt><dd>待核查条目<\/dd>/);
  assert.match(component, /模型信息持续核查更新/);

  assert.match(component, /className=\{styles\.quickTasks\}[^>]*tabIndex=\{0\}[^>]*onKeyDown=\{scrollQuickTasks\}/s);
  assert.match(component, /function scrollQuickTasks[\s\S]*scrollBy/s);
  assert.match(styles, /\.quickTasksViewport::after[^}]*width:\s*32px[^}]*linear-gradient[^;]*0\.98\) 32%/s);
  assert.match(styles, /@media \(max-width: 639px\)[\s\S]*\.quickTasks[^}]*overflow-x:\s*auto[^}]*padding:[^;]*44px[^;]*[^}]*touch-action:\s*pan-x/s);
  assert.match(styles, /@media \(max-width: 639px\)[\s\S]*\.quickTasks[^}]*gap:\s*10px[\s\S]*\.quickTasks span[^}]*padding:\s*9px 12px/s);
  assert.match(styles, /\.quickTasks span[^}]*white-space:\s*nowrap/s);

  assert.match(styles, /\.hero::after[^}]*bottom:\s*-66px[^}]*height:\s*112px/s);
  assert.match(styles, /\.lightCanvas[^}]*padding:\s*30px 24px 120px/s);
  assert.match(styles, /@media \(max-width: 639px\)[\s\S]*\.hero[^}]*padding:\s*124px 18px 92px[\s\S]*\.lightCanvas[^}]*padding:\s*30px 18px 88px/s);

  assert.match(styles, /\.heroSearch input::placeholder[^}]*rgba\(255, 255, 255, 0\.53\)/s);
  assert.match(styles, /\.popularSearches[^}]*rgba\(255, 255, 255, 0\.6\)/s);
  assert.match(styles, /\.quickTasks span[^}]*rgba\(255, 255, 255, 0\.78\)/s);
  assert.match(styles, /\.heroStats dd[^}]*rgba\(255, 255, 255, 0\.6\)/s);
  assert.match(styles, /\.dynamicNote[^}]*rgba\(255, 255, 255, 0\.5\)/s);
});

test('model database defaults to cards and exposes a real card/table view switch', async () => {
  assert.equal(existsSync(fileURLToPath(databaseUrl)), true, 'ModelDatabase.jsx should exist');
  const database = await readFile(databaseUrl, 'utf8');

  assert.match(database, /useState\('cards'\)/);
  assert.match(database, /aria-pressed=\{viewMode === 'cards'\}/);
  assert.match(database, /aria-pressed=\{viewMode === 'table'\}/);
  assert.match(database, />卡片视图</);
  assert.match(database, />表格视图</);
});

test('model cards expose the required summary fields and working actions', async () => {
  const database = await readFile(databaseUrl, 'utf8');
  const labels = ['模型类型', '上下文', '最大输出', '输入模态', '输出模态', 'API', '开放权重', '价格', '最后核查'];

  for (const label of labels) assert.match(database, new RegExp(label));
  assert.match(database, /href=\{`\/ai-models\/\$\{model\.slug\}`\}/);
  assert.match(database, /onToggleComparison\(model\.slug\)/);
  assert.match(database, /model\.verification\.status/);
  assert.doesNotMatch(database, /overallScore|benchmarkScore|综合总分/i);
  assert.match(database, /参数规模/);
  assert.match(database, /网页产品/);
});

test('model table has the locked columns and scrolls only inside its container', async () => {
  const database = await readFile(databaseUrl, 'utf8');
  const styles = await readFile(stylesUrl, 'utf8');
  const headers = ['模型', '厂商', '家族', '生命周期', '模型类型', '上下文', '最大输出', '输入模态', 'API', '开放状态', '标准输入', '标准输出', '发布时间', '核查日期', '操作'];

  assert.match(database, /<table/);
  for (const header of headers) assert.match(database, new RegExp(`<th[^>]*>${header}<`));
  assert.match(styles, /\.modelTableScroller[^}]*overflow-x:\s*auto/s);
  assert.match(styles, /\.modelTable[^}]*min-width:\s*1180px/s);
  assert.match(styles, /\.modelGrid[^}]*grid-template-columns:\s*repeat\(3,\s*minmax\(0,\s*1fr\)\)/s);
  assert.match(styles, /\.explorerPage[^}]*overflow-x:\s*(?:clip|hidden)/s);
});

test('database exposes core filters, expandable filters, sorting and removable conditions', async () => {
  const database = await readFile(databaseUrl, 'utf8');
  const component = await readFile(componentUrl, 'utf8');
  const coreLabels = ['搜索', '厂商', '模型家族', '模型类型', '支持模态', 'API', '开放状态'];
  const moreLabels = ['上下文区间', '价格状态', '发布时间', '核查状态'];

  for (const label of [...coreLabels, ...moreLabels]) assert.match(database, new RegExp(label));
  assert.match(database, /更多筛选/);
  assert.match(database, /lifecycleStatus:\s*'lifecycle'/);
  assert.match(database, /已选条件/);
  assert.match(database, /清除全部/);
  assert.match(database, /推荐/);
  assert.match(database, /最新发布/);
  assert.match(database, /最近核查/);
  assert.match(component, /sortModels/);
  assert.match(component, /filterModels/);
});

test('mobile filters use a closable bottom drawer with a live result action', async () => {
  const database = await readFile(databaseUrl, 'utf8');
  const styles = await readFile(stylesUrl, 'utf8');

  assert.match(database, /role="dialog"/);
  assert.match(database, /aria-modal="true"/);
  assert.match(database, /关闭筛选/);
  assert.match(database, /查看 \{models\.length\} 个模型/);
  assert.match(styles, /\.filterDrawer[^}]*position:\s*fixed/s);
  assert.match(styles, /\.filterDrawerAction[^}]*position:\s*sticky/s);
  assert.match(styles, /\.mobileDatabaseControls/);
});

test('empty state offers all four recovery paths without fake values', async () => {
  const database = await readFile(databaseUrl, 'utf8');

  assert.match(database, /未找到符合条件的模型/);
  for (const action of ['清除搜索词', '减少筛选条件', '查看全部模型', '浏览模型厂商']) {
    assert.match(database, new RegExp(action));
  }
  assert.doesNotMatch(database, /暂无数据.*0|参数为 0/);
});

test('comparison bar is fixed, collapsible and supports remove, clear and in-page comparison', async () => {
  assert.equal(existsSync(fileURLToPath(comparisonUrl)), true, 'ModelComparison.jsx should exist');
  const comparison = await readFile(comparisonUrl, 'utf8');
  const styles = await readFile(stylesUrl, 'utf8');

  assert.match(comparison, /buildComparisonRows/);
  assert.match(comparison, /已选模型/);
  assert.match(comparison, /增加模型/);
  assert.match(comparison, /清空/);
  assert.match(comparison, /开始对比/);
  assert.match(comparison, /selectedModels\.length < 2/);
  assert.match(comparison, /onRemove\(model\.slug\)/);
  assert.match(comparison, /onClear/);
  assert.match(styles, /\.comparisonBar[^}]*position:\s*fixed/s);
  assert.match(styles, /\.explorerShellCompared[^}]*padding-bottom/s);
});

test('comparison opens an accessible panel using only existing model fields', async () => {
  const comparison = await readFile(comparisonUrl, 'utf8');

  assert.match(comparison, /role="dialog"/);
  assert.match(comparison, /aria-modal="true"/);
  assert.match(comparison, /参数对比/);
  assert.match(comparison, /rows\.map/);
  assert.match(comparison, /关闭对比面板/);
  assert.doesNotMatch(comparison, /overallScore|benchmarkScore|综合总分|排名|progress-bar/i);
});

test('comparison remains on the overview route and exposes a compact mobile summary', async () => {
  const component = await readFile(componentUrl, 'utf8');
  const comparison = await readFile(comparisonUrl, 'utf8');

  assert.match(component, /<ModelComparison/);
  assert.match(comparison, /已选 \{selectedModels\.length\} 个模型/);
  assert.doesNotMatch(`${component}\n${comparison}`, /\/ai-models\/compare/);
});

test('FAQ renders exactly eight items with one controlled initial expansion', async () => {
  const component = await readFile(componentUrl, 'utf8');

  assert.equal(modelFaqs.length, 8);
  assert.match(component, /useState\(0\)/);
  assert.match(component, /faqs\.map\(\(faq, index\)/);
  assert.match(component, /aria-expanded=\{openFaqIndex === index\}/);
  assert.match(component, /aria-controls=\{`model-faq-answer-\$\{index\}`\}/);
  assert.match(component, /setOpenFaqIndex\(index\)/);
});

test('methodology statistics are data-derived and both CTA actions respond', async () => {
  const component = await readFile(componentUrl, 'utf8');

  assert.match(component, /stats\.modelCount/);
  assert.match(component, /dataStats\.updatedAt/);
  assert.match(component, /dataStats\.verifiedModelCount/);
  assert.match(component, /dataStats\.staleFieldCount/);
  assert.match(component, /dataStats\.pendingReviewFieldCount/);
  assert.match(component, /浏览全部模型/);
  assert.match(component, /开始模型对比/);
  assert.match(component, /onClick=\{scrollToDatabase\}/);
  assert.doesNotMatch(component, /\{\{[^}]+\}\}/);
});

test('responsive CSS locks desktop, tablet, mobile and reduced-motion behavior', async () => {
  const styles = await readFile(stylesUrl, 'utf8');

  assert.match(styles, /@media \(max-width: 639px\)/);
  assert.match(styles, /@media \(min-width: 640px\) and \(max-width: 1023px\)/);
  assert.match(styles, /@media \(min-width: 1024px\)/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(styles, /\.vendorGrid[^}]*repeat\(5,/s);
  assert.match(styles, /\.modelGrid[^}]*repeat\(3,/s);
  assert.match(styles, /@media \(max-width: 639px\)[\s\S]*\.vendorGrid[^}]*repeat\(2,/s);
  assert.match(styles, /@media \(max-width: 639px\)[\s\S]*\.modelGrid[^}]*grid-template-columns:\s*1fr/s);
  assert.match(styles, /\.quickTasks[^}]*scrollbar-width:\s*none/s);
  assert.match(styles, /\.quickTasks::-webkit-scrollbar[^}]*display:\s*none/s);
});

test('interactive model controls expose visible focus and mobile-size targets', async () => {
  const styles = await readFile(stylesUrl, 'utf8');

  assert.match(styles, /:focus-visible/);
  assert.match(styles, /min-height:\s*44px/);
  assert.match(styles, /\.modelTableScroller[^}]*overflow-x:\s*auto/s);
  assert.match(styles, /\.explorerPage[^}]*overflow-x:\s*(?:clip|hidden)/s);
});
