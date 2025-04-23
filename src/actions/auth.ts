"use server";

import { db } from "@/config/firebase";
import {
  SignupFormSchema,
  FormState,
  LoginFormSchema,
} from "@/lib/definitions";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import bcrypt from "bcryptjs";
import { signIn } from "@/auth";

export async function signup(state: FormState, formData: FormData) {
  // Validate form fields
  const validatedFields = SignupFormSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name, email, password } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    // 使用 Firebase 儲存使用者資料
    const usersRef = collection(db, "users");
    const docRef = await addDoc(usersRef, {
      name,
      email,
      password: hashedPassword,
      createdAt: new Date(),
    });

    if (!docRef.id) {
      return {
        error: "建立帳號時發生錯誤",
      };
    }

    // 註冊成功後自動登入
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/dashboard",
    });
  } catch (error) {
    console.error("Signup error:", error);
    return {
      error: "註冊失敗，此 Email 可能已被使用",
    };
  }
}

export async function login(state: FormState, formData: FormData) {
  try {
    const validatedFields = LoginFormSchema.safeParse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
      };
    }

    const { email, password } = validatedFields.data;

    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log("💗💗💗 沒有此帳號");
      return {
        errors: {email: "沒有此帳號"},
      };
    }

    const userDoc = querySnapshot.docs[0];
    const user = userDoc.data();

    const isPasswordValid = await bcrypt.compare(
      password,
      user.password as string
    );

    if (!isPasswordValid) {
      return {
        errors: { password: "密碼錯誤" },
      };
    }

    await signIn("credentials", {
      email,
      password,
    });
  } catch (error) {
    console.error("Login error:", error);
    return {
      errors: { password: "登入失敗" },
    };
  }
}
