import { auth } from "@/auth";
import { db } from "@/db/drizzle";
import { organizations, users } from "@/db/schema";
import { zValidator } from "@hono/zod-validator";
import redis from "@/lib/upstash/redis";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";

const app = new Hono()
  .get("/", async (c) => {
    const session = await auth();

    if (!session || !session.user || !session.user.email) {
      return c.json(
        {
          error: "Unauthorized",
        },
        401
      );
    }

    const email = session.user.email;

    // const cacheKey = `organizations:${email}`;

    // const cachedData: Array<Organization> | null = await redis.get(cacheKey);

    // if (cachedData) {
    //   console.log("Cache hit");
    //   try {
    //     return c.json(cachedData);
    //   } catch (error) {
    //     console.error("Error parsing cached data:", error);
    //     return c.json({
    //       error: "Some error occured",
    //     });
    //   }
    // }

    // console.log("Cache miss");

    const result = await db
      .select()
      .from(organizations)
      .where(eq(organizations.email, email));

    return c.json({ result });
  })
  .post(
    "/",
    zValidator(
      "json",
      z.object({
        organizationName: z.string(),
        organizationSlug: z.string(),
      })
    ),
    async (c) => {
      const session = await auth();

      if (!session || !session.user || !session.user.email) {
        return c.json(
          {
            error: "Unauthorized",
          },
          401
        );
      }

      const email = session.user.email;

      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

      const { organizationName, organizationSlug } = c.req.valid("json");

      const [data] = await db
        .insert(organizations)
        .values({
          name: organizationName,
          email: "mohammedmaaz2623@gmail.com",
          ownerId: user.id,
          slug: organizationSlug,
        })
        .returning();

      const cacheKey = `organizations:${"mohammedmaaz2623@gmail.com"}`;
      await redis.del(cacheKey);

      return c.json(data.slug);
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

      const data = await db.query.organizations.findFirst({
        where: (organizations) => eq(organizations.slug, slug),
      });

      if (!data)
        return c.json(
          {
            error: "Not found",
          },
          404
        );

      return c.json({ data });
    }
  );

export default app;
