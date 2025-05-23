"use client";

import {
  Button,
  Combobox,
  Portal,
  Wrap,
  createListCollection,
} from "@chakra-ui/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Tag } from "../common/Tag";
import { FcPlus } from "react-icons/fc";
import { createTagIfNotExist, getAllTags } from "@/services/tag";
import { SerializedTag } from "@/types/tag";
import { useFormContext } from "react-hook-form";
import { SerializedRecipeType } from "@/types/recipe";

export const TagRow = (props: { tags: SerializedTag[] }) => {
  const { tags } = props;
  const [searchValue, setSearchValue] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>(() =>
    tags.map((tag) => tag.name)
  );
  const [totalTags, setTotalTags] = useState<SerializedTag[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const { setValue, getValues } = useFormContext<SerializedRecipeType>();

  const filteredTags = useMemo(
    // 搜尋後的 tags
    () =>
      totalTags.filter((item) =>
        item.name.toLowerCase().includes(searchValue.toLowerCase())
      ),
    [searchValue, totalTags]
  );

  const collection = useMemo(
    () => createListCollection({ items: filteredTags }),
    [filteredTags]
  );

  const handleValueChange = (details: Combobox.ValueChangeDetails) => {
    setSelectedTags(details.value);
    const newTags = details.value
      .map((tag) => {
        const newTag = totalTags.find((t) => t.name === tag);
        return newTag;
      })
      .filter((tag) => tag !== undefined);
    setValue("tags", newTags);
  };

  const handleAddTag = async () => {
    const newTagName = inputRef.current?.value;
    if (newTagName) {
      const newTag = await createTagIfNotExist(newTagName);

      setSelectedTags([...selectedTags, newTagName]);

      const originalTags = getValues("tags");
      setValue("tags", [...originalTags, newTag]);
      inputRef.current!.value = "";
      fetchAllTags();
    }
  };

  const handleRemoveTag = (tag: string) => {
    setSelectedTags(selectedTags.filter((t) => t !== tag));
    const originalTags = getValues("tags");
    setValue(
      "tags",
      originalTags.filter((t) => t.name !== tag)
    );
  };

  const fetchAllTags = async () => {
    try {
      const tags = await getAllTags();
      setTotalTags(tags);
    } catch (error) {
      console.error("Error fetching all tags:", error);
    }
  };

  useEffect(() => {
    fetchAllTags();
  }, []);

  return (
    <Combobox.Root
      multiple
      closeOnSelect
      width="100%"
      value={selectedTags}
      collection={collection}
      onValueChange={handleValueChange}
      onInputValueChange={(details) => setSearchValue(details.inputValue)}
    >
      <Wrap gap="2" paddingBottom={2}>
        {selectedTags.map((tag) => (
          <Tag key={tag} onClose={() => handleRemoveTag(tag)}>
            {tag}
          </Tag>
        ))}
      </Wrap>

      <Combobox.Control width="320px">
        <Combobox.Input ref={inputRef} placeholder="輸入標籤" />
        <Combobox.IndicatorGroup>
          <Combobox.Trigger />
        </Combobox.IndicatorGroup>
      </Combobox.Control>

      <Portal>
        <Combobox.Positioner>
          <Combobox.Content>
            <Combobox.ItemGroup>
              {filteredTags.map((item) => (
                <Combobox.Item key={item.id} item={item.name}>
                  {item.name}
                  <Combobox.ItemIndicator />
                </Combobox.Item>
              ))}
              <Combobox.Empty>
                <Button variant="ghost" size="sm" onClick={handleAddTag}>
                  <FcPlus />
                  新增標籤
                </Button>
              </Combobox.Empty>
            </Combobox.ItemGroup>
          </Combobox.Content>
        </Combobox.Positioner>
      </Portal>
    </Combobox.Root>
  );
};
