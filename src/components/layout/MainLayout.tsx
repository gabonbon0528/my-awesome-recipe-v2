import { IconButton, VStack } from "@chakra-ui/react";
import Link from "next/link";
import { FaBookBookmark, FaBurger } from "react-icons/fa6";
import { Tooltip } from "../ui/tooltip";
import UserButton from "./UserButton";

export const Sidebar = async () => {
  return (
    <VStack
      gap={2}
      padding={2}
      bg={"teal"}
      position={"sticky"}
      top={0}
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
