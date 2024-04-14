import { html } from "hono/html"
import { AuthForm } from "./form"

interface Props {
    formType: string
}

export const AuthDialog = (props: Props) => {
    return (
        <>
            <dialog open id="auth-dialog" 
                class="p-8 border-2 border-black border-opacity-25 rounded w-96"
            >
                <AuthForm {...props}/>
            </dialog>
            {html`
            <script>
            document.getElementById("auth-close-button").addEventListener("click", function() {
                document.getElementById("auth-dialog").close();
                document.getElementById("auth-dialog").remove();
            });
            </script>
            `}
        </>
    )
}