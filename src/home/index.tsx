import { BaseLayout } from "../layouts/BaseLayout"

export const Home = () => {
    return (
        <BaseLayout 
            className="max-w-4xl mx-auto border-2 border-t-0 border-black p-8 font-sans"
        >
            <h1 class="text-3xl font-semibold leading-none pb-2">LogBook</h1>
            <h2 class="text-xl">Your Journey, Digitally Documented.</h2>
        </BaseLayout>
    )
}