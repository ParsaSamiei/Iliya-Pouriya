import { ArrowRight } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "@/i18n/navigation";
import { getPersonInitials, getPersonName } from "@/lib/person";

type TeamCardProps = {
  person: {
    slug: string;
    nameEn: string;
    nameFa: string;
    title: string;
    photoUrl: string | null;
    bioEn: string | null;
    bioFa: string | null;
  };
};

export async function TeamCard({ person }: TeamCardProps) {
  const locale = await getLocale();
  const t = await getTranslations("team");
  const bio = locale === "fa" ? person.bioFa : person.bioEn;
  const name = getPersonName(person, locale);
  const initials = getPersonInitials(person, locale);

  return (
    <Link
      href={{ pathname: "/team/[person]", params: { person: person.slug } }}
      className="group panel-module flex h-full cursor-pointer flex-col p-6 transition-colors duration-200 hover:border-signal/30"
    >
      <div className="flex items-start gap-4">
        <Avatar className="size-14 rounded-none border border-border">
          <AvatarImage src={person.photoUrl ?? undefined} alt={name} />
          <AvatarFallback className="rounded-none font-mono text-sm">{initials}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-lg font-semibold text-fg">{name}</h3>
          <p className="mt-1 font-mono text-[11px] text-signal">{person.title}</p>
        </div>
      </div>

      {bio && (
        <p className="mt-4 line-clamp-3 flex-1 text-sm leading-relaxed text-fg-muted">{bio}</p>
      )}

      <span className="mt-4 inline-flex items-center gap-1.5 font-mono text-xs text-fg-muted transition-colors duration-200 group-hover:text-accent">
        {t("viewProfile")}
        <ArrowRight className="landing-arrow size-3.5" aria-hidden />
      </span>
    </Link>
  );
}
