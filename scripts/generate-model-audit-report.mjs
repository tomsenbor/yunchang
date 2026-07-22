import { mkdir, writeFile } from 'node:fs/promises';
import { basename, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { archivedAiModels, currentAiModels, getModelDataStats, modelSources } from '../src/lib/model-data.mjs';
import { checkModelFreshness } from './check-model-freshness.mjs';

export const DEFAULT_REPORT_PATH = 'docs/research/generated-ai-models-data-audit-2026-07-22.md';

export function buildAuditReport() {
  const stats = getModelDataStats(currentAiModels, modelSources);
  const freshness = checkModelFreshness(currentAiModels, { asOf: '2026-07-22' });
  const lines = [
    '# AI 模型数据审计报告', '',
    `生成日期：${stats.updatedAt}`, '',
    '## 汇总', '',
    `- 当前模型：${stats.currentModelCount}`,
    `- 排除与归档记录：${archivedAiModels.length}`,
    `- 已核实字段：${stats.verifiedFieldCount}`,
    `- 官方未公开字段：${stats.officialUnpublishedFieldCount}`,
    `- 待复核字段：${stats.pendingReviewFieldCount}`,
    `- 价格完整模型：${stats.priceCompleteModelCount}`,
    `- 官方来源：${stats.sourceCount}`,
    `- 过期数据：${freshness.summary.staleModels}`,
    `- 结构错误：${freshness.errors.length}`, '',
    '## 厂商与当前模型', ''
  ];
  for (const vendor of [...new Set(currentAiModels.map((model) => model.vendorSlug))]) {
    lines.push(`- ${vendor}: ${currentAiModels.filter((model) => model.vendorSlug === vendor).map((model) => model.name).join('、')}`);
  }
  lines.push('', '## 待复核项', '');
  if (freshness.warnings.length) lines.push(...freshness.warnings.map((item) => `- ${item}`));
  else lines.push('- 无超过建议核查日期的数据。');
  for (const model of archivedAiModels.filter((model) => model.exclusionReason?.includes('needs-review'))) {
    lines.push(`- ${model.name}（${model.slug}）：${model.exclusionReason}`);
  }
  lines.push('', '> 本报告由版本化模型数据生成，不会自动修改人工确认的数据。', '');
  return lines.join('\n');
}

export async function writeAuditReport(outputPath = DEFAULT_REPORT_PATH) {
  const target = resolve(outputPath);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, buildAuditReport(), 'utf8');
  return target;
}

async function main() {
  const target = await writeAuditReport(process.argv[2] || DEFAULT_REPORT_PATH);
  console.log(`模型数据审计报告已生成：${target}`);
}

if (process.argv[1] && basename(process.argv[1]) === basename(fileURLToPath(import.meta.url))) await main();
