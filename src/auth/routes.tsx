import { Hono } from 'hono'
import { AuthDialog } from './dialog'

const AuthRouter = new Hono()

AuthRouter.get('/form/:formType', (c) => {
  const {  formType = "login" } = c.req.param() as never
  // Cache for 1 Week
  c.res.headers.set("Cache-Control", `max-age=${60 * 60 * 24 * 7}`)
  return c.render(
    <AuthDialog formType={formType} />
  )
})

export default AuthRouter