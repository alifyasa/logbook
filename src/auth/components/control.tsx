interface Props {
    username?: string
}

export const AuthControl = ({ username }: Props) => {
    const isAuthenticated = Boolean(username)

    if (isAuthenticated) {
        return (
            <>
            <div class="px-4 py-2 border rounded size-fit my-auto mr-2">
                <h1>Logged In as <span class="font-mono">{username}</span></h1>
            </div>
            <a 
                class="mr-4 my-auto py-2 px-4 border border-opacity-20 border-black rounded hover:border-opacity-100 active:bg-gray-200 size-fit"
                href="/auth/logout"
            >
                Log Out
            </a>
            </>
        )
    }

    return (
        <>
            <button
                id="auth-login-button"
                class="mr-2 my-auto py-2 px-4 border border-opacity-20 border-black rounded hover:border-opacity-100 active:bg-gray-200 size-fit"
                hx-get="/auth/form/login"
                hx-target="#auth-dialog-container"
                hx-swap="innerHTML"
            >
                Login
            </button>
            <button
                id="auth-register-button"
                class="mr-4 my-auto py-2 px-4 border border-opacity-25 border-black rounded hover:border-opacity-100 active:bg-gray-200 size-fit"
                hx-get="/auth/form/register"
                hx-target="#auth-dialog-container"
                hx-swap="innerHTML"
            >
                Register
            </button>
        </>
    )

}