import { SerializedRecipeType } from "@/types/recipe";
import { Box, Field, Heading, Input, VStack } from "@chakra-ui/react";
import { useFormContext, useWatch } from "react-hook-form";

//TODO: 使用 debounce 來優化

export default function CostCard() {
  const {
    register,
    formState: { errors },
    control,
  } = useFormContext<SerializedRecipeType>();

  const totalCost = useWatch({
    control,
    name: "recipeItems",
  }).reduce((acc, item) => {
    return acc + Number(item.purchase?.price ?? 0);
  }, 0);

  const portion = useWatch({
    control,
    name: "portion",
  });

  const calculateCostPerPortion = () => {
    if (isNaN(totalCost) || !portion || isNaN(Number(portion))) return "--";
    const costPerPortion = totalCost / Number(portion);
    if (isNaN(costPerPortion)) return "--";
    return costPerPortion.toFixed(2);
  };

  return (
    <VStack alignItems={"stretch"} gap={4}>
      <Heading size={"lg"}>成本</Heading>
      <VStack p={4} borderWidth={1} borderRadius={8}>
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
      </VStack>
      <Box borderWidth={1} borderRadius={8} p={4} bg={"teal.600"}>
        <Heading size={"lg"}>總成本</Heading>
        <Heading size={"2xl"}>{isNaN(totalCost) ? "0" : totalCost}</Heading>
      </Box>
      <Box borderWidth={1} borderRadius={8} p={4} bg={"teal.500"}>
        <Heading size={"lg"}>每份成本</Heading>
        <Heading size={"2xl"}>{calculateCostPerPortion()}</Heading>
      </Box>
    </VStack>
  );
}
