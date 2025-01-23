import { Hono } from "hono";
import { handle } from "hono/vercel";
import organizations from "./organizations";
import memberships from "./memberships";
import events from "./events";

export const runtime = "edge";

const app = new Hono().basePath("/api");

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const routes = app
  .route("/organizations", organizations)
  .route("/memberships", memberships)
  .route("/events", events);

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

export type AppType = typeof routes;
