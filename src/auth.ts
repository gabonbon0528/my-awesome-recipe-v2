import NextAuth, { Session } from "next-auth";
import Credentials from "next-auth/providers/credentials";

type User = {
  id: string;
  email: string;
  username: string;
};

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
        email: { type: "email", label: "Email" },
        username: { type: "username", label: "Username" },
        id: { type: "id", label: "Id" },
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
      // 將 token 中的使用者資料存入 session
      if (token.user) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.username = token.username;
      }
      return session;
    },
    async jwt({ token, user }) {
      // 將所有使用者資料存入 token
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.username = user.username;
      }
      return token;
    },

    // async session({ session, token }) {
    //   if (token.sub && session.user) {
    //     session.user.id = token.sub;
    //   }
    //   return session;
    // },
  },
});
