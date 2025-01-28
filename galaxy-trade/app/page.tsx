// Home page which will display ItemCard.tsx component

'use client';

import { FC, useEffect, useState } from 'react';
import { Box, SimpleGrid, Heading, Text } from '@chakra-ui/react';
import { ItemCard } from './components/ItemCard';
import { FetchItems } from './api/items/fetchItems';
import { Item } from './types/items';

async function getItems() {
const items = await FetchItems();
return items;
}

const HomePage: FC =  () => {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    getItems().then(setItems);
  }, []);

  return (
    <Box maxW="1200px" mx="auto" p={6}>
      <Box textAlign="center" mb={6} bg="blackAlpha.200" p={4} borderRadius="md">
        <Heading as="h1" size="xl">
          Welcome to GalaxyTrade 🌌
        </Heading>
        <Text fontSize="lg">
          Items available for trade.
        </Text>
      </Box>

      <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} gap={6}>
        {items.map((item) => (
          <ItemCard key={item.id} {...item} />
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default HomePage;
