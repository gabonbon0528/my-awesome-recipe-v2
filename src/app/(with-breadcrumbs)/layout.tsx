import { BreadCrumbs } from "@/components/layout/BreadCrumbs";
import LoginButton from "@/components/layout/LoginButton";
import { Sidebar } from "@/components/layout/MainLayout";
import { HStack, VStack } from "@chakra-ui/react";

export default function Layout(props: { children: React.ReactNode }) {
  return (
    <div className={"flex min-h-screen max-w-screen"}>
      <Sidebar />
      <VStack
        padding={4}
        alignItems={"flex-start"}
        gap={4}
        flex={1}
        overflowY={"auto"}
        height={"100vh"}
      >
        <HStack w={"100%"} justifyContent={"space-between"}>
          <BreadCrumbs />
          <LoginButton />
        </HStack>
        {props.children}
      </VStack>
    </div>
  );
}
