import { signOut } from "next-auth/react";
import { HiOutlinePlus } from "react-icons/hi";
import { AddItemModal } from "../components/Modals/AddItemModal";
// import Link from "next/link";
import { updateUserPic, getProfilePic } from "../lib/actions";
import { Avatar } from "@/components/ui/avatar";
import {
  Button,
  IconButton,
  //  Input
  Box,
} from "@chakra-ui/react";
import {
  DrawerBackdrop,
  DrawerBody,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerFooter,
  // DrawerHeader,
  DrawerRoot,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useEffect, useState } from "react";
import Inventory from "./InventoryPanel";
import Offers from "./OfferPanel";
// import EditPP from "../ui/editPP";
import UploadImage from "./UploadImage";
import PendingOffers from "./PendingOffers";

export default function Logout({ username }: { username: string }) {
  const placeholderPic =
    "https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg";

  // const [picUrl, setPicUrl] = useState("");
  const [userPic, setUserPic] = useState("");
  const [addItemModalOpen, setAddItemModalOpen] = useState(false);

  // console.log(picUrl);

  useEffect(() => {
    async function fetchProfilePic(username: string) {
      const pic = await getProfilePic(username);
      if (pic) {
        setUserPic(pic);
      }
    }
    fetchProfilePic(username);
  }, [username]);

  const handleImageUpload = async (publicId: string) => {
    try {
      await updateUserPic(username, publicId);
      setUserPic(publicId);
    } catch (error) {
      console.error("Failed to update profile picture:", error);
    }
  };

  const handleAddItemButtonClick = () => {
    setAddItemModalOpen(true);
  };

  return (
    <div className="flex items-center">
      <p className="hidden md:block mx-2">{`Hello! ${username}`}</p>
      <DrawerRoot size={"md"}>
        <DrawerBackdrop />
        <DrawerTrigger asChild>
          <Avatar
            className="hover:cursor-pointer"
            size="2xl"
            name={username}
            src={userPic || placeholderPic}
          />
        </DrawerTrigger>
        <DrawerContent>
          <DrawerCloseTrigger zIndex={100} />
          <DrawerBody>
            {addItemModalOpen && (
              <div>
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50" />
                <AddItemModal
                  username={username || null}
                  onClose={() => setAddItemModalOpen(false)}
                />
              </div>
            )}
            <div className="edit-section">
              <Box
                bg={"currentBg"}
                className="sticky top-0 z-10 w-full h-fit p-3 flex items-center"
              >
                <DrawerTitle className="my-[6px]">{`${username}'s Profile`}</DrawerTitle>
              </Box>
              <Avatar
                className="relative overflow-hidden"
                h={56}
                w={56}
                m={3}
                src={userPic || placeholderPic}
              ></Avatar>

              {/* <Input
                name="new-proflie-pic"
                className="w-4/5 m-3 p-3"
                onChange={(e) => setPicUrl(e.currentTarget.value)}
              />
              <Button className="p-3" m={3} onClick={() => updatePP()}>
                Submit
              </Button> */}

              <UploadImage onUploadSuccess={handleImageUpload} />
            </div>
            <div>
              <Box
                bg={"currentBg"}
                className="sticky top-0 z-10 w-full h-fit p-3 flex items-center "
              >
                <DrawerTitle>
                  Inventory
                  <IconButton
                    p={3}
                    className="mx-3 hover:cursor-pointer active:scale-[.95]"
                    onClick={handleAddItemButtonClick}
                  >
                    Add Item
                    <HiOutlinePlus />
                  </IconButton>
                </DrawerTitle>
              </Box>
              <Inventory username={username} />
            </div>
            <div>
              <Box
                bg={"currentBg"}
                className="sticky top-0 z-10 w-full h-fit p-3 flex items-center "
              >
                <DrawerTitle className="sticky top-0 z-10 w-full h-fit p-3 drop-shadow-md">
                  Offers
                </DrawerTitle>
              </Box>
              <Offers username={username} />
            </div>
            <div>
              <Box
                bg={"currentBg"}
                className="sticky top-0 z-10 w-full h-fit p-3 flex items-center "
              >
                <DrawerTitle className="sticky top-0 z-10 w-full h-fit p-3 drop-shadow-md">
                  Your Offers
                </DrawerTitle>
              </Box>
              <PendingOffers username={username} />
            </div>
          </DrawerBody>
          <DrawerFooter />
          <Button className="m-3 p-2 active:scale-95" onClick={() => signOut()}>
            Sign Out
          </Button>
        </DrawerContent>
      </DrawerRoot>
    </div>
  );
}
