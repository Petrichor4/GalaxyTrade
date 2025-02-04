import { Stack, Image, Button, Card } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { OfferItem } from "../types/items";
import { acceptOffer, declineOffer, getUserOffers } from "../lib/actions";
import { HiOutlineSwitchHorizontal } from "react-icons/hi";

export default function Offers({ username }: { username: string }) {
  const [userOffers, setUserOffers] = useState<OfferItem[]>([]);
  const [refresh, setRefresh] = useState(false)
  // const [offerItems, setOfferItems] = useState<Item[]>([]);
  const { data: session } = useSession();
  const isLoggedIn = !!session;

  console.log(userOffers);
  // console.log(username)

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const result = await getUserOffers(username);
        setUserOffers(result);
      } catch (error) {
        console.error(error);
      }
    };
    fetchOffers();
    const interval = setInterval(fetchOffers, 10000); // Poll every 5 seconds

    return () => clearInterval(interval); // Cleanup
    // setRefresh(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // const handleAccept = (id: number, offererUsername: string, username: string) => {
  //   acceptOffer
  // }

  return (
    <div>
      {isLoggedIn && (
        <Stack gap={2} alignItems={"center"} className="inventory-stack">
          {userOffers.filter((item) => item.status !== "rejected").map((item, index) => (
            <Card.Root
              key={index}
              size={"sm"}
              w={"11/12"}
              p={3}
              className="inventory-card"
            >
              <div style={{display:"flex"}} className="justify-center items-center">
                <Image
                  maxH={"200px"}
                  maxW={200}
                  rounded={"md"}
                  src={item.offered_item_image}
                  alt={`Picture of ${item.offered_item_title}`}
                />
                <HiOutlineSwitchHorizontal size={50} />
                <Image
                  src={item.item_image}
                  alt={` picture of${item.item_title}`}
                  maxH={"200px"}
                  maxW={200}
                  rounded={"md"}
                />
              </div>
              <Card.Body>
                <Card.Title>{`${item.offerer} is offering their ${item.offered_item_title} for your ${item.item_title}`}</Card.Title>
                <Card.Description>{item.offered_item_description}</Card.Description>
              </Card.Body>
              <Card.Footer display={"flex"} justifyContent={"space-around"} mt={2}>
                <Button px={2} variant={"solid"} colorPalette={"red"} onClick={() => declineOffer(item.offereditemid).then(() => setRefresh(true))}>
                  Reject Offer
                </Button>
                <Button px={2} variant={"solid"} colorPalette={"green"} onClick={async() => await acceptOffer(username, item.offerer, item.item_id, item.offereditemid).then(() => setRefresh(true))}>
                  Accept Offer
                </Button>
              </Card.Footer>
            </Card.Root>
          ))}
        </Stack>
      )}
    </div>
  );
}
