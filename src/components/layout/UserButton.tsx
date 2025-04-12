"use client";
import { Avatar } from "@chakra-ui/react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function UserButton() {
  const [pressTimer, setPressTimer] = useState<NodeJS.Timeout | null>(null);
  const router = useRouter();

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
        <Avatar.Fallback name="Segun Adebayo" />
        <Avatar.Image src="https://bit.ly/sage-adebayo" />
      </Avatar.Root>
    </Link>
  );
}
