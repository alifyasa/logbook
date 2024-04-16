import { html } from "hono/html"

interface Props {
    children: JSX.Element[] | JSX.Element,
    title?: string,
    className?: string,
}

export const BaseLayout = ({ children, title, className }: Props) => {
    return (
        <>
            {html`<!DOCTYPE html>`}
            <html>
                <head>
                    <link rel="icon" type="image/svg+xml" href="/static/favicon.svg"></link>
                    <link href="/static/styles.css" rel="stylesheet" />
                    <script src="https://unpkg.com/htmx.org@1.9.11"></script>
                    <script src="https://unpkg.com/htmx.org@1.9.11/dist/ext/response-targets.js"></script>
                    <script src="https://unpkg.com/htmx.org@1.9.11/dist/ext/remove-me.js"></script>
                    {/* <script src="https://unpkg.com/htmx.org@1.9.11/dist/ext/debug.js"></script> */}
                    <title>{title}</title>
                </head>
                <body 
                    class={className}
                    hx-ext="response-targets, remove-me"
                    _="on every htmx:beforeSend in <button:not(.no-disable)/> tell it toggle [disabled='true'] until htmx:afterOnLoad"
                >{children}</body>
            </html>
        </>
    )
}