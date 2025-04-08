import {
  cachedGetPurchasesByIngredientType
} from "@/services/ingredients";
import {
  Accordion,
  Box,
  Button,
  Card,
  DataList,
  EmptyState,
  Heading,
  HStack,
  Span
} from "@chakra-ui/react";
import Link from "next/link";
import { FaPlus } from "react-icons/fa";
import { FaBoxOpen } from "react-icons/fa6";

export default async function IngredientPage() {
  const purchasesByIngredientType = await cachedGetPurchasesByIngredientType();

  return (
    <Box width={"100%"}>
      <HStack justifyContent={"space-between"} pb={2}>
        <Heading size={"3xl"}>原料</Heading>
        <Link href="/ingredient/create">
          <Button size={"md"} colorPalette={"teal"}>
            <FaPlus />
            新增原料
          </Button>
        </Link>
      </HStack>
      <Accordion.Root size={"md"} collapsible defaultValue={["1"]}>
        {purchasesByIngredientType.map((ingredient) => {
          const { name, purchases } = ingredient;
          return (
            <Accordion.Item value={name} key={name}>
              <Accordion.ItemTrigger>
                <Span flex="1">{name}</Span>
                <Accordion.ItemIndicator />
              </Accordion.ItemTrigger>
              <Accordion.ItemContent>
                {purchases?.map((purchase) => {
                  const {
                    brand,
                    price,
                    createdAt,
                    weight,
                    id,
                    purchaseDate,
                    unit,
                  } = purchase;
                  return (
                    <Accordion.ItemBody key={createdAt}>
                      <Card.Root size="md">
                        <Card.Header>
                          <HStack justifyContent={"space-between"}>
                            <Heading size="md">{brand}</Heading>
                            <Button size={"sm"} colorPalette={"teal"}>
                              <Link href={`/ingredient/${id}`}>編輯</Link>
                            </Button>
                          </HStack>
                        </Card.Header>
                        <Card.Body color="fg.muted">
                          <DataList.Root orientation="horizontal">
                            <DataList.Item>
                              <DataList.ItemLabel>價格</DataList.ItemLabel>
                              <DataList.ItemValue>{price}</DataList.ItemValue>
                            </DataList.Item>
                            <DataList.Item>
                              <DataList.ItemLabel>重量</DataList.ItemLabel>
                              <DataList.ItemValue>
                                {weight} {unit}
                              </DataList.ItemValue>
                            </DataList.Item>
                            <DataList.Item>
                              <DataList.ItemLabel>購買日期</DataList.ItemLabel>
                              <DataList.ItemValue>
                                {purchaseDate}
                              </DataList.ItemValue>
                              <DataList.ItemLabel>建立日期</DataList.ItemLabel>
                              <DataList.ItemValue>
                                {createdAt}
                              </DataList.ItemValue>
                            </DataList.Item>
                          </DataList.Root>
                        </Card.Body>
                      </Card.Root>
                    </Accordion.ItemBody>
                  );
                })}
                {purchases?.length === 0 && (
                  <EmptyState.Root size="md">
                    <EmptyState.Content>
                      <EmptyState.Indicator>
                        <FaBoxOpen />
                      </EmptyState.Indicator>
                      <EmptyState.Title>尚無原料</EmptyState.Title>
                    </EmptyState.Content>
                  </EmptyState.Root>
                )}
              </Accordion.ItemContent>
            </Accordion.Item>
          );
        })}
      </Accordion.Root>
    </Box>
  );
}
