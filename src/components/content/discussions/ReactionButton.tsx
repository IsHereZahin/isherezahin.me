"use client"

import { AnimatedNumber } from "@/components/ui"
import { ThumbsDown, ThumbsUp } from "lucide-react"
import { toast } from "sonner"

interface ReactionButtonProps {
    type: "up" | "down"
    count: number
    active: boolean
    onClick: () => void
    disabled?: boolean
    disabledReason?: string
}

export default function ReactionButton({ type, count, active, onClick, disabled = false, disabledReason }: Readonly<ReactionButtonProps>) {
    const isUp = type === "up"
    const Icon = isUp ? ThumbsUp : ThumbsDown

    const handleClick = () => {
        if (disabled && disabledReason) {
            toast.error(disabledReason)
            return
        }
        if (!disabled) {
            onClick()
        }
    }

    return (
        <button
            onClick={handleClick}
            className={`flex items-center gap-1.5 px-2 py-0.5 rounded-lg transition-colors
                ${active ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground"}
                ${disabled ? "cursor-not-allowed opacity-50 hover:bg-transparent hover:text-muted-foreground" : "cursor-pointer"}
            `}
        >
            <Icon className="w-4 h-4" />
            <span className="font-medium">
                <AnimatedNumber value={count} />
            </span>
        </button>
    )
}