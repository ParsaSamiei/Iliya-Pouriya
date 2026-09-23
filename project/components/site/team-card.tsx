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
      className="group surface-card flex h-full cursor-pointer flex-col p-6"
    >
      <div className="flex items-start gap-4">
        <Avatar className="size-16 overflow-hidden rounded-sm border border-border">
          <AvatarImage
            src={person.photoUrl ?? undefined}
            alt={name}
            className="card-media-zoom object-cover"
          />
          <AvatarFallback className="rounded-sm text-sm">{initials}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-lg font-semibold text-fg">{name}</h3>
          <p className="mt-1 text-sm text-fg-muted">{person.title}</p>
        </div>
      </div>

      {bio && (
        <p className="mt-4 line-clamp-3 flex-1 text-sm leading-relaxed text-fg-muted">{bio}</p>
      )}

      <span className="mt-5 inline-flex items-center gap-1.5 text-sm text-fg-muted transition-colors duration-200 group-hover:text-accent">
        {t("viewProfile")}
        <ArrowRight className="landing-arrow size-3.5" aria-hidden />
      </span>
    </Link>
  );
}
