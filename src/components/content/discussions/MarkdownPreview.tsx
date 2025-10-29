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
        html = html.replace(/^### (.*?)$/gm, "<h3 class='font-semibold text-sm mt-2 mb-1'>$1</h3>")
        html = html.replace(/^## (.*?)$/gm, "<h2 class='font-semibold text-base mt-2 mb-1'>$1</h2>")
        html = html.replace(/^# (.*?)$/gm, "<h1 class='font-semibold text-lg mt-2 mb-1'>$1</h1>")

        // Bold
        html = html.replace(/\*\*(.*?)\*\*/g, "<strong class='font-semibold'>$1</strong>")
        html = html.replace(/__(.+?)__/g, "<strong class='font-semibold'>$1</strong>")

        // Italic
        html = html.replace(/\*(.*?)\*/g, "<em class='italic'>$1</em>")
        html = html.replace(/_(.+?)_/g, "<em class='italic'>$1</em>")

        // Code blocks
        html = html.replace(
            /```([\s\S]*?)```/g,
            "<pre class='bg-muted p-2 rounded text-xs overflow-x-auto my-1'><code>$1</code></pre>",
        )

        // Inline code
        html = html.replace(
            /`([^`]+)`/g,
            "<code class='bg-muted px-1.5 py-0.5 rounded text-xs font-mono'>$1</code>",
        )

        // Links
        html = html.replace(
            /\[([^\]]+)\]\(([^)]+)\)/g,
            "<a href='$2' class='text-primary hover:underline' target='_blank' rel='noopener noreferrer'>$1</a>",
        )

        // Blockquotes
        html = html.replace(
            /^&gt; (.*?)$/gm,
            "<blockquote class='border-l-2 border-primary pl-2 italic text-muted-foreground my-1'>$1</blockquote>",
        )

        // Unordered lists
        html = html.replace(/^- (.*?)$/gm, "<li class='ml-4'>$1</li>")
        html = html.replace(/(<li class='ml-4'>[\s\S]*?<\/li>)/, "<ul class='list-disc my-1'>$1</ul>")

        // Ordered lists
        html = html.replace(/^\d+\. (.*?)$/gm, "<li class='ml-4'>$1</li>")

        // @mentions
        html = html.replace(/@(\w+)/g, "<span class='text-primary font-semibold'>@$1</span>")

        // Line breaks
        html = html.replace(/\n/g, "<br />")

        return html
    }

    return (
        <div className="text-foreground text-sm leading-relaxed break-words">
            <div dangerouslySetInnerHTML={{ __html: parseMarkdown(content) }} />
        </div>
    )
}