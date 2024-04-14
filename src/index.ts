import { Hono } from 'hono'
import HomeRouter from './home/routes';

const app = new Hono()

app.route('/', HomeRouter)

app.get("/static/*", async (ctx) => {
  return await (ctx?.env?.ASSETS as any).fetch(ctx.req.raw);
});

export default app
