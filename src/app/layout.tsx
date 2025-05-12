import { Provider } from "../components/ui/provider";
import "../app/globals.css";
import { Toaster } from "../components/ui/toaster";
import { SessionProvider } from "next-auth/react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning>
      <body>
        <SessionProvider>
          <Provider>
            <Toaster />
            {children}
          </Provider>
        </SessionProvider>
        <div id="modal-root"></div>
      </body>
    </html>
  );
}
