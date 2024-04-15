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
            <div class="flex-grow overflow-scroll">
                    {
                        entries.map(entry => {
                            const ht = renderMarkdown(entry.entryMessage)
                            return (
                                <div class="flex flex-col mb-2 border rounded border-black">
                                    <div class="py-2 px-4 border-b border-black flex">
                                        <h1 class="text-md font-mono flex-grow">{formatTimestamp(entry.entryTimestamp)}</h1>
                                        <h1 class="text-md font-mono">[{entry.id}]</h1>
                                    </div>
                                    <div class="flex-grow p-4 text-wrap">
                                        {html(ht as unknown as TemplateStringsArray)}
                                    </div>
                                </div>
                            )
                        })
                    }
            </div>
        </BaseLayout>
    )

}