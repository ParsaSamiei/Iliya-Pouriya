"use client";

import { Mail, MapPin, Phone, Plus, Share2, Trash2 } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateContactSettings } from "@/lib/actions/settings";
import { SOCIAL_CHANNELS, type SocialChannelField } from "@/lib/social-channels";
import type {
  ContactPhone,
  ContactSettingsData,
} from "@/lib/validation/contact-settings";

type ContactSettingsEditorProps = {
  initial: ContactSettingsData;
};

const emptyPhone: ContactPhone = { nameEn: "", nameFa: "", number: "" };

function PhoneListField({
  items,
  onChange,
  onAdd,
  onRemove,
  disabled,
}: {
  items: ContactPhone[];
  onChange: (index: number, field: keyof ContactPhone, value: string) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
  disabled: boolean;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Phone className="size-4 text-fg-muted" aria-hidden />
        <Label>Phone numbers</Label>
      </div>
      <p className="text-xs text-fg-muted">
        Each number has English and Persian owner names shown on the matching language site.
      </p>
      <div className="space-y-3">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex flex-col gap-2 rounded-md border border-border/60 p-3 sm:flex-row sm:items-start"
          >
            <div className="grid flex-1 gap-2 sm:grid-cols-3">
              <Input
                value={item.nameEn}
                placeholder="Name (English)"
                disabled={disabled}
                aria-label={`Phone owner name English ${index + 1}`}
                onChange={(e) => onChange(index, "nameEn", e.target.value)}
              />
              <Input
                dir="rtl"
                value={item.nameFa}
                placeholder="نام (فارسی)"
                disabled={disabled}
                aria-label={`Phone owner name Persian ${index + 1}`}
                onChange={(e) => onChange(index, "nameFa", e.target.value)}
              />
              <Input
                type="tel"
                dir="ltr"
                value={item.number}
                placeholder="+98 21 1234 5678"
                disabled={disabled}
                aria-label={`Phone number ${index + 1}`}
                onChange={(e) => onChange(index, "number", e.target.value)}
              />
            </div>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              disabled={disabled}
              aria-label={`Remove phone ${index + 1}`}
              onClick={() => onRemove(index)}
              className="shrink-0 self-end sm:self-start"
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
        Add phone number
      </Button>
    </div>
  );
}

function EmailListField({
  items,
  onChange,
  onAdd,
  onRemove,
  disabled,
}: {
  items: string[];
  onChange: (index: number, value: string) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
  disabled: boolean;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Mail className="size-4 text-fg-muted" aria-hidden />
        <Label>Email addresses</Label>
      </div>
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <Input
              type="email"
              value={item}
              placeholder="hello@example.com"
              disabled={disabled}
              onChange={(e) => onChange(index, e.target.value)}
            />
            <Button
              type="button"
              size="icon"
              variant="ghost"
              disabled={disabled}
              aria-label={`Remove email ${index + 1}`}
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
        Add email address
      </Button>
    </div>
  );
}

export function ContactSettingsEditor({ initial }: ContactSettingsEditorProps) {
  const [data, setData] = useState(initial);
  const [pending, startTransition] = useTransition();

  function updatePhoneField(index: number, field: keyof ContactPhone, value: string) {
    setData((current) => {
      const phones = current.phones.length > 0 ? [...current.phones] : [{ ...emptyPhone }];
      phones[index] = { ...phones[index], [field]: value };
      return { ...current, phones };
    });
  }

  function removePhone(index: number) {
    setData((current) => ({
      ...current,
      phones: current.phones.filter((_, i) => i !== index),
    }));
  }

  function updateEmailField(index: number, value: string) {
    setData((current) => {
      const emails = current.emails.length > 0 ? [...current.emails] : [""];
      emails[index] = value;
      return { ...current, emails };
    });
  }

  function removeEmail(index: number) {
    setData((current) => ({
      ...current,
      emails: current.emails.filter((_, i) => i !== index),
    }));
  }

  function updateSocialField(field: SocialChannelField, value: string) {
    setData((current) => ({ ...current, [field]: value }));
  }

  function onSave() {
    startTransition(async () => {
      try {
        await updateContactSettings(data);
        toast.success("Contact settings saved.");
      } catch {
        toast.error("Could not save — check emails and social links are valid https:// URLs.");
      }
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Contact us</CardTitle>
        <p className="text-sm text-fg-muted">
          Phone numbers, emails, address, and social links shown on the Contact page and in the
          site footer. Leave fields empty to hide them from visitors.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <PhoneListField
          items={data.phones.length > 0 ? data.phones : [{ ...emptyPhone }]}
          disabled={pending}
          onChange={updatePhoneField}
          onAdd={() => setData((c) => ({ ...c, phones: [...c.phones, { ...emptyPhone }] }))}
          onRemove={removePhone}
        />

        <EmailListField
          items={data.emails.length > 0 ? data.emails : [""]}
          disabled={pending}
          onChange={updateEmailField}
          onAdd={() => setData((c) => ({ ...c, emails: [...c.emails, ""] }))}
          onRemove={removeEmail}
        />

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <MapPin className="size-4 text-fg-muted" aria-hidden />
            <Label>Address</Label>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="contact-location-en">Address (English)</Label>
              <Textarea
                id="contact-location-en"
                value={data.locationEn}
                placeholder={"No. 12, Example St.\nTehran, Iran"}
                rows={3}
                disabled={pending}
                onChange={(e) => setData((c) => ({ ...c, locationEn: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5" dir="rtl">
              <Label htmlFor="contact-location-fa">آدرس (فارسی)</Label>
              <Textarea
                id="contact-location-fa"
                dir="rtl"
                value={data.locationFa}
                placeholder={"خیابان نمونه، پلاک ۱۲\nتهران، ایران"}
                rows={3}
                disabled={pending}
                onChange={(e) => setData((c) => ({ ...c, locationFa: e.target.value }))}
              />
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Share2 className="size-4 text-fg-muted" aria-hidden />
            <Label>Social networks</Label>
          </div>
          <p className="text-xs text-fg-muted">
            Profile URLs for Telegram, Bale, YouTube, Aparat, and Instagram. Empty fields are
            hidden on the public site.
          </p>
          <div className="space-y-3">
            {SOCIAL_CHANNELS.map((channel) => (
              <div key={channel.field} className="space-y-1.5">
                <Label htmlFor={channel.field}>
                  {channel.labelEn} ({channel.labelFa})
                </Label>
                <Input
                  id={channel.field}
                  type="url"
                  dir="ltr"
                  placeholder={channel.placeholder}
                  value={data[channel.field]}
                  disabled={pending}
                  onChange={(e) => updateSocialField(channel.field, e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>

        <Button type="button" size="sm" disabled={pending} onClick={onSave}>
          {pending ? "Saving…" : "Save contact settings"}
        </Button>
      </CardContent>
    </Card>
  );
}
