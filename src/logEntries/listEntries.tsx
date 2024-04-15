import { html } from "hono/html";
import { renderMarkdown } from "./renderMarkdown";
import { LogEntry, formatTimestamp } from "./utils";

interface Props {
    entries: LogEntry[],
    offset?: number
}

export const ListEntries = ({ entries, offset = 0 }: Props) => {
    return (
        <>
            {
                entries.map(entry => {
                    const ht = renderMarkdown(entry.entryMessage)
                    return (
                        <div class="flex flex-col mb-2 border rounded border-black">
                            <div class="py-2 px-4 border-b border-black flex">
                                <h1 class="text-md font-mono flex-grow">{formatTimestamp(entry.entryTimestamp)}</h1>
                                {/* <h1 class="text-md font-mono">[#{entry.id}]</h1> */}
                            </div>
                            <div class="flex-grow p-4 text-wrap">
                                {html(ht as unknown as TemplateStringsArray)}
                            </div>
                        </div>
                    )
                })
            }
            {
                entries.length === 0 ? (
                    <div class="flex flex-col mb-2 border rounded border-black px-4 py-2 items-center font-mono">
                        <h1>You've reached the top!</h1>
                    </div>
                ) : (
                    <button
                        class="font-mono p-4 border rounded border-black hover:bg-blue-50 mb-2"
                        hx-get={`/log-entries/${offset + entries.length}`}
                        hx-swap="outerHTML"
                        hx-trigger="intersect once"
                    >
                        loading more...
                    </button>
                )
            }
        </>
    )

}