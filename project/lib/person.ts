type PersonNames = { nameEn: string; nameFa: string };

export function getPersonName(person: PersonNames, locale: string): string {
  return locale === "fa" ? person.nameFa : person.nameEn;
}

export function formatPersonList(people: PersonNames[], locale: string): string {
  const separator = locale === "fa" ? "، " : ", ";
  return people.map((person) => getPersonName(person, locale)).join(separator);
}

export function getPersonInitials(person: PersonNames, locale: string): string {
  return getPersonName(person, locale)
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("");
}
