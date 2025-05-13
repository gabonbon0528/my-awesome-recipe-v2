import { MainLayout } from "@/components/layout/MainLayout";
import { Box, Heading, Link, Text } from "@chakra-ui/react";

export default function Page() {
  return (
    <MainLayout>
      <Heading>Welcome to My Awesome Recipe</Heading>
      <Text>
        This app will help you organize your recipes, calculate the cost of
        ingredients, and cook better.
      </Text>
      <Text>
        Click{" "}
        <Link href="/recipe/create" colorPalette="teal" fontSize="xl">
          here Σ੧(❛□❛✿)
        </Link>{" "}
        to create a new recipe!
      </Text>
    </MainLayout>
  );
}
