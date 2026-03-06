import { z } from "zod";

const createUserSchema = z.object({
    username: z
        .string()
        .trim()
        .min(3, "Username must be at least 3 characters")
        .max(50, "Username must be at most 50 characters"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

const changePasswordSchema = z.object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(6, "New password must be at least 6 characters"),
});

export { createUserSchema, changePasswordSchema };
