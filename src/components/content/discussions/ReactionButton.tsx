"use client"

import { AnimatedNumber } from "@/components/ui"
import { ThumbsDown, ThumbsUp } from "lucide-react"

interface ReactionButtonProps {
    type: "up" | "down"
    count: number
    active: boolean
    onClick: () => void
    disabled?: boolean
}

export default function ReactionButton({ type, count, active, onClick, disabled = false }: Readonly<ReactionButtonProps>) {
    const isUp = type === "up"
    const Icon = isUp ? ThumbsUp : ThumbsDown

    return (
        <button
            onClick={disabled ? undefined : onClick}
            disabled={disabled}
            className={`flex items-center gap-1.5 px-2 py-0.5 rounded-lg transition-colors
                ${active ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground"}
                ${disabled ? "cursor-not-allowed opacity-50 hover:bg-transparent hover:text-muted-foreground" : "cursor-pointer"}
            `}
        >
            <Icon className="w-4 h-4" />
            {count > 0 && (
                <span className="font-medium">
                    <AnimatedNumber value={count} />
                </span>
            )}
        </button>
    )
}