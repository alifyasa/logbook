import { AuthControl } from "../auth/components/control"

interface Props {
    username?: string
}

export const BaseHeader = ({ username }: Props) => {
    return (
        <>
            <div class="flex flex-row mb-8">
                <div class="flex-grow">
                    <h1 class="text-3xl font-semibold leading-none pb-2">
                        <a href="/" class="hover:underline">LogBook</a>
                    </h1>
                    <h2 class="text-xl">
                        <a href="/log-entries" class="text-blue-600 hover:underline">
                            Your Journey
                        </a>, Digitally Documented.
                    </h2>
                </div>
                <AuthControl username={username} />
            </div>
        </>
    )
}