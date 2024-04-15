import { AuthControl } from "../auth/components/control"
import { BaseLayout } from "../layouts/BaseLayout"
import { LogEntriesForm } from "../logEntries/form"
import { BaseHeader } from "./header"

interface Props {
    username?: string
}

export const Home = ({ username }: Props) => {
    const isAuthenticated = Boolean(username)
    return (
        <BaseLayout
            className="p-8 font-sans w-screen h-screen flex flex-col"
        >
            <BaseHeader username={username}/>
            <div class="flex-grow">
                {
                    isAuthenticated ? (
                        <>
                            <LogEntriesForm />
                        </>
                    ) : (
                        <p>Welcome to LogBook! Please Login First!</p>
                    )
                }
            </div>
            <div id="auth-dialog-container">

            </div>
        </BaseLayout>
    )
}