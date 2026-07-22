import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const detailPageUrl = new URL('../src/app/ai-models/[slug]/page.js', import.meta.url);
const databaseUrl = new URL('../src/components/ModelDatabase.jsx', import.meta.url);
const overviewUrl = new URL('../src/components/ModelExplorer.jsx', import.meta.url);
const pageUrl = new URL('../src/app/ai-models/page.js', import.meta.url);
const overviewStylesUrl = new URL('../src/app/ai-models/ai-models.module.css', import.meta.url);
const detailStylesUrl = new URL('../src/app/ai-models/[slug]/page.module.css', import.meta.url);

test('model cards and table render official facts, lifecycle and source actions', async () => {
  const database = await readFile(databaseUrl, 'utf8');
  const styles = await readFile(overviewStylesUrl, 'utf8');
  for (const text of ['生命周期', '上下文', '最大输出', '输入模态', '输出模态', '推理模式', '标准输入价格', '标准输出价格', '最后核查', '查看官方来源']) {
    assert.match(database, new RegExp(text));
  }
  assert.match(database, /formatModelFact/);
  assert.match(database, /formatStandardPrice/);
  assert.match(database, /styles\.officialSourceAction/);
  assert.match(styles, /\.officialSourceAction/);
  assert.doesNotMatch(database, /model\.maxOutput\b|model\.apiAvailability\b|model\.weightAvailability\b/);
});

test('overview publishes update transparency and passes only current records to exploration', async () => {
  const overview = await readFile(overviewUrl, 'utf8');
  const page = await readFile(pageUrl, 'utf8');
  for (const text of ['数据更新时间', '最近核查模型', '过期数据', '待复核字段']) assert.match(overview, new RegExp(text));
  assert.match(page, /catalogModels=\{aiModels\}/);
  assert.match(overview, /lifecycleStatus: 'current'/);
});

test('detail page renders all required official fields with field-level source links', async () => {
  const detail = await readFile(detailPageUrl, 'utf8');
  const styles = await readFile(detailStylesUrl, 'utf8');
  for (const text of [
    '官方模型 ID', 'Aliases', '当前生命周期', '发布时间', '知识截止日期', '上下文窗口', '最大输出',
    '输入模态', '输出模态', '推理模式', 'Reasoning effort', '工具调用', 'Structured Output',
    'Web Search', 'File Search', 'Computer Use', 'Code Execution', 'Prompt Caching', 'Batch API',
    '微调支持', '开放权重与许可证', '参数规模', '本地部署要求', '标准价格', '缓存价格',
    'Batch 价格', '长上下文价格', '地区差异', '官方推荐场景', '已知限制', '版本关系',
    '弃用和替代信息', '最后核查记录'
  ]) assert.match(detail, new RegExp(text));
  assert.match(detail, /function FactValue/);
  assert.match(detail, /fact\.sourceId/);
  assert.match(detail, /source\.url/);
  assert.match(detail, /数据状态/);
  assert.match(detail, /核查日期/);
  assert.match(styles, /\.factValue/);
  assert.match(styles, /\.benchmarkTable[^}]*overflow-x:\s*auto/s);
});

test('detail benchmark disclosure never implies a unified ranking', async () => {
  const detail = await readFile(detailPageUrl, 'utf8');
  assert.match(detail, /以下成绩来自厂商公开测试，测试条件可能不同，不宜直接视为统一排行榜/);
  assert.match(detail, /当前暂无可核查的统一数据/);
  assert.doesNotMatch(detail, /overallScore|综合总分|progress-bar|aria-valuenow/i);
});
