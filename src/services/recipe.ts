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

// 集合參考
const recipesCollectionRef = collection(db, "recipes");

// --- 新增一筆食譜 (使用 addDoc，讓 Firestore 自動生成 ID) ---
export async function addRecipe(recipe: SerializedRecipeType) {
  try {
    const newRecipeData = {
      recipeName: recipe.recipeName,
      recipeItems: recipe.recipeItems,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    const docRef = await addDoc(recipesCollectionRef, newRecipeData);
    console.log(`食譜已成功添加，ID: ${docRef.id}`);
    return docRef.id;
  } catch (error) {
    console.error("添加食譜時出錯: ", error);
    return null;
  }
}

// --- 根據 ID 讀取單一食譜---
export async function getRecipeById(recipeId: string) {
  try { 
    const recipeDocRef = doc(recipesCollectionRef, recipeId);
    const docSnap = await getDoc(recipeDocRef);
    if (docSnap.exists()) {
      return {
        ...docSnap.data(),
        id: docSnap.id,
        createdAt: docSnap.data().createdAt?.toDate().toISOString(),
        updatedAt: docSnap.data().updatedAt?.toDate().toISOString(),
      } as SerializedRecipeType;
    } else {
      console.log(`找不到食譜: ${recipeId}`);
      return null;
    }
  } catch (error) {
    console.error(`讀取食譜 '${recipeId}' 時出錯: `, error);
    return null;
  }
}

export const cachedGetRecipeById = cache(async (recipeId: string) => {
  const recipe = await getRecipeById(recipeId);
  // if (!recipe) notFound();
  return recipe;
});

// --- 更新食譜資訊 (例如：更新食譜名稱) ---
export async function updateRecipe(
  recipeId: string,
  updateData: Partial<SerializedRecipeType>
) {
  const recipeDocRef = doc(recipesCollectionRef, recipeId);
  const dataToUpdate = {
    ...updateData,
    updatedAt: serverTimestamp(),
  };
  try {
    await updateDoc(recipeDocRef, dataToUpdate);
    console.log(`食譜 '${recipeId}' 的資訊已更新`);
  } catch (error) {
    console.error(`更新食譜 '${recipeId}' 時出錯: `, error);
  }
}

// --- 讀取所有食譜 ---
export async function getAllRecipes(): Promise<RecipeType[]> {
  try {
    const querySnapshot = await getDocs(recipesCollectionRef);
    const recipes: RecipeType[] = [];
    querySnapshot.forEach((doc) => {
      recipes.push({ id: doc.id, ...doc.data() } as RecipeType);
    });
    console.log("所有食譜:", recipes);
    return recipes;
  } catch (error) {
    console.error("讀取所有食譜時出錯: ", error);
    return [];
  }
}
