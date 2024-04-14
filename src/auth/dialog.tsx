import { html } from "hono/html"
import { AuthForm } from "./form"

interface Props {
    formType: string
}

export const AuthDialog = (props: Props) => {
    return (
        <div id="auth-dialog-backdrop" class="absolute top-0 left-0 w-screen h-screen bg-black bg-opacity-20 flex items-center">
            <dialog open id="auth-dialog" 
                class="p-8 border-2 border-black border-opacity-25 rounded w-96 z-10 moda"
            >
                <AuthForm {...props}/>
            </dialog>
            {html`
            <script>
            function removeDialog() {
                document.getElementById("auth-dialog").close();
                document.getElementById("auth-dialog-backdrop").remove();
            }
            document.getElementById("auth-close-button").addEventListener("click", removeDialog);
            </script>
            `}
        </div>
    )
}