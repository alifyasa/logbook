import { html } from "hono/html"
import { BaseLayout } from "../layouts/BaseLayout"
import { renderMarkdown } from "./renderMarkdown"
import { LogEntry, formatTimestamp } from "./utils"
import { AuthControl } from "../auth/components/control"

interface Props {
    entries: LogEntry[],
    username: string
}

export const ListEntries = ({ entries, username }: Props) => {
    return (
        <BaseLayout
            className="p-8 font-sans w-screen h-screen flex flex-col"
        >
            <div class="flex flex-row mb-8">
                <div class="flex-grow">
                    <h1 class="text-3xl font-semibold leading-none pb-2">LogBook</h1>
                    <h2 class="text-xl">Your Journey, Digitally Documented.</h2>
                </div>
                <AuthControl username={username} />
            </div>
            <>
                {
                    entries.map(entry => {
                        const ht = renderMarkdown(entry.entryMessage)
                        return (
                            <>
                                <h1 class="text-md">{formatTimestamp(entry.entryTimestamp)}</h1>
                                {html(ht as unknown as TemplateStringsArray)}
                            </>
                        )
                    })
                }
            </>
        </BaseLayout>
    )

}