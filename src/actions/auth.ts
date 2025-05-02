"use server";

import { db } from "@/config/firebase";
import { SignupFormSchema, LoginFormSchema } from "@/lib/definitions";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import bcrypt from "bcryptjs";
import { signIn, signOut } from "@/auth";

//使用映射類型（Mapped Type）來避免重複定義相似的欄位
export type FormState = {
  errors?:
    | {
        [key in "username" | "email" | "password" | "message"]?:
          | string
          | string[];
      }
    | null;
};

export async function signup(state: FormState, formData: FormData) {
  // Validate form fields
  const validatedFields = SignupFormSchema.safeParse({
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { username, email, password } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    // 使用 Firebase 儲存使用者資料
    const usersRef = collection(db, "users");
    const docRef = await addDoc(usersRef, {
      username,
      email,
      password: hashedPassword,
      createdAt: new Date(),
    });

    if (!docRef.id) {
      return {
        error: "建立帳號時發生錯誤",
      };
    }
  } catch (error) {
    console.error("Signup error:", error);
    return {
      error: "註冊失敗，此 Email 可能已被使用",
    };
  }

  const usersRef = collection(db, "users");
  const q = query(usersRef, where("email", "==", email));
  const querySnapshot = await getDocs(q);

  const userId = querySnapshot.docs[0].id;

  const userData = {
    email: email,
    username: username,
    id: userId,
    redirectTo: "/recipe",
  };

  // 註冊成功後自動登入
  await signIn("credentials", userData);
  return { errors: null };
}

export async function login(state: FormState, formData: FormData) {
  const validatedFields = LoginFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    } as FormState;
  }

  const { email, password } = validatedFields.data;

  const usersRef = collection(db, "users");
  const q = query(usersRef, where("email", "==", email));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    return {
      errors: { email: "沒有此帳號" },
    };
  }

  const userDoc = querySnapshot.docs[0];
  const user = userDoc.data();
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return {
      errors: { password: "密碼錯誤" },
    };
  }

  const userId = userDoc.id;
  const username = user.username;

  const userData = {
    email: email,
    username: username,
    id: userId,
    redirectTo: "/recipe",
  };

  //try catch 會影響 redirectTo 的行為

  await signIn("credentials", userData);
  return { errors: null };
}

export async function logout() {
  "use server";
  await signOut();
}
