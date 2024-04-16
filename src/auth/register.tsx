import bcrypt from 'bcryptjs';
import { SALT_ROUNDS } from './constants';
import { isExistUser } from './utils';
import { H, MiddlewareHandler } from 'hono/types';
import { LogInHandler } from './login';

async function register(dbBinding: D1Database, username: string, password: string) {
    const salt = await bcrypt.genSalt(SALT_ROUNDS)
    const passwordHash = await bcrypt.hash(password, salt)
    
    const userExist = await isExistUser(dbBinding, username)
    if (userExist) {
        return false
    }

    const dbInsertResponse = await dbBinding
        .prepare("INSERT INTO users (username, password_hash) VALUES (?, ?);")
        .bind(username, passwordHash)
        .run()
    
    return dbInsertResponse.success
}

export const RegisterHandler: H = async (ctx, next) => {
  const formData = await ctx.req.formData()

  const username = formData.get("username") as string | null
  const password = formData.get("password") as string | null

  if (!username || !password) {
    ctx.status(400)
    return ctx.render(
      <p remove-me="3s">Username or Password cannot be empty.</p>
    )
  }

  const dbBinding = (ctx.env?.DB) as D1Database
  const registerSuccess = await register(dbBinding, username, password)
  if (!registerSuccess) {
    ctx.status(500)
    return ctx.render(
      <p remove-me="3s">User already exist.</p>
    )
  }

  return await LogInHandler(ctx, next)
}