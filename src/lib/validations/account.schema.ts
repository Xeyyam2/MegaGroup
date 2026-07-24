import { z } from "zod";

export const changeEmailSchema = z.object({
  email: z.string().min(1, "Email məcburidir").email("Email formatı yanlışdır"),
});

export const changePasswordSchema = z.object({
  password: z.string().min(8, "Parol ən azı 8 simvol olmalıdır"),
});

export type ChangeEmailInput = z.input<typeof changeEmailSchema>;
export type ChangePasswordInput = z.input<typeof changePasswordSchema>;
