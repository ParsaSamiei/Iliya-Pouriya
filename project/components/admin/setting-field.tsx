"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateSiteSetting } from "@/lib/actions/settings";

export function SettingField({
  settingKey,
  label,
  valueEn,
  valueFa,
}: {
  settingKey: string;
  label: string;
  valueEn: string;
  valueFa: string;
}) {
  const [pending, startTransition] = useTransition();

  function onSubmit(formData: FormData) {
    startTransition(async () => {
      await updateSiteSetting(
        settingKey,
        String(formData.get("valueEn") ?? ""),
        String(formData.get("valueFa") ?? ""),
      );
      toast.success(`${label} saved.`);
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={onSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor={`${settingKey}-en`}>English</Label>
            <Textarea id={`${settingKey}-en`} name="valueEn" defaultValue={valueEn} rows={3} />
          </div>
          <div className="space-y-1.5" dir="rtl">
            <Label htmlFor={`${settingKey}-fa`}>فارسی</Label>
            <Textarea
              id={`${settingKey}-fa`}
              name="valueFa"
              defaultValue={valueFa}
              rows={3}
              dir="rtl"
            />
          </div>
          <Button type="submit" size="sm" disabled={pending}>
            {pending ? "Saving…" : "Save"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
