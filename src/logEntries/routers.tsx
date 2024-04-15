import { Hono } from "hono";
import { renderMarkdown } from "./renderMarkdown";
import { AuthMiddleware, AuthLogger, JWTPayload } from "../auth/jwt";
import { insertToDB } from "./insertToDB";
import { getEntries } from "./getEntries";
import { ListEntries } from "./listEntries";

const LogEntriesRouter = new Hono()

LogEntriesRouter.use(AuthMiddleware)

LogEntriesRouter.get("/", async (ctx) => {
    const jwtPayload = ctx.get("jwtPayload" as never) as JWTPayload | null | undefined
    if (!jwtPayload) {
        return ctx.text("Unauthenticated", 401)
    }

    const username = jwtPayload.username as string | null | undefined 
    if (!username) {
        return ctx.text("Error: Server Failure", 500)
    }

    const dbBinding = (ctx.env?.DB) as D1Database
    const entries = await getEntries(dbBinding, username, 0)

    return ctx.render(
        <ListEntries entries={entries} username={username} />
    )
})
LogEntriesRouter.post("/", async (ctx) => {
    const jwtPayload = ctx.get("jwtPayload" as never) as JWTPayload | null | undefined
    if (!jwtPayload) {
        return ctx.text("Unauthenticated", 401)
    }

    const username = jwtPayload.username as string | null | undefined 
    if (!username) {
        return ctx.text("Error: Server Failure", 500)
    }

    const formData = await ctx.req.formData()
    const entryMessage = formData.get("message") as string | null | undefined
    const entryTimestamp = formData.get("timestamp") as string | null | undefined
    if (!entryTimestamp || ! entryMessage) {
        return ctx.text("Error: Can't Parse Data", 400)
    }

    const dbBinding = (ctx.env?.DB) as D1Database
    await insertToDB(dbBinding, entryMessage, entryTimestamp, username)
    await getEntries(dbBinding, username, 0)

    return ctx.text("Log Entry Saved")
})

LogEntriesRouter.post("/render-markdown", async (c) => {
    const authLogger = c.get("authLogger" as never) as AuthLogger

    const formData = await c.req.formData()
    const message = formData.get("message") as string | null
    if (message === null) {
        authLogger("Obtained null message")
        c.status(400)
        return c.render(
            <p>Error Getting Message</p>
        )
    }

    const RenderedMarkdown = renderMarkdown(message)
    authLogger("Successfully converted markdown to html")
    return c.render(
        RenderedMarkdown
    )
})

export default LogEntriesRouter