import { Hono } from 'hono'
import { AuthDialog } from './dialog'
import { register } from './register'
import * as jose from 'jose';
import { login } from './login'
import { env } from 'hono/adapter';
import { setCookie } from 'hono/cookie';

const AuthRouter = new Hono()

AuthRouter.get('/form/:formType', (c) => {
  let { formType = "" } = c.req.param() as never
  formType = formType.toLowerCase()

  if (formType !== "login" && formType !== "register") {
    return c.text(`Invalid Form: ${formType}`, 404)
  }
  // Cache for 1 Week
  // c.res.headers.set("Cache-Control", `max-age=${60 * 60 * 24 * 7}`)
  return c.render(
    <AuthDialog formType={formType} />
  )
})

AuthRouter.post('/register', async (c) => {
  const formData = await c.req.formData()

  const username = formData.get("username") as string | null
  const password = formData.get("password") as string | null

  if (!username || !password) {
    c.status(400)
    return c.render(
      <p remove-me="3s">Username or Password cannot be empty</p>
    )
  }

  const dbBinding = (c.env?.DB) as D1Database
  const registerSuccess = await register(dbBinding, username, password)

  if (!registerSuccess) {
    c.status(500)
    return c.render(
      <p remove-me="3s">Registration Failed</p>
    )
  }

  const isAuthenticated = await login(dbBinding, username, password)

  if (!isAuthenticated) {
    c.status(401)
    return c.render(
      <p remove-me="3s">Authentication Failed</p>
    )
  }

  const { SECRET_KEY } = env<{ SECRET_KEY: string | null | undefined }>(c)

  if (!SECRET_KEY) {
    c.status(500)
    return c.render(
      <p remove-me="3s">Unexpected Failure</p>
    )
  }

  const jwtToken = await new jose.SignJWT({ username })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('2h')
    .sign(new TextEncoder().encode(SECRET_KEY))
  
  setCookie(c, "jwt", jwtToken, {
    secure: true,
    sameSite: "Strict",
    httpOnly: true
  })

  c.res.headers.set("HX-Refresh", "true")
  return c.text(`Authenticated, Refreshing Page...`, 200)
})

AuthRouter.post('/login', async (c) => {
  const formData = await c.req.formData()

  const username = formData.get("username") as string | null
  const password = formData.get("password") as string | null

  if (!username || !password) {
    c.status(400)
    return c.render(
      <p remove-me="3s">Username or Password cannot be empty</p>
    )
  }

  const dbBinding = (c.env?.DB) as D1Database
  const isAuthenticated = await login(dbBinding, username, password)

  if (!isAuthenticated) {
    c.status(401)
    return c.render(
      <p remove-me="3s">Authentication Failed</p>
    )
  }

  const { SECRET_KEY } = env<{ SECRET_KEY: string | null | undefined }>(c)

  if (!SECRET_KEY) {
    c.status(500)
    return c.render(
      <p remove-me="3s">Unexpected Failure</p>
    )
  }

  const jwtToken = await new jose.SignJWT({ username })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('2h')
    .sign(new TextEncoder().encode(SECRET_KEY))
  
  setCookie(c, "jwt", jwtToken, {
    secure: true,
    sameSite: "Strict",
    httpOnly: true
  })

  c.res.headers.set("HX-Refresh", "true")
  return c.text(`Authenticated, Refreshing Page...`, 200)
})

export default AuthRouter