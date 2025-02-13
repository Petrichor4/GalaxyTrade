"use server";
// import { revalidatePath } from 'next/cache';
// import { redirect } from 'next/navigation';
import { sql } from "@vercel/postgres";
import bcrypt from "bcrypt";
import { User } from "./definitions";
import { Item, Offer, OfferItem } from "../types/items";

export async function addUser(
  username: string,
  password: string,
  contact: string
) {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  try {
    await sql<User>`INSERT INTO users (username, password, contact) VALUES (${username}, ${hashedPassword}, ${contact})`;
  } catch (error) {
    console.error(error);
  }
}

export async function getUserByUsername(username: string) {
  try {
    const user =
      await sql<User>`SELECT * FROM users WHERE username = ${username}`;
    return user;
  } catch (error) {
    console.error(error);
  }
}

export async function getProfilePic(username: string) {
  try {
    const user =
      await sql<User>`SELECT * FROM users WHERE username = ${username}`;
    return user.rows[0].profile_pic || "";
  } catch (error) {
    console.error(error);
  }
}

export async function updateUserPic(username: string, userPic: string) {
  try {
    await sql<User>`
        UPDATE users SET profile_pic = ${userPic} WHERE username = ${username}`;
  } catch (error) {
    console.error(error);
  }
}

export async function getUserItems(username: string): Promise<Item[]> {
  try {
    const result = await sql<Item>`
        SELECT * FROM items WHERE owner = ${username}
        `;
    return result.rows;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getUserOffers(username: string): Promise<OfferItem[]> {
  try {
    const result = await sql<OfferItem>`
        SELECT 
    offers.id AS offer_id,
    offers.item_id,
    items.title AS item_title,
    items.description AS item_description,
    items.condition AS item_condition,
    items.image AS item_image,
    items.owner,
    offers.offereditemid,
    offers.offerer,
    items_offered.title AS offered_item_title,
    items_offered.description AS offered_item_description,
    items_offered.condition AS offered_item_condition,
    items_offered.image AS offered_item_image,
    offers.status
FROM 
    offers
JOIN 
    items ON offers.item_id = items.id
JOIN 
    items AS items_offered ON offers.offereditemid = items_offered.id
WHERE 
    items.owner = ${username} AND offers.status NOT IN ('rejected','accepted');

        `;
    return result.rows;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function acceptOffer(
  name: string,
  offererUsername: string,
  id: number,
  offerId: number
) {
  console.log('Processing offer:', { name, offererUsername, id, offerId });
// Update first item ownership
const updateItem1 = await sql`
UPDATE items
SET owner = ${offererUsername}, tradable = false
WHERE owner = ${name} AND id = ${id}
RETURNING *;
`;

if (updateItem1.rowCount === 0) {
throw new Error('Failed to update first item ownership.');
}

// Update second item ownership
const updateItem2 = await sql`
UPDATE items
SET owner = ${name}, tradable = false
WHERE id = ${offerId}
RETURNING *;
`;

if (updateItem2.rowCount === 0) {
throw new Error('Failed to update second item ownership.');
}

// Update the offer status
const updateOffer = await sql`
UPDATE offers
SET status = 'accepted'
WHERE offereditemid = ${offerId}
RETURNING *;
`;

if (updateOffer.rowCount === 0) {
throw new Error('Failed to update offer status.');
}

console.log('Offer accepted successfully.');}

export async function declineOffer(id: number) {
  try {
    await sql`
      UPDATE offers SET status = 'rejected' WHERE offereditemid = ${id}
    `
  } catch (error) {
    console.error(error);
  }
}

export async function addItemOffer(
  itemId: number,
  offerer: string,
  offeredItemId: number
): Promise<Offer | null> {
  try {
    const result = await sql<Offer>`
            INSERT INTO offers (item_id, offerer, offeredItemId, status)
            VALUES (${itemId}, ${offerer}, ${offeredItemId}, 'pending')
            RETURNING *;
        `;

    return result.rows[0];
  } catch (error) {
    console.error("Error adding offer:", error);
    return null;
  }
}

export async function markAvailable(id: number) {
  try {
    await sql`UPDATE items SET tradable = TRUE WHERE id = ${id} `
  } catch (error) {
    console.error(error);
  }
}

export async function deleteItem(id: number) {
  try {
    console.log(`deleting item with id ${id}`)
    await sql`DELETE FROM items WHERE id = ${id}`
  } catch (error) {
    console.error(error)
  }
}

export async function getPendingOffers(username: string): Promise<OfferItem[]> {
  try {
    const result = await sql<OfferItem>`
        SELECT 
    offers.id AS offer_id,
    offers.item_id,
    items.title AS item_title,
    items.description AS item_description,
    items.condition AS item_condition,
    items.image AS item_image,
    items.owner,
    offers.offereditemid,
    offers.offerer,
    items_offered.title AS offered_item_title,
    items_offered.description AS offered_item_description,
    items_offered.condition AS offered_item_condition,
    items_offered.image AS offered_item_image,
    offers.status
FROM 
    offers
JOIN 
    items ON offers.item_id = items.id
JOIN 
    items AS items_offered ON offers.offereditemid = items_offered.id
WHERE 
    offers.offerer = ${username};

        `;
    return result.rows;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function cancelOffer(id: number) {
  try {
    await sql`DELETE FROM offers WHERE id = ${id}`
  } catch (error) {
    console.error(error);
  }
}