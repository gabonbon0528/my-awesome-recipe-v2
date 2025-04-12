"use client";
import { Button, Heading, HStack } from "@chakra-ui/react";
import Link from "next/link";

export default function DetailHeader({ isCreate }: { isCreate: boolean }) {
  return (
    <HStack justifyContent={"space-between"} pb={4}>
      <Heading size={"3xl"}>
        {isCreate ? "新增原料" : "編輯原料"}
      </Heading>
      <HStack>
        <Link href="/ingredient">
          <Button size={"md"} colorPalette={"teal"} variant={"outline"}>
            返回
          </Button>
        </Link>
        <Button size={"md"} colorPalette={"teal"} type="submit">
          {isCreate ? "新增" : "儲存"}
        </Button>
      </HStack>
    </HStack>
  );
}
