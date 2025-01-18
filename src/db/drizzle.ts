import config from "@/config";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { memberships, organizations, users, events } from "./schema";

const sql = neon(config.env.dbUrl);

export const db = drizzle({
  client: sql,
  schema: {
    organizations,
    users,
    memberships,
    events,
  },
});
