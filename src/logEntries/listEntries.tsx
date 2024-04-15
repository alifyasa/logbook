import { html } from "hono/html"
import { BaseLayout } from "../layouts/BaseLayout"
import { renderMarkdown } from "./renderMarkdown"
import { LogEntry, formatTimestamp } from "./utils"
import { AuthControl } from "../auth/components/control"
import { BaseHeader } from "../home/header"

interface Props {
    entries: LogEntry[],
    username: string
}

export const ListEntries = ({ entries, username }: Props) => {
    return (
        <BaseLayout
            className="p-8 font-sans w-screen h-screen flex flex-col"
        >
            <BaseHeader username={username} />
            <>
                {
                    entries.map(entry => {
                        const ht = renderMarkdown(entry.entryMessage)
                        return (
                            <div class="text-wrap">
                                <h1 class="text-md">{formatTimestamp(entry.entryTimestamp)}</h1>
                                {html(ht as unknown as TemplateStringsArray)}
                            </div>
                        )
                    })
                }
            </>
        </BaseLayout>
    )

}