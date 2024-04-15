import { H } from "hono/types";
import { browserRedirect, htmxRedirect, removeJwt } from "./utils";

export const LogOutHandler: H = async (ctx) => {
  removeJwt(ctx)
  htmxRedirect(ctx)
  browserRedirect(ctx)
  return ctx.text("Logged Out. Redirecting to Home...")
}