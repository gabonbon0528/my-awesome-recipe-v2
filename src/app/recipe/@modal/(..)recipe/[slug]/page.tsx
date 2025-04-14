"use client";
import { useRouter } from "next/navigation";
import { getRecipeById } from "@/services/recipe";
import { useEffect, useState } from "react";
import { SerializedRecipeType } from "@/types/recipe";

export default function RecipeModal({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const [recipe, setRecipe] = useState<SerializedRecipeType | null>(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const data = await getRecipeById(params.slug);
        setRecipe(data);
      } catch (error) {
        console.error("Error fetching recipe:", error);
      }
    };
    fetchRecipe();
  }, [params.slug]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-lg max-w-2xl w-full">
        <h2 className="text-2xl font-bold mb-4">🍽️ {recipe?.recipeName || "載入中..."}</h2>
        {recipe ? (
          <div>
            <p className="mb-4">這是用 modal 顯示的內容。</p>
            <div className="mt-4">
              <button
                onClick={() => router.back()}
                className="px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600"
              >
                關閉
              </button>
            </div>
          </div>
        ) : (
          <p>載入中...</p>
        )}
      </div>
    </div>
  );
}