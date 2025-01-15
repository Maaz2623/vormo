import config from "@/config";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

const sql = neon(config.env.dbUrl);

export const db = drizzle({
  client: sql,
});
