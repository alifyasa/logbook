import { Hono } from "hono";
import { html } from "hono/html";
import showdown from "showdown";
import xss, { FilterXSS, getDefaultWhiteList } from "xss";
import { renderMarkdown } from "./renderMarkdown";

const LogEntriesRouter = new Hono()

LogEntriesRouter.post("/", (c) => c.text("Message Submitted"))
LogEntriesRouter.post("/render-markdown", async (c) => {
    const formData = await c.req.formData()
    const message = formData.get("message") as string | null
    if (message === null) {
        c.status(400)
        return c.render(
            <p>Error Getting Message</p>
        )
    }

    const RenderedMarkdown = renderMarkdown(message)
    return c.render(
        RenderedMarkdown
    )
})

export default LogEntriesRouter