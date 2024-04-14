import { Context } from 'hono';
import { env } from 'hono/adapter';
import * as jose from 'jose';

export const getSecretKey = (ctx: Context) => {
  const { SECRET_KEY } = env<{ SECRET_KEY: string | null | undefined }>(ctx)
  return SECRET_KEY
}

export const jwtSign = async (object: jose.JWTPayload, secretKey: string) => {
    return await new jose.SignJWT(object)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('2h')
        .sign(new TextEncoder().encode(secretKey))
}

export const jwtVerify = async (jwtToken: string, secretKey: string) => {
  try {
    return await jose.jwtVerify(jwtToken, new TextEncoder().encode(secretKey))
  } catch (error) {
    return null    
  }
}