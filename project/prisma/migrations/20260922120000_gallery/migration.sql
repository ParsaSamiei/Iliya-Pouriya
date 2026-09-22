-- CreateEnum
CREATE TYPE "gallery_media_type" AS ENUM ('IMAGE', 'VIDEO');

-- CreateTable
CREATE TABLE "gallery_items" (
    "id" TEXT NOT NULL,
    "media_type" "gallery_media_type" NOT NULL DEFAULT 'IMAGE',
    "image_url" TEXT,
    "video_url" TEXT,
    "alt_en" TEXT,
    "alt_fa" TEXT,
    "caption_en" TEXT,
    "caption_fa" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "gallery_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gallery_tags" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name_en" TEXT NOT NULL,
    "name_fa" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "gallery_tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gallery_item_tags" (
    "item_id" TEXT NOT NULL,
    "tag_id" TEXT NOT NULL,

    CONSTRAINT "gallery_item_tags_pkey" PRIMARY KEY ("item_id","tag_id")
);

-- CreateIndex
CREATE INDEX "gallery_items_sort_order_idx" ON "gallery_items"("sort_order");

-- CreateIndex
CREATE UNIQUE INDEX "gallery_tags_slug_key" ON "gallery_tags"("slug");

-- CreateIndex
CREATE INDEX "gallery_tags_is_active_sort_order_idx" ON "gallery_tags"("is_active", "sort_order");

-- CreateIndex
CREATE INDEX "gallery_item_tags_tag_id_idx" ON "gallery_item_tags"("tag_id");

-- AddForeignKey
ALTER TABLE "gallery_item_tags" ADD CONSTRAINT "gallery_item_tags_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "gallery_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gallery_item_tags" ADD CONSTRAINT "gallery_item_tags_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "gallery_tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;
