"use client";

export default function TypingIndicator({ name }: { name?: string }) {
    return (
        <div className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground">
            <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:-0.3s]" />
                <span className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:-0.15s]" />
                <span className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" />
            </div>
            <span>{name || "Someone"} is typing...</span>
        </div>
    );
}
