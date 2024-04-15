import { Hono } from "hono";
import { renderMarkdown } from "./renderMarkdown";
import { AuthMiddleware, AuthLogger } from "../auth/jwt";

const LogEntriesRouter = new Hono()

LogEntriesRouter.use(AuthMiddleware)
LogEntriesRouter.post("/", (c) => c.text("Message Submitted"))
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