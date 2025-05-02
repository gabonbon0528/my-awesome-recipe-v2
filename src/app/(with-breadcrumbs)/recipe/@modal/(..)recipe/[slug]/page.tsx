import { getAllRecipes, getRecipeById } from "@/services/recipe";
import ReceiptModal from "@/components/recipe/ReceiptModal";

export default async function RecipeModal({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const recipe = await getRecipeById(slug);

  if (!recipe) return <p>載入中...</p>;

  return <ReceiptModal recipe={recipe} />;
}

export async function generateStaticParams() {
  const recipes = await getAllRecipes();
  return recipes.map((recipe) => ({
    slug: recipe.id,
  }));
}
