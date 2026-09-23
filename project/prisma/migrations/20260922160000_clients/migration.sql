-- Organizations / collaborators shown in the homepage "worked with" carousel.

CREATE TABLE IF NOT EXISTS "clients" (
    "id" TEXT NOT NULL,
    "name_en" TEXT NOT NULL,
    "name_fa" TEXT NOT NULL,
    "note_en" TEXT,
    "note_fa" TEXT,
    "logo_url" TEXT,
    "url" TEXT,
    "is_published" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "clients_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "clients_is_published_sort_order_idx"
ON "clients"("is_published", "sort_order");
