import { Context, MiddlewareHandler } from 'hono';
import { env } from 'hono/adapter';
import { getCookie } from 'hono/cookie';
import { logger } from 'hono/logger';
import * as jose from 'jose';
import { isExistUser, removeJwtAndRedirectToHome } from './utils';

export type JWTPayload = jose.JWTPayload
export type AuthLogger = (str: string, ...rest: string[]) => void

export const getSecretKey = (ctx: Context) => {
  const { SECRET_KEY } = env<{ SECRET_KEY: string | null | undefined }>(ctx)
  return SECRET_KEY
}

export const jwtSign = async (object: jose.JWTPayload, secretKey: string) => {
    return await new jose.SignJWT(object)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('4w')
        .sign(new TextEncoder().encode(secretKey))
}

export const jwtVerify = async (jwtToken: string, secretKey: string) => {
  try {
    return await jose.jwtVerify(jwtToken, new TextEncoder().encode(secretKey))
  } catch (error) {
    return null    
  }
}

export const AuthMiddleware: MiddlewareHandler = async (ctx, next) => {
  const jwtToken = getCookie(ctx, "jwt")
  if (!jwtToken) {
    removeJwtAndRedirectToHome(ctx)
    return ctx.text("Error: Unauthenticated", 401)
  }

  const SECRET_KEY = getSecretKey(ctx)
  if (!SECRET_KEY) {
    return ctx.text("Error: Server Failure", 500)
  }

  const jwtPayload = await jwtVerify(jwtToken, SECRET_KEY)
  if(!jwtPayload) {
    removeJwtAndRedirectToHome(ctx)
    return ctx.text("Error: Unauthenticated", 401)
  }
  
  const username = jwtPayload.payload.username as string | null | undefined
  if (!username){
    removeJwtAndRedirectToHome(ctx)
    return ctx.text("Error: Server Failure", 500)
  }

  const dbBinding = (ctx.env?.DB) as D1Database
  const userExist = await isExistUser(dbBinding, username)
  if(!userExist){
    removeJwtAndRedirectToHome(ctx)
    return ctx.text("Error: Unauthenticated", 401)
  }

  ctx.set("jwtPayload", jwtPayload.payload)
  
  // To differentiate log between requests
  const logId = __generateRandomString(8)
  const authLogger: AuthLogger = (str: string, ...rest: string[]) => {
      const trimmedStr = str.trim()
      if (trimmedStr.substring(0, 3) === "<--") {
        console.log(`[${logId}] ${trimmedStr} (User: ${jwtPayload.payload.username})`, ...rest)
        return
      }

      console.log(`[${logId}] ${trimmedStr}`, ...rest)
  }
  ctx.set("authLogger", authLogger)
  const loggerMiddleware = logger(authLogger)
  await loggerMiddleware(ctx, next)
}

export const AuthCheckMiddleware: MiddlewareHandler = async (ctx, next) => {
  const jwtToken = getCookie(ctx, "jwt")
  if (!jwtToken) {
    ctx.set("isAuthenticated", false)
    return await next()
  }

  const SECRET_KEY = getSecretKey(ctx)
  if (!SECRET_KEY) {
    ctx.set("isAuthenticated", false)
    return await next()
  }

  const jwtPayload = await jwtVerify(jwtToken, SECRET_KEY)
  if(!jwtPayload) {
    ctx.set("isAuthenticated", false)
    return await next()
  }
  
  const username = jwtPayload.payload.username as string | null | undefined
  if (!username){
    ctx.set("isAuthenticated", false)
    return await next()
  }

  const dbBinding = (ctx.env?.DB) as D1Database
  const userExist = await isExistUser(dbBinding, username)
  if(!userExist){
    ctx.set("isAuthenticated", false)
    return await next()
  }

  ctx.set("username", jwtPayload.payload.username)
  ctx.set("isAuthenticated", true)
  return await next()
}

function __generateRandomString(length: number): string {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        result += charset.charAt(randomIndex);
    }
    return result;
}