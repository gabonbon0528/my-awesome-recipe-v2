import { MainLayout } from "@/components/layout/MainLayout";

export default function Layout(props: { children: React.ReactNode }) {
  return <MainLayout>{props.children}</MainLayout>;
}
