import { BreadCrumbs } from "@/components/layout/BreadCrumbs";
import { MainLayout } from "@/components/layout/MainLayout";

export default function Layout(props: { children: React.ReactNode }) {
  return (
    <MainLayout>
      <BreadCrumbs />
      {props.children}
    </MainLayout>
  );
}
