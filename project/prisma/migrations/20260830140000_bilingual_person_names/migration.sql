-- Split people.name into name_en / name_fa without losing existing rows.

ALTER TABLE "people" ADD COLUMN IF NOT EXISTS "name_en" TEXT;
ALTER TABLE "people" ADD COLUMN IF NOT EXISTS "name_fa" TEXT;

-- Copy existing English names when present.
UPDATE "people"
SET "name_en" = "name"
WHERE "name_en" IS NULL
  AND EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'people'
      AND column_name = 'name'
  );

UPDATE "people" SET "name_fa" = 'ایلیا زاهدی عبقری' WHERE "slug" = 'iliya' AND "name_fa" IS NULL;
UPDATE "people" SET "name_fa" = 'پوریا افشاری مقدم' WHERE "slug" = 'pouriya' AND "name_fa" IS NULL;

-- Fallback: keep something readable if slug is unexpected.
UPDATE "people"
SET "name_fa" = COALESCE("name_fa", "name_en", '')
WHERE "name_fa" IS NULL;

UPDATE "people"
SET "name_en" = COALESCE("name_en", '')
WHERE "name_en" IS NULL;

ALTER TABLE "people" ALTER COLUMN "name_en" SET NOT NULL;
ALTER TABLE "people" ALTER COLUMN "name_fa" SET NOT NULL;

ALTER TABLE "people" DROP COLUMN IF EXISTS "name";
