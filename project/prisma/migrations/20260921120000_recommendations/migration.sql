-- Third-party recommendations shown on the public homepage.

CREATE TABLE IF NOT EXISTS "recommendations" (
    "id" TEXT NOT NULL,
    "quote_en" TEXT NOT NULL,
    "quote_fa" TEXT NOT NULL,
    "author_name_en" TEXT NOT NULL,
    "author_name_fa" TEXT NOT NULL,
    "author_role_en" TEXT,
    "author_role_fa" TEXT,
    "author_photo_url" TEXT,
    "author_url" TEXT,
    "is_published" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "recommendations_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "recommendations_is_published_sort_order_idx"
ON "recommendations"("is_published", "sort_order");
