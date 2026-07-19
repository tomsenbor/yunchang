import Link from 'next/link';

function RelatedGroup({ title, items, buildHref }) {
  if (!items?.length) return null;

  return (
    <section>
      <h3>{title}</h3>
      <div className="guide-next-links">
        {items.map((item) => (
          <Link key={item.slug} href={buildHref(item)}>
            <span>{item.name || item.title}</span>
            <small>{item.summary || item.excerpt || item.outcome || '查看相关内容'}</small>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function GuideRelatedContent({
  category,
  relatedGuides = [],
  relatedTools = [],
  relatedVideos = [],
  relatedComparisons = []
}) {
  return (
    <section className="guide-section" aria-labelledby="guide-related-content-title">
      <p className="guide-section-kicker">Explore</p>
      <h2 id="guide-related-content-title">相关内容</h2>

      <div className="next-learning-list">
        {category ? (
          <section>
            <h3>所属分类</h3>
            <div className="guide-next-links">
              <Link href={`/guides/category/${category.slug}`}>
                <span>{category.name}</span>
                <small>{category.description}</small>
              </Link>
            </div>
          </section>
        ) : null}

        <RelatedGroup title="相关文章" items={relatedGuides} buildHref={(item) => `/guides/${item.slug}`} />
        <RelatedGroup title="相关工具" items={relatedTools} buildHref={(item) => `/ai-tools/${item.slug}`} />
        <RelatedGroup title="相关视频" items={relatedVideos} buildHref={(item) => `/videos/${item.slug}`} />
        <RelatedGroup title="工具对比" items={relatedComparisons} buildHref={(item) => `/compare/${item.slug}`} />
      </div>
    </section>
  );
}
