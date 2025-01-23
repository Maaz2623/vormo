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

export type Location = {
  lat: number;
  lng: number;
};

export const eventTypeEnum = pgEnum("event_type", ["public", "private"]);

export const events = pgTable("events", {
  id: uuid("id").notNull().primaryKey().defaultRandom().unique(),
  name: varchar({ length: 50 }).notNull(), // Event name
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organizations.id), // Reference to organizations table
  price: decimal("event_ticket_price").notNull(), // Event price
  venueLocation: jsonb("event_venue_location").$type<Location>().notNull(), // Venue location (as JSON)
  venueTag: text("event_venue_tag").notNull(), // Venue tag
  blocks: jsonb("event_blocks").$type<Block[]>().default([]), // Blocks as JSON
  banners: jsonb("event_banners").$type<string[]>().default([]), // Banners as JSON
  brochure: text("event_brochure"), // Brochure (nullable text)
  eventType: eventTypeEnum("event_type").default("public"), // Event type (enum)
  dateFrom: timestamp("date_from").notNull(), // Start date
  dateTo: timestamp("date_to").notNull(), // End date
});
export type Organization = typeof organizations.$inferSelect;
export type Member = typeof memberships.$inferSelect;
export type Event = typeof events.$inferSelect;
