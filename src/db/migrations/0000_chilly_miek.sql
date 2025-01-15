CREATE TABLE "organization" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" text NOT NULL,
	"owner_id" uuid NOT NULL,
	CONSTRAINT "organization_id_unique" UNIQUE("id"),
	CONSTRAINT "organization_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"first_name" varchar(255),
	"last_name" varchar(255),
	"email" text,
	"created_at" timestamp with time zone DEFAULT now(),
	"email_verified" boolean NOT NULL,
	"picture" text NOT NULL,
	"locale" text NOT NULL,
	CONSTRAINT "users_id_unique" UNIQUE("id"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "organization" ADD CONSTRAINT "organization_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;