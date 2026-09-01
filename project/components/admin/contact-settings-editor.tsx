"use client";

import { Mail, MapPin, Phone, Plus, Trash2 } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateContactSettings } from "@/lib/actions/settings";
import type { ContactSettingsData } from "@/lib/validation/contact-settings";

type ContactSettingsEditorProps = {
  initial: ContactSettingsData;
};

function ListField({
  icon: Icon,
  label,
  addLabel,
  items,
  inputType,
  placeholder,
  onChange,
  onAdd,
  onRemove,
  disabled,
}: {
  icon: typeof Phone;
  label: string;
  addLabel: string;
  items: string[];
  inputType?: string;
  placeholder: string;
  onChange: (index: number, value: string) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
  disabled: boolean;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Icon className="size-4 text-fg-muted" aria-hidden />
        <Label>{label}</Label>
      </div>
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <Input
              type={inputType}
              value={item}
              placeholder={placeholder}
              disabled={disabled}
              onChange={(e) => onChange(index, e.target.value)}
            />
            <Button
              type="button"
              size="icon"
              variant="ghost"
              disabled={disabled}
              aria-label={`Remove ${label.toLowerCase()} ${index + 1}`}
              onClick={() => onRemove(index)}
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        ))}
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={items.length >= 6 || disabled}
        onClick={onAdd}
      >
        <Plus className="size-4" />
        {addLabel}
      </Button>
    </div>
  );
}

export function ContactSettingsEditor({ initial }: ContactSettingsEditorProps) {
  const [data, setData] = useState(initial);
  const [pending, startTransition] = useTransition();

  function updateListField(
    field: "phones" | "emails",
    index: number,
    value: string,
  ) {
    setData((current) => {
      const items = current[field].length > 0 ? [...current[field]] : [""];
      items[index] = value;
      return { ...current, [field]: items };
    });
  }

  function removeListField(field: "phones" | "emails", index: number) {
    setData((current) => ({
      ...current,
      [field]: current[field].filter((_, i) => i !== index),
    }));
  }

  function onSave() {
    startTransition(async () => {
      try {
        await updateContactSettings(data);
        toast.success("Contact settings saved.");
      } catch {
        toast.error("Could not save — check email addresses are valid.");
      }
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Contact us</CardTitle>
        <p className="text-sm text-fg-muted">
          Phone numbers, emails, and location shown in the site footer. Leave fields empty to
          hide them from visitors.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <ListField
          icon={Phone}
          label="Phone numbers"
          addLabel="Add phone number"
          items={data.phones.length > 0 ? data.phones : [""]}
          inputType="tel"
          placeholder="+98 21 1234 5678"
          disabled={pending}
          onChange={(index, value) => updateListField("phones", index, value)}
          onAdd={() => setData((c) => ({ ...c, phones: [...c.phones, ""] }))}
          onRemove={(index) => removeListField("phones", index)}
        />

        <ListField
          icon={Mail}
          label="Email addresses"
          addLabel="Add email address"
          items={data.emails.length > 0 ? data.emails : [""]}
          inputType="email"
          placeholder="hello@example.com"
          disabled={pending}
          onChange={(index, value) => updateListField("emails", index, value)}
          onAdd={() => setData((c) => ({ ...c, emails: [...c.emails, ""] }))}
          onRemove={(index) => removeListField("emails", index)}
        />

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <MapPin className="size-4 text-fg-muted" aria-hidden />
            <Label>Location</Label>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="contact-location-en">Address (English)</Label>
              <Input
                id="contact-location-en"
                value={data.locationEn}
                placeholder="Tehran, Iran"
                disabled={pending}
                onChange={(e) => setData((c) => ({ ...c, locationEn: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5" dir="rtl">
              <Label htmlFor="contact-location-fa">آدرس (فارسی)</Label>
              <Input
                id="contact-location-fa"
                dir="rtl"
                value={data.locationFa}
                placeholder="تهران، ایران"
                disabled={pending}
                onChange={(e) => setData((c) => ({ ...c, locationFa: e.target.value }))}
              />
            </div>
          </div>
        </div>

        <Button type="button" size="sm" disabled={pending} onClick={onSave}>
          {pending ? "Saving…" : "Save contact settings"}
        </Button>
      </CardContent>
    </Card>
  );
}
