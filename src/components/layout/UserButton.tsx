"use client";
import { Avatar } from "@chakra-ui/react";
import Link from "next/link";

export default function UserButton() {

  return (
    <Link href="/">
      <Avatar.Root size={"md"}>
        <Avatar.Fallback name="Segun Adebayo" />
        <Avatar.Image src="https://bit.ly/sage-adebayo" />
      </Avatar.Root>
    </Link>
  );
}
