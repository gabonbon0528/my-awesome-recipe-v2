"use client";
import { Button } from "@chakra-ui/react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function LoginButton() {
  const { data: session } = useSession();
  const isLoggedIn = session?.user?.id;

  if (!isLoggedIn) {
    return (
      <Link href="/login">
        <Button>登入</Button>
      </Link>
    );
  }

  return <Button onClick={() => signOut()}>登出</Button>;
}
