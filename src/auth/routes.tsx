import { Hono } from 'hono'
import { AuthDialog } from './components/dialog'
import { RegisterHandler } from './register'
import { LogInHandler } from './login'
import { LogOutHandler } from './logout';

const AuthRouter = new Hono()

AuthRouter.post('/register', RegisterHandler)
AuthRouter.post('/login', LogInHandler)
AuthRouter.get('/logout', LogOutHandler)
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

export default AuthRouter