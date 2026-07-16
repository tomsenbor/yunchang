export function FlowBlock({ title = '推荐工作流', steps = [] }) {
  const visibleSteps = Array.isArray(steps) ? steps.filter(Boolean).slice(0, 6) : [];
  if (!visibleSteps.length) return null;

  return (
    <div className="detail-flow-block" aria-label={title}>
      <p>{title}</p>
      <div className="detail-flow-track">
        {visibleSteps.map((step, index) => (
          <span key={`${step}-${index}`} className="detail-flow-node">
            <i aria-hidden="true">{index + 1}</i>
            {step}
          </span>
        ))}
      </div>
    </div>
  );
}

export function ComparisonBars({ items = [] }) {
  const visibleItems = Array.isArray(items) ? items.filter(Boolean).slice(0, 7) : [];
  if (!visibleItems.length) return null;

  return (
    <div className="comparison-bars" aria-label="能力条形对比">
      {visibleItems.map((item) => {
        const leftScore = Math.max(0, Math.min(100, Number(item.left) || 0));
        const rightScore = Math.max(0, Math.min(100, Number(item.right) || 0));

        return (
          <div key={item.label} className="comparison-bar-row">
            <p>{item.label}</p>
            <div className="comparison-bar-pair">
              <span>{item.leftLabel}</span>
              <span className="comparison-bar-track" aria-hidden="true">
                <i style={{ '--comparison-score': `${leftScore}%` }} />
              </span>
              <b>{leftScore}</b>
            </div>
            <div className="comparison-bar-pair">
              <span>{item.rightLabel}</span>
              <span className="comparison-bar-track" aria-hidden="true">
                <i style={{ '--comparison-score': `${rightScore}%` }} />
              </span>
              <b>{rightScore}</b>
            </div>
          </div>
        );
      })}
    </div>
  );
}
