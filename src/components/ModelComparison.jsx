'use client';

import { useState } from 'react';
import ModelLogo from './ModelLogo';
import { buildComparisonRows } from '../lib/model-explorer.mjs';
import styles from '../app/ai-models/ai-models.module.css';

export default function ModelComparison({ selectedModels, onRemove, onClear, onAddModel }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const rows = buildComparisonRows(selectedModels);

  if (!selectedModels.length) return null;

  return (
    <>
      <aside className={`${styles.comparisonBar} ${isCollapsed ? styles.comparisonBarCollapsed : ''}`} aria-label="模型对比选择">
        <div className={styles.comparisonBarInner}>
          <div className={styles.comparisonHeading}>
            <strong>已选模型</strong>
            <span>{selectedModels.length}/4</span>
          </div>
          <p className={styles.comparisonMobileCount}>已选 {selectedModels.length} 个模型</p>
          {!isCollapsed ? (
            <div className={styles.comparisonChips}>
              {selectedModels.map((model) => (
                <span key={model.slug}>
                  <ModelLogo model={model} frameSize={24} imageSize={16} className={styles.comparisonLogo} decorative />
                  {model.name}
                  <button type="button" aria-label={`移除 ${model.name}`} onClick={() => onRemove(model.slug)}>×</button>
                </span>
              ))}
              {selectedModels.length < 4 ? <button type="button" onClick={onAddModel}>增加模型</button> : null}
            </div>
          ) : null}
          <div className={styles.comparisonActions}>
            <button type="button" className={styles.collapseComparison} onClick={() => setIsCollapsed((collapsed) => !collapsed)}>{isCollapsed ? '展开' : '折叠'}</button>
            <button type="button" onClick={onClear}>清空</button>
            <button type="button" disabled={selectedModels.length < 2} onClick={() => setIsPanelOpen(true)}>开始对比</button>
          </div>
        </div>
      </aside>

      {isPanelOpen ? (
        <div className={styles.comparisonPanelBackdrop} onMouseDown={(event) => event.target === event.currentTarget && setIsPanelOpen(false)}>
          <section className={styles.comparisonPanel} role="dialog" aria-modal="true" aria-labelledby="comparison-panel-title">
            <header>
              <div><p>PARAMETER COMPARISON</p><h2 id="comparison-panel-title">参数对比</h2></div>
              <button type="button" aria-label="关闭对比面板" onClick={() => setIsPanelOpen(false)}>关闭</button>
            </header>
            <p className={styles.comparisonNotice}>仅对比当前模型记录中已有字段；未确认信息保留原始中性标记。</p>
            <div className={styles.comparisonTableScroller} tabIndex="0">
              <table>
                <thead><tr><th>参数</th>{selectedModels.map((model) => <th key={model.slug}><span className={styles.comparisonModelHeading}><ModelLogo model={model} frameSize={28} imageSize={18} className={styles.comparisonPanelLogo} decorative />{model.name}</span></th>)}</tr></thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.label}><th>{row.label}</th>{row.values.map((value, index) => <td key={`${row.label}-${selectedModels[index].slug}`}>{value}</td>)}</tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}
