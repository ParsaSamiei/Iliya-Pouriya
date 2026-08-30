import { getTranslations, setRequestLocale } from "next-intl/server";
import { PlaceholderNotice } from "@/components/site/placeholder-notice";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@/i18n/navigation";
import { db } from "@/lib/db";
import { getPersonName } from "@/lib/person";

export const revalidate = 300;

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");
  const _tTeam = await getTranslations("team");

  const [aboutSetting, people] = await Promise.all([
    db.siteSetting.findUnique({ where: { key: "about_page_copy" } }).catch(() => null),
    db.person.findMany({ orderBy: { sortOrder: "asc" } }).catch(() => []),
  ]);

  const aboutCopy =
    ((locale === "fa" ? aboutSetting?.valueFa : aboutSetting?.valueEn) as string | undefined) ??
    null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="font-display text-3xl font-semibold text-fg">{t("title")}</h1>

      {aboutCopy ? (
        <p className="mt-4 text-fg-muted">{aboutCopy}</p>
      ) : (
        <div className="mt-4">
          <PlaceholderNotice />
        </div>
      )}

      {people.length > 0 && (
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {people.map((person) => {
            const name = getPersonName(person, locale);
            return (
            <Link
              key={person.id}
              href={{ pathname: "/team/[person]", params: { person: person.slug } }}
            >
              <Card className="transition-colors hover:border-accent">
                <CardContent className="flex items-center gap-4 p-4">
                  <Avatar>
                    <AvatarImage src={person.photoUrl ?? undefined} alt={name} />
                    <AvatarFallback>{name.slice(0, 1)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-fg">{name}</p>
                    <p className="font-mono text-xs text-fg-muted">{person.title}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
