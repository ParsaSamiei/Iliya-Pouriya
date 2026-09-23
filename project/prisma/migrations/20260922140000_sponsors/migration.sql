-- Partners / sponsors shown in the site footer (admin-managed).

CREATE TABLE IF NOT EXISTS "sponsors" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "logo_url" TEXT,
    "url" TEXT,
    "is_published" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sponsors_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "sponsors_is_published_sort_order_idx"
ON "sponsors"("is_published", "sort_order");
