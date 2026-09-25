import { z } from "zod";
import {
  CRM_CUSTOMER_STATUSES,
  CRM_DELIVERY_STATUSES,
  CRM_FUNNEL_STAGES,
  CRM_INTERACTION_TYPES,
  CRM_NOTE_KINDS,
} from "@/lib/crm/types";

export const crmProjectTypeSchema = z
  .object({
    nameEn: z.string().trim().optional().default(""),
    nameFa: z.string().trim().optional().default(""),
  })
  .superRefine((data, ctx) => {
    if (!data.nameEn.trim() && !data.nameFa.trim()) {
      ctx.addIssue({ code: "custom", message: "نام دسته لازم است.", path: ["nameFa"] });
    }
  });

export const crmTrackedProjectSchema = z
  .object({
    nameEn: z.string().trim().optional().default(""),
    nameFa: z.string().trim().optional().default(""),
    clientNameEn: z.string().trim().optional().default(""),
    clientNameFa: z.string().trim().optional().default(""),
    typeId: z.string().uuid("یک دسته انتخاب کنید."),
    progress: z.coerce.number().int().min(0).max(100).optional().default(0),
    status: z.enum(CRM_DELIVERY_STATUSES),
    deliveryDate: z.string().optional().nullable(),
    completedAt: z.string().optional().nullable(),
    revenue: z.coerce.number().nonnegative().optional().nullable(),
    isNewCustomer: z.boolean(),
    showOnPublic: z.boolean(),
    coverImageUrl: z.string().optional().nullable(),
    quoteEn: z.string().optional().nullable(),
    quoteFa: z.string().optional().nullable(),
  })
  .superRefine((data, ctx) => {
    if (!data.nameEn.trim() && !data.nameFa.trim()) {
      ctx.addIssue({ code: "custom", message: "نام پروژه لازم است.", path: ["nameFa"] });
    }
    if (!data.clientNameEn.trim() && !data.clientNameFa.trim()) {
      ctx.addIssue({ code: "custom", message: "نام مشتری لازم است.", path: ["clientNameFa"] });
    }
  });

export const crmFunnelMonthSchema = z.object({
  month: z.string().min(1),
  FIRST_CONTACT: z.coerce.number().int().min(0),
  QUALIFIED: z.coerce.number().int().min(0),
  PROPOSAL: z.coerce.number().int().min(0),
  IN_PROGRESS: z.coerce.number().int().min(0),
  DELIVERED: z.coerce.number().int().min(0),
});

export const crmSettingsSchema = z.object({
  publicReportEnabled: z.boolean(),
  customerSatisfaction: z.coerce.number().min(0).max(100).optional().nullable(),
});

export { CRM_FUNNEL_STAGES };

const emptyToNull = (v: unknown) => {
  if (v == null) return null;
  if (typeof v !== "string") return v;
  const t = v.trim();
  return t === "" ? null : t;
};

export const crmCustomerSchema = z.object({
  name: z.string().trim().min(1, "نام لازم است."),
  phone: z.preprocess(emptyToNull, z.string().max(40).nullable()),
  email: z.preprocess(
    emptyToNull,
    z.string().email("ایمیل نامعتبر است.").max(200).nullable(),
  ),
  company: z.preprocess(emptyToNull, z.string().max(200).nullable()),
  status: z.enum(CRM_CUSTOMER_STATUSES),
});

export const crmCustomerNoteSchema = z
  .object({
    kind: z.enum(CRM_NOTE_KINDS),
    title: z.preprocess(emptyToNull, z.string().max(200).nullable()),
    body: z.string().trim().min(1, "متن لازم است."),
    interactionType: z.preprocess(
      emptyToNull,
      z.enum(CRM_INTERACTION_TYPES).nullable(),
    ),
    occurredAt: z.preprocess(emptyToNull, z.string().nullable()),
  })
  .superRefine((data, ctx) => {
    if (data.kind === "WORK" && !data.title) {
      ctx.addIssue({ code: "custom", message: "عنوان کار لازم است.", path: ["title"] });
    }
    if (data.kind === "INTERACTION" && !data.interactionType) {
      ctx.addIssue({
        code: "custom",
        message: "نوع تعامل را انتخاب کنید.",
        path: ["interactionType"],
      });
    }
  });
