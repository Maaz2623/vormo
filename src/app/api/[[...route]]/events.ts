import { auth } from "@/auth";
import { db } from "@/db/drizzle";
import { events } from "@/db/schema";
import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";

const BlockSchema = z.object({
  title: z.string(),
  paragraph: z.string(),
});

const app = new Hono()
  .get(
    "/event/:id",
    zValidator(
      "param",
      z.object({
        id: z.string(),
      })
    ),
    async (c) => {
      const { id } = c.req.valid("param");

      const session = await auth();

      if (!session || !session.user || !session.user.email) {
        return c.json(
          {
            error: "Unauthorized",
          },
          401
        );
      }

      const event = await db.query.events.findFirst({
        where: (events) => eq(events.id, id),
      });

      if (!event)
        return c.json(
          {
            error: "Not found",
          },
          404
        );

      return c.json({ event });
    }
  )
  .get(
    "/:slug",
    zValidator(
      "param",
      z.object({
        slug: z.string(),
      })
    ),
    async (c) => {
      const { slug } = c.req.valid("param");

      const session = await auth();

      if (!session || !session.user || !session.user.email) {
        return c.json(
          {
            error: "Unauthorized",
          },
          401
        );
      }

      const organization = await db.query.organizations.findFirst({
        where: (organizations) => eq(organizations.slug, slug),
      });

      if (!organization)
        return c.json(
          {
            error: "Organization not found",
          },
          404
        );

      const events = await db.query.events.findMany({
        where: (events) => eq(events.organizationId, organization.id),
      });

      if (events.length === 0) {
        return c.json({
          events: [],
        });
      }

      return c.json({
        events,
      });
    }
  )
  .post(
    "/",
    zValidator(
      "json",
      z.object({
        organizationSlug: z.string(),
        eventName: z.string(),
        eventType: z.enum(["public", "private"]),
        venueTag: z.string(),
        price: z.string(),
        dateFrom: z.string().datetime(),
        dateTo: z.string().datetime(),
        mapSelected: z.object({
          lat: z.number(),
          lng: z.number(),
        }),
        brochure: z.string(),
        blocksList: z.array(BlockSchema).optional(),
        bannersList: z.array(z.string()).optional(),
      })
    ),
    async (c) => {
      const session = await auth();

      // Validate session
      if (!session || !session.user || !session.user.email) {
        return c.json(
          {
            error: "Unauthorized",
          },
          401
        );
      }

      const email = session.user.email;

      // Find the user in the database
      const user = await db.query.users.findFirst({
        where: (users) => eq(users.email, email),
      });

      if (!user) {
        return c.json(
          {
            error: "User not found",
          },
          404
        );
      }

      const {
        eventName,
        eventType,
        venueTag,
        price,
        dateFrom,
        dateTo,
        mapSelected,
        brochure,
        blocksList,
        organizationSlug,
        bannersList,
      } = c.req.valid("json");

      const organization = await db.query.organizations.findFirst({
        where: (organizations) => eq(organizations.slug, organizationSlug),
      });

      if (!organization)
        return c.json({
          error: "Organization not found",
        });

      // Insert the event into the database
      const [event] = await db
        .insert(events)
        // @ts-expect-error some error related to types of values being passed to this
        .values({
          name: eventName,
          organizationId: organization.id,
          price: parseFloat(price),
          venueLocation: {
            lat: mapSelected.lat,
            lng: mapSelected.lng,
          }, // Pass the object directly
          venueTag,
          blocks: blocksList || [],
          banners: bannersList || [],
          brochure,
          eventType,
          dateFrom: new Date(dateFrom), // Ensure it's a valid Date object
          dateTo: new Date(dateTo), // Ensure it's a valid Date object
        })
        .returning();

      return c.json(event.id);
    }
  );

export default app;
