import { Context } from "hono"
import { setCookie } from "hono/cookie"

export async function isExistUser(dbBinding: D1Database, username: string) {
    const dbSelectResponse = await dbBinding
        .prepare("SELECT username FROM users WHERE username = ?;")
        .bind(username)
        .all()

    const dbRecord = dbSelectResponse.results
    console.log(dbRecord.length !== 0)
    return dbRecord.length !== 0
}

export async function removeJwtAndRedirectToHome(ctx: Context) {
  setCookie(ctx, "jwt", "", {
    secure: true,
    sameSite: "Strict",
    httpOnly: true,
    maxAge: 0,
    expires: new Date(0)
  })
  ctx.header("HX-Redirect", "/")
}