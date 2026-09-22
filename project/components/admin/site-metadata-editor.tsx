"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateSiteMetadata } from "@/lib/actions/settings";
import type { SiteMetadataData } from "@/lib/validation/site-metadata";

type SiteMetadataEditorProps = {
  initial: SiteMetadataData;
};

export function SiteMetadataEditor({ initial }: SiteMetadataEditorProps) {
  const [data, setData] = useState(initial);
  const [pending, startTransition] = useTransition();

  function setField<K extends keyof SiteMetadataData>(key: K, value: SiteMetadataData[K]) {
    setData((current) => ({ ...current, [key]: value }));
  }

  function onSave() {
    startTransition(async () => {
      try {
        await updateSiteMetadata(data);
        toast.success("Site metadata saved.");
      } catch {
        toast.error("Could not save — check all fields are filled in.");
      }
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Site metadata</CardTitle>
        <p className="text-sm text-fg-muted">
          Site name and tagline used in browser titles, meta description, Open Graph, header,
          footer, and the web app manifest.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="site-name-en">Site name (English)</Label>
            <Input
              id="site-name-en"
              value={data.nameEn}
              disabled={pending}
              onChange={(e) => setField("nameEn", e.target.value)}
            />
          </div>
          <div className="space-y-1.5" dir="rtl">
            <Label htmlFor="site-name-fa">نام سایت (فارسی)</Label>
            <Input
              id="site-name-fa"
              dir="rtl"
              value={data.nameFa}
              disabled={pending}
              onChange={(e) => setField("nameFa", e.target.value)}
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="site-tagline-en">Tagline / description (English)</Label>
            <Textarea
              id="site-tagline-en"
              value={data.taglineEn}
              rows={3}
              disabled={pending}
              onChange={(e) => setField("taglineEn", e.target.value)}
            />
          </div>
          <div className="space-y-1.5" dir="rtl">
            <Label htmlFor="site-tagline-fa">شعار / توضیحات (فارسی)</Label>
            <Textarea
              id="site-tagline-fa"
              dir="rtl"
              value={data.taglineFa}
              rows={3}
              disabled={pending}
              onChange={(e) => setField("taglineFa", e.target.value)}
            />
          </div>
        </div>

        <p className="text-xs text-fg-muted">
          Default title becomes{" "}
          <span className="font-mono text-fg">
            {data.nameEn || "…"} — {data.taglineEn || "…"}
          </span>
          ; other pages use{" "}
          <span className="font-mono text-fg">Page — {data.nameEn || "…"}</span>.
        </p>

        <Button type="button" size="sm" disabled={pending} onClick={onSave}>
          {pending ? "Saving…" : "Save site metadata"}
        </Button>
      </CardContent>
    </Card>
  );
}
