export const LogEntriesForm = () => {
    return (
        <form
            hx-post="/log-entries/render-markdown"
            hx-trigger="input"
            hx-target="#rendered-markdown"
            class="flex flex-col h-full"
        >
            <div class="flex flex-row h-full pb-2">
                <textarea
                    name="message"
                    class="w-1/2 mr-1 h-full p-4 leading-tight border rounded focus:outline-none focus:border-blue-500 resize-none"
                    autofocus
                >
                </textarea>
                <div id="rendered-markdown" class="ml-1 p-4 w-1/2 rounded border h-full overflow-y-scroll overflow-x-auto">

                </div>
            </div>
            <button
                type="submit"
                name="submit"
                hx-post="/log-entries"
                hx-trigger="click"
                hx-target="#rendered-markdown"
                class="px-4 py-2 w-full rounded hover:border-blue-400 border"
            >Submit</button>
        </form>
    )
}