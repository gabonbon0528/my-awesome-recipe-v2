"use client";
import { addRecipe, updateRecipe } from "@/services/recipe";
import { RecipeItem, SerializedRecipeType } from "@/types/recipe";
import {
  Button,
  Field,
  Heading,
  HStack,
  Input,
  InputGroup,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { toaster } from "../ui/toaster";
import { Calculator } from "./Calculator";
import CostCard from "./CostCard";
import IngredientTable from "./IngredientTable";

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
  const form = useForm<SerializedRecipeType>({
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
  const {
    handleSubmit,
    getValues,
    register,
    formState: { errors },
  } = form;

  const router = useRouter();

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

  return (
    <FormProvider {...form}>
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
        </HStack>
        <VStack gap={4} alignItems={"flex-start"}>
          <HStack gap={4} width={"100%"} alignItems={"stretch"}>
            <IngredientTable />
            <CostCard />
          </HStack>
          <VStack alignItems={"stretch"} gap={4}>
            <Heading size="lg">烘焙設定</Heading>
            <VStack p={4} borderWidth={1} borderRadius={8}>
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
          </VStack>
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
        <HStack justifyContent={"flex-end"} mt={4}>
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
      </form>
    </FormProvider>
  );
}
