import { Flex } from "@chakra-ui/react";
import RecipeTable from "@/components/recipe/RecipeTable";
import { cachedGetRecipeById, getAllRecipes } from "@/services/recipe";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const isCreate = slug === "create";
  const recipe = await cachedGetRecipeById(slug);

  return (
    <Flex flexDirection={"column"} gap={4} width={"100%"}>
      <RecipeTable isCreate={isCreate} recipe={recipe} recipeId={slug} />
    </Flex>
  );
}

export async function generateStaticParams() {
  const recipes = await getAllRecipes();
  if (!Array.isArray(recipes)) {
    return [];
  }
  return recipes.map((recipe) => ({
    slug: recipe.id,
  }));
}
