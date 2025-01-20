import {
  decimal,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

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

export const ROLE_ENUM = pgEnum("roles", ["ADMIN", "MODERATOR", "USER"]);

export const memberships = pgTable("memberships", {
  id: uuid("id").notNull().primaryKey().defaultRandom().unique(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organizations.id),
  memberRole: ROLE_ENUM("member_role").default("USER"),
});

export type Block = {
  title: string;
  paragraph: string;
};

export const events = pgTable("events", {
  id: uuid("id").notNull().primaryKey().defaultRandom().unique(),
  name: varchar({
    length: 50,
  }).notNull(),
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organizations.id),
  price: decimal("price").notNull(),
  venueLocation: text("venue_location").notNull(),
  venueTag: text("venue_tag").notNull(),
  blocks: jsonb("blocks").$type<Block[]>().default([]),
  date: timestamp("date").notNull(),
});

export type Organization = typeof organizations.$inferSelect;
export type Member = typeof memberships.$inferSelect;
