"use client";

import { ChevronDown, Pencil, Sparkles, Trash2 } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import type { CrmProjectType, CrmDeliveryStatus, CrmFunnelStage } from "@/generated/prisma/client";
import {
  createCrmProjectType,
  createCrmTrackedProject,
  deleteCrmProjectType,
  deleteCrmTrackedProject,
  loadCrmSampleData,
  updateCrmProjectType,
  updateCrmSettings,
  updateCrmTrackedProject,
  upsertCrmFunnelMonth,
} from "@/lib/actions/crm";
import {
  CRM_DELIVERY_STATUSES,
  CRM_FUNNEL_STAGE_LABELS_FA,
  CRM_FUNNEL_STAGES,
  CRM_STATUS_LABELS_FA,
} from "@/lib/crm/types";

/** Plain JSON-safe project shape for Client Components (no Prisma Decimal/Date). */
export type CrmTrackedProjectInput = {
  id: string;
  nameEn: string;
  nameFa: string;
  clientNameEn: string;
  clientNameFa: string;
  typeId: string;
  progress: number;
  status: CrmDeliveryStatus;
  deliveryDate: string | null;
  completedAt: string | null;
  revenue: number | null;
  isNewCustomer: boolean;
  showOnPublic: boolean;
  coverImageUrl: string | null;
  quoteEn: string | null;
  quoteFa: string | null;
};

export type CrmFunnelEntryInput = {
  id: string;
  month: string;
  stage: CrmFunnelStage;
  count: number;
};

const STATUS_HINT: Record<CrmDeliveryStatus, string> = {
  ON_TRACK: "همه‌چیز خوب پیش می‌رود",
  AT_RISK: "ممکن است از موعد عقب بیفتد",
  DELAYED: "از موعد گذشته",
  DELIVERED: "با موفقیت تمام شده (در نرخ موفقیت حساب می‌شود)",
  FAILED: "لغو / تحویل نشد (نرخ موفقیت را پایین می‌آورد)",
};

const FUNNEL_HINT: Record<string, string> = {
  FIRST_CONTACT: "کسانی که تماس گرفتند",
  QUALIFIED: "ارزش پیگیری واقعی",
  PROPOSAL: "پیشنهاد / قیمت ارسال شده",
  IN_PROGRESS: "کار فعال و پرداخت‌شده",
  DELIVERED: "در آن ماه تمام شده",
};

const QUICK_TYPES = [
  { nameEn: "Embedded systems", nameFa: "سیستم‌های نهفته" },
  { nameEn: "Robotics", nameFa: "رباتیک" },
  { nameEn: "Firmware", nameFa: "فریمور" },
  { nameEn: "Hardware", nameFa: "سخت‌افزار" },
] as const;

