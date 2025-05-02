import { Button, Heading, HStack, VStack, Link } from "@chakra-ui/react";
import { FaPlus } from "react-icons/fa6";
import RecipeList from "@/components/recipe/RecipeList";
import { getAllRecipes } from "@/services/recipe";

export const dynamic = "force-dynamic";

export default async function RecipePage() {
  const recipes = await getAllRecipes();
  const serializedRecipes = recipes.map((recipe) => ({
    ...recipe,
    createdAt: recipe.createdAt?.toDate().toISOString(),
    updatedAt: recipe.updatedAt?.toDate().toISOString(),
  }));

  return (
    <VStack
      width={"100%"}
      alignItems={"stretch"}
      minW={"620px"}
      maxW={"1200px"}
    >
      <HStack justifyContent={"space-between"} pb={2}>
        <Heading size={"3xl"}>食譜</Heading>
        <Link href="/recipe/create">
          <Button size={"md"} colorPalette={"teal"}>
            <FaPlus />
            新增食譜
          </Button>
        </Link>
      </HStack>
      <RecipeList recipes={serializedRecipes} />
    </VStack>
  );
}
