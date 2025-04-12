"use client";
import { SerializedRecipeType } from "@/types/recipe";
import {
  Button,
  ButtonGroup,
  DataList,
  Heading,
  HStack,
  IconButton,
  Link,
  Pagination,
  Separator,
  Table,
  Tag,
  Text,
  VStack
} from "@chakra-ui/react";
import { useState } from "react";
import { FaSpoon } from "react-icons/fa6";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";

// 新增日期格式化輔助函數
const formatDateTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString("zh-TW", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false, // 設定為24小時制
  });
};

export default function RecipeList({
  recipes,
}: {
  recipes: SerializedRecipeType[];
}) {
  const [page, setPage] = useState(1);
  const [selectedRecipe, setSelectedRecipe] =
    useState<SerializedRecipeType | null>(null);

  const pageSize = 8;
  const count = recipes.length;
  const startRange = (page - 1) * pageSize;
  const endRange = startRange + pageSize;

  const visibleRecipes = recipes.slice(startRange, endRange);

  return (
    <HStack gap={8} paddingY={2} maxW={"1200px"}>
      <VStack
        p={4}
        alignItems={"center"}
        justifyContent={"space-between"}
        borderWidth={1}
        borderColor="gray.200"
        borderRadius={8}
        width={"50vw"}
        height={"80vh"}
      >
        <Table.Root size="sm" interactive>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>食譜名稱</Table.ColumnHeader>
              <Table.ColumnHeader>上次編輯時間</Table.ColumnHeader>
              <Table.ColumnHeader>標籤</Table.ColumnHeader>
              <Table.ColumnHeader>備註</Table.ColumnHeader>
              <Table.ColumnHeader></Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {visibleRecipes.map((recipe) => (
              <Table.Row key={recipe.id}>
                <Table.Cell>
                  <Text
                    truncate
                    maxW={"100px"}
                    fontWeight={
                      selectedRecipe?.id === recipe.id ? "bold" : "normal"
                    }
                  >
                    {recipe.recipeName}
                  </Text>
                </Table.Cell>
                <Table.Cell>{formatDateTime(recipe.updatedAt)}</Table.Cell>
                <Table.Cell>
                  <HStack gap={1}>
                    <Tag.Root size="sm">
                      <Tag.Label>{"待"}</Tag.Label>
                    </Tag.Root>
                    <Tag.Root size="sm">
                      <Tag.Label>{"開"}</Tag.Label>
                    </Tag.Root>
                    <Tag.Root size="sm">
                      <Tag.Label>{"發"}</Tag.Label>
                    </Tag.Root>
                  </HStack>
                </Table.Cell>
                <Table.Cell>
                  <Text truncate maxW={"100px"}>
                    {recipe.note || "--"}
                  </Text>
                </Table.Cell>
                <Table.Cell textAlign="end">
                  <Button
                    colorPalette="teal"
                    variant={
                      selectedRecipe?.id === recipe.id ? "solid" : "outline"
                    }
                    onClick={() => setSelectedRecipe(recipe)}
                  >
                    展開食譜
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
        <Pagination.Root
          count={count}
          pageSize={pageSize}
          page={page}
          onPageChange={(e) => setPage(e.page)}
        >
          <ButtonGroup variant="ghost" size="sm">
            <Pagination.PageText format="long" flex="1" />
            <Pagination.PrevTrigger asChild>
              <IconButton>
                <HiChevronLeft />
              </IconButton>
            </Pagination.PrevTrigger>

            <Pagination.Items
              render={(page) => (
                <IconButton variant={{ base: "ghost", _selected: "outline" }}>
                  {page.value}
                </IconButton>
              )}
            />
            <Pagination.NextTrigger asChild>
              <IconButton>
                <HiChevronRight />
              </IconButton>
            </Pagination.NextTrigger>
          </ButtonGroup>
        </Pagination.Root>
      </VStack>
      {selectedRecipe && (
        <VStack
          alignItems={"stretch"}
          justifyContent={"space-between"}
          p={4}
          borderWidth={1}
          borderColor="gray.200"
          borderRadius={8}
          width={"30vw"}
          height={"80vh"}
          data-state="open"
          _open={{
            animation: "fade-in 300ms ease-out",
          }}
        >
          <Heading size="xl">{selectedRecipe.recipeName}</Heading>
          <HStack gap={4} alignItems={"start"} flex={1}>
            <Table.Root size="sm" striped width={"70%"}>
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeader>材料名稱</Table.ColumnHeader>
                  <Table.ColumnHeader>重量</Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {selectedRecipe.recipeItems.map((item) => (
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
                    {selectedRecipe.portion ?? "-- "}份
                  </DataList.ItemValue>
                </DataList.Item>
                <DataList.Item>
                  <DataList.ItemLabel>烘烤時間</DataList.ItemLabel>
                  <DataList.ItemValue>
                    {selectedRecipe.bakingTime ?? "-- "}分
                  </DataList.ItemValue>
                </DataList.Item>
                <DataList.Item>
                  <DataList.ItemLabel>上溫</DataList.ItemLabel>
                  <DataList.ItemValue>
                    {selectedRecipe.topTemperature ?? "-- "}°C
                  </DataList.ItemValue>
                </DataList.Item>
                <DataList.Item>
                  <DataList.ItemLabel>下溫</DataList.ItemLabel>
                  <DataList.ItemValue>
                    {selectedRecipe.bottomTemperature ?? "-- "}°C
                  </DataList.ItemValue>
                </DataList.Item>
                <DataList.Item>
                  <DataList.ItemLabel>備註</DataList.ItemLabel>
                  <DataList.ItemValue>
                    {selectedRecipe.note ?? "--"}
                  </DataList.ItemValue>
                </DataList.Item>
              </DataList.Root>
            </VStack>
          </HStack>
          <Button colorPalette="teal" asChild>
            <Link href={`/recipe/${selectedRecipe.id}`}>
              <FaSpoon />
              編輯食譜
            </Link>
          </Button>
        </VStack>
      )}
    </HStack>
  );
}
