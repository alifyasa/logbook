import { Hono } from "hono";
import { html } from "hono/html";
import showdown from "showdown";
import xss, { FilterXSS, getDefaultWhiteList } from "xss";

const LogEntriesRouter = new Hono()

LogEntriesRouter.post("/", (c) => c.text("Message Submitted"))
LogEntriesRouter.post("/render-markdown", async (c) => {
    const formData = await c.req.formData()
    const message = formData.get("message") as string | null

    if (!message) {
        c.status(400)
        return c.render(
            <p>Error Parsing Message</p>
        )
    }

    const classMap: Record<string, string> = {
        'h1': 'text-2xl font-semibold mb-3',
        'h2': 'text-xl font-semibold mb-2',
        'h3': 'text-lg font-semibold mb-1',
        'p': 'text-base leading-normal mb-4',
        'a': 'text-blue-500 underline',
        'ul': 'list-disc pl-5 mb-4',
        'ol': 'list-decimal pl-5 mb-4',
        'li': 'mb-2',
        'blockquote': 'border-l-4 border-gray-300 pl-4 italic text-gray-600 my-4',
        'code': 'font-mono text-sm bg-gray-100 p-1 rounded'
    }
    const classBindings = Object.keys(classMap)
        .map(key => ({
            type: 'output',
            regex: new RegExp(`<${key}(.*)>`, 'g'),
            replace: `<${key} class="${classMap[key]}" $1>`
        }));
    const converter = new showdown.Converter({
        extensions: [
            ...classBindings,
            {
                type: 'output',
                regex: new RegExp('<a(.*)>', 'g'),
                replace: '<a target="_blank" $1>'
            }
        ]
    })

    let whiteListedTags = getDefaultWhiteList() 
    for (const classMapKey in classMap) {
        if(whiteListedTags[classMapKey] === undefined) {
            whiteListedTags[classMapKey] = ["class"]
        }
        whiteListedTags[classMapKey]?.push("class")
    }
    const RenderedMarkdown = xss(converter.makeHtml(message), {
        whiteList: whiteListedTags
    })

    return c.render(
        RenderedMarkdown
    )
})

export default LogEntriesRouter