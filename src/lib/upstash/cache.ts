import { db } from "@/db/drizzle";
import redis from "./redis";
import { organizations, users } from "@/db/schema";
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

export async function getOrganizationsByEmail(email: string) {
  const cacheKey = `organizations:${email}`;

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
  const result = await db
    .select()
    .from(organizations)
    .where(eq(organizations.email, email));
  if (result.length > 0) {
    // Cache data with TTL (e.g., 3600 seconds)
    await redis.set(cacheKey, JSON.stringify(result), { ex: 3600 });
    return result;
  }
}

export const checkOrganizationSlugValidity = async (slug: string) => {
  const cacheKey = `slug:${slug}`;

  // Check cache
  const cachedData = await redis.get(cacheKey);

  // If cache exists, return it
  if (cachedData) {
    console.log("Cache hit for slug:", slug);
    return JSON.parse(JSON.stringify(cachedData));
  }

  console.log("Cache miss for slug:", slug);

  try {
    // Ensure slug is valid format
    const isValidFormat =
      /^[a-zA-Z0-9]+(-[a-zA-Z0-9]+)*$/.test(slug) && !/[\/]/.test(slug);

    if (!isValidFormat) {
      // Cache the invalid format result for a short time to avoid recalculating repeatedly
      await redis.set(cacheKey, JSON.stringify("invalid-format"), { ex: 600 });
      return "invalid-format";
    }

    // Query the database to check if the slug exists
    const result = await db
      .select()
      .from(organizations)
      .where(eq(organizations.slug, slug))
      .limit(1);

    // Check if the slug is already taken
    const isSlugAvailable = result.length === 0;

    // Cache the result with TTL (e.g., 3600 seconds)
    await redis.set(cacheKey, JSON.stringify(isSlugAvailable), { ex: 3600 });

    return isSlugAvailable;
  } catch (error) {
    console.error("Error checking slug validity:", error);
    return false; // Assume slug is invalid if an error occurs
  }
};
