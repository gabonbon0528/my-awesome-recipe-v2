import { cachedGetAllIngredientTypes } from "@/services/ingredients";
import {
  IngredientType,
  SerializedIngredientPurchase,
} from "@/types/ingredients";
import { SerializedRecipeType } from "@/types/recipe";
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
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import { FcFullTrash, FcLock, FcPlus, FcUnlock } from "react-icons/fc";
import IngredientDrawer from "./IngredientDrawer";
import { DEFAULT_RECIPE_ITEM } from "./RecipeTable";

export default function IngredientTable() {
  const form = useFormContext<SerializedRecipeType>();
  const {
    register,
    formState: { errors },
    getValues,
    control,
    setValue,
  } = form;

  const { fields, remove, replace, append } = useFieldArray({
    control,
    name: "recipeItems",
  });

  const totalWeight = useWatch({
    control,
    name: "recipeItems",
  }).reduce((acc, item) => {
    return acc + Number(item.originalWeight);
  }, 0);

  const [isRatioLocked, setIsRatioLocked] = useState(false);
  const [ingredients, setIngredients] = useState<IngredientType[]>([]);

  function onDragEnd(result: DropResult) {
    if (!result.destination) return;
    if (result.destination.index === result.source.index) return;

    const recipeItems = getValues("recipeItems");
    const [reorderedItem] = recipeItems.splice(result.source.index, 1);
    recipeItems.splice(result.destination.index, 0, reorderedItem);

    replace(recipeItems);
  }

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
    return (costPerUnit * originalWeight).toFixed(0) + " 元 / g";
  };

  const handleWeightChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value;
    const regex = /^\d*$/;
    if (!regex.test(value) || Number(value) === 0) return;
    const recipeItems = getValues("recipeItems");

    if (!isRatioLocked) {
      recipeItems.forEach((item, itemIndex) => {
        const itemWeight = Number(item.originalWeight);
        const ratio = Number(((itemWeight / totalWeight) * 100).toFixed(2));
        setValue(`recipeItems.${itemIndex}.ratio`, ratio);
      });
    } else {
      const targetRatio = Number(getValues(`recipeItems.${index}.ratio`));
      recipeItems.forEach((item, itemIndex) => {
        if (itemIndex === index) return;
        const itemRatio = Number(item.ratio);
        const newWeight = ((Number(value) / targetRatio) * itemRatio).toFixed(
          0
        );
        setValue(`recipeItems.${itemIndex}.originalWeight`, newWeight);
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
    <VStack alignItems={"stretch"} gap={4} flex={1}>
      <HStack justifyContent={"space-between"}>
        <Heading size={"lg"}>材料</Heading>
        <HStack>
          <Button
            variant={"ghost"}
            onClick={() => append(DEFAULT_RECIPE_ITEM, { shouldFocus: false })}
          >
            <FcPlus />
            加入材料
          </Button>
          <Button
            variant={"ghost"}
            onClick={() => setIsRatioLocked(!isRatioLocked)}
          >
            {isRatioLocked ? <FcUnlock /> : <FcLock />}
            鎖定比例
          </Button>
        </HStack>
      </HStack>
      <Table.Root size="md" rounded={"md"} variant="outline">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>項目</Table.ColumnHeader>
            <Table.ColumnHeader>材料重量</Table.ColumnHeader>
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
              單位成本
            </Table.ColumnHeader>
            <Table.ColumnHeader textAlign={"center"}>刪除</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="list">
            {(provided) => (
              <Table.Body ref={provided.innerRef} {...provided.droppableProps}>
                {fields.map((field, index) => (
                  <Draggable
                    draggableId={field.id}
                    index={index}
                    key={field.id}
                  >
                    {(provided) => (
                      <Table.Row
                        key={field.id}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
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
                            invalid={
                              !!errors.recipeItems?.[index]?.originalWeight
                            }
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
                                {...register(
                                  `recipeItems.${index}.originalWeight`,
                                  {
                                    required: "必填欄位",
                                    min: {
                                      value: 1,
                                      message: "材料重量不能為0",
                                    },
                                    pattern: {
                                      value: /^\d+$/,
                                      message: "請輸入有效的數字",
                                    },
                                  }
                                )}
                                onBlur={(e) => handleWeightChange(e, index)}
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
                          {getValues(`recipeItems.${index}.ratio`)} %
                        </Table.Cell>
                        <Table.Cell textAlign={"center"}>
                          <IngredientDrawer
                            onConfirm={(ingredient) =>
                              handleConfirmIngredient(index, ingredient)
                            }
                            purchase={getValues(
                              `recipeItems.${index}.purchase`
                            )}
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
                            <FcFullTrash />
                          </Button>
                        </Table.Cell>
                      </Table.Row>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </Table.Body>
            )}
          </Droppable>
        </DragDropContext>
      </Table.Root>
    </VStack>
  );
}
