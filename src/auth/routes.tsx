import { Hono } from 'hono'
import { AuthDialog } from './components/dialog'
import { register } from './register'
import { login } from './login'
import { setCookie } from 'hono/cookie';
import { getSecretKey, jwtSign } from './jwt';
import { browserRedirect, htmxRedirect, removeJwt } from './utils';

const AuthRouter = new Hono()

AuthRouter.get('/logout', (ctx) => {
  removeJwt(ctx)
  htmxRedirect(ctx)
  browserRedirect(ctx)
  return ctx.text("Logged Out. Redirecting to Home...")
})

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

  const SECRET_KEY = getSecretKey(c)
  if (!SECRET_KEY) {
    c.status(500)
    return c.render(
      <p remove-me="3s">Unexpected Failure</p>
    )
  }
  
  const jwtToken = await jwtSign({ username }, SECRET_KEY)  
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

  const SECRET_KEY = getSecretKey(c)
  if (!SECRET_KEY) {
    c.status(500)
    return c.render(
      <p remove-me="3s">Unexpected Failure</p>
    )
  }

  const jwtToken = await jwtSign({ username }, SECRET_KEY)  
  setCookie(c, "jwt", jwtToken, {
    secure: true,
    sameSite: "Strict",
    httpOnly: true
  })

  c.res.headers.set("HX-Refresh", "true")
  return c.text(`Authenticated, Refreshing Page...`, 200)
})

export default AuthRouter