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
