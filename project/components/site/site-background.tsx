/** Fixed decorative background layers — blueprint grid, PCB traces, ambient depth. */
export function SiteBackground() {
  return (
    <div className="site-bg-root" aria-hidden>
      <div className="site-bg-layer site-bg-layer--depth" />
      <div className="site-bg-layer site-bg-layer--grid" />
      <div className="site-bg-layer site-bg-layer--trace" />
      <div className="site-bg-layer site-bg-layer--scanline" />
      <div className="site-bg-layer site-bg-layer--vignette" />
      <div className="site-bg-layer site-bg-layer--fiducials" />
    </div>
  );
}
