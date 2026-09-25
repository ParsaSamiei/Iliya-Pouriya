"use client";

import { motion, useReducedMotion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { ContactInfoDetails } from "@/components/site/contact-info-details";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Link, usePathname } from "@/i18n/navigation";
import type { ContactSettingsView } from "@/lib/contact-settings";
import type { SocialChannelUrls } from "@/lib/social-channels";
import { cn } from "@/lib/utils";

type ContactWidgetClientProps = {
  contact: ContactSettingsView;
  socialUrls: SocialChannelUrls;
};

export function ContactWidgetClient({ contact, socialUrls }: ContactWidgetClientProps) {
  const t = useTranslations("contact");
  const locale = useLocale();
  const pathname = usePathname();
  const reduce = useReducedMotion();

  if (pathname === "/contact") {
    return null;
  }

  return (
    <Dialog>
      <div className="fixed end-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-40 sm:end-6 sm:bottom-[max(1.5rem,env(safe-area-inset-bottom))]">
        <motion.div
          className="relative"
          animate={reduce ? undefined : { y: [0, -8, 0] }}
          transition={
            reduce
              ? undefined
              : { duration: 3.2, repeat: Infinity, ease: "easeInOut" }
          }
        >
          {!reduce ? (
            <>
              <span aria-hidden className="contact-widget-ping" />
              <span aria-hidden className="contact-widget-ping contact-widget-ping--delayed" />
            </>
          ) : null}

          <DialogTrigger asChild>
            <motion.button
              type="button"
              className={cn(
                buttonVariants({ size: "icon" }),
                "btn-motion relative size-14 rounded-full shadow-[0_8px_28px_var(--glow-accent)]",
              )}
              aria-label={t("widgetOpen")}
              whileHover={
                reduce
                  ? undefined
                  : { scale: 1.12, rotate: -8 }
              }
              whileTap={reduce ? undefined : { scale: 0.94 }}
              transition={{ type: "spring", stiffness: 420, damping: 18 }}
            >
              <motion.span
                className="inline-flex"
                animate={reduce ? undefined : { rotate: [0, 8, -6, 0] }}
                transition={
                  reduce
                    ? undefined
                    : {
                        duration: 3.2,
                        repeat: Infinity,
                        ease: "easeInOut",
                        times: [0, 0.25, 0.55, 1],
                      }
                }
              >
                <MessageCircle className="size-6" aria-hidden />
              </motion.span>
            </motion.button>
          </DialogTrigger>
        </motion.div>
      </div>

      <DialogContent className="max-h-[min(90vh,36rem)] max-w-md overflow-y-auto">
        <DialogHeader className="pe-8 text-start">
          <DialogTitle>{t("widgetTitle")}</DialogTitle>
          <DialogDescription>{t("widgetDescription")}</DialogDescription>
        </DialogHeader>

        <ContactInfoDetails
          contact={contact}
          socialUrls={socialUrls}
          locale={locale}
          compact
          labels={{
            infoLabel: t("infoLabel"),
            phone: t("phone"),
            emailLabel: t("emailLabel"),
            address: t("address"),
            socialTitle: t("socialTitle"),
            opensInNewTab: t("opensInNewTab"),
          }}
        />

        <div className="border-t border-border pt-4">
          <Button asChild className="btn-motion w-full">
            <Link href="/contact">{t("widgetCta")}</Link>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
