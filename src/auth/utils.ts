import { Context } from "hono"
import { setCookie } from "hono/cookie"

export async function isExistUser(dbBinding: D1Database, username: string) {
    const dbSelectResponse = await dbBinding
        .prepare("SELECT username FROM users WHERE username = ?;")
        .bind(username)
        .all()

    const dbRecord = dbSelectResponse.results
    return dbRecord.length !== 0
}

export function removeJwtAndRedirectToHome(ctx: Context) {
  setCookie(ctx, "jwt", "", {
    secure: true,
    sameSite: "Strict",
    httpOnly: true,
    maxAge: 0,
    expires: new Date(0)
  })
  ctx.header("HX-Redirect", "/")
}

export function removeJwt(ctx: Context) {
  setCookie(ctx, "jwt", "", {
    secure: true,
    sameSite: "Strict",
    httpOnly: true,
    maxAge: 0,
    expires: new Date(0)
  })
}

export function htmxRedirect(ctx: Context, redirectLocation = "/") {
  ctx.header("HX-Redirect", redirectLocation)
}

export function browserRedirect(ctx: Context, redirectLocation = "/") {
    ctx.status(307)
    ctx.header("Location", redirectLocation)
}