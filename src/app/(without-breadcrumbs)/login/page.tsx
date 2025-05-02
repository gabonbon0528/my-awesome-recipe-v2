import LoginButton from "@/components/login/LoginButton";
import LoginForm from "@/components/login/LoginForm";
import { Flex, Text } from "@chakra-ui/react";

export default function LoginPage() {
  return (
    <Flex flexDirection={"column"} gap={4} width={"100%"}>
      <Text>LoginPage</Text>
      <LoginForm />
      {/* <LoginButton /> */}
    </Flex>
  );
}
