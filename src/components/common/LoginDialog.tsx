"use client";

import { Button, CloseButton, Dialog, Portal } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

type Props = {
  trigger: React.ReactNode;
};

export default function LoginDialog(props: Props) {
  const { trigger } = props;
  const router = useRouter();
  return (
    <Dialog.Root>
      <Dialog.Trigger>{trigger}</Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>請先登入。</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <p>本功能需要先登入。</p>
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button variant="outline">取消</Button>
              </Dialog.ActionTrigger>
              <Button onClick={() => router.push("/login")}>登入</Button>
            </Dialog.Footer>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
