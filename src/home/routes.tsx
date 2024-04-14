import { Hono } from 'hono'
import { Home } from '.';
import { getCookie } from 'hono/cookie';

import { getSecretKey, jwtVerify } from '../auth/jwt';

const HomeRouter = new Hono()

HomeRouter.get('/', async (c) => {
  const jwtToken = getCookie(c, "jwt")
  if (!jwtToken) {
    return c.render(
      <Home />
    )
  }

  const SECRET_KEY = getSecretKey(c)
  if (!SECRET_KEY) {
    return c.text("Unexpected Failure", 500)
  }

  const verifiedJwt = await jwtVerify(jwtToken, SECRET_KEY)
  if (!verifiedJwt) {
    return c.render(
      <Home />
    )
  }

  return c.render(
    <Home username={verifiedJwt.payload.username as string} />
  )
})

export default HomeRouter