const PERSIAN_DIGITS = "۰۱۲۳۴۵۶۷۸۹";
const ARABIC_DIGITS = "٠١٢٣٤٥٦٧٨٩";

export function toWesternDigits(value: string): string {
  return value
    .replace(/[۰-۹]/g, (char) => String(PERSIAN_DIGITS.indexOf(char)))
    .replace(/[٠-٩]/g, (char) => String(ARABIC_DIGITS.indexOf(char)));
}

export function normalizePhoneForTel(phone: string): string {
  return toWesternDigits(phone).replace(/[\s\-()]/g, "");
}
