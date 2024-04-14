import { BaseLayout } from "../layouts/BaseLayout"

interface Props {
    username?: string
}

export const Home = ({ username }: Props) => {
    return (
        <BaseLayout
            className="max-w-4xl mx-auto border-2 border-t-0 border-black p-8 font-sans"
        >
            <div class="flex flex-row">
                <div class="flex-grow">
                    <h1 class="text-3xl font-semibold leading-none pb-2">LogBook</h1>
                    <h2 class="text-xl">Your Journey, Digitally Documented.</h2>
                </div>
                {
                    username ? (
                        <div class="px-4 py-2 border border-black rounded size-fit my-auto mr-4">
                            <h1 class="font-mono">{username}</h1>
                        </div>
                    ) : (
                        <>
                            <button
                                id="auth-login-button"
                                class="m-2 py-2 px-4 border border-opacity-20 border-black rounded hover:border-opacity-100 active:bg-gray-200"
                                hx-get="/auth/form/login"
                                hx-target="#auth-dialog-container"
                                hx-swap="innerHTML"
                            >
                                Login
                            </button>
                            <button
                                id="auth-register-button"
                                class="m-2 py-2 px-4 border border-opacity-25 border-black rounded hover:border-opacity-100 active:bg-gray-200"
                                hx-get="/auth/form/register"
                                hx-target="#auth-dialog-container"
                                hx-swap="innerHTML"
                            >
                                Register
                            </button>
                        </>

                    )
                }
            </div>
            <div id="auth-dialog-container">

            </div>
        </BaseLayout>
    )
}