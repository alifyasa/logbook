import { Hono } from 'hono'
import { Home } from '.';
import { getCookie } from 'hono/cookie';

import { getSecretKey } from '../auth/jwt';

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

  const isAuthenticated = c.get("isAuthenticated" as never) as boolean | undefined | null
  const username = c.get("username" as never) as string | undefined | null
  if (!isAuthenticated || !username) {
    return c.render(
      <Home />
    )
  }

  return c.render(
    <Home username={username} />
  )
})

export default HomeRouter