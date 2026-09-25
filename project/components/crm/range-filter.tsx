"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CRM_RANGES, type CrmRangeMonths, parseCrmRange } from "@/lib/crm/types";
import { cn } from "@/lib/utils";

export function CrmRangeFilter({
  range,
  className,
  labels,
}: {
  range: CrmRangeMonths;
  className?: string;
  labels?: { months: string };
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();
  const monthsLabel = labels?.months ?? "mo";

  function setRange(next: string) {
    const value = parseCrmRange(next);
    const params = new URLSearchParams(searchParams.toString());
    params.set("range", String(value));
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  }

  return (
    <Tabs
      value={String(range)}
      onValueChange={setRange}
      className={cn(pending && "opacity-70", className)}
    >
      <TabsList aria-label={monthsLabel === "ماه" ? "بازه زمانی" : "Time range"}>
        {CRM_RANGES.map((m) => (
          <TabsTrigger key={m} value={String(m)} className="cursor-pointer min-w-14">
            {m} {monthsLabel}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
