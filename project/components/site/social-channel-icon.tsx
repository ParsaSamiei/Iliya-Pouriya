import type { SocialChannelId } from "@/lib/social-channels";
import { cn } from "@/lib/utils";

const CHANNEL_ICON: Record<SocialChannelId, string> = {
  youtube: "/brand/youtube.svg",
  instagram: "/brand/instagram.png",
  telegram: "/brand/telegram.svg",
  bale: "/brand/bale.png",
  aparat: "/brand/aparat.svg",
};

type SocialChannelIconProps = {
  id: SocialChannelId;
  className?: string;
};

/** Colored brand marks for site social channels. */
export function SocialChannelIcon({ id, className }: SocialChannelIconProps) {
  return (
    // Decorative — link text / aria-label carries the channel name.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={CHANNEL_ICON[id]}
      alt=""
      width={20}
      height={20}
      className={cn("size-5 shrink-0 object-contain", className)}
      aria-hidden="true"
      decoding="async"
    />
  );
}
