import { auth } from "@/auth";
import { db } from "@/db/drizzle";
import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";

const app = new Hono().get(
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

    const email = session.user.email;

    const user = await db.query.users.findFirst({
      where: (users) => eq(users.email, email),
    });

    if (!user)
      return c.json(
        {
          error: "Unauthorized",
        },
        401
      );

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

    const isMember = await db.query.memberships.findFirst({
      where: (memberships) =>
        eq(memberships.userId, user.id) &&
        eq(memberships.organizationId, organization.id),
    });

    if (!isMember)
      return c.json(
        {
          error: "Not a member. Unauthorized",
        },
        401
      );

    const data = await db.query.memberships.findMany({
      where: (memberships) => eq(memberships.organizationId, organization.id),
    });

    if (data.length === 0)
      return c.json({
        data: [],
      });

    return c.json({
      data,
    });
  }
);

export default app;
