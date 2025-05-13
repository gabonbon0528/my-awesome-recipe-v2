import { VStack } from "@chakra-ui/react";
import IngredientButton from "./IngredientButton";
import RecipeButton from "./RecipeButton";
import UserButton from "./UserButton";

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className={"flex min-h-screen max-w-screen"}>
      <Sidebar />
      <VStack
        padding={4}
        alignItems={"flex-start"}
        gap={4}
        flex={1}
        overflowY={"auto"}
        height={"100vh"}
      >
        {children}
      </VStack>
    </div>
  );
};

export const Sidebar = async () => {
  return (
    <VStack
      gap={2}
      padding={2}
      bg={"teal"}
      position={"sticky"}
      top={0}
      className={"text-white w-14 h-screen"}
    >
      <UserButton />
      <RecipeButton />
      <IngredientButton />
    </VStack>
  );
};
