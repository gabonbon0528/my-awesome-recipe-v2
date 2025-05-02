import { Sidebar } from "@/components/layout/MainLayout";
import { Box } from "@chakra-ui/react";

export default function Layout(props: { children: React.ReactNode }) {
  return (
    <div className={"flex min-h-screen max-w-screen"}>
      <Sidebar />
      <Box p={4} flex={1} overflowY={"auto"} height={"100vh"}>
        {props.children}
      </Box>
    </div>
  );
}
