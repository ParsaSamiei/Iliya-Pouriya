import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CrmCustomerDetail } from "@/components/admin/crm-customer-detail";
import { countsFromKinds, serializeNote } from "@/lib/crm/customers";
import { db } from "@/lib/db";

type PageProps = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const customer = await db.crmCustomer.findUnique({
    where: { id },
    select: { name: true },
  });
  return { title: customer ? customer.name : "مشتری" };
}

export default async function AdminCrmCustomerPage({ params }: PageProps) {
  const { id } = await params;
  const customer = await db.crmCustomer.findUnique({
    where: { id },
    include: {
      notes: { orderBy: [{ occurredAt: "desc" }, { createdAt: "desc" }] },
    },
  });
  if (!customer) notFound();

  return (
    <CrmCustomerDetail
      customer={{
        id: customer.id,
        name: customer.name,
        phone: customer.phone,
        email: customer.email,
        company: customer.company,
        status: customer.status,
        createdAt: customer.createdAt.toISOString(),
        updatedAt: customer.updatedAt.toISOString(),
        ...countsFromKinds(customer.notes.map((n) => n.kind)),
        notes: customer.notes.map(serializeNote),
      }}
    />
  );
}
