import { IconButton, VStack } from "@chakra-ui/react";
import Link from "next/link";
import { FaBookBookmark, FaBurger } from "react-icons/fa6";
import { Tooltip } from "../ui/tooltip";
import { BreadCrumbs } from "./BreadCrumbs";
import UserButton from "./UserButton";

export const MainLayout = (props: { children: React.ReactNode }) => {
  return (
    <div className={"flex min-h-screen max-w-screen"}>
      <Sidebar />
      <VStack padding={4} alignItems={"flex-start"} gap={4} flex={1}>
        <BreadCrumbs />
        {props.children}
      </VStack>
    </div>
  );
};

export const Sidebar = () => {
  return (
    <VStack
      padding={2}
      gap={2}
      bg={"teal"}
      className={"text-white w-14 h-screen"}
    >
      <UserButton />
      <Link href="/ingredient">
        <Tooltip content="原料" interactive>
          <IconButton rounded="full" colorPalette="teal">
            <FaBurger />
          </IconButton>
        </Tooltip>
      </Link>
      <Link href="/recipe">
        <Tooltip content="食譜" interactive>
          <IconButton rounded="full" colorPalette="teal">
            <FaBookBookmark />
          </IconButton>
        </Tooltip>
      </Link>
    </VStack>
  );
};
