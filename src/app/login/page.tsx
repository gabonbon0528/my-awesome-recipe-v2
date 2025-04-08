import { Flex, Text } from "@chakra-ui/react";
import LoginButton from "../../components/Login/LoginButton";

export default function LoginPage() {
  return (
    <Flex flexDirection={"column"} gap={4} width={"100%"}>
      <Text>LoginPage</Text>
      <LoginButton />
    </Flex>
  );
}
