"use client";

import { Plus, Trash2 } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateHeroLabPanel } from "@/lib/actions/settings";
import type { HeroLabPanelData, HeroLabPanelRow } from "@/lib/validation/hero-lab-panel";

const EMPTY_ROW: HeroLabPanelRow = {
  labelEn: "",
  labelFa: "",
  detailEn: "",
  detailFa: "",
  led: "accent",
};

export function HeroLabPanelEditor({ initial }: { initial: HeroLabPanelData }) {
  const [data, setData] = useState(initial);
  const [pending, startTransition] = useTransition();

  function updateRow(index: number, patch: Partial<HeroLabPanelRow>) {
    setData((current) => ({
      ...current,
      rows: current.rows.map((row, i) => (i === index ? { ...row, ...patch } : row)),
    }));
  }

  function addRow() {
    if (data.rows.length >= 8) return;
    setData((current) => ({ ...current, rows: [...current.rows, { ...EMPTY_ROW }] }));
  }

  function removeRow(index: number) {
    if (data.rows.length <= 1) return;
    setData((current) => ({
      ...current,
      rows: current.rows.filter((_, i) => i !== index),
    }));
  }

  function onSave() {
    startTransition(async () => {
      try {
        await updateHeroLabPanel(data);
        toast.success("Hero lab panel saved.");
      } catch {
        toast.error("Could not save — check all fields are filled in.");
      }
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Hero lab panel</CardTitle>
        <p className="text-sm text-fg-muted">
          The system stack shown in the homepage hero instrument panel (labels, details, LED
          colors).
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="hero-panel-title-en">Panel title (English)</Label>
            <Input
              id="hero-panel-title-en"
              value={data.panelTitleEn}
              onChange={(e) => setData((c) => ({ ...c, panelTitleEn: e.target.value }))}
            />
          </div>
          <div className="space-y-1.5" dir="rtl">
            <Label htmlFor="hero-panel-title-fa">عنوان پنل (فارسی)</Label>
            <Input
              id="hero-panel-title-fa"
              dir="rtl"
              value={data.panelTitleFa}
              onChange={(e) => setData((c) => ({ ...c, panelTitleFa: e.target.value }))}
            />
          </div>
        </div>

        <div className="space-y-4">
          {data.rows.map((row, index) => (
            <div
              key={index}
              className="space-y-3 rounded-[var(--radius-sm)] border border-border p-4"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="font-mono text-xs text-fg-muted uppercase">Row {index + 1}</p>
                <div className="flex items-center gap-2">
                  <Select
                    value={row.led}
                    onValueChange={(value: "accent" | "signal") =>
                      updateRow(index, { led: value })
                    }
                  >
                    <SelectTrigger className="h-8 w-[7.5rem]" aria-label="LED color">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="accent">Amber LED</SelectItem>
                      <SelectItem value="signal">Cyan LED</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    disabled={data.rows.length <= 1 || pending}
                    onClick={() => removeRow(index)}
                    aria-label={`Remove row ${index + 1}`}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor={`row-${index}-label-en`}>Label (English)</Label>
                  <Input
                    id={`row-${index}-label-en`}
                    value={row.labelEn}
                    onChange={(e) => updateRow(index, { labelEn: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5" dir="rtl">
                  <Label htmlFor={`row-${index}-label-fa`}>برچسب (فارسی)</Label>
                  <Input
                    id={`row-${index}-label-fa`}
                    dir="rtl"
                    value={row.labelFa}
                    onChange={(e) => updateRow(index, { labelFa: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor={`row-${index}-detail-en`}>Detail (English)</Label>
                  <Input
                    id={`row-${index}-detail-en`}
                    value={row.detailEn}
                    onChange={(e) => updateRow(index, { detailEn: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5" dir="rtl">
                  <Label htmlFor={`row-${index}-detail-fa`}>جزئیات (فارسی)</Label>
                  <Input
                    id={`row-${index}-detail-fa`}
                    dir="rtl"
                    value={row.detailFa}
                    onChange={(e) => updateRow(index, { detailFa: e.target.value })}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={data.rows.length >= 8 || pending}
            onClick={addRow}
          >
            <Plus className="size-4" />
            Add row
          </Button>
          <Button type="button" size="sm" disabled={pending} onClick={onSave}>
            {pending ? "Saving…" : "Save lab panel"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
