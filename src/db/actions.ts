"use server";
import { db } from "./drizzle";
import { organizations } from "./schema";

export const createOrganization = async ({
  organizationName,
  userId,
}: {
  organizationName: string;
  userId: string;
}) => {
  try {
    await db.insert(organizations).values({
      name: organizationName,
      email: "mohammedmaaz2623@gmail.com",
      ownerId: userId,
    });
  } catch (error) {
    console.log(error);
  }
};
