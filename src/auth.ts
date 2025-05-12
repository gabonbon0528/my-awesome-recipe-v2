import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

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
        id: { type: "text", label: "Id" },
        imgUrl: { type: "text", label: "ImgUrl" },
      },
      // 步驟 1: 使用者資料的起點
      // 當使用者提交登入表單時，這個函數會被調用
      // 在實際應用中，這裡應該要：
      // 1. 連接資料庫驗證使用者憑證
      // 2. 從資料庫獲取完整的使用者資料
      // 3. 回傳資料庫中的使用者資料
      authorize: async (credentials) => {
        try {
          const { email, username, id, imgUrl } = credentials;

          return {
            email: email as string,
            username: username as string,
            id: id as string,
            imgUrl: imgUrl as string,
          };
        } catch (error) {
          console.error("Login error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    // 步驟 2: 將使用者資料存入 JWT token
    // 這個 callback 在使用者登入時被調用
    // token: 目前的 JWT token
    // user: 來自 authorize 函數的返回值
    async jwt({ token, user }) {
      // 將所有使用者資料存入 token
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.username = user.username;
        token.imgUrl = user.imgUrl;
      }
      return token;
    },
    // 步驟 3: 設定 session 中的使用者資料
    // 這個 callback 在每次請求時都會被調用
    // session: 目前的會話資訊
    // token: 包含我們在 jwt callback 中存入的所有資料
    async session({ session, token }) {
      // 將 token 中的使用者資料同步到 session 中
      // 這樣前端才能通過 useSession() 取得完整的使用者資訊
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id as string,
          email: token.email as string,
          username: token.username as string,
          imgUrl: token.imgUrl as string,
        },
      };
    },
  },
});

/**
 * JWT (JSON Web Token) 說明
 *
 * JWT 是一種用於安全傳遞資訊的開放標準，由三個部分組成：
 * 1. Header（標頭）：
 *    - 包含 token 類型和加密演算法
 *    - 例如：{ "alg": "HS256", "typ": "JWT" }
 *
 * 2. Payload（載荷）：
 *    - 包含實際的使用者資料
 *    - 在此檔案中包含：
 *      - id: 使用者 ID
 *      - email: 使用者信箱
 *      - username: 使用者名稱
 *      - iat (issued at): token 建立時間
 *      - exp (expiration): token 過期時間
 *
 * 3. Signature（簽名）：
 *    - 用於驗證 token 的完整性
 *    - 使用 secret 對前兩部分進行加密
 *
 * 運作流程：
 * 1. 使用者登入 -> authorize 函數驗證並回傳使用者資料
 * 2. jwt callback 將使用者資料存入 token
 * 3. token 儲存在瀏覽器 cookie 中
 * 4. 之後的請求都會帶上此 token 進行身份驗證
 *
 * 1. 使用者登入 -> server 驗證成功後產生 JWT -> 儲存在瀏覽器 cookie
 * 2. 之後每次請求 -> NextAuth 從 cookie 讀取 JWT -> 將 JWT 資料同步到 session
 */
