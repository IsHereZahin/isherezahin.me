import {
    AtSign,
    Bold,
    Code,
    Code2,
    Heading,
    Italic,
    Link2,
    List,
    Quote,
} from "lucide-react";
import { createElement } from "react";

export interface MarkdownTool {
    key: string;
    title: string;
    icon: React.ReactNode;
    before: string;
    after: string;
    placeholder: string;
}

export const markdownTools: MarkdownTool[] = [
    { key: "bold", title: "Bold", icon: createElement(Bold, { className: "w-3.5 h-3.5" }), before: "**", after: "**", placeholder: "bold text" },
    { key: "italic", title: "Italic", icon: createElement(Italic, { className: "w-3.5 h-3.5" }), before: "*", after: "*", placeholder: "italic text" },
    { key: "heading", title: "Heading", icon: createElement(Heading, { className: "w-3.5 h-3.5" }), before: "# ", after: "", placeholder: "Heading" },
    { key: "quote", title: "Quote", icon: createElement(Quote, { className: "w-3.5 h-3.5" }), before: "> ", after: "", placeholder: "Quote" },
    { key: "inlineCode", title: "Inline Code", icon: createElement(Code, { className: "w-3.5 h-3.5" }), before: "`", after: "`", placeholder: "code" },
    { key: "codeBlock", title: "Code Block", icon: createElement(Code2, { className: "w-3.5 h-3.5" }), before: "```\n", after: "\n```", placeholder: "code block" },
    { key: "link", title: "Link", icon: createElement(Link2, { className: "w-3.5 h-3.5" }), before: "[", after: "](url)", placeholder: "text" },
    { key: "list", title: "List", icon: createElement(List, { className: "w-3.5 h-3.5" }), before: "- ", after: "", placeholder: "list item" },
    { key: "mention", title: "Mention", icon: createElement(AtSign, { className: "w-3.5 h-3.5" }), before: "@", after: "", placeholder: "username" },
];

export function parseMarkdown(text: string): string {
    let html = text;

    // Escape HTML
    html = html.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

    // Headers
    html = html.replace(/^### (.*?)$/gm, "<h3 class='text-base font-semibold mt-2 mb-1 text-foreground'>$1</h3>");
    html = html.replace(/^## (.*?)$/gm, "<h2 class='text-lg font-semibold mt-2 mb-1 text-foreground'>$1</h2>");
    html = html.replace(/^# (.*?)$/gm, "<h1 class='text-xl font-semibold mt-2 mb-1 text-foreground'>$1</h1>");

    // Bold & Italic
    html = html.replace(/\*\*(.*?)\*\*/g, "<strong class='font-semibold text-foreground'>$1</strong>");
    html = html.replace(/\*(.*?)\*/g, "<em class='italic text-foreground'>$1</em>");

    // Code blocks
    html = html.replace(
        /```([\s\S]*?)```/g,
        "<pre class='bg-muted p-2 rounded text-xs overflow-x-auto text-secondary-foreground my-1'><code>$1</code></pre>"
    );

    // Inline code
    html = html.replace(
        /`([^`]+)`/g,
        "<code class='bg-muted px-1 py-0.5 rounded text-xs font-mono text-secondary-foreground'>$1</code>"
    );

    // Standard markdown links: [display text](url)
    html = html.replace(
        /\[([^\]]+)\]\(([^)]+)\)/g,
        "<a href='$2' class='text-primary hover:underline' target='_blank' rel='noopener noreferrer'>$1</a>"
    );

    // Blockquotes
    html = html.replace(
        /^&gt; (.*?)$/gm,
        "<blockquote class='border-l-2 border-primary pl-2 italic text-muted-foreground my-1'>$1</blockquote>"
    );

    // Lists
    html = html.replace(/^- (.*?)$/gm, "<li class='ml-3 text-secondary-foreground'>$1</li>");
    html = html.replace(/(<li[\s\S]*?<\/li>)/g, "<ul class='list-disc my-1'>$1</ul>");

    // Mentions
    html = html.replace(/@(\w+)/g, "<span class='text-primary font-semibold'>@$1</span>");

    // Line breaks
    html = html.replace(/\n/g, "<br />");

    return html;
}
