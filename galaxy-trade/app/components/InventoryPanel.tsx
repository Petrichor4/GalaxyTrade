// Sliding inventory panel component
import { Stack, Card, Image, Button } from "@chakra-ui/react";
import { getUserItems } from "../lib/actions";
import { useState, useEffect } from "react";
import { Item } from "../types/items";
import { useSession } from "next-auth/react";

export default function Inventory({ username }: { username: string }) {
  const [userInventory, setUserInventory] = useState<Item[]>([]);

  const { data: session } = useSession();
  const isLoggedIn = !!session;

  console.log(userInventory)

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const userItems = await getUserItems(username);
        setUserInventory(userItems);
      } catch (error) {
        console.error(error);
      }
    };
    fetchItems();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      {isLoggedIn && (
        <Stack gap={2} alignItems={"center"} className="inventory-stack">
          {userInventory.map((item, index) => (
            <Card.Root
              key={index}
              size={"sm"}
              w={"11/12"}
              p={3}
              className="inventory-card"
            >
              <Image
                src={item.image}
                alt={` picture of${item.title}`}
                maxH={"200px"}
                maxW={200}
                rounded={"inherit"}
              />
              <Card.Body>
                <Card.Title>{item.title}</Card.Title>
                <Card.Description>{item.description}</Card.Description>
              </Card.Body>
              <Card.Footer>
                <Button p={3} variant={"solid"}>
                  Mark Available
                </Button>
              </Card.Footer>
            </Card.Root>
          ))}
        </Stack>
      )}{" "}
    </div>
  );
}
