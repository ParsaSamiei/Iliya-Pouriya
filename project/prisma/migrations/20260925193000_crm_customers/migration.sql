-- CRM customers: contact records, status, interaction/work/internal notes.

CREATE TYPE "crm_customer_status" AS ENUM ('LEAD', 'ACTIVE', 'PAST', 'INACTIVE');
CREATE TYPE "crm_note_kind" AS ENUM ('INTERACTION', 'WORK', 'INTERNAL');
CREATE TYPE "crm_interaction_type" AS ENUM ('CALL', 'EMAIL', 'MEETING', 'MESSAGE', 'OTHER');

CREATE TABLE "crm_customers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT,
    "company" TEXT,
    "status" "crm_customer_status" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "crm_customers_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "crm_customer_notes" (
    "id" TEXT NOT NULL,
    "customer_id" TEXT NOT NULL,
    "kind" "crm_note_kind" NOT NULL,
    "title" TEXT,
    "body" TEXT NOT NULL,
    "interaction_type" "crm_interaction_type",
    "occurred_at" TIMESTAMP(3),
    "author_email" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "crm_customer_notes_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "crm_customers_status_updated_at_idx" ON "crm_customers"("status", "updated_at");
CREATE INDEX "crm_customer_notes_customer_id_kind_created_at_idx" ON "crm_customer_notes"("customer_id", "kind", "created_at");

ALTER TABLE "crm_customer_notes"
ADD CONSTRAINT "crm_customer_notes_customer_id_fkey"
FOREIGN KEY ("customer_id") REFERENCES "crm_customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
