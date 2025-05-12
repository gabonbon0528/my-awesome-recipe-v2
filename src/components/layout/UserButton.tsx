"use client";
import { Avatar } from "@chakra-ui/react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function UserButton() {
  const [pressTimer, setPressTimer] = useState<NodeJS.Timeout | null>(null);
  const router = useRouter();
  const { data: session, update } = useSession();
  const user = session?.user as { username: string; imgUrl: string };

  const handleMouseDown = () => {
    const timer = setTimeout(() => {
      router.push("/admin/errors");
    }, 3000);
    setPressTimer(timer);
  };

  const handleMouseUp = () => {
    if (pressTimer) {
      clearTimeout(pressTimer);
      setPressTimer(null);
    }
  };

  const handleMouseLeave = () => {
    if (pressTimer) {
      clearTimeout(pressTimer);
      setPressTimer(null);
    }
  };

  useEffect(() => {
    return () => {
      if (pressTimer) {
        clearTimeout(pressTimer);
      }
    };
  }, [pressTimer]);

  useEffect(() => {
    update();
  }, []);

  return (
    <Link href="/">
      <Avatar.Root
        size={"md"}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleMouseDown}
        onTouchEnd={handleMouseUp}
      >
        <Avatar.Fallback name={user?.username ?? ""} />
        <Avatar.Image src={user?.imgUrl ?? null} />
      </Avatar.Root>
    </Link>
  );
}
