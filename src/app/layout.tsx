import { MainLayout } from "../components/layout/MainLayout";
import { Provider } from "../components/ui/provider";
import "../app/globals.css";
import { Toaster } from "../components/ui/toaster";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning>
      <body>
        <Provider>
          <Toaster />
          <MainLayout>{children}</MainLayout>
        </Provider>
      </body>
    </html>
  );
}
