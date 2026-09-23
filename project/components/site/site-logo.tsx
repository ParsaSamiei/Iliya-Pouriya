import Image from "next/image";
import { cn } from "@/lib/utils";

const SIZES = {
  sm: 28,
  md: 40,
  lg: 88,
  xl: 128,
  hero: 168,
} as const;

type SiteLogoProps = {
  size?: keyof typeof SIZES;
  className?: string;
  priority?: boolean;
  /** When true, logo is the sole brand label (sets meaningful alt). */
  labeled?: boolean;
  label?: string;
};

/** IPZ hexagon brand mark from /public/logo.png */
export function SiteLogo({
  size = "sm",
  className,
  priority = false,
  labeled = false,
  label = "IPZ",
}: SiteLogoProps) {
  const px = SIZES[size];

  return (
    <Image
      src="/logo.png"
      alt={labeled ? label : ""}
      width={px}
      height={px}
      priority={priority}
      className={cn("shrink-0 select-none object-contain", className)}
    />
  );
}
