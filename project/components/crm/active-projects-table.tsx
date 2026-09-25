import { CrmEmptyState } from "@/components/crm/empty-state";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { AdminCrmAnalytics, CrmDeliveryStatus } from "@/lib/crm/types";
import { CRM_STATUS_LABELS, CRM_STATUS_LABELS_FA } from "@/lib/crm/types";
import { cn } from "@/lib/utils";

const STATUS_CLASS: Record<CrmDeliveryStatus, string> = {
  ON_TRACK: "border-transparent bg-success/20 text-success",
  AT_RISK: "border-transparent bg-warning/20 text-warning",
  DELAYED: "border-transparent bg-error/20 text-error",
  DELIVERED: "border-transparent bg-accent/20 text-accent",
  FAILED: "border-transparent bg-error/30 text-error",
};

function ProgressBar({ value }: { value: number }) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className="flex min-w-28 items-center gap-2">
      <div className="h-1.5 flex-1 overflow-hidden rounded-[var(--radius-sm)] bg-surface-raised">
        <div
          className="h-full rounded-[var(--radius-sm)] bg-accent transition-[width] duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="w-8 font-mono text-xs tabular-nums text-fg-muted">{pct}%</span>
    </div>
  );
}

export function ActiveProjectsTable({
  projects,
  emptyTitle,
  locale = "fa",
}: {
  projects: AdminCrmAnalytics["activeProjects"];
  emptyTitle: string;
  locale?: "en" | "fa";
}) {
  if (projects.length === 0) return <CrmEmptyState title={emptyTitle} />;

  const isFa = locale === "fa";
  const statusLabels = isFa ? CRM_STATUS_LABELS_FA : CRM_STATUS_LABELS;

  return (
    <div className="overflow-x-auto rounded-[var(--radius-md)] border border-border" dir={isFa ? "rtl" : "ltr"}>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>{isFa ? "پروژه" : "Project"}</TableHead>
            <TableHead>{isFa ? "مشتری" : "Client"}</TableHead>
            <TableHead>{isFa ? "نوع" : "Type"}</TableHead>
            <TableHead>{isFa ? "پیشرفت" : "Progress"}</TableHead>
            <TableHead>{isFa ? "وضعیت" : "Status"}</TableHead>
            <TableHead>{isFa ? "تحویل" : "Delivery"}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((p) => (
            <TableRow key={p.id} className="hover:bg-surface-raised/60">
              <TableCell className="font-medium">{isFa ? p.nameFa : p.nameEn}</TableCell>
              <TableCell className="text-fg-muted">{isFa ? p.clientNameFa : p.clientNameEn}</TableCell>
              <TableCell className="text-fg-muted">{isFa ? p.typeNameFa : p.typeNameEn}</TableCell>
              <TableCell>
                <ProgressBar value={p.progress} />
              </TableCell>
              <TableCell>
                <Badge className={cn(STATUS_CLASS[p.status])}>{statusLabels[p.status]}</Badge>
              </TableCell>
              <TableCell className="font-mono text-xs text-fg-muted">
                {p.deliveryDate
                  ? new Date(p.deliveryDate).toLocaleDateString(isFa ? "fa-IR" : "en", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                  : "—"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
