import { Hono } from 'hono'

import HomeRouter from './home/routes';
import AuthRouter from './auth/routes';
import LogEntriesRouter from './logEntries/routers';

export type Bindings = {
  DB: D1Database
}

const app = new Hono()

app.route('/', HomeRouter)
app.route('/auth', AuthRouter)
app.route('/log-entries', LogEntriesRouter)

app.get("/static/*", async (ctx) => {
  return await (ctx?.env?.ASSETS as any).fetch(ctx.req.raw);
});

export default app
