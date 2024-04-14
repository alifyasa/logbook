interface Props {
    formType: string
}

export const AuthForm = ({ formType }: Props) => {
    return (
        <>
            <h2 class="text-3xl font-semibold mb-4">
                <span class="capitalize">{formType}</span> to LogBook
            </h2>
            <form
                id="loginForm"
                hx-post={`/auth/${formType}`}
                class="m-0"
            >
                <div class="mb-2">
                    <label for="username" class="block mb-1 text-lg">Username</label>
                    <input tabindex={1} class="w-full border border-black p-2 rounded text-md" type="text" id="username" name="username" required />
                </div>
                <div class="mb-8">
                    <label for="password" class="block mb-1 text-lg">Password</label>
                    <input tabindex={2} class="w-full border border-black p-2 rounded text-md" type="password" id="password" name="password" required />
                </div>
                <div class="flex flex-row justify-between">
                    <button tabindex={4} class="py-1 px-2 border border-black border-opacity-50 rounded capitalize" type="button" id="auth-close-button">Close</button>
                    <button 
                        tabindex={3} 
                        class="py-1 px-2 border border-black border-opacity-50 rounded capitalize" 
                        type="submit"
                    >{formType}</button>
                </div>
            </form>
            <div id="loginResult">
            </div>
        </>
    )
}