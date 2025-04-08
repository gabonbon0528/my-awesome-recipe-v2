"use client";
import {
  Field,
  Input,
  NativeSelect,
  RadioCard,
  Stack,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { Controller, useForm, useWatch } from "react-hook-form";
import {
  addIngredientType,
  addPurchase,
  updatePurchaseDetails,
} from "@/services/ingredients";
import DetailHeader from "./DetailHeader";
import { toaster } from "../ui/toaster";
import {
  IngredientFormValues,
  IngredientPurchase,
  SerializedIngredientPurchase,
  SerializedIngredientType,
} from "@/types/ingredients";
import { redirect } from "next/navigation";

export default function IngredientForm({
  types,
  purchase,
  isCreate,
}: {
  types: SerializedIngredientType[];
  purchase: IngredientPurchase | null;
  isCreate: boolean;
}) {
  const {
    control,
    handleSubmit,
    register,
    formState: { errors, dirtyFields },
  } = useForm<IngredientFormValues>({
    defaultValues: {
      ingredientType: purchase?.ingredientType || "create",
      ingredientTypeName: purchase?.ingredientType || "",
      brand: purchase?.brand || "",
      price: purchase?.price || "",
      weight: purchase?.weight || "",
      unit: purchase?.unit || "g",
      purchaseDate:
        purchase?.purchaseDate || new Date().toISOString().split("T")[0],
    },
  });

  const currentIngredientType = useWatch({ control, name: "ingredientType" });
  const isCreateIngredientType = currentIngredientType === "create";

  const checkIngredientType = async (ingredientTypeName: string) => {
    const isExist = types.some(
      (ingredientType) => ingredientType.name === ingredientTypeName
    );
    return isExist;
  };

  const handleCreateIngredient = async (data: IngredientFormValues) => {
    try {
      if (isCreateIngredientType) {
        await addIngredientType(data.ingredientTypeName, data.unit);
      }

      await addPurchase({
        ingredientType: isCreateIngredientType
          ? data.ingredientTypeName
          : data.ingredientType,
        brand: data.brand,
        price: Number(data.price),
        weight: Number(data.weight),
        unit: data.unit,
        purchaseDate: data.purchaseDate,
      });

      toaster.create({
        type: "success",
        title: "新增成功",
        description: "已成功新增食材",
      });
    } catch (error) {
      console.error(error);
      toaster.create({
        type: "error",
        title: "新增失敗",
        description: "請重新嘗試",
      });
    }
    redirect("/ingredient");
  };

  const handleUpdateIngredient = async (data: IngredientFormValues) => {
    if (!purchase) return;
    const updateFields = Object.keys(dirtyFields);
    const updateData: Partial<SerializedIngredientPurchase> = {};
    updateFields.forEach((field) => {
      updateData[field as keyof SerializedIngredientPurchase] = data[field as keyof IngredientFormValues];
    });
    updateData.ingredientType = isCreateIngredientType
      ? data.ingredientTypeName
      : data.ingredientType;
    try {
      if (isCreateIngredientType) {
        await addIngredientType(data.ingredientTypeName, data.unit);
      }
      await updatePurchaseDetails(purchase.id, updateData);
      toaster.create({
        type: "success",
        title: "更新成功",
        description: "已成功更新食材",
      });
    } catch (error) {
      console.error(error);
      toaster.create({
        type: "error",
        title: "更新失敗",
        description: "請重新嘗試",
      });
    }
    redirect("/ingredient");
  };

  return (
    <form
      onSubmit={handleSubmit(
        isCreate ? handleCreateIngredient : handleUpdateIngredient
      )}
    >
      <DetailHeader isCreate={isCreate} />
      <Stack gap="4" maxW="sm">
        <Controller
          control={control}
          name={"ingredientType"}
          rules={{ required: true }}
          render={({ field }) => (
            <RadioCard.Root
              orientation="horizontal"
              align="center"
              justify="center"
              maxW="lg"
              variant={"surface"}
              colorPalette={"teal"}
              defaultValue={field.value}
              onChange={field.onChange}
            >
              <RadioCard.Label>類別</RadioCard.Label>
              <Wrap>
                {types.map((ingredientType) => (
                  <WrapItem key={ingredientType.id}>
                    <RadioCard.Item value={ingredientType.name}>
                      <RadioCard.ItemHiddenInput />
                      <RadioCard.ItemControl>
                        <RadioCard.ItemText>
                          {ingredientType.name}
                        </RadioCard.ItemText>
                      </RadioCard.ItemControl>
                    </RadioCard.Item>
                  </WrapItem>
                ))}
                <WrapItem>
                  <RadioCard.Item value={"create"}>
                    <RadioCard.ItemHiddenInput />
                    <RadioCard.ItemControl>
                      <RadioCard.ItemText>新增</RadioCard.ItemText>
                    </RadioCard.ItemControl>
                  </RadioCard.Item>
                </WrapItem>
              </Wrap>
            </RadioCard.Root>
          )}
        />
        {isCreateIngredientType && (
          <Field.Root required invalid={!!errors.ingredientTypeName}>
            <Field.Label>
              新增類別
              <Field.RequiredIndicator />
            </Field.Label>
            <Input
              placeholder="範例：奶油"
              {...register("ingredientTypeName", {
                required: isCreateIngredientType,
                validate: async (ingredientTypeName) => {
                  if (!ingredientTypeName) return "必填欄位";
                  const isExist = await checkIngredientType(ingredientTypeName);
                  return !isExist || `「${ingredientTypeName}」已存在`;
                },
              })}
            />
            <Field.ErrorText>
              {String(errors.ingredientTypeName?.message ?? "")}
            </Field.ErrorText>
          </Field.Root>
        )}
        <Field.Root required invalid={!!errors.brand}>
          <Field.Label>
            品牌名稱
            <Field.RequiredIndicator />
          </Field.Label>
          <Input
            placeholder="範例：鐵塔"
            {...register("brand", {
              required: "必填欄位",
              maxLength: {
                value: 10,
                message: "品牌名稱最多只能10個字",
              },
            })}
          />
          <Field.ErrorText>
            {String(errors.brand?.message ?? "品牌名稱最多只能10個字")}
          </Field.ErrorText>
        </Field.Root>
        <Field.Root required invalid={!!errors.price}>
          <Field.Label>
            價格
            <Field.RequiredIndicator />
          </Field.Label>
          <Input
            placeholder="範例：250"
            {...register("price", {
              required: "必填欄位",
              min: {
                value: 1,
                message: "價格不能為0",
              },
              pattern: {
                value: /^\d+$/,
                message: "請輸入有效的數字",
              },
            })}
          />
          <Field.ErrorText>
            {String(errors.price?.message ?? "請輸入有效的數字")}
          </Field.ErrorText>
        </Field.Root>
        <Field.Root required invalid={!!errors.weight}>
          <Field.Label>
            重量
            <Field.RequiredIndicator />
          </Field.Label>
          <Input
            placeholder="範例：500"
            {...register("weight", {
              required: "必填欄位",
              min: {
                value: 1,
                message: "重量不能為0",
              },
              pattern: {
                value: /^\d+$/,
                message: "請輸入有效的數字",
              },
            })}
          />
          <Field.ErrorText>
            {String(errors.weight?.message ?? "請輸入有效的數字")}
          </Field.ErrorText>
        </Field.Root>
        <Field.Root required>
          <Field.Label>
            單位
            <Field.RequiredIndicator />
          </Field.Label>
          <NativeSelect.Root>
            <NativeSelect.Field
              {...register("unit", {
                required: "必填欄位",
              })}
            >
              <option value="g">g</option>
              <option value="ml">ml</option>
            </NativeSelect.Field>
            <NativeSelect.Indicator />
          </NativeSelect.Root>
        </Field.Root>
        <Field.Root required invalid={!!errors.purchaseDate}>
          <Field.Label>
            購買時間
            <Field.RequiredIndicator />
          </Field.Label>
          <Input
            placeholder="範例：2025-01-01"
            {...register("purchaseDate", {
              required: "必填欄位",
              pattern: {
                value: /^\d{4}-\d{2}-\d{2}$/,
                message: "請輸入有效的日期格式 (YYYY-MM-DD)",
              },
            })}
          />
          <Field.ErrorText>
            {String(errors.purchaseDate?.message ?? "請輸入有效的日期格式")}
          </Field.ErrorText>
        </Field.Root>
      </Stack>
    </form>
  );
}
