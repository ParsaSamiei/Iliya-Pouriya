import type {
  ContactPhone,
  ContactSettingsData,
} from "@/lib/validation/contact-settings";
import { contactSettingsSchema } from "@/lib/validation/contact-settings";
import { SOCIAL_CHANNELS } from "@/lib/social-channels";

export const CONTACT_SETTINGS_KEY = "contact_settings";

const emptySocialUrls = Object.fromEntries(
  SOCIAL_CHANNELS.map((channel) => [channel.field, ""]),
) as Pick<ContactSettingsData, (typeof SOCIAL_CHANNELS)[number]["field"]>;

export const DEFAULT_CONTACT_SETTINGS: ContactSettingsData = {
  phones: [],
  emails: [],
  locationEn: "",
  locationFa: "",
  ...emptySocialUrls,
};

export type ContactPhoneView = {
  name: string;
  number: string;
};

export type ContactSettingsView = {
  phones: ContactPhoneView[];
  emails: string[];
  location: string;
};

function normalizePhone(phone: ContactPhone): ContactPhone | null {
  const number = phone.number.trim();
  if (!number) return null;
  return {
    nameEn: phone.nameEn.trim(),
    nameFa: phone.nameFa.trim(),
    number,
  };
}

function normalizeLists(data: ContactSettingsData): ContactSettingsData {
  const social = Object.fromEntries(
    SOCIAL_CHANNELS.map((channel) => {
      const raw = data[channel.field];
      return [channel.field, typeof raw === "string" ? raw.trim() : ""];
    }),
  ) as Pick<ContactSettingsData, (typeof SOCIAL_CHANNELS)[number]["field"]>;

  return {
    ...data,
    phones: data.phones.map(normalizePhone).filter((p): p is ContactPhone => p !== null),
    emails: data.emails.map((e) => e.trim()).filter(Boolean),
    ...social,
  };
}

export function parseContactSettings(value: unknown): ContactSettingsData {
  const result = contactSettingsSchema.safeParse(value);
  return result.success ? normalizeLists(result.data) : DEFAULT_CONTACT_SETTINGS;
}

export function resolveContactSettings(
  data: ContactSettingsData,
  locale: string,
): ContactSettingsView {
  const normalized = normalizeLists(data);
  const isFa = locale === "fa";
  return {
    phones: normalized.phones.map((phone) => ({
      number: phone.number,
      name: isFa
        ? phone.nameFa || phone.nameEn
        : phone.nameEn || phone.nameFa,
    })),
    emails: normalized.emails,
    location: isFa ? normalized.locationFa : normalized.locationEn,
  };
}

export function hasContactInfo(view: ContactSettingsView): boolean {
  return view.phones.length > 0 || view.emails.length > 0 || view.location.length > 0;
}
