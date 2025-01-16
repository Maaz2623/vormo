import { pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").notNull().primaryKey().defaultRandom().unique(),
  firstName: varchar("first_name", {
    length: 255,
  }),
  lastName: varchar("last_name", {
    length: 255,
  }),
  email: text("email").unique(),
  picture: text("picture"),
  createdAt: timestamp("created_at", {
    withTimezone: true,
  }).defaultNow(),
});

export const organizations = pgTable("organization", {
  id: uuid("id").notNull().primaryKey().defaultRandom().unique(),
  name: varchar("name", {
    length: 255,
  }).notNull(),
  slug: text("slug").notNull().unique(),
  email: text("email").notNull(),
  ownerId: uuid("owner_id")
    .notNull()
    .references(() => users.id),
});

export type Organization = typeof organizations.$inferSelect;
