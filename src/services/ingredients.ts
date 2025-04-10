import {
  IngredientPurchase,
  IngredientType,
  SerializedIngredientPurchase,
} from "@/types/ingredients";
import {
  AppError,
  ErrorCode,
  handleError,
  logDebug,
  logError,
  logInfo,
  logWarning,
} from "@/utils/error-handler";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { notFound } from "next/navigation";
import { cache } from "react";
import { db } from "../config/firebase";

// 集合參考
const typesCollectionRef = collection(db, "ingredientTypes");
const purchasesCollectionRef = collection(db, "purchases");

// --- 新增成分類型 ---
export async function addIngredientType(name: string, defaultUnit: string) {
  try {
    logDebug("Adding ingredient type", { name, defaultUnit });

    const ingredientId = name;
    const typeDocRef = doc(typesCollectionRef, ingredientId);

    await setDoc(typeDocRef, {
      name,
      defaultUnit,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    logInfo(`Ingredient type added successfully`, { id: ingredientId, name });
    return ingredientId;
  } catch (error) {
    throw handleError(error, "addIngredientType");
  }
}

// --- 新增一筆購買記錄 ---
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
    logDebug("Adding purchase record", { ingredientType, brand, price });

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
    logInfo(`Purchase record added successfully`, {
      id: docRef.id,
      ingredientType,
    });
    return docRef.id;
  } catch (error) {
    throw handleError(error, "addPurchase");
  }
}

// --- 讀取所有成分類型 ---
export async function getAllIngredientTypes(): Promise<IngredientType[]> {
  try {
    logDebug("Fetching all ingredient types");

    const querySnapshot = await getDocs(typesCollectionRef);
    const types: IngredientType[] = [];

    querySnapshot.forEach((doc) => {
      types.push({ id: doc.id, ...doc.data() } as IngredientType);
    });

    logInfo(`Retrieved ${types.length} ingredient types`);
    return types;
  } catch (error) {
    throw handleError(error, "getAllIngredientTypes");
  }
}

export const cachedGetAllIngredientTypes = cache(async () => {
  try {
    const types = await getAllIngredientTypes();
    if (!types.length) {
      logWarning("No ingredient types found");
      throw new AppError("No ingredient types found", ErrorCode.NOT_FOUND, 404);
    }
    return types;
  } catch (error) {
    logError("Error in cachedGetAllIngredientTypes", error);
    throw error;
  }
});

// --- 按成分類型分組的購買記錄 ---
export async function getPurchasesByIngredientType() {
  try {
    logDebug("Fetching purchases grouped by ingredient type");

    const querySnapshot = await getDocs(purchasesCollectionRef);
    const purchasesByType: {
      name: string;
      purchases: SerializedIngredientPurchase[];
    }[] = [];

    querySnapshot.forEach((doc) => {
      const purchase = {
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate().toISOString(),
        updatedAt: doc.data().updatedAt?.toDate().toISOString(),
      } as SerializedIngredientPurchase;

      const existingTypeIndex = purchasesByType.findIndex(
        (type) => type.name === purchase.ingredientType
      );

      if (existingTypeIndex === -1) {
        purchasesByType.push({
          name: purchase.ingredientType,
          purchases: [purchase],
        });
      } else {
        purchasesByType[existingTypeIndex].purchases.push(purchase);
      }
    });

    logInfo(
      `Retrieved purchases for ${purchasesByType.length} ingredient types`
    );
    return purchasesByType;
  } catch (error) {
    throw handleError(error, "getPurchasesByIngredientType");
  }
}

// --- 讀取所有購買記錄 ---
export async function getAllPurchases(): Promise<
  SerializedIngredientPurchase[]
> {
  try {
    logDebug("Fetching all purchases");

    const querySnapshot = await getDocs(purchasesCollectionRef);
    const purchases: SerializedIngredientPurchase[] = [];

    querySnapshot.forEach((doc) => {
      purchases.push({
        id: doc.id,
        ...doc.data(),
      } as SerializedIngredientPurchase);
    });

    logInfo(`Retrieved ${purchases.length} purchases`);
    return purchases;
  } catch (error) {
    throw handleError(error, "getAllPurchases");
  }
}

// --- 根據 ID 讀取單一購買記錄 ---
export async function getPurchaseById(
  purchaseId: string
): Promise<IngredientPurchase | null> {
  try {
    logDebug("Fetching purchase by ID", { purchaseId });

    const purchaseDocRef = doc(purchasesCollectionRef, purchaseId);
    const docSnap = await getDoc(purchaseDocRef);

    if (docSnap.exists()) {
      const purchase = {
        ...docSnap.data(),
        id: docSnap.id,
        createdAt: docSnap.data().createdAt?.toDate().toISOString(),
      } as IngredientPurchase;

      logInfo(`Purchase found`, { purchaseId });
      return purchase;
    } else {
      logWarning(`Purchase not found`, { purchaseId });
      throw new AppError(
        `Purchase not found: ${purchaseId}`,
        ErrorCode.NOT_FOUND,
        404
      );
    }
  } catch (error) {
    throw handleError(error, "getPurchaseById");
  }
}

// --- 更新購買記錄 ---
export async function updatePurchaseDetails(
  purchaseId: string,
  updateData: Partial<SerializedIngredientPurchase>
) {
  try {
    logDebug("Updating purchase details", { purchaseId, updateData });

    const purchaseDocRef = doc(purchasesCollectionRef, purchaseId);
    const dataToUpdate = {
      ...updateData,
      updatedAt: serverTimestamp(),
    };

    await updateDoc(purchaseDocRef, dataToUpdate);
    logInfo(`Purchase updated successfully`, { purchaseId });
  } catch (error) {
    throw handleError(error, "updatePurchaseDetails");
  }
}

// --- 根據名稱讀取成分類型 ---
export async function getPurchasesByIngredient(ingredientName: string) {
  try {
    logDebug("Fetching purchases by ingredient name", { ingredientName });

    const purchasesQuery = query(
      purchasesCollectionRef,
      where("ingredientType", "==", ingredientName)
    );
    const purchasesSnapshot = await getDocs(purchasesQuery);
    const purchases: SerializedIngredientPurchase[] = [];
    purchasesSnapshot.forEach((doc) => {
      purchases.push({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate().toISOString(),
        updatedAt: doc.data().updatedAt?.toDate().toISOString(),
      } as SerializedIngredientPurchase);
    });

    if (purchases.length > 0) {
      logInfo(`Purchases found`, { purchases });
      return purchases;
    } else {
      logWarning(`Purchases not found`, { ingredientName });
      throw new AppError(
        `Purchases not found: ${ingredientName}`,
        ErrorCode.NOT_FOUND,
        404
      );
    }
  } catch (error) {
    throw handleError(error, "getPurchasesByIngredient");
  }
}

export const cachedGetPurchasesByIngredient = cache(
  async (ingredientName: string) => {
    const purchases = await getPurchasesByIngredient(ingredientName);
    if (!purchases) notFound();
    return purchases;
  }
);
