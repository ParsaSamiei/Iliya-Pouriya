import { z } from "zod";
import {
  CRM_DELIVERY_STATUSES,
  CRM_FUNNEL_STAGES,
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
