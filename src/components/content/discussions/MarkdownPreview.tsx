"use client"

interface MarkdownPreviewProps {
    content: string
}

export default function MarkdownPreview({ content }: Readonly<MarkdownPreviewProps>) {
    const parseMarkdown = (text: string) => {
        let html = text

        // Escape HTML
        html = html.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")

        // Headers
        html = html.replace(/^### (.*?)$/gm, (_, p1) => {
            const id = p1.toLowerCase().replace(/[^\w]+/g, "-")
            return `<h3 id="${id}" class='content-headline text-lg font-semibold mt-5 -mb-2 text-foreground'>${p1}</h3>`
        })
        html = html.replace(/^## (.*?)$/gm, (_, p1) => {
            const id = p1.toLowerCase().replace(/[^\w]+/g, "-")
            return `<h2 id="${id}" class='content-headline text-xl font-semibold mt-5 -mb-3 text-foreground'>${p1}</h2>`
        })
        html = html.replace(/^# (.*?)$/gm, (_, p1) => {
            const id = p1.toLowerCase().replace(/[^\w]+/g, "-")
            return `<h1 id="${id}" class='content-headline text-2xl font-semibold mt-5 -mb-4 text-foreground'>${p1}</h1>`
        })

        // Bold & Italic
        html = html.replace(/\*\*(.*?)\*\*/g, "<strong class='font-semibold text-foreground'>$1</strong>")
        html = html.replace(/\*(.*?)\*/g, "<em class='italic text-foreground'>$1</em>")

        // Code blocks
        html = html.replace(
            /```([\s\S]*?)```/g,
            "<pre class='bg-muted p-4 rounded-lg text-sm overflow-x-auto text-secondary-foreground'><code>$1</code></pre>"
        )

        // Inline code
        html = html.replace(
            /`([^`]+)`/g,
            "<code class='bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-secondary-foreground'>$1</code>"
        )

        // Links
        html = html.replace(
            /\[([^\]]+)\]\(([^)]+)\)/g,
            "<a href='$2' class='text-primary hover:underline' target='_blank' rel='noopener noreferrer'>$1</a>"
        )

        // Blockquotes
        html = html.replace(
            /^&gt; (.*?)$/gm,
            "<blockquote class='border-l-2 border-primary pl-3 italic text-muted-foreground my-3'>$1</blockquote>"
        )

        // Lists
        html = html.replace(/^- (.*?)$/gm, "<li class='ml-4 -mb-4 text-secondary-foreground'>$1</li>")
        html = html.replace(/(<li[\s\S]*?<\/li>)/g, "<ul class='list-disc'>$1</ul>")
        html = html.replace(/^\d+\. (.*?)$/gm, "<li class='ml-4 -mb-4 text-secondary-foreground'>$1</li>")

        // Mentions
        html = html.replace(/@(\w+)/g, "<span class='text-primary font-semibold'>@$1</span>")

        // Line breaks
        html = html.replace(/\n/g, "<br />")

        return html
    }

    return (
        <article className="prose prose-lg max-w-none flex-1 text-secondary-foreground leading-relaxed">
            <div dangerouslySetInnerHTML={{ __html: parseMarkdown(content) }} />
        </article>
    )
}