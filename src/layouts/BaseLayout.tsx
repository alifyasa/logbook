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
                    <link href="/static/styles.css" rel="stylesheet" />
                    <script src="https://unpkg.com/htmx.org@1.9.11"></script>
                    <title>{title}</title>
                </head>
                <body class={className}>{children}</body>
            </html>
        </>
    )
}