import {
  collection,
  doc,
  setDoc,
  addDoc,
  serverTimestamp,
  getDocs,
  query,
  where,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { IngredientPurchase, IngredientType, SerializedIngredientPurchase } from "@/types/ingredients";
import { cache } from "react";
import { notFound } from "next/navigation";

// 集合參考
const typesCollectionRef = collection(db, "ingredientTypes");
const purchasesCollectionRef = collection(db, "purchases");

// --- 新增成分類型 (使用 setDoc，因為我們用成分名稱當 ID) ---
export async function addIngredientType(name: string, defaultUnit: string) {
  const ingredientId = name; // 直接使用名稱作為文件 ID
  const typeDocRef = doc(typesCollectionRef, ingredientId);
  try {
    await setDoc(typeDocRef, {
      name,
      defaultUnit,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    console.log(`成分類型 '${name}' 已成功添加/更新，ID: ${ingredientId}`);
    return ingredientId;
  } catch (error) {
    console.error(`添加成分類型 '${name}' 時出錯: `, error);
    return null;
  }
}

// --- 新增一筆購買記錄 (使用 addDoc，讓 Firestore 自動生成 ID) ---
export async function addPurchase({
  ingredientType,
  brand,
  price,
  weight,
  unit,
  purchaseDate,
}: {
  ingredientType: string;
  brand: string;
  price: number;
  weight: number;
  unit: string;
  purchaseDate: string;
}) {
  try {
    const newPurchaseData = {
      ingredientType,
      brand,
      price,
      weight,
      unit,
      purchaseDate,
      createdAt: serverTimestamp(),
    };
    const docRef = await addDoc(purchasesCollectionRef, newPurchaseData);
    console.log(`購買記錄已成功添加，ID: ${docRef.id}`);
    return docRef.id;
  } catch (error) {
    console.error("添加購買記錄時出錯: ", error);
    return null;
  }
}

// --- 讀取所有成分類型 ---
export async function getAllIngredientTypes(): Promise<IngredientType[]> {
  try {
    const querySnapshot = await getDocs(typesCollectionRef);
    const types: IngredientType[] = [];
    querySnapshot.forEach((doc) => {
      types.push({ id: doc.id, ...doc.data() } as IngredientType);
    });
    console.log("所有成分類型:", types);
    return types;
  } catch (error) {
    console.error("讀取所有成分類型時出錯: ", error);
    return [];
  }
}

// This will de-duplicate and only make one query.
export const cachedGetAllIngredientTypes = cache(async () => {
  const types = await getAllIngredientTypes();
  if (!types) notFound();
  return types;
});

// --- 按成分類型分組的購買記錄 ---
export async function getPurchasesByIngredientType() {
  const ingredientTypesSnapshot = await getDocs(typesCollectionRef);
  const results: { name: string; purchases: SerializedIngredientPurchase[] }[] = [];

  for (const typeDoc of ingredientTypesSnapshot.docs) {
    const typeData = typeDoc.data();
    const ingredientName = typeData.name;
    const purchasesQuery = query(
      purchasesCollectionRef,
      where("ingredientType", "==", ingredientName)
    );
    const purchasesSnapshot = await getDocs(purchasesQuery);
    const purchases: IngredientPurchase[] = [];
    purchasesSnapshot.forEach((doc) => {
      purchases.push({ id: doc.id, ...doc.data() } as IngredientPurchase);
    });

    results.push({
      name: ingredientName,
      purchases: purchases.map((purchase) => ({
        ...purchase,
        createdAt: purchase.createdAt?.toDate().toISOString() || new Date().toISOString(),
        updatedAt: purchase.updatedAt?.toDate().toISOString() || new Date().toISOString(),
      })),
    });
  }

  console.log("按成分類型分組的購買記錄:", results);
  return results;
}

// --- 按成分類型分組的購買記錄 (使用 cache) ---
export const cachedGetPurchasesByIngredientType = cache(async () => {
  const purchases = await getPurchasesByIngredientType();
  if (!purchases) notFound();
  return purchases;
});

// --- 讀取所有購買記錄 ---
export async function getAllPurchases(): Promise<SerializedIngredientPurchase[]> {
  const querySnapshot = await getDocs(purchasesCollectionRef);
  const purchases: SerializedIngredientPurchase[] = [];
  querySnapshot.forEach((doc) => {
    purchases.push({ id: doc.id, ...doc.data() } as SerializedIngredientPurchase);
  });
  return purchases;
}

// --- 根據 ID 讀取單一購買記錄 ---
export async function getPurchaseById(
  purchaseId: string
): Promise<IngredientPurchase | null> {
  const purchaseDocRef = doc(purchasesCollectionRef, purchaseId);
  try {
    const docSnap = await getDoc(purchaseDocRef);
    if (docSnap.exists()) {
      return {
        ...docSnap.data(),
        id: docSnap.id,
        createdAt: docSnap.data().createdAt.toDate().toISOString(),
      } as IngredientPurchase;
    } else {
      console.log(`找不到購買記錄: ${purchaseId}`);
      return null;
    }
  } catch (error) {
    console.error(`讀取購買記錄 '${purchaseId}' 時出錯: `, error);
    return null;
  }
}

// --- 更新購買記錄資訊 (例如：更新價格和添加備註) ---
export async function updatePurchaseDetails(
  purchaseId: string,
  updateData: Partial<SerializedIngredientPurchase>
) {
  const purchaseDocRef = doc(purchasesCollectionRef, purchaseId);
  const dataToUpdate = {
    ...updateData,
    updatedAt: serverTimestamp(),
  };
  try {
    await updateDoc(purchaseDocRef, dataToUpdate);
    console.log(`購買記錄 '${purchaseId}' 的資訊已更新`);
  } catch (error) {
    console.error(`更新購買記錄 '${purchaseId}' 時出錯: `, error);
  }
}

// --- 根據 ID (名稱) 讀取單一成分類型 ---
export async function getIngredientType(ingredientName: string) {
  try {
    const purchasesQuery = query(
      purchasesCollectionRef,
      where("ingredientType", "==", ingredientName)
    );
    const purchasesSnapshot = await getDocs(purchasesQuery);
    const purchases: SerializedIngredientPurchase[] = [];
    purchasesSnapshot.forEach((doc) => {
      purchases.push({ id: doc.id, ...doc.data() } as SerializedIngredientPurchase);
    });

    if (purchases.length > 0) {
      console.log("成分類型資料:", purchases);
      return purchases;
    } else {
      console.log(`找不到成分類型: ${ingredientName}`);
      return [];
    }
  } catch (error) {
    console.error(`讀取成分類型 '${ingredientName}' 時出錯: `, error);
    return null;
  }
}

export const cachedGetIngredientType = cache(async (ingredientName: string) => {
  const purchases = await getIngredientType(ingredientName);
  if (!purchases) notFound();
  return purchases;
});
