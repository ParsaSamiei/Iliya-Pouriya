"use client";

import { Plus, Trash2 } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateLandingCopy } from "@/lib/actions/settings";
import type {
  LandingCapability,
  LandingCopyData,
} from "@/lib/validation/landing-copy";

type LandingTextKey = Exclude<
  keyof LandingCopyData,
  | "capabilities"
  | "statusBoardActiveCount"
  | "statusBoardFieldCount"
  | "statusBoardCompleteCount"
>;


type FieldDef = {
  key: LandingTextKey;
  label: string;
  multiline?: boolean;
  rows?: number;
};

const EMPTY_CAPABILITY: LandingCapability = {
  titleEn: "",
  titleFa: "",
  descEn: "",
  descFa: "",
};

const SECTIONS: Array<{
  title: string;
  description: string;
  fields: FieldDef[];
}> = [
  {
    title: "Hero",
    description: "Names, headline, supporting line, and primary CTAs.",
    fields: [
      { key: "heroNameAEn", label: "Name A (English)" },
      { key: "heroNameAFa", label: "نام A (فارسی)" },
      { key: "heroNameBEn", label: "Name B (English)" },
      { key: "heroNameBFa", label: "نام B (فارسی)" },
      { key: "heroTitleEn", label: "Headline (English)", multiline: true, rows: 2 },
      { key: "heroTitleFa", label: "عنوان (فارسی)", multiline: true, rows: 2 },
      { key: "heroSubtitleEn", label: "Subtitle (English)", multiline: true, rows: 3 },
      { key: "heroSubtitleFa", label: "زیرعنوان (فارسی)", multiline: true, rows: 3 },
      { key: "ctaViewProjectsEn", label: "CTA — view projects (English)" },
      { key: "ctaViewProjectsFa", label: "دکمه — مشاهده پروژه‌ها (فارسی)" },
      { key: "ctaMeetTeamEn", label: "CTA — meet the team (English)" },
      { key: "ctaMeetTeamFa", label: "دکمه — آشنایی با تیم (فارسی)" },
    ],
  },
  {
    title: "Team section",
    description: "Eyebrow, title, and subtitle above the people cards.",
    fields: [
      { key: "teamEyebrowEn", label: "Eyebrow (English)" },
      { key: "teamEyebrowFa", label: "برچسب بخش (فارسی)" },
      { key: "meetTheTeamEn", label: "Title (English)" },
      { key: "meetTheTeamFa", label: "عنوان (فارسی)" },
      { key: "meetTheTeamSubtitleEn", label: "Subtitle (English)", multiline: true, rows: 2 },
      { key: "meetTheTeamSubtitleFa", label: "زیرعنوان (فارسی)", multiline: true, rows: 2 },
    ],
  },
  {
    title: "Projects section",
    description:
      "Header and “view all” link for featured projects, plus status board copy. Counts are edited in the card below.",
    fields: [
      { key: "projectsEyebrowEn", label: "Eyebrow (English)" },
      { key: "projectsEyebrowFa", label: "برچسب بخش (فارسی)" },
      { key: "featuredProjectsEn", label: "Title (English)" },
      { key: "featuredProjectsFa", label: "عنوان (فارسی)" },
      {
        key: "featuredProjectsSubtitleEn",
        label: "Subtitle (English)",
        multiline: true,
        rows: 2,
      },
      {
        key: "featuredProjectsSubtitleFa",
        label: "زیرعنوان (فارسی)",
        multiline: true,
        rows: 2,
      },
      { key: "viewAllProjectsEn", label: "View all link (English)" },
      { key: "viewAllProjectsFa", label: "لینک مشاهده همه (فارسی)" },
      { key: "statusBoardEyebrowEn", label: "Status board eyebrow (English)" },
      { key: "statusBoardEyebrowFa", label: "برچسب تابلو وضعیت (فارسی)" },
      { key: "statusBoardTitleEn", label: "Status board title (English)" },
      { key: "statusBoardTitleFa", label: "عنوان تابلو وضعیت (فارسی)" },
      {
        key: "statusBoardSubtitleEn",
        label: "Status board subtitle (English)",
        multiline: true,
        rows: 2,
      },
      {
        key: "statusBoardSubtitleFa",
        label: "زیرعنوان تابلو وضعیت (فارسی)",
        multiline: true,
        rows: 2,
      },
      {
        key: "statusBoardEmptyEn",
        label: "Status board empty (English)",
        multiline: true,
        rows: 2,
      },
      {
        key: "statusBoardEmptyFa",
        label: "متن خالی تابلو وضعیت (فارسی)",
        multiline: true,
        rows: 2,
      },
    ],
  },
  {
    title: "Capabilities section",
    description: "Section header — capability items are edited below.",
    fields: [
      { key: "capabilitiesEyebrowEn", label: "Eyebrow (English)" },
      { key: "capabilitiesEyebrowFa", label: "برچسب بخش (فارسی)" },
      { key: "capabilitiesTitleEn", label: "Title (English)" },
      { key: "capabilitiesTitleFa", label: "عنوان (فارسی)" },
      {
        key: "capabilitiesSubtitleEn",
        label: "Subtitle (English)",
        multiline: true,
        rows: 2,
      },
      {
        key: "capabilitiesSubtitleFa",
        label: "زیرعنوان (فارسی)",
        multiline: true,
        rows: 2,
      },
    ],
  },
  {
    title: "Blog section",
    description: "Header and “view all” link for latest posts.",
    fields: [
      { key: "blogEyebrowEn", label: "Eyebrow (English)" },
      { key: "blogEyebrowFa", label: "برچسب بخش (فارسی)" },
      { key: "latestPostsEn", label: "Title (English)" },
      { key: "latestPostsFa", label: "عنوان (فارسی)" },
      { key: "latestPostsSubtitleEn", label: "Subtitle (English)", multiline: true, rows: 2 },
      { key: "latestPostsSubtitleFa", label: "زیرعنوان (فارسی)", multiline: true, rows: 2 },
      { key: "viewAllPostsEn", label: "View all link (English)" },
      { key: "viewAllPostsFa", label: "لینک مشاهده همه (فارسی)" },
    ],
  },
  {
    title: "Recommendations section",
    description: "Header above third-party quotes on the homepage.",
    fields: [
      { key: "recommendationsEyebrowEn", label: "Eyebrow (English)" },
      { key: "recommendationsEyebrowFa", label: "برچسب بخش (فارسی)" },
      { key: "recommendationsTitleEn", label: "Title (English)" },
      { key: "recommendationsTitleFa", label: "عنوان (فارسی)" },
      {
        key: "recommendationsSubtitleEn",
        label: "Subtitle (English)",
        multiline: true,
        rows: 2,
      },
      {
        key: "recommendationsSubtitleFa",
        label: "زیرعنوان (فارسی)",
        multiline: true,
        rows: 2,
      },
    ],
  },
  {
    title: "Clients section",
    description: "Header above the “who we’ve worked with” carousel.",
    fields: [
      { key: "clientsEyebrowEn", label: "Eyebrow (English)" },
      { key: "clientsEyebrowFa", label: "برچسب بخش (فارسی)" },
      { key: "clientsTitleEn", label: "Title (English)" },
      { key: "clientsTitleFa", label: "عنوان (فارسی)" },
      {
        key: "clientsSubtitleEn",
        label: "Subtitle (English)",
        multiline: true,
        rows: 2,
      },
      {
        key: "clientsSubtitleFa",
        label: "زیرعنوان (فارسی)",
        multiline: true,
        rows: 2,
      },
    ],
  },
  {
    title: "Contact CTA",
    description: "Closing call-to-action strip on the homepage.",
    fields: [
      { key: "contactEyebrowEn", label: "Eyebrow (English)" },
      { key: "contactEyebrowFa", label: "برچسب بخش (فارسی)" },
      { key: "contactTitleEn", label: "Title (English)" },
      { key: "contactTitleFa", label: "عنوان (فارسی)" },
      { key: "contactSubtitleEn", label: "Subtitle (English)", multiline: true, rows: 2 },
      { key: "contactSubtitleFa", label: "زیرعنوان (فارسی)", multiline: true, rows: 2 },
      { key: "ctaContactEn", label: "CTA button (English)" },
      { key: "ctaContactFa", label: "دکمه تماس (فارسی)" },
    ],
  },
];

