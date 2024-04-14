interface Props {
    children: JSX.Element[],
    title?: string,
    className?: string,
}

export const BaseLayout = ({ children, title, className }: Props) => {
    return (
        <html>
            <head>
                <link href="/static/styles.css" rel="stylesheet" />
                <script src="https://unpkg.com/htmx.org@1.9.11"></script>
                <title>{title}</title>
            </head>
            <body class={className}>{children}</body>
        </html>
    )
}