"use server";
import { eq } from "drizzle-orm";
import { db } from "./drizzle";
import { organizations } from "./schema";

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

export const checkOrganizationSlugValidity = async (slug: string) => {
  try {
    // Ensure slug is valid format
    const isValidFormat =
      /^[a-zA-Z0-9]+(-[a-zA-Z0-9]+)*$/.test(slug) && !/[\/]/.test(slug);

    if (!isValidFormat) {
      return "invalid-format";
    }

    // Query the database
    const result = await db
      .select()
      .from(organizations)
      .where(eq(organizations.slug, slug))
      .limit(1);

    return result.length === 0;
  } catch (error) {
    console.log(error);
    return false; // Assume slug is invalid if an error occurs
  }
};
