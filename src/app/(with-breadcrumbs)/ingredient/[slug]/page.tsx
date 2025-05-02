import IngredientForm from "@/components/ingredient/IngredientForm";
import {
  cachedGetAllIngredientTypes,
  getAllPurchases,
  getPurchaseById,
} from "@/services/ingredients";
import { Box } from "@chakra-ui/react";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const purchase = await getPurchaseById(slug);
  const types = await cachedGetAllIngredientTypes();

  const serializedTypes = types.map((type) => ({
    ...type,
    createdAt: type.createdAt?.toDate().toISOString(),
    updatedAt: type.updatedAt?.toDate().toISOString(),
  }));

  return (
    <Box width={"100%"}>
      <IngredientForm
        isCreate={slug === "create"}
        types={serializedTypes}
        purchase={purchase}
      />
    </Box>
  );
}

export async function generateStaticParams() {
  const purchases = await getAllPurchases();
  if (!Array.isArray(purchases)) {
    return [];
  }
  return purchases.map((purchase) => ({
    slug: purchase.id,
  }));
}
