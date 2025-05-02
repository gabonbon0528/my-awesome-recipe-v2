"use client";
import { Avatar } from "@chakra-ui/react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function UserButton() {
  const [pressTimer, setPressTimer] = useState<NodeJS.Timeout | null>(null);
  const router = useRouter();
  const session = useSession();
  const user = session?.data?.user as { username: string };
  console.log("💗💗💗", user);

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
        <Avatar.Image src="https://image1.gamme.com.tw/news2/2017/31/14/rJeapKCXlKCZrKQ.jpg" />
      </Avatar.Root>
    </Link>
  );
}
