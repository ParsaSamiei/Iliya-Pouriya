-- Lab status board fields on projects.

CREATE TYPE "ProjectStatus" AS ENUM ('ACTIVE', 'FIELD', 'COMPLETE');

ALTER TABLE "projects"
ADD COLUMN IF NOT EXISTS "status" "ProjectStatus" NOT NULL DEFAULT 'ACTIVE',
ADD COLUMN IF NOT EXISTS "status_updated_at" TIMESTAMP(3),
ADD COLUMN IF NOT EXISTS "show_on_status_board" BOOLEAN NOT NULL DEFAULT true;

-- Featured published work starts as Active; other published work as Complete.
UPDATE "projects"
SET
  "status" = CASE
    WHEN "is_featured" = true AND "published_at" IS NOT NULL THEN 'ACTIVE'::"ProjectStatus"
    WHEN "published_at" IS NOT NULL THEN 'COMPLETE'::"ProjectStatus"
    ELSE 'ACTIVE'::"ProjectStatus"
  END,
  "status_updated_at" = COALESCE("published_at", CURRENT_TIMESTAMP)
WHERE "status_updated_at" IS NULL;

CREATE INDEX IF NOT EXISTS "projects_show_on_status_board_status_idx"
ON "projects"("show_on_status_board", "status");
