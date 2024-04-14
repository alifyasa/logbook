import { Hono } from 'hono'
import { Home } from '.';
import { getCookie } from 'hono/cookie';
import { env } from 'hono/adapter';

import * as jose from 'jose';

const HomeRouter = new Hono()

HomeRouter.get('/', async (c) => {
  const jwtToken = getCookie(c, "jwt")
  if (!jwtToken) {
    return c.render(
      <Home />
    )
  }

  const { SECRET_KEY } = env<{ SECRET_KEY: string | null | undefined }>(c)
  if (!SECRET_KEY) {
    return c.text("Unexpected Failure", 500)
  }

  let verifiedJwt;
  try {
    verifiedJwt = await jose.jwtVerify(jwtToken, new TextEncoder().encode(SECRET_KEY))
  } catch (error) {
    verifiedJwt = null    
  }

  if (!verifiedJwt) {
    return c.render(
      <Home />
    )
  }

  return c.render(
    <Home username={verifiedJwt.payload.username as string}/>
  )
})

export default HomeRouter