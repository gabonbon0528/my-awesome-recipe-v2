import { Tag as ChakraTag } from "@chakra-ui/react";
import * as React from "react";

export interface TagProps extends ChakraTag.RootProps {
  startElement?: React.ReactNode;
  endElement?: React.ReactNode;
  onClose?: VoidFunction;
  closable?: boolean;
}

export const Tag = React.forwardRef<HTMLSpanElement, TagProps>(function Tag(
  props,
  ref
) {
  const {
    startElement,
    endElement,
    onClose,
    closable = !!onClose,
    children,
    ...rest
  } = props;

  const onClickCloseTrigger = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    onClose?.();
  };

  return (
    <ChakraTag.Root
      ref={ref}
      {...rest}
      variant={"solid"}
      size={"lg"}
      colorPalette={"teal"}
    >
      {startElement && (
        <ChakraTag.StartElement>{startElement}</ChakraTag.StartElement>
      )}
      <ChakraTag.Label>{children}</ChakraTag.Label>
      {endElement && <ChakraTag.EndElement>{endElement}</ChakraTag.EndElement>}
      {closable && (
        <ChakraTag.EndElement>
          <ChakraTag.CloseTrigger onClick={onClickCloseTrigger} />
        </ChakraTag.EndElement>
      )}
    </ChakraTag.Root>
  );
});
