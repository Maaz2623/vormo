CREATE TYPE "public"."roles" AS ENUM('ADMIN', 'MODERATOR', 'USER');--> statement-breakpoint
CREATE TYPE "public"."event_type" AS ENUM('public', 'private');--> statement-breakpoint
CREATE TABLE "events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(50) NOT NULL,
	"organization_id" uuid NOT NULL,
	"event_ticket_price" numeric NOT NULL,
	"event_venue_location" jsonb NOT NULL,
	"event_venue_tag" text NOT NULL,
	"event_blocks" jsonb DEFAULT '[]'::jsonb,
	"event_banners" jsonb DEFAULT '[]'::jsonb,
	"event_brochure" text,
	"event_type" "event_type" DEFAULT 'public',
	"date_from" timestamp NOT NULL,
	"date_to" timestamp NOT NULL,
	CONSTRAINT "events_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "memberships" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"organization_id" uuid NOT NULL,
	"member_role" "roles" DEFAULT 'USER',
	CONSTRAINT "memberships_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "organization" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" text NOT NULL,
	"email" text NOT NULL,
	"owner_id" uuid NOT NULL,
	CONSTRAINT "organization_id_unique" UNIQUE("id"),
	CONSTRAINT "organization_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"first_name" varchar(255),
	"last_name" varchar(255),
	"email" text,
	"picture" text,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "users_id_unique" UNIQUE("id"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "memberships" ADD CONSTRAINT "memberships_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "memberships" ADD CONSTRAINT "memberships_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organization" ADD CONSTRAINT "organization_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;