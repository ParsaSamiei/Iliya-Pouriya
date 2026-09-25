"use client";

import { Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  createCrmCustomerNote,
  deleteCrmCustomer,
  deleteCrmCustomerNote,
  updateCrmCustomer,
} from "@/lib/actions/crm-customers";
import type { CrmCustomerDetail as CrmCustomerRecord, CrmCustomerNoteInput } from "@/lib/crm/customers";
import {
  CRM_CUSTOMER_STATUS_LABELS_FA,
  CRM_CUSTOMER_STATUSES,
  CRM_INTERACTION_TYPE_LABELS_FA,
  CRM_INTERACTION_TYPES,
  type CrmCustomerStatus,
  type CrmNoteKind,
} from "@/lib/crm/types";

const STATUS_BADGE: Record<CrmCustomerStatus, "default" | "secondary" | "outline"> = {
  ACTIVE: "default",
  LEAD: "outline",
  PAST: "secondary",
  INACTIVE: "secondary",
};

function formatWhen(iso: string | null) {
  const d = new Date(iso ?? "");
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("fa-IR", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function NoteList({
  notes,
  pending,
  onDelete,
}: {
  notes: CrmCustomerNoteInput[];
  pending: boolean;
  onDelete: (id: string) => void;
}) {
  if (notes.length === 0) {
    return <p className="py-6 text-center text-sm text-fg-muted">هنوز چیزی ثبت نشده.</p>;
  }

  return (
    <ul className="space-y-3">
      {notes.map((n) => (
        <li
          key={n.id}
          className="rounded-[var(--radius-md)] border border-border bg-surface px-4 py-3"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              {n.kind === "INTERACTION" && n.interactionType ? (
                <Badge variant="outline">{CRM_INTERACTION_TYPE_LABELS_FA[n.interactionType]}</Badge>
              ) : null}
              {n.title ? <p className="mt-1 text-sm font-medium text-fg">{n.title}</p> : null}
              <p className="mt-1 whitespace-pre-wrap text-sm text-fg">{n.body}</p>
              <p className="mt-2 text-xs text-fg-muted">
                {formatWhen(n.occurredAt ?? n.createdAt)}
                {n.authorEmail ? ` · ${n.authorEmail}` : ""}
              </p>
            </div>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              disabled={pending}
              onClick={() => onDelete(n.id)}
            >
              <Trash2 className="size-4 text-error" />
              <span className="sr-only">حذف</span>
            </Button>
          </div>
        </li>
      ))}
    </ul>
  );
}

export function CrmCustomerDetail({ customer }: { customer: CrmCustomerRecord }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [editOpen, setEditOpen] = useState(false);
  const [formKey, setFormKey] = useState(0);

  function run(action: () => Promise<{ ok: boolean; error?: string }>, success: string) {
    startTransition(async () => {
      const result = await action();
      if (!result.ok) toast.error(result.error ?? "خطا.");
      else {
        toast.success(success);
        setEditOpen(false);
        setFormKey((k) => k + 1);
      }
    });
  }

  const interactions = customer.notes.filter((n) => n.kind === "INTERACTION");
  const work = customer.notes.filter((n) => n.kind === "WORK");
  const internal = customer.notes.filter((n) => n.kind === "INTERNAL");

  return (
    <div className="space-y-6" dir="rtl" lang="fa">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm">
            <Link href="/admin/crm" className="text-fg-muted hover:text-accent">
              بازگشت به داده CRM
            </Link>
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <h1 className="font-display text-2xl font-semibold">{customer.name}</h1>
            <Badge variant={STATUS_BADGE[customer.status]}>
              {CRM_CUSTOMER_STATUS_LABELS_FA[customer.status]}
            </Badge>
          </div>
          <dl className="mt-3 grid gap-1 text-sm text-fg-muted sm:grid-cols-2">
            <div>
              <dt className="inline text-fg-muted">شرکت: </dt>
              <dd className="inline text-fg">{customer.company ?? "—"}</dd>
            </div>
            <div>
              <dt className="inline text-fg-muted">شماره: </dt>
              <dd className="inline text-fg" dir="ltr">
                {customer.phone ?? "—"}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="inline text-fg-muted">ایمیل: </dt>
              <dd className="inline text-fg" dir="ltr">
                {customer.email ?? "—"}
              </dd>
            </div>
          </dl>
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={() => setEditOpen(true)}>
            <Pencil className="size-4" />
            ویرایش اطلاعات
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              if (window.confirm(`«${customer.name}» و همه یادداشت‌هایش حذف شوند؟`)) {
                startTransition(async () => {
                  const result = await deleteCrmCustomer(customer.id);
                  if (!result.ok) toast.error(result.error ?? "خطا.");
                  else {
                    toast.success("مشتری حذف شد.");
                    router.push("/admin/crm");
                  }
                });
              }
            }}
          >
            <Trash2 className="size-4 text-error" />
            حذف
          </Button>
        </div>
      </div>

      <Tabs defaultValue="interactions" className="space-y-4">
        <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1">
          <TabsTrigger value="interactions" className="cursor-pointer">
            تاریخچه تعاملات ({interactions.length})
          </TabsTrigger>
          <TabsTrigger value="work" className="cursor-pointer">
            ثبت کار ({work.length})
          </TabsTrigger>
          <TabsTrigger value="internal" className="cursor-pointer">
            یادداشت داخلی ({internal.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="interactions" className="space-y-4">
          <form
            key={`int-${formKey}`}
            className="space-y-3 rounded-[var(--radius-md)] border border-border bg-surface p-4"
            action={(fd) => {
              fd.set("kind", "INTERACTION");
              run(() => createCrmCustomerNote(customer.id, fd), "تعامل ثبت شد.");
            }}
          >
            <input type="hidden" name="kind" value="INTERACTION" />
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="int-type">نوع</Label>
                <select
                  id="int-type"
                  name="interactionType"
                  required
                  className="flex h-9 w-full cursor-pointer rounded-[var(--radius-sm)] border border-border bg-bg px-3 text-sm"
                  defaultValue="CALL"
                >
                  {CRM_INTERACTION_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {CRM_INTERACTION_TYPE_LABELS_FA[t]}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="int-when">زمان</Label>
                <Input id="int-when" name="occurredAt" type="datetime-local" />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="int-body">خلاصه</Label>
                <Textarea
                  id="int-body"
                  name="body"
                  required
                  rows={3}
                  dir="rtl"
                  placeholder="چه گفته شد، نتیجه چه بود…"
                />
              </div>
            </div>
            <Button type="submit" disabled={pending}>
              ثبت تعامل
            </Button>
          </form>
          <NoteList
            notes={interactions}
            pending={pending}
            onDelete={(id) =>
              run(() => deleteCrmCustomerNote(customer.id, id), "تعامل حذف شد.")
            }
          />
        </TabsContent>

        <TabsContent value="work" className="space-y-4">
          <form
            key={`work-${formKey}`}
            className="space-y-3 rounded-[var(--radius-md)] border border-border bg-surface p-4"
            action={(fd) => {
              fd.set("kind", "WORK" satisfies CrmNoteKind);
              run(() => createCrmCustomerNote(customer.id, fd), "کار ثبت شد.");
            }}
          >
            <input type="hidden" name="kind" value="WORK" />
            <div className="space-y-1.5">
              <Label htmlFor="work-title">عنوان کار</Label>
              <Input
                id="work-title"
                name="title"
                required
                dir="rtl"
                placeholder="مثلاً ارسال پیش‌نویس فریمور"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="work-body">یادداشت</Label>
              <Textarea
                id="work-body"
                name="body"
                required
                rows={3}
                dir="rtl"
                placeholder="جزئیات کار برای این مشتری"
              />
            </div>
            <Button type="submit" disabled={pending}>
              ثبت کار
            </Button>
          </form>
          <NoteList
            notes={work}
            pending={pending}
            onDelete={(id) => run(() => deleteCrmCustomerNote(customer.id, id), "کار حذف شد.")}
          />
        </TabsContent>

        <TabsContent value="internal" className="space-y-4">
          <form
            key={`internal-${formKey}`}
            className="space-y-3 rounded-[var(--radius-md)] border border-border bg-surface p-4"
            action={(fd) => {
              fd.set("kind", "INTERNAL");
              run(() => createCrmCustomerNote(customer.id, fd), "یادداشت داخلی ثبت شد.");
            }}
          >
            <input type="hidden" name="kind" value="INTERNAL" />
            <div className="space-y-1.5">
              <Label htmlFor="intn-body">یادداشت تیم (فقط ادمین)</Label>
              <Textarea
                id="intn-body"
                name="body"
                required
                rows={4}
                dir="rtl"
                placeholder="نکته داخلی — مشتری این را نمی‌بیند"
              />
            </div>
            <Button type="submit" disabled={pending}>
              ذخیره یادداشت
            </Button>
          </form>
          <NoteList
            notes={internal}
            pending={pending}
            onDelete={(id) =>
              run(() => deleteCrmCustomerNote(customer.id, id), "یادداشت حذف شد.")
            }
          />
        </TabsContent>
      </Tabs>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent dir="rtl" lang="fa">
          <DialogHeader>
            <DialogTitle>ویرایش اطلاعات مشتری</DialogTitle>
          </DialogHeader>
          <form
            action={(fd) => run(() => updateCrmCustomer(customer.id, fd), "اطلاعات ذخیره شد.")}
            className="space-y-4"
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="d-name">نام</Label>
                <Input id="d-name" name="name" required dir="rtl" defaultValue={customer.name} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="d-phone">شماره</Label>
                <Input
                  id="d-phone"
                  name="phone"
                  dir="ltr"
                  defaultValue={customer.phone ?? ""}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="d-email">ایمیل</Label>
                <Input
                  id="d-email"
                  name="email"
                  type="email"
                  dir="ltr"
                  defaultValue={customer.email ?? ""}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="d-company">شرکت</Label>
                <Input
                  id="d-company"
                  name="company"
                  dir="rtl"
                  defaultValue={customer.company ?? ""}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="d-status">دسته‌بندی</Label>
                <select
                  id="d-status"
                  name="status"
                  defaultValue={customer.status}
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
            <DialogFooter>
              <Button type="submit" disabled={pending}>
                ذخیره
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
