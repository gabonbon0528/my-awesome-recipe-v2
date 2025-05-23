"use client";
import { SerializedRecipeType } from "@/types/recipe";
import {
  Button,
  ButtonGroup,
  HStack,
  IconButton,
  Pagination,
  Table,
  Tag,
  Text,
  VStack,
} from "@chakra-ui/react";
import Link from "next/link";
import { useState } from "react";
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

  const pageSize = 8;
  const count = recipes.length;
  const startRange = (page - 1) * pageSize;
  const endRange = startRange + pageSize;

  const visibleRecipes = recipes.slice(startRange, endRange);

  return (
    <VStack
      p={4}
      alignItems={"center"}
      justifyContent={"space-between"}
      borderWidth={1}
      borderColor="gray.200"
      borderRadius={8}
      width={"100%"}
      height={"80vh"}
      paddingY={2}
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
                <Text truncate maxW={"100%"}>
                  {recipe.recipeName}
                </Text>
              </Table.Cell>
              <Table.Cell>{formatDateTime(recipe.updatedAt)}</Table.Cell>
              <Table.Cell>
                <HStack gap={1}>
                  {recipe.tags.map((tag) => (
                    <Tag.Root size="sm" key={tag.id}>
                      <Tag.Label>{tag.name}</Tag.Label>
                    </Tag.Root>
                  ))}
                </HStack>
              </Table.Cell>
              <Table.Cell>
                <Text truncate maxW={"100%"}>
                  {recipe.note || "--"}
                </Text>
              </Table.Cell>
              <Table.Cell textAlign="end">
                <Link href={`/recipe/${recipe.id}`}>
                  <Button colorPalette="teal">查看</Button>
                </Link>
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
  );
}
