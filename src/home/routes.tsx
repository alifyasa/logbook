import { Hono } from 'hono'
import { Home } from '.';

const HomeRouter = new Hono()

HomeRouter.get('/', (c) => {
  return c.render(
    <Home />
  )
})

export default HomeRouter