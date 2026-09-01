import { getTranslations } from "next-intl/server";
import type { HeroLabPanelView } from "@/lib/hero-lab-panel";

type HeroInstrumentPanelProps = {
  projectCount: number;
  engineerCount: number;
  labPanel: HeroLabPanelView;
};

const LED_CLASS = {
  accent: "led",
  signal: "led led--signal",
} as const;

export async function HeroInstrumentPanel({
  projectCount,
  engineerCount,
  labPanel,
}: HeroInstrumentPanelProps) {
  const t = await getTranslations("home");

  return (
    <aside
      className="panel-module panel-module--hero relative w-full max-w-md shrink-0 lg:w-80 xl:w-96"
      aria-label={t("heroStatus")}
    >
      <div className="panel-module__bezel" aria-hidden />

      <div className="relative border-b border-border px-4 py-3">
        <div className="flex items-center justify-between gap-3 font-mono text-[11px] tracking-wide">
          <span className="text-fg-muted">{t("heroStatus")}</span>
          <span className="flex items-center gap-2 text-success">
            <span className="led led--pulse" aria-hidden />
            {t("heroStatusOnline")}
          </span>
        </div>
      </div>

      <div className="relative px-4 py-4">
        <p className="font-mono text-[10px] tracking-wide text-fg-muted uppercase">
          {labPanel.panelTitle}
        </p>

        <ul className="mt-3 space-y-0 border border-border bg-bg/80">
          {labPanel.rows.map((row, index) => (
            <li
              key={`${row.label}-${index}`}
              className="flex items-start gap-3 border-b border-border px-3 py-2.5 last:border-b-0"
            >
              <span className={`${LED_CLASS[row.led]} mt-1 shrink-0`} aria-hidden />
              <div className="min-w-0 flex-1">
                <p className="font-mono text-xs text-fg">{row.label}</p>
                <p className="mt-0.5 font-mono text-[10px] leading-relaxed text-fg-muted">
                  {row.detail}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="grid grid-cols-2 gap-px border-t border-border bg-border font-mono text-[11px]">
        <div className="bg-surface px-4 py-3">
          <p className="text-[10px] tracking-wide text-fg-muted uppercase">{t("statProjects")}</p>
          <p className="mt-1 font-display text-2xl font-semibold tabular-nums text-accent">
            {String(projectCount).padStart(2, "0")}
          </p>
        </div>
        <div className="bg-surface px-4 py-3">
          <p className="text-[10px] tracking-wide text-fg-muted uppercase">{t("statEngineers")}</p>
          <p className="mt-1 font-display text-2xl font-semibold tabular-nums text-signal">
            {String(engineerCount).padStart(2, "0")}
          </p>
        </div>
      </div>
    </aside>
  );
}
