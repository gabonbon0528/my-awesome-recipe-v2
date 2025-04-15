"use client";

import {
  Box,
  Button,
  DataList,
  Heading,
  HStack,
  Link,
  Separator,
  Table,
  VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { FaSpoon } from "react-icons/fa6";
import { Modal } from "../common/Modal";
import { SerializedRecipeType } from "@/types/recipe";

export default function ReceiptModal({
  recipe,
}: {
  recipe: SerializedRecipeType;
}) {
  const router = useRouter();

  return (
    <Modal>
      <Box
        padding={4}
        bgColor={"Background"}
        className="rounded-lg shadow-lg max-w-2xl w-full"
      >
        <Heading size={"2xl"}>🍽️ {recipe.recipeName}</Heading>
        <VStack
          alignItems={"stretch"}
          justifyContent={"space-between"}
          height={"80vh"}
        >
          <HStack gap={4} alignItems={"start"} flex={1}>
            <Table.Root size="sm" striped width={"70%"}>
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeader>材料名稱</Table.ColumnHeader>
                  <Table.ColumnHeader>重量</Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {recipe.recipeItems.map((item) => (
                  <Table.Row key={item.name}>
                    <Table.Cell>{item.name}</Table.Cell>
                    <Table.Cell>
                      {item.originalWeight + item.originalWeightUnit}
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
            <Separator orientation="vertical" height={"95%"} />
            <VStack gap={4} justifyContent={"start"} width={"30%"} paddingY={4}>
              <DataList.Root width={"100%"}>
                <DataList.Item>
                  <DataList.ItemLabel>份量</DataList.ItemLabel>
                  <DataList.ItemValue>
                    {recipe.portion ?? "-- "}份
                  </DataList.ItemValue>
                </DataList.Item>
                <DataList.Item>
                  <DataList.ItemLabel>烘烤時間</DataList.ItemLabel>
                  <DataList.ItemValue>
                    {recipe.bakingTime ?? "-- "}分
                  </DataList.ItemValue>
                </DataList.Item>
                <DataList.Item>
                  <DataList.ItemLabel>上溫</DataList.ItemLabel>
                  <DataList.ItemValue>
                    {recipe.topTemperature ?? "-- "}°C
                  </DataList.ItemValue>
                </DataList.Item>
                <DataList.Item>
                  <DataList.ItemLabel>下溫</DataList.ItemLabel>
                  <DataList.ItemValue>
                    {recipe.bottomTemperature ?? "-- "}°C
                  </DataList.ItemValue>
                </DataList.Item>
                <DataList.Item>
                  <DataList.ItemLabel>備註</DataList.ItemLabel>
                  <DataList.ItemValue>{recipe.note ?? "--"}</DataList.ItemValue>
                </DataList.Item>
              </DataList.Root>
            </VStack>
          </HStack>
          <HStack gap={4} justifyContent={"end"}>
            <Button
              colorPalette="teal"
              variant="outline"
              onClick={() => router.back()}
            >
              關閉
            </Button>
            <Button colorPalette="teal" asChild>
              <Link href={`/recipe/${recipe.id}`}>
                <FaSpoon />
                編輯食譜
              </Link>
            </Button>
          </HStack>
        </VStack>
      </Box>
    </Modal>
  );
}
