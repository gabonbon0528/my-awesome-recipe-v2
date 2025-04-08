"use client";
import { calculate } from "@/utils/calculate";
import {
  Button,
  Center,
  Heading,
  HStack,
  Input,
  Presence,
  Stack,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { useCallback, useMemo, useState } from "react";

const OPERATOR_BUTTONS = new Map([
  [
    "+",
    {
      onClick: (input: string, setInput: (value: string) => void) =>
        setInput(input + "+"),
    },
  ],
  [
    "-",
    {
      onClick: (input: string, setInput: (value: string) => void) =>
        setInput(input + "-"),
    },
  ],
  [
    "*",
    {
      onClick: (input: string, setInput: (value: string) => void) =>
        setInput(input + "*"),
    },
  ],
  [
    "/",
    {
      onClick: (input: string, setInput: (value: string) => void) =>
        setInput(input + "/"),
    },
  ],
  [
    ".",
    {
      onClick: (input: string, setInput: (value: string) => void) =>
        setInput(input + "."),
    },
  ],
  [
    "Backspace",
    {
      onClick: (input: string, setInput: (value: string) => void) =>
        setInput(input.slice(0, -1)),
      colorPalette: "green",
    },
  ],
  [
    "=",
    {
      onClick: (
        input: string,
        setInput: (value: string) => void,
        handleCalculate: () => void
      ) => handleCalculate(),
      colorPalette: "blue",
    },
  ],
  [
    "C",
    {
      onClick: (
        input: string,
        setInput: (value: string) => void,
        handleCalculate: () => void,
        setResult: (value: string) => void
      ) => {
        setInput("");
        setResult("0");
      },
      colorPalette: "red",
    },
  ],
]);

const BUTTON_STYLES = {
  size: "sm",
  rounded: "full",
} as const;

export const Calculator = () => {
  const { open, onToggle } = useDisclosure();
  const [input, setInput] = useState("");
  const [result, setResult] = useState("0");

  const handleCalculate = useCallback(() => {
    try {
      const result = calculate(input);
      setResult(String(result));
    } catch (error) {
      setResult("錯誤");
      console.error(error);
    }
  }, [input]);

  const handleToggleButton = () => {
    setInput("");
    setResult("");
    onToggle();
  };

  const numberButtons = useMemo(
    () =>
      Array.from({ length: 10 }, (_, i) => (
        <Button
          key={i}
          {...BUTTON_STYLES}
          onClick={() => setInput(input + i.toString())}
        >
          {i}
        </Button>
      )),
    [input]
  );

  const operatorButtons = useMemo(
    () =>
      Array.from(OPERATOR_BUTTONS, ([text, props]) => (
        <Button
          key={text}
          {...BUTTON_STYLES}
          {...props}
          onClick={() =>
            props.onClick(input, setInput, handleCalculate, setResult)
          }
        >
          {text}
        </Button>
      )),
    [input, handleCalculate]
  );

  return (
    <Stack gap="4">
      <Button alignSelf="flex-start" onClick={handleToggleButton}>
        計算機
      </Button>
      <Presence
        position="fixed"
        bottom="0"
        insetX="0"
        present={open}
        animationName={{
          _open: "slide-from-bottom-full",
          _closed: "slide-to-bottom-full",
        }}
        animationDuration="moderate"
        zIndex={1000}
      >
        <Center p="10" roundedTop="md" layerStyle="fill.muted">
          <HStack gap="8" justifyContent="flex-start" w={"100%"}>
            <Input
              size="2xl"
              bg="white"
              outline="none"
              border="none"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              flex={1}
            />
            <VStack gap="1" alignItems="flex-start" flex={1}>
              <HStack gap="1">{numberButtons}</HStack>
              <HStack gap="1">{operatorButtons}</HStack>
            </VStack>
            <Heading size="5xl" textAlign="center" flex={1}>
              {result}
            </Heading>
          </HStack>
        </Center>
      </Presence>
    </Stack>
  );
};
