import { RecipeType, SerializedRecipeType } from "@/types/recipe";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { cache } from "react";
import { db } from "../config/firebase";
import {
  AppError,
  ErrorCode,
  handleError,
  logDebug,
  logError,
  logInfo,
  logWarning,
} from "@/utils/error-handler";

// 集合參考
const recipesCollectionRef = collection(db, "recipes");

// --- 新增一筆食譜 (使用 addDoc，讓 Firestore 自動生成 ID) ---
export async function addRecipe(recipe: SerializedRecipeType) {
  try {
    logDebug("Adding new recipe", { recipeName: recipe.recipeName });

    const newRecipeData = {
      recipeName: recipe.recipeName,
      recipeItems: recipe.recipeItems,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(recipesCollectionRef, newRecipeData);
    logInfo(`Recipe added successfully`, {
      id: docRef.id,
      recipeName: recipe.recipeName,
    });
    return docRef.id;
  } catch (error) {
    throw handleError(error, "addRecipe");
  }
}

// --- 根據 ID 讀取單一食譜---
export async function getRecipeById(recipeId: string) {
  try {
    if (recipeId === "create") return null;
    logDebug("Fetching recipe by ID", { recipeId });

    const recipeDocRef = doc(recipesCollectionRef, recipeId);
    const docSnap = await getDoc(recipeDocRef);

    if (docSnap.exists()) {
      const recipe = {
        ...docSnap.data(),
        id: docSnap.id,
        createdAt: docSnap.data().createdAt?.toDate().toISOString(),
        updatedAt: docSnap.data().updatedAt?.toDate().toISOString(),
      } as SerializedRecipeType;

      logInfo(`Recipe found`, { recipeId, recipeName: recipe.recipeName });
      return recipe;
    } else {
      logWarning(`Recipe not found`, { recipeId });
      throw new AppError(
        `Recipe not found: ${recipeId}`,
        ErrorCode.NOT_FOUND,
        404
      );
    }
  } catch (error) {
    throw handleError(error, "getRecipeById");
  }
}

export const cachedGetRecipeById = cache(async (recipeId: string) => {
  try {
    return await getRecipeById(recipeId);
  } catch (error) {
    logError("Error in cachedGetRecipeById", error);
    throw error;
  }
});

// --- 更新食譜資訊 ---
export async function updateRecipe(
  recipeId: string,
  updateData: Partial<SerializedRecipeType>
) {
  try {
    logDebug("Updating recipe", { recipeId, updateData });

    const recipeDocRef = doc(recipesCollectionRef, recipeId);
    const dataToUpdate = {
      ...updateData,
      updatedAt: serverTimestamp(),
    };

    await updateDoc(recipeDocRef, dataToUpdate);
    logInfo(`Recipe updated successfully`, { recipeId });
  } catch (error) {
    throw handleError(error, "updateRecipe");
  }
}

// --- 讀取所有食譜 ---
export async function getAllRecipes(): Promise<RecipeType[]> {
  try {
    logDebug("Fetching all recipes");

    const querySnapshot = await getDocs(recipesCollectionRef);
    const recipes: RecipeType[] = [];

    querySnapshot.forEach((doc) => {
      recipes.push({ id: doc.id, ...doc.data() } as RecipeType);
    });

    logInfo(`Retrieved ${recipes.length} recipes`);
    return recipes;
  } catch (error) {
    throw handleError(error, "getAllRecipes");
  }
}
