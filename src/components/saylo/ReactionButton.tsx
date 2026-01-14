"use client";

import { ReactionType, Reactions } from "@/utils/types";
import { Flame, Heart, Laugh, ThumbsUp } from "lucide-react";
import { useRef } from "react";

// Reaction configuration
export const REACTIONS: { type: ReactionType; icon: typeof ThumbsUp; label: string; activeColor: string }[] = [
    { type: "like", icon: ThumbsUp, label: "Like", activeColor: "text-blue-500" },
    { type: "love", icon: Heart, label: "Love", activeColor: "text-red-500" },
    { type: "haha", icon: Laugh, label: "Haha", activeColor: "text-yellow-500" },
    { type: "fire", icon: Flame, label: "Fire", activeColor: "text-orange-500" },
];

interface ReactionButtonProps {
    userReaction: ReactionType | null;
    isReacting: boolean;
    onReaction: (type: ReactionType) => void;
    showPicker: boolean;
    onShowPickerChange: (show: boolean) => void;
    pickerRef: React.RefObject<HTMLDivElement | null>;
}

export default function ReactionButton({
    userReaction,
    isReacting,
    onReaction,
    showPicker,
    onShowPickerChange,
    pickerRef,
}: Readonly<ReactionButtonProps>) {
    const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleClick = () => {
        if (userReaction) {
            onReaction(userReaction);
        } else {
            onShowPickerChange(!showPicker);
        }
    };

    const handleMouseEnter = () => {
        if (isReacting) return;
        hoverTimeoutRef.current = setTimeout(() => onShowPickerChange(true), 1000);
    };

    const handleMouseLeave = () => {
        if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current);
            hoverTimeoutRef.current = null;
        }
    };

    return (
        <div className="relative flex-1" ref={pickerRef}>
            <button
                onClick={handleClick}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                disabled={isReacting}
                className={`flex items-center justify-center gap-2 w-full py-2 text-sm rounded-lg transition-all active:scale-95 hover:bg-accent/50 cursor-pointer ${userReaction
                        ? REACTIONS.find((r) => r.type === userReaction)?.activeColor
                        : "text-muted-foreground hover:text-foreground"
                    }`}
            >
                {userReaction ? (
                    <>
                        {(() => {
                            const r = REACTIONS.find((r) => r.type === userReaction);
                            const Icon = r?.icon || ThumbsUp;
                            const canFill = userReaction === "like" || userReaction === "love";
                            return <Icon className={`w-5 h-5 ${canFill ? "fill-current" : ""}`} />;
                        })()}
                        <span className="capitalize">{userReaction}</span>
                    </>
                ) : (
                    <>
                        <ThumbsUp className="w-5 h-5" />
                        <span>Like</span>
                    </>
                )}
            </button>

            {/* Reaction Picker */}
            {showPicker && (
                <div
                    className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 flex items-center gap-1 px-2 py-1.5 bg-card border border-border/50 rounded-full shadow-xl z-50"
                    onMouseLeave={() => onShowPickerChange(false)}
                    onMouseEnter={() => {
                        if (hoverTimeoutRef.current) {
                            clearTimeout(hoverTimeoutRef.current);
                            hoverTimeoutRef.current = null;
                        }
                    }}
                >
                    {REACTIONS.map((r) => {
                        const Icon = r.icon;
                        const canFill = r.type === "like" || r.type === "love";
                        return (
                            <button
                                key={r.type}
                                onClick={() => onReaction(r.type)}
                                className={`p-2 rounded-full hover:bg-accent/50 transition-all hover:scale-125 cursor-pointer ${userReaction === r.type ? r.activeColor + " bg-accent/50" : "text-muted-foreground"
                                    }`}
                                title={r.label}
                            >
                                <Icon className={`w-5 h-5 ${userReaction === r.type && canFill ? "fill-current" : ""}`} />
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

// Reactions Summary Component
interface ReactionsSummaryProps {
    reactions: Reactions;
    userReaction: ReactionType | null;
}

export function ReactionsSummary({ reactions, userReaction }: Readonly<ReactionsSummaryProps>) {
    const totalReactions = Object.values(reactions).reduce((a, b) => a + b, 0);

    if (totalReactions === 0) return null;

    return (
        <div className="relative group/reactions">
            <div className="flex items-center gap-1.5 cursor-pointer">
                <div className="flex -space-x-1">
                    {REACTIONS.filter((r) => reactions[r.type] > 0).map((r) => {
                        const Icon = r.icon;
                        const canFill = r.type === "like" || r.type === "love";
                        return (
                            <div
                                key={r.type}
                                className={`w-4.5 h-4.5 rounded-full bg-card border border-background flex items-center justify-center ${r.activeColor}`}
                            >
                                <Icon className={`w-2.5 h-2.5 ${canFill ? "fill-current" : ""}`} />
                            </div>
                        );
                    })}
                </div>
                <span className="text-muted-foreground hover:underline">
                    {userReaction
                        ? totalReactions === 1
                            ? "You"
                            : `You and ${totalReactions - 1} other${totalReactions - 1 === 1 ? "" : "s"}`
                        : totalReactions}
                </span>
            </div>

            {/* Tooltip */}
            <div className="absolute left-0 bottom-full mb-2 px-3 py-2 bg-foreground text-background text-xs rounded-lg shadow-xl z-50 opacity-0 invisible group-hover/reactions:opacity-100 group-hover/reactions:visible transition-all min-w-max">
                <div className="space-y-1">
                    {REACTIONS.filter((r) => reactions[r.type] > 0).map((r) => {
                        const Icon = r.icon;
                        return (
                            <div key={r.type} className="flex items-center gap-2">
                                <Icon className="w-4 h-4" />
                                <span className="capitalize">{r.label}</span>
                                <span className="ml-auto font-medium">{reactions[r.type]}</span>
                            </div>
                        );
                    })}
                </div>
                <div className="absolute left-4 top-full w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-foreground" />
            </div>
        </div>
    );
}
