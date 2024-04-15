import { BaseLayout } from "../layouts/BaseLayout"
import { LogEntry } from "./utils"
import { BaseHeader } from "../home/header"
import { ListEntries } from "./listEntries"

interface Props {
    entries: LogEntry[],
    username: string
}

export const ListEntriesPage = ({ entries, username }: Props) => {
    return (
        <BaseLayout
            className="p-8 font-sans w-screen h-screen flex flex-col"
        >
            <BaseHeader username={username} />
            <div class="flex-grow overflow-scroll flex flex-col-reverse">
                <ListEntries entries={entries} />
            </div>
        </BaseLayout>
    )

}