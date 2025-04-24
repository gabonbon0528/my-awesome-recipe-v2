import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { db } from "@/config/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import bcrypt from "bcryptjs";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { type: "email" },
        username: { type: "text" },
        id: { type: "text" },
      },
      authorize: async (credentials) => {
        try {
          const { email, username, id } = credentials;

          return {
            email: email as string,
            username: username as string,
            id: id as string,
          };
        } catch (error) {
          console.error("Login error:", error);
          return {
            errors: { message: "登入失敗" },
          };
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
});
