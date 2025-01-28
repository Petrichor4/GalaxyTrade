'use server';
// import { revalidatePath } from 'next/cache';
// import { redirect } from 'next/navigation';
import { sql } from '@vercel/postgres';
import bcrypt from 'bcrypt'
import { User } from './definitions';
import { Item } from '../types/items';

  
export async function addUser(username:string, password: string, contact: string) {
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(password, saltRounds)
    try {
        await sql<User>`INSERT INTO users (username, password, contact) VALUES (${username}, ${hashedPassword}, ${contact})`
    } catch (error) {
        console.error(error)
    }
}

export async function getUserByUsername(username: string) {
    try {
        const user = await sql<User>`SELECT * FROM users WHERE username = ${username}`
        return user
    } catch (error) {
        console.error(error)
    }
}

export async function getProfilePic(username: string) {
    try {
        const user = await sql<User>`SELECT * FROM users WHERE username = ${username}`
        return user.rows[0].profile_pic || ''
    } catch (error) {
        console.error(error)
    }
}

export async function updateUserPic(username: string, picUrl: string) {
    try {
        await sql<User>`
        UPDATE users SET profile_pic = ${picUrl} WHERE username = ${username}`
    } catch (error) {
        console.error(error)
    }
}

export async function getUserItems(username: string): Promise<Item[]> {
    try {
        const result = await sql<Item>`
        SELECT * FROM items WHERE owner = ${username}
        `
        return result.rows;
    } catch (error) {
        console.error(error)
        return [];
    }
}