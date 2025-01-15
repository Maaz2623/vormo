import { db } from "@/db/drizzle";
import redis from "./redis";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getUserData(email: string) {
  const cacheKey = `user:${email}`;

  // Check cache
  const cachedData = await redis.get(cacheKey);

  // If cache exists, parse it
  if (cachedData) {
    console.log("Cache hit");
    try {
      return JSON.parse(JSON.stringify(cachedData));
    } catch (error) {
      console.error("Error parsing cached data:", error);
      return null;
    }
  }

  console.log("Cache miss");

  // If not in cache, query from database
  const user = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  if (user.length > 0) {
    // Cache data with TTL (e.g., 3600 seconds)
    await redis.set(cacheKey, JSON.stringify(user[0]), { ex: 3600 });
    return user[0];
  }

  return null; // User not found
}
