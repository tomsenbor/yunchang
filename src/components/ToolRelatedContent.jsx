import Link from 'next/link';

function RelationGroup({ title, items, hrefFor }) {
  if (items.length === 0) return null;

  return (
    <section className="rounded-xl border border-line bg-white p-4">
      <h3 className="text-base font-bold text-ink">{title}</h3>
      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li key={item.slug}>
            <Link className="text-sm font-semibold leading-6 text-muted hover:text-brand" href={hrefFor(item)}>
              {item.title || item.name}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function ToolRelatedContent({ tool, relations }) {
  const hasRelations = relations.guides.length > 0
    || relations.videos.length > 0
    || relations.comparisons.length > 0;

  if (!hasRelations) return null;

  return (
    <section className="doc-section" aria-labelledby="tool-related-content-title">
      <h2 id="tool-related-content-title">围绕 {tool.name} 继续学习</h2>
      <p>按教程、视频和工具对比继续了解使用方法与选型差异，推荐内容来自站内已建立的确定性关系。</p>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <RelationGroup title="相关教程" items={relations.guides} hrefFor={(item) => `/guides/${item.slug}`} />
        <RelationGroup title="相关视频" items={relations.videos} hrefFor={(item) => `/videos/${item.slug}`} />
        <RelationGroup title="工具对比" items={relations.comparisons} hrefFor={(item) => `/compare/${item.slug}`} />
      </div>
    </section>
  );
}
