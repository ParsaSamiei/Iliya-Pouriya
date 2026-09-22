import { cache } from "react";
import { db } from "@/lib/db";
import {
  DEFAULT_LANDING_COPY,
  LANDING_COPY_KEY,
  parseLandingCopy,
  resolveLandingCopy,
  type LandingCopyView,
} from "@/lib/landing-copy";

/** Cached per-request load of landing copy, resolved for the given locale. */
export const getLandingCopy = cache(async (locale: string): Promise<LandingCopyView> => {
  const setting = await db.siteSetting
    .findUnique({ where: { key: LANDING_COPY_KEY } })
    .catch(() => null);

  const data = setting?.valueEn
    ? parseLandingCopy(setting.valueEn)
    : DEFAULT_LANDING_COPY;

  return resolveLandingCopy(data, locale);
});
