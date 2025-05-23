import { Timestamp } from "firebase/firestore";
import { SerializedIngredientPurchase } from "./ingredients";
import { SerializedTag, Tag } from "./tag";

export interface RecipeItem {
  order: number;
  name: string; // 項目
  originalWeight: number | string; // 原始材料重量
  originalWeightUnit: string; // 原始材料重量單位
  ratio: number | string; // 比例
  purchase: SerializedIngredientPurchase | null; // 購買原料
}

export interface RecipeType {
  id: string;
  recipeName: string;
  recipeItems: RecipeItem[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
  note?: string;
  portion: string;
  topTemperature: string;
  bottomTemperature: string;
  bakingTime: string;
  tags: Tag[];
}

export interface SerializedRecipeType {
  id: string;
  recipeName: string;
  recipeItems: RecipeItem[];
  createdAt: string;
  updatedAt: string;
  note?: string;
  portion: string;
  topTemperature: string;
  bottomTemperature: string;
  bakingTime: string;
  tags: SerializedTag[];
}
