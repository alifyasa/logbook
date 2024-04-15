import Showdown from "showdown";
import xss, { getDefaultWhiteList } from "xss";

const defaultClassMap: Record<string, string> = {
    'h1': 'text-2xl font-semibold mb-3',
    'h2': 'text-xl font-semibold mb-2',
    'h3': 'text-lg font-semibold mb-1',
    'p': 'text-base leading-normal mb-4',
    'a': 'text-blue-500 underline',
    'ul': 'list-disc pl-5 mb-4',
    'ol': 'list-decimal pl-5 mb-4',
    'li': 'mb-2',
    'blockquote': 'border-l-4 border-gray-300 pl-4 italic text-gray-600 my-4',
    'code': 'font-mono',
    'pre': 'font-mono text-sm bg-gray-100 p-2 rounded'
}

export const renderMarkdown = (markdown: string, classMap = defaultClassMap) => {
    const classBindings = Object.keys(classMap)
        .map(key => ({
            type: 'output',
            regex: new RegExp(`(?:<${key}>)|(?:<${key} (.*)>)`, 'g'),
            replace: `<${key} class="${classMap[key]}" $1>`
        }));
    const converter = new Showdown.Converter({
        extensions: [
            ...classBindings,
            {
                // Open link in new tab
                type: 'output',
                regex: new RegExp('<a(.*)>', 'g'),
                replace: '<a target="_blank" $1>'
            }
        ]
    })

    let whiteListedTags = getDefaultWhiteList()
    for (const classMapKey in classMap) {
        if (whiteListedTags[classMapKey] === undefined) {
            whiteListedTags[classMapKey] = ["class"]
        }
        whiteListedTags[classMapKey]?.push("class")
    }
    const rawHtml = converter.makeHtml(markdown)
    const RenderedMarkdown = xss(rawHtml, {
        whiteList: whiteListedTags
    })

    return RenderedMarkdown
}