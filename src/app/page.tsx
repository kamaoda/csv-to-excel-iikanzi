'use client'

import { Button, Flex, Heading, Input, useColorMode, useColorModeValue } from "@chakra-ui/react";

export default function Home() {
  const { colorMode, toggleColorMode } = useColorMode();
  const formBackground = useColorModeValue("gray.100", "gray.700");
  return (
    <Flex 
      height="100dvh"
      alignItems="center"
      justifyContent="center"
    > 
      <Flex
        direction="column"
        background={formBackground}
        p="12"
        rounded={6}
      >
        <Heading mb={6}>Hello World</Heading>
        <Input placeholder="yamada@example.com" variant="filled" mb={2} type="email" />
        <Input placeholder="******"             variant="filled" mb={4} type="password" />
        <Button colorScheme="teal">Log in</Button>
        <Button colorScheme="teal" onClick={toggleColorMode} mt={4}>Toggle Color Mode</Button>
      </Flex>
    </Flex>
  );
}
