// Sliding inventory panel component
import { Stack, Card, Image, Button } from "@chakra-ui/react";
import { getUserItems } from "../lib/actions";
import { useState, useEffect } from "react";
import { Item } from "../types/items";

export default function Inventory({
  username,
  isLoggedIn,
}: {
  username: string;
  isLoggedIn: boolean;
}) {
  const [userInventory, setUserInventory] = useState<Item[]>([]);
  //   const userInventory = [

  //     {
  //       id: 1,
  //       title: "Mountain Bike",
  //       description: "A sturdy mountain bike, great for off-road adventures.",
  //       condition: "Good",
  //       image:
  //         "https://images.singletracks.com/blog/wp-content/uploads/2018/04/Trek_FullStache_D.Milner_portrait.jpg",
  //       owner: "john_doe",
  //       tradable: true,
  //       offers: [
  //         {
  //           id: 1,
  //           itemId: 1,
  //           offerer: "jane_smith",
  //           offeredItemId: 3,
  //           status: "pending",
  //         },
  //       ],
  //     },
  //     {
  //       id: 2,
  //       title: "Guitar",
  //       description:
  //         "An acoustic guitar with a rich sound, perfect for beginners and pros.",
  //       condition: "Excellent",
  //       image:
  //         "https://c1.zzounds.com/media/productmedia/fit%2C2018by3200/quality%2C85/8_Full_Left_Front_NA-35daf2308f67324f1bb32f0e9e9c3888.jpg",
  //       owner: "jane_smith",
  //       tradable: true,
  //       offers: [
  //         {
  //           id: 2,
  //           itemId: 2,
  //           offerer: "john_doe",
  //           offeredItemId: 4,
  //           status: "pending",
  //         },
  //       ],
  //     },
  //     {
  //       id: 3,
  //       title: "Lawn Mower",
  //       description: "Electric lawn mower in working condition, lightly used.",
  //       condition: "Fair",
  //       image:
  //         "https://images-na.ssl-images-amazon.com/images/I/81RpASXRIvL._SL1500_.jpg",
  //       owner: "alex_jones",
  //       tradable: true,
  //       offers: [],
  //     },
  //     {
  //       id: 4,
  //       title: "Camera",
  //       description: "Digital camera with 20MP resolution and 10x optical zoom.",
  //       condition: "Good",
  //       image:
  //         "https://www.bhphotovideo.com/images/images1500x1500/canon_eos_r50_with_rf_s_1748812.jpg",
  //       owner: "john_doe",
  //       tradable: true,
  //       offers: [
  //         {
  //           id: 3,
  //           itemId: 4,
  //           offerer: "jane_smith",
  //           offeredItemId: 2,
  //           status: "rejected",
  //         },
  //       ],
  //     },
  //   ];

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
                <Button variant={"solid"}>Mark Available</Button>
              </Card.Footer>
            </Card.Root>
          ))}
        </Stack>
      )}{" "}
    </div>
  );
}
