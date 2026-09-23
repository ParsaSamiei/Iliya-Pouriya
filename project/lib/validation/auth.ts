import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export type LoginInput = z.infer<typeof loginSchema>;

const emailField = z
  .string()
  .trim()
  .max(254, "Enter a shorter email.")
  .refine((value) => z.string().email().safeParse(value).success, {
    message: "Enter a valid email.",
  })
  .transform((value) => value.toLowerCase());

export const changeEmailSchema = z.object({
  email: emailField,
  currentPassword: z.string().min(1, "Enter your current password."),
});

export type ChangeEmailInput = z.infer<typeof changeEmailSchema>;

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Enter your current password."),
    newPassword: z
      .string()
      .min(8, "Use at least 8 characters.")
      .max(128, "Use at most 128 characters."),
    confirmPassword: z.string().min(1, "Confirm the new password."),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "New passwords do not match.",
    path: ["confirmPassword"],
  });

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
