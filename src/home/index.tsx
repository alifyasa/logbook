import { AuthControl } from "../auth/components/control"
import { BaseLayout } from "../layouts/BaseLayout"
import { LogEntriesForm } from "../logEntries/form"

interface Props {
    username?: string
}

export const Home = ({ username }: Props) => {
    const isAuthenticated = Boolean(username)
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