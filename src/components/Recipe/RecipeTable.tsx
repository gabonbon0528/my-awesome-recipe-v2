"use client";
import { cachedGetAllIngredientTypes } from "@/services/ingredients";
import { addRecipe, updateRecipe } from "@/services/recipe";
import { IngredientType, SerializedIngredientPurchase } from "@/types/ingredients";
import { RecipeItem, SerializedRecipeType } from "@/types/recipe";
import {
  Button,
  Checkbox,
  Field,
  Heading,
  HStack,
  Input,
  InputGroup,
  NativeSelect,
  Table,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { toaster } from "../ui/toaster";
import { Calculator } from "./Calculator";
import IngredientDrawer from "./IngredientDrawer";

export const DEFAULT_RECIPE_ITEM: RecipeItem = {
  order: 0,
  name: "",
  originalWeight: "",
  originalWeightUnit: "g",
  ratio: 0,
  purchase: null,
};

//TODO: 鎖定比例

export default function RecipeTable({
  isCreate,
  recipe,
  recipeId,
}: {
  isCreate: boolean;
  recipe: SerializedRecipeType | null;
  recipeId: string;
}) {
  const [ingredients, setIngredients] = useState<IngredientType[]>([]);
  const [isRatioLocked, setIsRatioLocked] = useState(false);
  const {
    handleSubmit,
    control,
    getValues,
    setValue,
    register,
    formState: { errors },
  } = useForm<SerializedRecipeType>({
    defaultValues: {
      recipeName: recipe?.recipeName || "",
      recipeItems: recipe?.recipeItems || [DEFAULT_RECIPE_ITEM],
      portion: recipe?.portion || "",
      topTemperature: recipe?.topTemperature || "",
      bottomTemperature: recipe?.bottomTemperature || "",
      bakingTime: recipe?.bakingTime || "",
      note: recipe?.note || "",
    },
  });
  const router = useRouter();

  const { fields, insert, remove } = useFieldArray({
    control,
    name: "recipeItems",
  });

  const totalWeight = useWatch({
    control,
    name: "recipeItems",
  }).reduce((acc, item) => {
    return acc + Number(item.originalWeight);
  }, 0);

  const calculateRatio = (number: number) => {
    const ratio = Number(((number / totalWeight) * 100).toFixed(0));
    if (isNaN(ratio)) return "--";
    return ratio + "%";
  };

  const handleConfirmIngredient = (
    index: number,
    ingredient: SerializedIngredientPurchase
  ) => {
    setValue(`recipeItems.${index}.purchase`, ingredient);
  };

  const calculateCost = (index: number) => {
    const purchase = getValues(`recipeItems.${index}.purchase`);
    if (!purchase) return "--";
    const originalWeight = Number(
      getValues(`recipeItems.${index}.originalWeight`)
    );
    if (isNaN(originalWeight)) return "--";
    const costPerUnit = Number(purchase.price) / Number(purchase.weight);
    if (isNaN(costPerUnit)) return "--";
    return (costPerUnit * originalWeight).toFixed(0);
  };

  const handleCreateRecipe = async (data: SerializedRecipeType) => {
    try {
      await addRecipe(data);
      toaster.create({
        type: "success",
        title: "新增食譜成功",
        description: "食譜已成功新增",
      });
      router.push(`/recipe`);
    } catch (error) {
      console.error(error);
      toaster.create({
        type: "error",
        title: "新增食譜失敗",
        description: "請重新嘗試",
      });
    }
  };

  const handleUpdateRecipe = async (data: SerializedRecipeType) => {
    try {
      await updateRecipe(recipeId, data);
      toaster.create({
        type: "success",
        title: "更新食譜成功",
        description: "食譜已成功更新",
      });
      router.push(`/recipe`);
    } catch (error) {
      console.error(error);
      toaster.create({
        type: "error",
        title: "更新食譜失敗",
        description: "請重新嘗試",
      });
    }
  };

  useEffect(() => {
    const fetchIngredients = async () => {
      const types = await cachedGetAllIngredientTypes();
      setIngredients(types);
    };
    fetchIngredients();
  }, []);

  return (
    <form
      onSubmit={handleSubmit(
        isCreate ? handleCreateRecipe : handleUpdateRecipe
      )}
    >
      <HStack justifyContent={"space-between"} pb={4}>
        {isCreate ? (
          <HStack gap={4}>
            <Heading size={"3xl"} flexShrink={0}>
              新增食譜
            </Heading>
            <Field.Root required invalid={!!errors.recipeName}>
              <Input
                placeholder="食譜名稱"
                {...register("recipeName", {
                  required: "必填欄位",
                  maxLength: {
                    value: 10,
                    message: "食譜名稱最多只能10個字",
                  },
                })}
              />
              <Field.ErrorText>
                {String(errors.recipeName?.message ?? "")}
              </Field.ErrorText>
            </Field.Root>
          </HStack>
        ) : (
          <Heading size={"3xl"}>{getValues("recipeName")}</Heading>
        )}
        <HStack>
          <Calculator />
          <Link href="/recipe">
            <Button size={"md"} colorPalette={"teal"} variant={"outline"}>
              返回
            </Button>
          </Link>
          <Button size={"md"} colorPalette={"teal"} type="submit">
            {isCreate ? "新增" : "儲存"}
          </Button>
        </HStack>
      </HStack>
      <HStack gap={4} alignItems={"start"}>
        <VStack alignItems={"stretch"} gap={4} flex={1}>
          <Table.Root size="md" rounded={"md"} variant="outline">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader>項目</Table.ColumnHeader>
                <Table.ColumnHeader>原始材料重量</Table.ColumnHeader>
                <Table.ColumnHeader textAlign={"center"}>
                  <Checkbox.Root
                    variant={"solid"}
                    colorPalette={"teal"}
                    checked={isRatioLocked}
                  >
                    <Checkbox.HiddenInput
                      onChange={(e) => setIsRatioLocked(e.target.checked)}
                    />
                    <Checkbox.Control />
                    <Checkbox.Label>比例</Checkbox.Label>
                  </Checkbox.Root>
                </Table.ColumnHeader>
                <Table.ColumnHeader textAlign={"center"}>
                  使用原料
                </Table.ColumnHeader>
                <Table.ColumnHeader textAlign={"center"}>
                  成本
                </Table.ColumnHeader>
                <Table.ColumnHeader textAlign={"center"}>
                  刪除
                </Table.ColumnHeader>
                <Table.ColumnHeader textAlign={"center"}>
                  新增
                </Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {fields.map((field, index) => (
                <Table.Row key={field.id}>
                  <Table.Cell>
                    <Field.Root
                      required
                      invalid={!!errors.recipeItems?.[index]?.name}
                    >
                      <Input
                        type="text"
                        {...register(`recipeItems.${index}.name`, {
                          required: "必填欄位",
                          maxLength: {
                            value: 10,
                            message: "項目名稱最多只能10個字",
                          },
                        })}
                      />
                      <Field.ErrorText>
                        {String(
                          errors.recipeItems?.[index]?.name?.message ?? ""
                        )}
                      </Field.ErrorText>
                    </Field.Root>
                  </Table.Cell>
                  <Table.Cell>
                    <Field.Root
                      required
                      invalid={!!errors.recipeItems?.[index]?.originalWeight}
                    >
                      <InputGroup
                        flex="1"
                        endElement={
                          <NativeSelect.Root
                            size="xs"
                            variant="plain"
                            width="auto"
                            me="-1"
                          >
                            <NativeSelect.Field
                              defaultValue="g"
                              fontSize="sm"
                              {...register(
                                `recipeItems.${index}.originalWeightUnit`,
                                {
                                  required: "必填欄位",
                                }
                              )}
                            >
                              <option value="g">g</option>
                              <option value="ml">ml</option>
                            </NativeSelect.Field>
                            <NativeSelect.Indicator />
                          </NativeSelect.Root>
                        }
                      >
                        <Input
                          w="100px"
                          ps="1rem"
                          pe="2rem"
                          placeholder="1000"
                          {...register(`recipeItems.${index}.originalWeight`, {
                            required: "必填欄位",
                            min: {
                              value: 1,
                              message: "原始材料重量不能為0",
                            },
                            pattern: {
                              value: /^\d+$/,
                              message: "請輸入有效的數字",
                            },
                          })}
                        />
                      </InputGroup>
                      <Field.ErrorText>
                        {String(
                          errors.recipeItems?.[index]?.originalWeight
                            ?.message ?? ""
                        )}
                      </Field.ErrorText>
                    </Field.Root>
                  </Table.Cell>
                  <Table.Cell textAlign={"center"}>
                    {/* {getValues(`recipe.${index}.ratio`)} */}
                    {calculateRatio(
                      Number(getValues(`recipeItems.${index}.originalWeight`))
                    )}
                  </Table.Cell>
                  <Table.Cell textAlign={"center"}>
                    <IngredientDrawer
                      onConfirm={(ingredient) =>
                        handleConfirmIngredient(index, ingredient)
                      }
                      purchase={getValues(`recipeItems.${index}.purchase`)}
                      ingredients={ingredients}
                    />
                  </Table.Cell>
                  <Table.Cell textAlign={"center"}>
                    {calculateCost(index)}
                  </Table.Cell>
                  <Table.Cell textAlign={"center"}>
                    <Button
                      disabled={fields.length === 1}
                      variant={"ghost"}
                      onClick={() => remove(index)}
                    >
                      ❌
                    </Button>
                  </Table.Cell>
                  <Table.Cell textAlign={"center"}>
                    <Button
                      variant={"ghost"}
                      onClick={() => insert(index + 1, DEFAULT_RECIPE_ITEM)}
                    >
                      ➕
                    </Button>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
          <Field.Root>
            <Field.Label>備註</Field.Label>
            <Textarea
              placeholder="備註"
              {...register("note", {
                maxLength: {
                  value: 100,
                  message: "備註最多只能100個字",
                },
              })}
            />
            <Field.ErrorText>
              {String(errors.note?.message ?? "")}
            </Field.ErrorText>
          </Field.Root>
        </VStack>

        <VStack
          p={4}
          borderWidth={1}
          borderColor="gray.200"
          borderRadius={8}
          width={"30vw"}
        >
          <Field.Root required invalid={!!errors.portion}>
            <Field.Label>
              份數
              <Field.RequiredIndicator />
            </Field.Label>
            <Input
              placeholder="份數"
              {...register("portion", {
                required: "必填欄位",
                min: {
                  value: 1,
                  message: "份數不能為0",
                },
                pattern: {
                  value: /^\d+$/,
                  message: "請輸入有效的數字",
                },
              })}
            />
            <Field.ErrorText>
              {String(errors.portion?.message ?? "")}
            </Field.ErrorText>
          </Field.Root>
          <Field.Root required invalid={!!errors.topTemperature}>
            <Field.Label>
              上火
              <Field.RequiredIndicator />
            </Field.Label>
            <InputGroup endElement="°C">
              <Input
                placeholder="180"
                {...register("topTemperature", {
                  required: "必填欄位",
                  min: {
                    value: 1,
                    message: "溫度不能為0",
                  },
                  pattern: {
                    value: /^\d+$/,
                    message: "請輸入有效的數字",
                  },
                })}
              />
            </InputGroup>
            <Field.ErrorText>
              {String(errors.topTemperature?.message ?? "")}
            </Field.ErrorText>
          </Field.Root>
          <Field.Root required invalid={!!errors.bottomTemperature}>
            <Field.Label>
              下火
              <Field.RequiredIndicator />
            </Field.Label>
            <InputGroup endElement="°C">
              <Input
                placeholder="180"
                {...register("bottomTemperature", {
                  required: "必填欄位",
                  min: {
                    value: 1,
                    message: "溫度不能為0",
                  },
                  pattern: {
                    value: /^\d+$/,
                    message: "請輸入有效的數字",
                  },
                })}
              />
            </InputGroup>
            <Field.ErrorText>
              {String(errors.bottomTemperature?.message ?? "")}
            </Field.ErrorText>
          </Field.Root>
          <Field.Root required invalid={!!errors.bakingTime}>
            <Field.Label>
              烘烤時間
              <Field.RequiredIndicator />
            </Field.Label>
            <InputGroup endElement="分鐘">
              <Input
                placeholder="180"
                {...register("bakingTime", {
                  required: "必填欄位",
                  min: {
                    value: 1,
                    message: "烘烤時間不能為0",
                  },
                  pattern: {
                    value: /^\d+$/,
                    message: "請輸入有效的數字",
                  },
                })}
              />
            </InputGroup>
            <Field.ErrorText>
              {String(errors.bakingTime?.message ?? "")}
            </Field.ErrorText>
          </Field.Root>
        </VStack>
      </HStack>
    </form>
  );
}
