import { Briefcase, Code2, Mail } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { getPersonName } from "@/lib/person";
import { buildLocaleAlternates, JsonLd, personJsonLd } from "@/lib/seo";

export async function generateStaticParams() {
  const people = await db.person.findMany({ select: { slug: true } }).catch(() => []);
  return people.map((p) => ({ person: p.slug }));
}

export const revalidate = 300;

async function getPerson(slug: string) {
  return db.person.findFirst({
    where: { slug },
    include: {
      experience: { orderBy: { sortOrder: "asc" } },
      skills: { orderBy: { sortOrder: "asc" } },
    },
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; person: string }>;
}): Promise<Metadata> {
  const { locale, person: slug } = await params;
  const person = await getPerson(slug).catch(() => null);
  if (!person) return {};
  const name = getPersonName(person, locale);
  return {
    title: name,
    description: person.title,
    alternates: buildLocaleAlternates(`/team/${slug}`),
    openGraph: {
      title: name,
      description: person.title,
      images: person.photoUrl ? [person.photoUrl] : undefined,
    },
  };
}

export default async function TeamMemberPage({
  params,
}: {
  params: Promise<{ locale: string; person: string }>;
}) {
  const { locale, person: slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("team");

  const person = await getPerson(slug).catch(() => null);
  if (!person) notFound();

  const bio = locale === "fa" ? person.bioFa : person.bioEn;
  const name = getPersonName(person, locale);
  const resumeUrl =
    locale === "fa"
      ? (person.resumeUrlFa ?? person.resumeUrlEn)
      : (person.resumeUrlEn ?? person.resumeUrlFa);
  const social =
    (person.socialLinks as { github?: string; linkedin?: string; email?: string } | null) ?? {};

  const skillsByCategory = {
    hardware: person.skills.filter((s) => s.category === "hardware"),
    software: person.skills.filter((s) => s.category === "software"),
    other: person.skills.filter((s) => s.category === "other"),
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <JsonLd data={personJsonLd(person)} />
      <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-start sm:text-left">
        <Avatar className="size-24">
          <AvatarImage src={person.photoUrl ?? undefined} alt={name} />
          <AvatarFallback className="text-2xl">{name.slice(0, 1)}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="font-display text-3xl font-semibold text-fg">{name}</h1>
          <p className="mt-1 font-mono text-sm text-accent">{person.title}</p>
          <div className="mt-3 flex justify-center gap-2 sm:justify-start">
            {social.github && (
              <Button asChild size="icon" variant="ghost">
                <a href={social.github} target="_blank" rel="noreferrer" aria-label="GitHub">
                  <Code2 className="size-4" />
                </a>
              </Button>
            )}
            {social.linkedin && (
              <Button asChild size="icon" variant="ghost">
                <a href={social.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
                  <Briefcase className="size-4" />
                </a>
              </Button>
            )}
            {social.email && (
              <Button asChild size="icon" variant="ghost">
                <a href={`mailto:${social.email}`}>
                  <Mail className="size-4" />
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>

      {bio && <p className="mt-8 text-fg-muted">{bio}</p>}

      {resumeUrl && (
        <Button asChild className="mt-6" variant="outline">
          <a href={resumeUrl} download>
            {t("viewResume")}
          </a>
        </Button>
      )}

      {person.experience.length > 0 && (
        <section className="mt-12">
          <h2 className="font-display text-xl font-semibold text-fg">{t("experience")}</h2>
          <ol className="mt-4 space-y-6 border-l border-border pl-6">
            {person.experience.map((exp) => (
              <li key={exp.id} className="relative">
                <span className="absolute top-1.5 -left-[29px] size-2 rounded-full bg-accent" />
                <p className="font-medium text-fg">
                  {locale === "fa" ? exp.roleFa : exp.roleEn}{" "}
                  <span className="text-fg-muted">— {exp.organization}</span>
                </p>
                <p className="font-mono text-xs text-fg-muted">
                  {new Date(exp.startDate).getFullYear()}
                  {" – "}
                  {exp.endDate ? new Date(exp.endDate).getFullYear() : "present"}
                </p>
                {(locale === "fa" ? exp.descriptionFa : exp.descriptionEn) && (
                  <p className="mt-1 text-sm text-fg-muted">
                    {locale === "fa" ? exp.descriptionFa : exp.descriptionEn}
                  </p>
                )}
              </li>
            ))}
          </ol>
        </section>
      )}

      {person.skills.length > 0 && (
        <section className="mt-12">
          <h2 className="font-display text-xl font-semibold text-fg">{t("skills")}</h2>
          <div className="mt-4 space-y-4">
            {Object.entries(skillsByCategory).map(
              ([category, skills]) =>
                skills.length > 0 && (
                  <div key={category}>
                    <p className="font-mono text-xs tracking-widest text-fg-muted uppercase">
                      {category}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {skills.map((skill) => (
                        <Badge key={skill.id} variant="secondary">
                          {skill.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ),
            )}
          </div>
        </section>
      )}
    </div>
  );
}