function isFaKey(key: string) {
  return key.endsWith("Fa");
}

function BilingualField({
  field,
  value,
  onChange,
  disabled,
}: {
  field: FieldDef;
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
}) {
  const id = `landing-${field.key}`;
  const rtl = isFaKey(field.key);

  return (
    <div className="space-y-1.5" dir={rtl ? "rtl" : undefined}>
      <Label htmlFor={id}>{field.label}</Label>
      {field.multiline ? (
        <Textarea
          id={id}
          value={value}
          rows={field.rows ?? 3}
          dir={rtl ? "rtl" : undefined}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <Input
          id={id}
          value={value}
          dir={rtl ? "rtl" : undefined}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </div>
  );
}

export function LandingCopyEditor({ initial }: { initial: LandingCopyData }) {
  const [data, setData] = useState(initial);
  const [pending, startTransition] = useTransition();

  function setField(key: LandingTextKey, value: string) {
    setData((current) => ({ ...current, [key]: value }));
  }

  function updateCapability(index: number, patch: Partial<LandingCapability>) {
    setData((current) => ({
      ...current,
      capabilities: current.capabilities.map((item, i) =>
        i === index ? { ...item, ...patch } : item,
      ),
    }));
  }

  function addCapability() {
    if (data.capabilities.length >= 8) return;
    setData((current) => ({
      ...current,
      capabilities: [...current.capabilities, { ...EMPTY_CAPABILITY }],
    }));
  }

  function removeCapability(index: number) {
    if (data.capabilities.length <= 1) return;
    setData((current) => ({
      ...current,
      capabilities: current.capabilities.filter((_, i) => i !== index),
    }));
  }

  function onSave() {
    startTransition(async () => {
      try {
        await updateLandingCopy(data);
        toast.success("Landing page copy saved.");
      } catch {
        toast.error("Could not save — check that every field is filled in.");
      }
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-lg font-semibold">Landing page copy</h2>
        <p className="mt-1 text-sm text-fg-muted">
          Every text string shown on the homepage. English and فارسی are edited side by
          side; empty fields are not allowed.
        </p>
      </div>

      {SECTIONS.map((section) => (
        <Card key={section.title}>
          <CardHeader>
            <CardTitle className="text-base">{section.title}</CardTitle>
            <p className="text-sm text-fg-muted">{section.description}</p>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              {section.fields.map((field) => (
                <BilingualField
                  key={field.key}
                  field={field}
                  value={String(data[field.key] ?? "")}
                  disabled={pending}
                  onChange={(value) => setField(field.key, value)}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Status board counts</CardTitle>
          <p className="text-sm text-fg-muted">
            Numbers shown on the homepage lab status board. Set these manually — they are
            not calculated from projects.
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label htmlFor="status-board-active">Active</Label>
              <Input
                id="status-board-active"
                type="number"
                min={0}
                max={9999}
                inputMode="numeric"
                value={data.statusBoardActiveCount}
                disabled={pending}
                onChange={(e) =>
                  setData((current) => ({
                    ...current,
                    statusBoardActiveCount: Math.max(
                      0,
                      Math.min(9999, Number.parseInt(e.target.value, 10) || 0),
                    ),
                  }))
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="status-board-field">Field</Label>
              <Input
                id="status-board-field"
                type="number"
                min={0}
                max={9999}
                inputMode="numeric"
                value={data.statusBoardFieldCount}
                disabled={pending}
                onChange={(e) =>
                  setData((current) => ({
                    ...current,
                    statusBoardFieldCount: Math.max(
                      0,
                      Math.min(9999, Number.parseInt(e.target.value, 10) || 0),
                    ),
                  }))
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="status-board-complete">Complete</Label>
              <Input
                id="status-board-complete"
                type="number"
                min={0}
                max={9999}
                inputMode="numeric"
                value={data.statusBoardCompleteCount}
                disabled={pending}
                onChange={(e) =>
                  setData((current) => ({
                    ...current,
                    statusBoardCompleteCount: Math.max(
                      0,
                      Math.min(9999, Number.parseInt(e.target.value, 10) || 0),
                    ),
                  }))
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Capability items</CardTitle>
          <p className="text-sm text-fg-muted">
            The practice areas listed under Capabilities (title + description each).
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.capabilities.map((item, index) => (
            <div
              key={index}
              className="space-y-3 rounded-[var(--radius-sm)] border border-border p-4"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="font-mono text-xs text-fg-muted uppercase">
                  Item {index + 1}
                </p>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  disabled={data.capabilities.length <= 1 || pending}
                  onClick={() => removeCapability(index)}
                  aria-label={`Remove capability ${index + 1}`}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor={`cap-${index}-title-en`}>Title (English)</Label>
                  <Input
                    id={`cap-${index}-title-en`}
                    value={item.titleEn}
                    disabled={pending}
                    onChange={(e) => updateCapability(index, { titleEn: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5" dir="rtl">
                  <Label htmlFor={`cap-${index}-title-fa`}>عنوان (فارسی)</Label>
                  <Input
                    id={`cap-${index}-title-fa`}
                    dir="rtl"
                    value={item.titleFa}
                    disabled={pending}
                    onChange={(e) => updateCapability(index, { titleFa: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor={`cap-${index}-desc-en`}>Description (English)</Label>
                  <Textarea
                    id={`cap-${index}-desc-en`}
                    rows={3}
                    value={item.descEn}
                    disabled={pending}
                    onChange={(e) => updateCapability(index, { descEn: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5" dir="rtl">
                  <Label htmlFor={`cap-${index}-desc-fa`}>توضیح (فارسی)</Label>
                  <Textarea
                    id={`cap-${index}-desc-fa`}
                    dir="rtl"
                    rows={3}
                    value={item.descFa}
                    disabled={pending}
                    onChange={(e) => updateCapability(index, { descFa: e.target.value })}
                  />
                </div>
              </div>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={data.capabilities.length >= 8 || pending}
            onClick={addCapability}
          >
            <Plus className="size-4" />
            Add capability
          </Button>
        </CardContent>
      </Card>

      <Button type="button" disabled={pending} onClick={onSave}>
        {pending ? "Saving…" : "Save landing page copy"}
      </Button>
    </div>
  );
}
