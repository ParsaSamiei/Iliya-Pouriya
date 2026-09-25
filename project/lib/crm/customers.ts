import type { CrmCustomerStatus, CrmInteractionType, CrmNoteKind } from "@/lib/crm/types";

export type CrmCustomerListItem = {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  company: string | null;
  status: CrmCustomerStatus;
  createdAt: string;
  updatedAt: string;
  interactionCount: number;
  workCount: number;
  internalCount: number;
};

export type CrmCustomerNoteInput = {
  id: string;
  kind: CrmNoteKind;
  title: string | null;
  body: string;
  interactionType: CrmInteractionType | null;
  occurredAt: string | null;
  authorEmail: string | null;
  createdAt: string;
};

export type CrmCustomerDetail = CrmCustomerListItem & {
  notes: CrmCustomerNoteInput[];
};

export function countsFromKinds(kinds: CrmNoteKind[]) {
  return {
    interactionCount: kinds.filter((k) => k === "INTERACTION").length,
    workCount: kinds.filter((k) => k === "WORK").length,
    internalCount: kinds.filter((k) => k === "INTERNAL").length,
  };
}

export function serializeNote(n: {
  id: string;
  kind: CrmNoteKind;
  title: string | null;
  body: string;
  interactionType: CrmInteractionType | null;
  occurredAt: Date | null;
  authorEmail: string | null;
  createdAt: Date;
}): CrmCustomerNoteInput {
  return {
    id: n.id,
    kind: n.kind,
    title: n.title,
    body: n.body,
    interactionType: n.interactionType,
    occurredAt: n.occurredAt?.toISOString() ?? null,
    authorEmail: n.authorEmail,
    createdAt: n.createdAt.toISOString(),
  };
}
