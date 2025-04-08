"use client";
import { cachedGetIngredientType } from "@/services/ingredients";
import {
  IngredientType,
  SerializedIngredientPurchase,
} from "@/types/ingredients";
import {
  Button,
  CloseButton,
  Drawer,
  EmptyState,
  Flex,
  Portal,
  RadioCard,
  VStack,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

export default function IngredientDrawer({
  onConfirm,
  purchase,
  ingredients,
}: {
  onConfirm: (ingredient: SerializedIngredientPurchase) => void;
  purchase: SerializedIngredientPurchase | null;
  ingredients: IngredientType[];
}) {
  const [open, setOpen] = useState(false);
  const [purchases, setPurchases] = useState<SerializedIngredientPurchase[]>(
    []
  );

  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedPurchase, setSelectedPurchase] =
    useState<SerializedIngredientPurchase | null>(purchase);

  const handleSave = () => {
    if (!selectedPurchase) return;
    onConfirm(selectedPurchase);
    setOpen(false);
  };

  useEffect(() => {
    if (!selectedType) return;
    const fetchIngredientType = async () => {
      try {
        const purchases = await cachedGetIngredientType(selectedType);
        setPurchases(purchases);
      } catch (error) {
        console.error(error);
      }
    };
    fetchIngredientType();
  }, [selectedType]);

  return (
    <Drawer.Root open={open} onOpenChange={(e) => setOpen(e.open)}>
      <Drawer.Trigger asChild>
        <Button variant="outline" size="sm">
          {purchase ? purchase.brand : "選擇原料"}
        </Button>
      </Drawer.Trigger>
      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content>
            <Drawer.Header>
              <Drawer.Title>選擇原料</Drawer.Title>
            </Drawer.Header>
            <Drawer.Body>
              <VStack gap={4}>
                <RadioCard.Root
                  size={"md"}
                  defaultValue={selectedType}
                  onValueChange={(details) =>
                    setSelectedType(details.value ?? "")
                  }
                >
                  <RadioCard.Label>種類</RadioCard.Label>
                  <Wrap gap={2}>
                    {ingredients.map((ingredient) => (
                      <WrapItem key={ingredient.id}>
                        <RadioCard.Item value={String(ingredient.id)}>
                          <RadioCard.ItemHiddenInput />
                          <RadioCard.ItemControl>
                            <RadioCard.ItemText>
                              {ingredient.name}
                            </RadioCard.ItemText>
                          </RadioCard.ItemControl>
                        </RadioCard.Item>
                      </WrapItem>
                    ))}
                  </Wrap>
                </RadioCard.Root>
                <RadioCard.Root
                  defaultValue={selectedPurchase?.id}
                  width={"100%"}
                >
                  <RadioCard.Label>原料</RadioCard.Label>
                  <Flex flexDirection={"column"} gap={2}>
                    {purchases?.map((purchase) => (
                      <RadioCard.Item key={purchase.id} value={purchase.id}>
                        <RadioCard.ItemHiddenInput
                          onChange={() => setSelectedPurchase(purchase)}
                        />
                        <RadioCard.ItemControl>
                          <RadioCard.ItemContent>
                            <RadioCard.ItemText>
                              {purchase.brand}
                            </RadioCard.ItemText>
                            <RadioCard.ItemDescription>
                              {purchase.price}元 / {purchase.weight}g /{" "}
                              {purchase.purchaseDate}
                            </RadioCard.ItemDescription>
                          </RadioCard.ItemContent>
                          <RadioCard.ItemIndicator />
                        </RadioCard.ItemControl>
                      </RadioCard.Item>
                    ))}
                    {purchases?.length === 0 && (
                      <EmptyState.Root alignSelf={"center"}>
                        <EmptyState.Title textAlign={"center"}>
                          尚未購買此原料
                        </EmptyState.Title>
                      </EmptyState.Root>
                    )}
                  </Flex>
                </RadioCard.Root>
              </VStack>
            </Drawer.Body>
            <Drawer.Footer>
              <Button variant="outline" onClick={() => setOpen(false)}>
                取消
              </Button>
              <Button onClick={handleSave}>確認</Button>
            </Drawer.Footer>
            <Drawer.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Drawer.CloseTrigger>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  );
}
