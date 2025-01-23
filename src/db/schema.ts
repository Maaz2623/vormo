import {
  Banner,
  Brochure,
} from "@/features/events/components/create-event-modal";
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

export const eventTypeEnum = pgEnum("event_type", ["public", "private"]);

export const events = pgTable("events", {
  id: uuid("id").notNull().primaryKey().defaultRandom().unique(),
  name: varchar({
    length: 50,
  }).notNull(), // Event name
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organizations.id), // Reference to organizations table
  price: decimal("price").notNull(), // Event price
  venueLocation: text("venue_location").notNull(), // Venue location (as text/JSON)
  venueTag: text("venue_tag").notNull(), // Venue tag
  blocks: jsonb("blocks").$type<Block[]>().default([]), // Blocks list as JSON
  banners: jsonb("banners").$type<Banner[]>().default([]), // Banners list as JSON
  brochure: jsonb("brochure").$type<Brochure | null>().default(null), // Brochure (nullable JSON)
  eventType: eventTypeEnum("event_type").default("public"), // Event type (enum)
  date: timestamp("date").notNull(), // Event date
});

export type Organization = typeof organizations.$inferSelect;
export type Member = typeof memberships.$inferSelect;
