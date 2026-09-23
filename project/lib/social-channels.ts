/** Fixed set of social channels editable via Admin → Settings → Contact. */
export const SOCIAL_CHANNELS = [
  {
    id: "telegram",
    field: "telegramUrl",
    labelFa: "تلگرام",
    labelEn: "Telegram",
    placeholder: "https://t.me/username",
  },
  {
    id: "bale",
    field: "baleUrl",
    labelFa: "بله",
    labelEn: "Bale",
    placeholder: "https://ble.ir/username",
  },
  {
    id: "youtube",
    field: "youtubeUrl",
    labelFa: "یوتیوب",
    labelEn: "YouTube",
    placeholder: "https://www.youtube.com/@channel",
  },
  {
    id: "aparat",
    field: "aparatUrl",
    labelFa: "آپارات",
    labelEn: "Aparat",
    placeholder: "https://www.aparat.com/username",
  },
  {
    id: "instagram",
    field: "instagramUrl",
    labelFa: "اینستاگرام",
    labelEn: "Instagram",
    placeholder: "https://www.instagram.com/username",
  },
] as const;

export type SocialChannelId = (typeof SOCIAL_CHANNELS)[number]["id"];
export type SocialChannelField = (typeof SOCIAL_CHANNELS)[number]["field"];

export interface SocialLink {
  id: SocialChannelId;
  href: string;
  labelFa: string;
  labelEn: string;
}

export type SocialChannelUrls = {
  [K in SocialChannelField]?: string | null;
};

/** Returns only channels that have a non-empty URL set. */
export function getSocialLinks(settings: SocialChannelUrls | null | undefined): SocialLink[] {
  if (!settings) return [];
  return SOCIAL_CHANNELS.flatMap((channel) => {
    const value = settings[channel.field];
    const href = typeof value === "string" ? value.trim() : "";
    if (!href) return [];
    return [
      {
        id: channel.id,
        href,
        labelFa: channel.labelFa,
        labelEn: channel.labelEn,
      },
    ];
  });
}

export function socialLinkLabel(link: SocialLink, locale: string): string {
  return locale === "fa" ? link.labelFa : link.labelEn;
}
