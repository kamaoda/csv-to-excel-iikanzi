'use client'

import { Button, Flex, Heading, Input, useColorModeValue } from "@chakra-ui/react";

export default function Home() {
  const formBackground = useColorModeValue("gray.100", "gray.700");
  return (
    <Flex 
      minHeight="100dvh"
      alignItems="center"
      justifyContent="center"
    > 
      <Flex
        direction="column"
        background={formBackground}
        p="12"
        rounded={6}
      >
        <Heading mb={6}>CSVをいい感じの.xlsxに変換する君</Heading>
        <Input variant="filled" mb={2} type="file" />
        <Button colorScheme="teal">変換！</Button>
      </Flex>
    </Flex>
  );
}
