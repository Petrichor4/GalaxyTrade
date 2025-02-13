import { db } from '@vercel/postgres'
import { seedItems } from './placeholder-data'


async function seedDatabase() {
    // await client.sql`CREATE EXTENSION IF NOT EXISTS items`;
    const client = await db.connect();

    await client.sql`
        TRUNCATE TABLE offers RESTART IDENTITY CASCADE;
        TRUNCATE TABLE items RESTART IDENTITY CASCADE;
    `;

    await client.sql`
        CREATE TABLE IF NOT EXISTS items (
            id SERIAL PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            description TEXT,
            condition VARCHAR(50),
            image VARCHAR(255),
            owner VARCHAR(255) NOT NULL,
            tradable BOOLEAN DEFAULT TRUE,
            offers JSONB DEFAULT '[]'::jsonb
        );
    `;

    await client.sql`
        CREATE TABLE IF NOT EXISTS offers (
        id SERIAL PRIMARY KEY,
        item_id INTEGER REFERENCES items(id) ON DELETE CASCADE,
        offerer VARCHAR(255) NOT NULL,
        offeredItemId INTEGER,
        status VARCHAR(20) CHECK (status IN ('pending', 'accepted', 'rejected')) NOT NULL
        )
    `;


    const insertedItems = await Promise.all(
        seedItems.map(async (item) => {
            const result = await client.sql`
                INSERT INTO items (title, description, condition, image, owner, tradable)
                VALUES (${item.title}, ${item.description}, ${item.condition}, ${item.image}, ${item.owner}, ${item.tradable})
                RETURNING id
            `;
            return result.rows;
        })
    );

    await Promise.all(
        seedItems.map(async (item, index) => {
            const itemId = insertedItems[index][0].id;
            const offers = item.offers;
            if (offers.length > 0) {
                await Promise.all(
                    offers.map((offer) => client.sql`
                        INSERT INTO offers (item_id, offerer, offeredItemId, status)
                        VALUES (${itemId}, ${offer.offerer}, ${offer.offeredItemId}, ${offer.status})
                    `)
                );
            }
        })
    );

    return insertedItems;
}

export async function GET() {
    const client = await db.connect();
    try {
        await client.sql`BEGIN`;
        await seedDatabase();
        await client.sql`COMMIT`;

        // return Response.json({ message: 'Seeded ideas successfully' });
        return new Response(JSON.stringify({ message: "Seeded items successfully" }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
        
    } catch (error) {
        await client.sql`ROLLBACK`;
        return Response.json({ error }, { status: 500 });
    }
}
