"use server";
import { db } from "./drizzle";
import { organizations } from "./schema";
import { checkOrganizationSlugValidity } from "@/lib/upstash/cache";

export const createOrganization = async ({
  organizationName,
  userId,
  organizationSlug,
}: {
  organizationName: string;
  userId: string;
  organizationSlug: string;
}) => {
  try {
    await db.insert(organizations).values({
      name: organizationName,
      email: "mohammedmaaz2623@gmail.com",
      ownerId: userId,
      slug: organizationSlug,
    });
  } catch (error) {
    console.log(error);
  }
};

export const checkSlug = async (slug: string) => {
  try {
    // Ensure slug is valid format
    const check = checkOrganizationSlugValidity(slug);

    return check;
  } catch (error) {
    console.log(error);
    return false; // Assume slug is invalid if an error occurs
  }
};
