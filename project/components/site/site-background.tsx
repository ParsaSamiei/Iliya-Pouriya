/** Fixed ambient background — soft depth and grain, no measurement grid. */
export function SiteBackground() {
  return (
    <div className="site-bg-root" aria-hidden>
      <div className="site-bg-layer site-bg-layer--depth" />
      <div className="site-bg-layer site-bg-layer--grain" />
      <div className="site-bg-layer site-bg-layer--vignette" />
    </div>
  );
}