function toDateInput(value: Date | string | null | undefined): string {
  if (!value) return "";
  const d = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

function toMonthInput(value: Date | string): string {
  const d = typeof value === "string" ? new Date(value) : value;
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}

function FieldHint({ children }: { children: React.ReactNode }) {
  return <p className="text-xs text-fg-muted">{children}</p>;
}

function CheckboxRow({
  name,
  label,
  hint,
  defaultChecked,
}: {
  name: string;
  label: string;
  hint?: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex cursor-pointer gap-2 text-sm">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="mt-0.5 size-4 shrink-0 rounded border-border accent-[var(--accent)]"
      />
      <span>
        <span className="font-medium">{label}</span>
        {hint ? <span className="mt-0.5 block text-xs text-fg-muted">{hint}</span> : null}
      </span>
    </label>
  );
}

function SimpleProjectFields({
  defaults,
  types,
  idPrefix,
}: {
  defaults?: CrmTrackedProjectInput;
  types: CrmProjectType[];
  idPrefix: string;
}) {
  const [showMore, setShowMore] = useState(false);

  return (
    <div className="space-y-4">
      <div className="rounded-[var(--radius-sm)] border border-border bg-surface-raised/40 px-3 py-2 text-xs text-fg-muted">
        فقط <strong className="text-fg">نام، مشتری، دسته و وضعیت</strong> لازم است. فیلد انگلیسی
        اختیاری است — اگر خالی بماند از فارسی کپی می‌شود.
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor={`${idPrefix}-nameFa`}>نام پروژه</Label>
          <Input
            id={`${idPrefix}-nameFa`}
            name="nameFa"
            required
            dir="rtl"
            placeholder="مثلاً بازو گیرنده نسخه ۲"
            defaultValue={defaults?.nameFa}
          />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor={`${idPrefix}-clientFa`}>مشتری</Label>
          <Input
            id={`${idPrefix}-clientFa`}
            name="clientNameFa"
            required
            dir="rtl"
            placeholder="مثلاً شرکت رباتیک میدانی"
            defaultValue={defaults?.clientNameFa}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={`${idPrefix}-type`}>دسته</Label>
          <select
            id={`${idPrefix}-type`}
            name="typeId"
            required
            defaultValue={defaults?.typeId ?? types[0]?.id}
            className="flex h-9 w-full cursor-pointer rounded-[var(--radius-sm)] border border-border bg-bg px-3 text-sm"
          >
            {types.map((t) => (
              <option key={t.id} value={t.id}>
                {t.nameFa}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={`${idPrefix}-status`}>وضعیت</Label>
          <select
            id={`${idPrefix}-status`}
            name="status"
            defaultValue={defaults?.status ?? "ON_TRACK"}
            className="flex h-9 w-full cursor-pointer rounded-[var(--radius-sm)] border border-border bg-bg px-3 text-sm"
          >
            {CRM_DELIVERY_STATUSES.map((s) => (
              <option key={s} value={s}>
                {CRM_STATUS_LABELS_FA[s]}
              </option>
            ))}
          </select>
          <FieldHint>تحویل‌شده = موفقیت. ناموفق = تحویل نشد. پیشرفت خودکار تنظیم می‌شود.</FieldHint>
        </div>
      </div>

      <details
        className="rounded-[var(--radius-sm)] border border-border"
        open={showMore}
        onToggle={(e) => setShowMore((e.target as HTMLDetailsElement).open)}
      >
        <summary className="flex cursor-pointer list-none items-center gap-2 px-3 py-2 text-sm text-fg-muted hover:text-fg">
          <ChevronDown className="size-4" />
          اختیاری — پول، تاریخ، نقل‌قول عمومی
        </summary>
        <div className="grid gap-3 border-t border-border p-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor={`${idPrefix}-revenue`}>درآمد (دلار)</Label>
            <Input
              id={`${idPrefix}-revenue`}
              name="revenue"
              type="number"
              min={0}
              step="0.01"
              placeholder="فقط ادمین — در گزارش عمومی نیست"
              defaultValue={defaults?.revenue ?? ""}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor={`${idPrefix}-progress`}>پیشرفت ٪</Label>
            <Input
              id={`${idPrefix}-progress`}
              name="progress"
              type="number"
              min={0}
              max={100}
              placeholder="خالی = خودکار"
              defaultValue={defaults?.progress}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor={`${idPrefix}-delivery`}>موعد تحویل</Label>
            <Input
              id={`${idPrefix}-delivery`}
              name="deliveryDate"
              type="date"
              defaultValue={toDateInput(defaults?.deliveryDate)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor={`${idPrefix}-completed`}>تاریخ اتمام</Label>
            <Input
              id={`${idPrefix}-completed`}
              name="completedAt"
              type="date"
              defaultValue={toDateInput(defaults?.completedAt)}
            />
            <FieldHint>برای تحویل‌شده / ناموفق. خالی = امروز.</FieldHint>
          </div>
          <div className="sm:col-span-2">
            <ImageUploadField
              name="coverImageUrl"
              label="عکس (کارت نمونهٔ عمومی)"
              category="projects"
              defaultValue={defaults?.coverImageUrl ?? ""}
            />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor={`${idPrefix}-quoteFa`}>نقل‌قول کوتاه مشتری</Label>
            <Textarea
              id={`${idPrefix}-quoteFa`}
              name="quoteFa"
              rows={2}
              dir="rtl"
              placeholder="اگر تیک زیر را بزنید در گزارش عمومی دیده می‌شود"
              defaultValue={defaults?.quoteFa ?? ""}
            />
          </div>
          <input type="hidden" name="quoteEn" defaultValue={defaults?.quoteEn ?? ""} />
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor={`${idPrefix}-nameEn`}>نام انگلیسی (اختیاری)</Label>
            <Input
              id={`${idPrefix}-nameEn`}
              name="nameEn"
              placeholder="Leave empty to copy Persian"
              defaultValue={defaults?.nameEn}
            />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor={`${idPrefix}-clientEn`}>مشتری انگلیسی (اختیاری)</Label>
            <Input
              id={`${idPrefix}-clientEn`}
              name="clientNameEn"
              placeholder="Leave empty to copy Persian"
              defaultValue={defaults?.clientNameEn}
            />
          </div>
          <CheckboxRow
            name="isNewCustomer"
            label="مشتری جدید"
            hint="در KPI مشتریان جدید حساب می‌شود"
            defaultChecked={defaults?.isNewCustomer ?? true}
          />
          <CheckboxRow
            name="showOnPublic"
            label="نمایش در گزارش عمومی"
            hint="وضعیت باید «تحویل‌شده» باشد و گزارش عمومی روشن باشد"
            defaultChecked={defaults?.showOnPublic}
          />
        </div>
      </details>
    </div>
  );
}

export function CrmDataManager({
  types,
  projects,
  funnelEntries,
  settings,
}: {
  types: CrmProjectType[];
  projects: CrmTrackedProjectInput[];
  funnelEntries: CrmFunnelEntryInput[];
  settings: { publicReportEnabled: boolean; customerSatisfaction: number | null };
}) {
  const [pending, startTransition] = useTransition();
  const [editType, setEditType] = useState<CrmProjectType | null>(null);
  const [editProject, setEditProject] = useState<CrmTrackedProjectInput | null>(null);
  const [createTypeOpen, setCreateTypeOpen] = useState(false);
  const [createProjectOpen, setCreateProjectOpen] = useState(false);

  const isEmpty = types.length === 0 && projects.length === 0;

  function run(action: () => Promise<{ ok: boolean; error?: string }>, success: string) {
    startTransition(async () => {
      const result = await action();
      if (!result.ok) toast.error(result.error ?? "خطا.");
      else {
        toast.success(success);
        setEditType(null);
        setEditProject(null);
        setCreateTypeOpen(false);
        setCreateProjectOpen(false);
      }
    });
  }

  function loadSamples(force: boolean) {
    startTransition(async () => {
      const result = await loadCrmSampleData(force);
      if (!result.ok) toast.error(result.error ?? "خطا.");
      else toast.success("دادهٔ نمونه بارگذاری شد — داشبورد را ببینید.");
    });
  }

  const funnelByMonth = new Map<string, Partial<Record<string, number>>>();
  for (const e of funnelEntries) {
    const key = toMonthInput(e.month);
    const row = funnelByMonth.get(key) ?? {};
    row[e.stage] = e.count;
    funnelByMonth.set(key, row);
  }
  const funnelMonths = [...funnelByMonth.entries()].sort((a, b) => b[0].localeCompare(a[0]));

  const missingQuick = QUICK_TYPES.filter(
    (q) => !types.some((t) => t.nameEn.toLowerCase() === q.nameEn.toLowerCase()),
  );

  return (
    <div className="space-y-6" dir="rtl" lang="fa">
      <div className="rounded-[var(--radius-md)] border border-accent/25 bg-accent/5 p-4 sm:p-5">
        <h2 className="font-display text-sm font-semibold text-fg">چطور پر کنم؟</h2>
        <ol className="mt-3 space-y-2 text-sm text-fg-muted">
          <li>
            <span className="font-mono text-accent">۱.</span> چند{" "}
            <strong className="text-fg">دسته</strong> بسازید (یا روی پیشنهادها کلیک کنید).
          </li>
          <li>
            <span className="font-mono text-accent">۲.</span> هر{" "}
            <strong className="text-fg">پروژه</strong> واقعی را اضافه کنید و وضعیتش را بزنید.
          </li>
          <li>
            <span className="font-mono text-accent">۳.</span> اختیاری:{" "}
            <strong className="text-fg">قیف فروش</strong> ماهانه را پر کنید.
          </li>
          <li>
            <span className="font-mono text-accent">۴.</span> وقتی آمادهٔ اشتراک‌گذاری بودید،{" "}
            <strong className="text-fg">گزارش عمومی</strong> را روشن کنید (
            <code className="text-accent">/report</code>).
          </li>
        </ol>
        <div className="mt-4 flex flex-wrap gap-2">
          {isEmpty ? (
            <Button type="button" disabled={pending} onClick={() => loadSamples(false)}>
              <Sparkles className="size-4" />
              بارگذاری دادهٔ نمونه
            </Button>
          ) : (
            <Button
              type="button"
              variant="outline"
              disabled={pending}
              onClick={() => {
                if (
                  window.confirm(
                    "همهٔ پروژه‌ها، دسته‌ها و اعداد قیف با دادهٔ نمونه جایگزین شوند؟",
                  )
                ) {
                  loadSamples(true);
                }
              }}
            >
              <Sparkles className="size-4" />
              جایگزینی با دادهٔ نمونه
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue={isEmpty ? "types" : "projects"} className="space-y-6">
        <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1">
          <TabsTrigger value="types" className="cursor-pointer">
            ۱. دسته‌ها
          </TabsTrigger>
          <TabsTrigger value="projects" className="cursor-pointer">
            ۲. پروژه‌ها
          </TabsTrigger>
          <TabsTrigger value="funnel" className="cursor-pointer">
            ۳. قیف فروش
          </TabsTrigger>
          <TabsTrigger value="visibility" className="cursor-pointer">
            ۴. گزارش عمومی
          </TabsTrigger>
        </TabsList>

        <TabsContent value="types" className="space-y-4">
          <p className="text-sm text-fg-muted">
            دسته‌ها نمودار «موفقیت بر اساس نوع» را می‌سازند. برای افزودن فوری کلیک کنید.
          </p>
          {missingQuick.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {missingQuick.map((q) => (
                <Button
                  key={q.nameEn}
                  type="button"
                  size="sm"
                  variant="secondary"
                  disabled={pending}
                  className="cursor-pointer"
                  onClick={() => {
                    const fd = new FormData();
                    fd.set("nameEn", q.nameEn);
                    fd.set("nameFa", q.nameFa);
                    run(() => createCrmProjectType(fd), `«${q.nameFa}» اضافه شد.`);
                  }}
                >
                  + {q.nameFa}
                </Button>
              ))}
            </div>
          ) : null}

          <div className="flex justify-start">
            <Button type="button" variant="outline" onClick={() => setCreateTypeOpen(true)}>
              دستهٔ سفارشی
            </Button>
          </div>

          <ul className="divide-y divide-border rounded-[var(--radius-md)] border border-border">
            {types.length === 0 ? (
              <li className="p-6 text-center text-sm text-fg-muted">
                هنوز دسته‌ای نیست — روی پیشنهاد بالا کلیک کنید یا دادهٔ نمونه بگذارید.
              </li>
            ) : (
              types.map((t) => (
                <li key={t.id} className="flex items-center justify-between gap-3 px-4 py-3">
                  <div>
                    <p className="text-sm font-medium">{t.nameFa}</p>
                    <p className="text-xs text-fg-muted">{t.nameEn}</p>
                  </div>
                  <div className="flex gap-1">
                    <Button type="button" size="icon" variant="ghost" onClick={() => setEditType(t)}>
                      <Pencil className="size-4" />
                    </Button>
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={() => run(() => deleteCrmProjectType(t.id), "دسته حذف شد.")}
                    >
                      <Trash2 className="size-4 text-error" />
                    </Button>
                  </div>
                </li>
              ))
            )}
          </ul>
        </TabsContent>

        <TabsContent value="projects" className="space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-fg-muted">هر ردیف KPI و نمودارها را پر می‌کند. معنی وضعیت‌ها:</p>
            <Button
              type="button"
              onClick={() => setCreateProjectOpen(true)}
              disabled={pending || types.length === 0}
            >
              افزودن پروژه
            </Button>
          </div>
          {types.length === 0 ? (
            <p className="text-sm text-warning">اول یک دسته بسازید (تب ۱).</p>
          ) : (
            <ul className="space-y-1 text-xs text-fg-muted sm:columns-2">
              {CRM_DELIVERY_STATUSES.map((s) => (
                <li key={s}>
                  <span className="font-medium text-fg">{CRM_STATUS_LABELS_FA[s]}:</span>{" "}
                  {STATUS_HINT[s]}
                </li>
              ))}
            </ul>
          )}

          <ul className="divide-y divide-border rounded-[var(--radius-md)] border border-border">
            {projects.length === 0 ? (
              <li className="p-6 text-center text-sm text-fg-muted">
                هنوز پروژه‌ای نیست — یکی اضافه کنید یا دادهٔ نمونه بارگذاری کنید.
              </li>
            ) : (
              projects.map((p) => (
                <li key={p.id} className="flex items-center justify-between gap-3 px-4 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{p.nameFa}</p>
                    <p className="text-xs text-fg-muted">
                      {p.clientNameFa} · {CRM_STATUS_LABELS_FA[p.status]}
                      {p.showOnPublic ? " · نمونهٔ عمومی" : ""}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={() => setEditProject(p)}
                    >
                      <Pencil className="size-4" />
                    </Button>
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={() => run(() => deleteCrmTrackedProject(p.id), "پروژه حذف شد.")}
                    >
                      <Trash2 className="size-4 text-error" />
                    </Button>
                  </div>
                </li>
              ))
            )}
          </ul>
        </TabsContent>

        <TabsContent value="funnel" className="space-y-4">
          <p className="text-sm text-fg-muted">
            تعداد تقریبی ماهانه از اولین تماس تا تحویل. اگر فقط KPI پروژه مهم است، این بخش را رد
            کنید.
          </p>
          <form
            className="space-y-4 rounded-[var(--radius-md)] border border-border bg-surface p-5"
            action={(fd) => run(() => upsertCrmFunnelMonth(fd), "ماه قیف ذخیره شد.")}
          >
            <div className="max-w-xs space-y-1.5">
              <Label htmlFor="funnel-month">ماه</Label>
              <Input
                id="funnel-month"
                name="month"
                type="month"
                required
                defaultValue={toMonthInput(new Date())}
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {CRM_FUNNEL_STAGES.map((stage) => (
                <div key={stage} className="space-y-1.5">
                  <Label htmlFor={`funnel-${stage}`}>{CRM_FUNNEL_STAGE_LABELS_FA[stage]}</Label>
                  <Input
                    id={`funnel-${stage}`}
                    name={stage}
                    type="number"
                    min={0}
                    defaultValue={0}
                    placeholder="۰"
                  />
                  <FieldHint>{FUNNEL_HINT[stage]}</FieldHint>
                </div>
              ))}
            </div>
            <Button type="submit" disabled={pending}>
              ذخیره این ماه
            </Button>
          </form>

          {funnelMonths.length > 0 ? (
            <ul className="space-y-2 text-sm">
              {funnelMonths.map(([month, counts]) => (
                <li
                  key={month}
                  className="rounded-[var(--radius-sm)] border border-border px-3 py-2 font-mono text-xs text-fg-muted"
                >
                  <span className="text-fg">{month}</span>
                  {" · "}
                  {CRM_FUNNEL_STAGES.map(
                    (s) => `${CRM_FUNNEL_STAGE_LABELS_FA[s]} ${counts[s] ?? 0}`,
                  ).join(" ← ")}
                </li>
              ))}
            </ul>
          ) : null}
        </TabsContent>

        <TabsContent value="visibility" className="space-y-4">
          <form
            className="space-y-4 rounded-[var(--radius-md)] border border-border bg-surface p-5"
            action={(fd) => run(() => updateCrmSettings(fd), "تنظیمات گزارش عمومی ذخیره شد.")}
          >
            <CheckboxRow
              name="publicReportEnabled"
              label="انتشار گزارش عمومی در /report"
              hint="خاموش = بازدیدکننده فقط جای‌خالی می‌بیند. پول، تأخیر و شکست هرگز آنجا نشان داده نمی‌شود."
              defaultChecked={settings.publicReportEnabled}
            />
            <div className="max-w-xs space-y-1.5">
              <Label htmlFor="customerSatisfaction">رضایت مشتری ٪</Label>
              <Input
                id="customerSatisfaction"
                name="customerSatisfaction"
                type="number"
                min={0}
                max={100}
                step="1"
                defaultValue={settings.customerSatisfaction ?? ""}
                placeholder="مثلاً ۹۶"
              />
              <FieldHint>عدد اختیاری که خودتان برای هیرو عمومی می‌گذارید.</FieldHint>
            </div>
            <Button type="submit" disabled={pending}>
              ذخیره
            </Button>
          </form>
        </TabsContent>
      </Tabs>

      <Dialog open={createTypeOpen} onOpenChange={setCreateTypeOpen}>
        <DialogContent dir="rtl" lang="fa">
          <DialogHeader>
            <DialogTitle>دستهٔ سفارشی</DialogTitle>
            <DialogDescription>
              نام انگلیسی اختیاری است — اگر خالی باشد از فارسی کپی می‌شود.
            </DialogDescription>
          </DialogHeader>
          <form
            action={(fd) => run(() => createCrmProjectType(fd), "دسته ساخته شد.")}
            className="space-y-4"
          >
            <div className="space-y-1.5">
              <Label htmlFor="new-type-nameFa">نام</Label>
              <Input
                id="new-type-nameFa"
                name="nameFa"
                required
                dir="rtl"
                placeholder="مثلاً مشاوره"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="new-type-nameEn">English (اختیاری)</Label>
              <Input id="new-type-nameEn" name="nameEn" placeholder="optional" />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={pending}>
                افزودن
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editType} onOpenChange={(o) => !o && setEditType(null)}>
        <DialogContent dir="rtl" lang="fa">
          <DialogHeader>
            <DialogTitle>ویرایش دسته</DialogTitle>
          </DialogHeader>
          {editType ? (
            <form
              action={(fd) =>
                run(() => updateCrmProjectType(editType.id, fd), "دسته به‌روز شد.")
              }
              className="space-y-4"
            >
              <div className="space-y-1.5">
                <Label htmlFor="edit-type-nameFa">نام</Label>
                <Input
                  id="edit-type-nameFa"
                  name="nameFa"
                  required
                  dir="rtl"
                  defaultValue={editType.nameFa}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="edit-type-nameEn">English</Label>
                <Input
                  id="edit-type-nameEn"
                  name="nameEn"
                  defaultValue={editType.nameEn}
                />
              </div>
              <DialogFooter>
                <Button type="submit" disabled={pending}>
                  ذخیره
                </Button>
              </DialogFooter>
            </form>
          ) : null}
        </DialogContent>
      </Dialog>

      <Dialog open={createProjectOpen} onOpenChange={setCreateProjectOpen}>
        <DialogContent className="max-w-lg" dir="rtl" lang="fa">
          <DialogHeader>
            <DialogTitle>افزودن پروژه</DialogTitle>
            <DialogDescription>چهار فیلد برای شروع روی داشبورد کافی است.</DialogDescription>
          </DialogHeader>
          <form
            action={(fd) => run(() => createCrmTrackedProject(fd), "پروژه اضافه شد.")}
            className="space-y-4"
          >
            <SimpleProjectFields types={types} idPrefix="new-proj" />
            <DialogFooter>
              <Button type="submit" disabled={pending}>
                افزودن پروژه
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editProject} onOpenChange={(o) => !o && setEditProject(null)}>
        <DialogContent className="max-w-lg" dir="rtl" lang="fa">
          <DialogHeader>
            <DialogTitle>ویرایش پروژه</DialogTitle>
          </DialogHeader>
          {editProject ? (
            <form
              action={(fd) =>
                run(() => updateCrmTrackedProject(editProject.id, fd), "پروژه به‌روز شد.")
              }
              className="space-y-4"
            >
              <SimpleProjectFields defaults={editProject} types={types} idPrefix="edit-proj" />
              <DialogFooter>
                <Button type="submit" disabled={pending}>
                  ذخیره
                </Button>
              </DialogFooter>
            </form>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
