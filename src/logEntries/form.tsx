import { html } from "hono/html"

export const LogEntriesForm = () => {
    return (
        <>
        <form
            hx-post="/log-entries/render-markdown"
            hx-trigger="input"
            hx-target="#rendered-markdown"
            class="flex flex-col h-full"
        >
            <div class="flex flex-row h-full pb-2">
                <div class="mr-1 w-1/2 h-full flex flex-col">
                    <div class="flex border rounded py-2 px-4 mb-2">
                        <h3 id="time-display" class="font-mono">2024/04/15 05:50</h3>
                    </div>
                    <input type="hidden" id="timestamp-input" name="timestamp"></input>
                    <textarea
                        name="message"
                        class="flex-grow p-4 leading-tight border rounded focus:outline-none focus:border-blue-500 resize-none"
                        autofocus
                    >
                    </textarea>
                </div>
                <div class="ml-1 w-1/2 h-full flex flex-col">

                    <div id="rendered-markdown" class="flex-grow p-4 rounded border overflow-y-scroll overflow-x-auto">

                    </div>
                </div>
            </div>
            <button
                type="submit"
                hx-post="/log-entries"
                hx-trigger="click"
                hx-target="#rendered-markdown"
                class="px-4 py-2 w-full rounded hover:border-blue-400 border"
                onclick="updateTimeInput()"
            >Submit</button>
        </form>
        {html`
        <script>
        function updateTime() {
            var now = new Date();
            var year = now.getFullYear();
            var month = (now.getMonth() + 1).toString().padStart(2, '0');
            var day = now.getDate().toString().padStart(2, '0');
            var hours = now.getHours().toString().padStart(2, '0');
            var minutes = now.getMinutes().toString().padStart(2, '0');
            var offset = -now.getTimezoneOffset() / 60; // Get timezone offset in hours
            var offsetString = (offset >= 0 ? '+' : '-') + Math.abs(offset).toString().padStart(2, '0') + ':00'; // Format offset string
            
            var timeString = year + '/' + month + '/' + day + ' ' + hours + ':' + minutes + ' (UTC' + offsetString + ')';
            
            document.getElementById('time-display').textContent = timeString;
        }
        
        // Update time every second
        setInterval(updateTime, 1000);
        
        // Initial call to display time immediately
        updateTime();

        function getCurrentTimestampWithTimezone() {
            var now = new Date();
            var offset = -now.getTimezoneOffset();
            var offsetHours = Math.floor(offset / 60);
            var offsetMinutes = offset % 60;
            var offsetString = (offsetHours < 0 ? '-' : '+') +
                               ('00' + Math.abs(offsetHours)).slice(-2) +
                               ':' +
                               ('00' + Math.abs(offsetMinutes)).slice(-2);
            
            var isoString = now.toISOString().slice(0, -1) + offsetString;
            
            return isoString;
        }

        function updateTimeInput(){
            // Set value of hidden input field
            document.getElementById('timestamp-input').value = getCurrentTimestampWithTimezone();
        }
        </script>`}
        </>
    )
}