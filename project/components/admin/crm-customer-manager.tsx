"use client";

import { Pencil, Search, Trash2, UserPlus } from "lucide-react";
import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
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
import {
  createCrmCustomer,
  deleteCrmCustomer,
  updateCrmCustomer,
} from "@/lib/actions/crm-customers";
import type { CrmCustomerListItem } from "@/lib/crm/customers";
import {
  CRM_CUSTOMER_STATUS_LABELS_FA,
  CRM_CUSTOMER_STATUSES,
  type CrmCustomerStatus,
} from "@/lib/crm/types";

const STATUS_BADGE: Record<CrmCustomerStatus, "default" | "secondary" | "outline"> = {
  ACTIVE: "default",
  LEAD: "outline",
  PAST: "secondary",
  INACTIVE: "secondary",
};

function CustomerFields({
  defaults,
  idPrefix,
}: {
  defaults?: CrmCustomerListItem;
  idPrefix: string;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="space-y-1.5 sm:col-span-2">
        <Label htmlFor={`${idPrefix}-name`}>نام</Label>
        <Input
          id={`${idPrefix}-name`}
          name="name"
          required
          dir="rtl"
          placeholder="نام شخص"
          defaultValue={defaults?.name}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor={`${idPrefix}-phone`}>شماره (اختیاری)</Label>
        <Input
          id={`${idPrefix}-phone`}
          name="phone"
          type="tel"
          dir="ltr"
          placeholder="۰۹۱۲…"
          defaultValue={defaults?.phone ?? ""}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor={`${idPrefix}-email`}>ایمیل (اختیاری)</Label>
        <Input
          id={`${idPrefix}-email`}
          name="email"
          type="email"
          dir="ltr"
          placeholder="name@example.com"
          defaultValue={defaults?.email ?? ""}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor={`${idPrefix}-company`}>شرکت (اختیاری)</Label>
        <Input
          id={`${idPrefix}-company`}
          name="company"
          dir="rtl"
          placeholder="نام سازمان"
          defaultValue={defaults?.company ?? ""}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor={`${idPrefix}-status`}>دسته‌بندی</Label>
        <select
          id={`${idPrefix}-status`}
          name="status"
          defaultValue={defaults?.status ?? "ACTIVE"}
          className="flex h-9 w-full cursor-pointer rounded-[var(--radius-sm)] border border-border bg-bg px-3 text-sm"
        >
          {CRM_CUSTOMER_STATUSES.map((s) => (
            <option key={s} value={s}>
              {CRM_CUSTOMER_STATUS_LABELS_FA[s]}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export function CrmCustomerManager({ customers }: { customers: CrmCustomerListItem[] }) {
  const [pending, startTransition] = useTransition();
  const [createOpen, setCreateOpen] = useState(false);
  const [edit, setEdit] = useState<CrmCustomerListItem | null>(null);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<CrmCustomerStatus | "ALL">("ALL");

  function run(action: () => Promise<{ ok: boolean; error?: string }>, success: string) {
    startTransition(async () => {
      const result = await action();
      if (!result.ok) toast.error(result.error ?? "خطا.");
      else {
        toast.success(success);
        setCreateOpen(false);
        setEdit(null);
      }
    });
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return customers.filter((c) => {
      if (statusFilter !== "ALL" && c.status !== statusFilter) return false;
      if (!q) return true;
      const hay = [c.name, c.company, c.phone, c.email].filter(Boolean).join(" ").toLowerCase();
      return hay.includes(q);
    });
  }, [customers, query, statusFilter]);

  return (
    <div className="space-y-4">
      <p className="text-sm text-fg-muted">
        اطلاعات تماس، دسته (فعال / قدیمی / …)، تاریخچه تعامل، ثبت کار و یادداشت داخلی تیم.
      </p>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search className="pointer-events-none absolute top-1/2 right-2.5 size-4 -translate-y-1/2 text-fg-muted" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="جستجو نام، شرکت، شماره، ایمیل"
            className="pr-8"
            dir="rtl"
            aria-label="جستجوی مشتری"
          />
        </div>
        <Button type="button" onClick={() => setCreateOpen(true)}>
          <UserPlus className="size-4" />
          مشتری جدید
        </Button>
      </div>

      <div className="flex flex-wrap gap-1.5">
        <Button
          type="button"
          size="sm"
          variant={statusFilter === "ALL" ? "default" : "outline"}
          className="cursor-pointer"
          onClick={() => setStatusFilter("ALL")}
        >
          همه ({customers.length})
        </Button>
        {CRM_CUSTOMER_STATUSES.map((s) => {
          const n = customers.filter((c) => c.status === s).length;
          return (
            <Button
              key={s}
              type="button"
              size="sm"
              variant={statusFilter === s ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setStatusFilter(s)}
            >
              {CRM_CUSTOMER_STATUS_LABELS_FA[s]} ({n})
            </Button>
          );
        })}
      </div>

      <ul className="divide-y divide-border rounded-[var(--radius-md)] border border-border">
        {filtered.length === 0 ? (
          <li className="p-6 text-center text-sm text-fg-muted">
            {customers.length === 0
              ? "هنوز مشتری‌ای ثبت نشده."
              : "با این فیلتر نتیجه‌ای نیست."}
          </li>
        ) : (
          filtered.map((c) => (
            <li key={c.id} className="flex items-center justify-between gap-3 px-4 py-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    href={`/admin/crm/customers/${c.id}`}
                    className="truncate text-sm font-medium text-fg hover:text-accent"
                  >
                    {c.name}
                  </Link>
                  <Badge variant={STATUS_BADGE[c.status]}>
                    {CRM_CUSTOMER_STATUS_LABELS_FA[c.status]}
                  </Badge>
                </div>
                <p className="mt-0.5 truncate text-xs text-fg-muted">
                  {[c.company, c.phone, c.email].filter(Boolean).join(" · ") || "بدون اطلاعات تماس"}
                </p>
                <p className="mt-0.5 text-xs text-fg-muted">
                  {c.interactionCount} تعامل · {c.workCount} کار · {c.internalCount} یادداشت داخلی
                </p>
              </div>
              <div className="flex shrink-0 gap-1">
                <Button type="button" size="icon" variant="ghost" onClick={() => setEdit(c)}>
                  <Pencil className="size-4" />
                  <span className="sr-only">ویرایش</span>
                </Button>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={() => {
                    if (window.confirm(`«${c.name}» و همه یادداشت‌هایش حذف شوند؟`)) {
                      run(() => deleteCrmCustomer(c.id), "مشتری حذف شد.");
                    }
                  }}
                >
                  <Trash2 className="size-4 text-error" />
                  <span className="sr-only">حذف</span>
                </Button>
              </div>
            </li>
          ))
        )}
      </ul>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent dir="rtl" lang="fa">
          <DialogHeader>
            <DialogTitle>مشتری جدید</DialogTitle>
            <DialogDescription>فقط نام لازم است. بقیه فیلدها اختیاری‌اند.</DialogDescription>
          </DialogHeader>
          <form
            action={(fd) => run(() => createCrmCustomer(fd), "مشتری اضافه شد.")}
            className="space-y-4"
          >
            <CustomerFields idPrefix="new-cust" />
            <DialogFooter>
              <Button type="submit" disabled={pending}>
                افزودن
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!edit} onOpenChange={(o) => !o && setEdit(null)}>
        <DialogContent dir="rtl" lang="fa">
          <DialogHeader>
            <DialogTitle>ویرایش مشتری</DialogTitle>
          </DialogHeader>
          {edit ? (
            <form
              action={(fd) => run(() => updateCrmCustomer(edit.id, fd), "مشتری به‌روز شد.")}
              className="space-y-4"
            >
              <CustomerFields defaults={edit} idPrefix="edit-cust" />
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
