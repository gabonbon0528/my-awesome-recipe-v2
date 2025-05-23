import { z } from "zod";

export const SignupFormSchema = z.object({
  username: z.string().min(2, { message: "至少2個字" }).trim(),
  email: z.string().email({ message: "請輸入有效的電子郵件" }).trim(),
  password: z
    .string()
    .min(8, { message: "至少8個字" })
    // .regex(/[a-zA-Z]/, { message: "至少包含一個字母" })
    // .regex(/[0-9]/, { message: "至少包含一個數字" })
    // .regex(/[^a-zA-Z0-9]/, {
    //   message: "至少包含一個特殊字元",
    // })
    .trim(),
});

export const LoginFormSchema = z.object({
  email: z.string().email({ message: "請輸入有效的電子郵件" }).trim(),
  password: z
    .string()
    .min(8, { message: "至少8個字" })
    .trim(),
});

export const tagSchema = z.object({
  name: z.string().min(1),
  group: z.string().optional(),
  aliases: z.array(z.string()).optional(),
  translations: z.record(z.string()).optional(),
  usageCount: z.number().optional(),
  lastUsedAt: z.date().optional(),
  visible: z.boolean().optional(),
  status: z.enum(["active", "archived", "pending"]).optional(),
  color: z.string().optional(),
  icon: z.string().optional(),
  createdBy: z.string().optional(),
  createdAt: z.date().optional()
});

// export type TagInput = z.infer<typeof tagSchema>;
