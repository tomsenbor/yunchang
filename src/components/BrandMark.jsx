export function BrandMark({
  className = 'brand-mark brand-mark-ai site-logo-mark',
  ariaHidden = false
}) {
  const accessibilityProps = ariaHidden
    ? { 'aria-hidden': 'true', focusable: 'false' }
    : { role: 'img', 'aria-label': 'AI', focusable: 'false' };

  return (
    <svg className={className} viewBox="0 0 84 48" {...accessibilityProps}>
      <path d="M7 42 22.3 7h9.5L16.5 42H7Z" />
      <path d="M34 7 50.6 42H39.4L27.7 20.2 33.3 7H34Z" />
      <path d="M60 7h10v35H60V7Z" />
    </svg>
  );
}
