import Link from 'next/link';

export function RelatedGuides({ guides = [] }) {
  if (guides.length === 0) return null;

  return (
    <section aria-labelledby="related-guides-title">
      <h3 id="related-guides-title">推荐教程</h3>
      <div className="guide-next-links">
        {guides.map((guide) => (
          <Link key={guide.slug} href={`/guides/${guide.slug}`}>
            <span>{guide.title}</span>
            <small>{guide.outcome}</small>
          </Link>
        ))}
      </div>
    </section>
  );
}
