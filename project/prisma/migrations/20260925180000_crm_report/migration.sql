-- CRM delivery report: tracked projects, types, funnel, public visibility.

CREATE TYPE "crm_delivery_status" AS ENUM ('ON_TRACK', 'AT_RISK', 'DELAYED', 'DELIVERED', 'FAILED');
CREATE TYPE "crm_funnel_stage" AS ENUM ('FIRST_CONTACT', 'QUALIFIED', 'PROPOSAL', 'IN_PROGRESS', 'DELIVERED');

CREATE TABLE "crm_settings" (
    "id" TEXT NOT NULL,
    "public_report_enabled" BOOLEAN NOT NULL DEFAULT false,
    "customer_satisfaction" DOUBLE PRECISION,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "crm_settings_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "crm_project_types" (
    "id" TEXT NOT NULL,
    "name_en" TEXT NOT NULL,
    "name_fa" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "crm_project_types_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "crm_tracked_projects" (
    "id" TEXT NOT NULL,
    "name_en" TEXT NOT NULL,
    "name_fa" TEXT NOT NULL,
    "client_name_en" TEXT NOT NULL,
    "client_name_fa" TEXT NOT NULL,
    "type_id" TEXT NOT NULL,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "status" "crm_delivery_status" NOT NULL DEFAULT 'ON_TRACK',
    "delivery_date" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),
    "revenue" DECIMAL(14,2),
    "is_new_customer" BOOLEAN NOT NULL DEFAULT false,
    "show_on_public" BOOLEAN NOT NULL DEFAULT false,
    "cover_image_url" TEXT,
    "quote_en" TEXT,
    "quote_fa" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "crm_tracked_projects_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "crm_funnel_entries" (
    "id" TEXT NOT NULL,
    "month" TIMESTAMP(3) NOT NULL,
    "stage" "crm_funnel_stage" NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "crm_funnel_entries_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "crm_project_types_sort_order_idx" ON "crm_project_types"("sort_order");

CREATE INDEX "crm_tracked_projects_status_completed_at_idx" ON "crm_tracked_projects"("status", "completed_at");
CREATE INDEX "crm_tracked_projects_type_id_idx" ON "crm_tracked_projects"("type_id");
CREATE INDEX "crm_tracked_projects_show_on_public_idx" ON "crm_tracked_projects"("show_on_public");

CREATE UNIQUE INDEX "crm_funnel_entries_month_stage_key" ON "crm_funnel_entries"("month", "stage");
CREATE INDEX "crm_funnel_entries_month_idx" ON "crm_funnel_entries"("month");

ALTER TABLE "crm_tracked_projects"
ADD CONSTRAINT "crm_tracked_projects_type_id_fkey"
FOREIGN KEY ("type_id") REFERENCES "crm_project_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

INSERT INTO "crm_settings" ("id", "public_report_enabled", "customer_satisfaction", "updated_at")
VALUES ('default', false, NULL, CURRENT_TIMESTAMP)
ON CONFLICT ("id") DO NOTHING;
