import { html } from "hono/html";
import { renderMarkdown } from "../renderMarkdown";
import { LogEntry, formatTimestamp } from "../utils";

interface Props {
    entries: LogEntry[],
    offset?: number
}

const EmptyEntryMarker = ({ offset = -1 }) => {
    if (offset === 0) {
        return (
            <div class="flex flex-col mb-2 border rounded items-center font-mono flex-grow">
                <h1 class="m-auto text-xl">Add new logs in <a href="/" class="hover:underline text-blue-600">Home</a>!</h1>
            </div>
        )
    }
    return (
        <div class="flex flex-col mb-2 border rounded border-black px-4 py-2 items-center font-mono">
            <h1>You've reached the top!</h1>
        </div>
    )
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
                    <EmptyEntryMarker offset={offset} />
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