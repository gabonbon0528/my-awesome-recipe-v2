"use client";

import { IconButton } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { IconType } from "react-icons";
import LoginDialog from "../common/LoginDialog";
import { Tooltip } from "../ui/tooltip";

interface SidebarButtonProps {
  href: string;
  icon: IconType;
  tooltipContent: string;
}

export function SidebarButton({ href, icon: Icon, tooltipContent }: SidebarButtonProps) {
  const session = useSession();
  const isLoggedIn = session.status === "authenticated";

  const button = (
    <IconButton rounded="full" colorPalette="teal">
      <Icon />
    </IconButton>
  );

  if (!isLoggedIn) {
    return <LoginDialog trigger={button} />;
  }

  return (
    <Link href={href}>
      <Tooltip content={tooltipContent} interactive>
        {button}
      </Tooltip>
    </Link>
  );
} 