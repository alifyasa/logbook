import bcrypt from 'bcryptjs';
import { H } from 'hono/types';
import { getSecretKey, jwtSign } from './jwt';
import { setCookie } from 'hono/cookie';

export async function login(dbBinding: D1Database, username: string, password: string) {
    const dbResponse = await dbBinding
        .prepare("SELECT username, password_hash FROM users WHERE username = ?;")
        .bind(username)
        .all()

    const dbRecord = dbResponse.results.find(record => record.username === username)

    if (dbRecord) {
        const { password_hash } = dbRecord
        const compareResult = await bcrypt.compare(password, password_hash as string)
        return compareResult
    }

    return false
}

export const LogInHandler: H = async (ctx) => {
  const formData = await ctx.req.formData()

  const username = formData.get("username") as string | null
  const password = formData.get("password") as string | null
  if (!username || !password) {
    ctx.status(400)
    return ctx.render(
      <p remove-me="3s">Username or Password cannot be empty</p>
    )
  }

  const dbBinding = (ctx.env?.DB) as D1Database
  const isAuthenticated = await login(dbBinding, username, password)
  if (!isAuthenticated) {
    ctx.status(401)
    return ctx.render(
      <p remove-me="3s">Authentication Failed</p>
    )
  }

  const SECRET_KEY = getSecretKey(ctx)
  if (!SECRET_KEY) {
    ctx.status(500)
    return ctx.render(
      <p remove-me="3s">Unexpected Failure</p>
    )
  }

  const jwtToken = await jwtSign({ username }, SECRET_KEY)  
  setCookie(ctx, "jwt", jwtToken, {
    secure: true,
    sameSite: "Strict",
    httpOnly: true,
    maxAge: 4 * 7 * 24 * 60 * 60,
  })

  ctx.header("HX-Refresh", "true")
  return ctx.text(`Authenticated, Refreshing Page...`, 200)
}