import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import config from "./config";
import { db } from "./db/drizzle";
import { users } from "./db/schema";
import { eq } from "drizzle-orm";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: config.env.auth.google.clientId,
      clientSecret: config.env.auth.google.clientSecret,
    }),
  ],
  callbacks: {
    async signIn({ profile }) {
      // Ensure profile is defined and has necessary properties
      if (profile && "email" in profile) {
        const { email, given_name, family_name, picture } = profile;

        // If the user doesn't have an email, reject the sign-in
        if (!email) {
          console.error("Email not found in Google profile");
          return false; // Returning false to deny sign-in
        }

        // Check if the user already exists in the database
        const existingUser = await db
          .select()
          .from(users)
          .where(eq(users.email, email))
          .limit(1);

        // If the user already exists, skip insertion
        if (existingUser.length > 0) return true; // Return true to proceed with the sign-in

        // Insert new user into the database
        await db.insert(users).values({
          email,
          firstName: given_name,
          lastName: family_name,
          picture: picture,
        });

        return true; // Proceed with the sign-in
      } else {
        console.error("Profile or email is undefined");
        return false; // Returning false to deny sign-in if profile is undefined
      }
    },
  },
});
