import { availableThemes } from "@/data";
import type { ReactionKey, Reactions, ReactionUser } from "@/lib/github/types";

export interface ThemeColor {
    name: string;
    lightPrimary: string;
    darkPrimary: string;
    lightPrimaryRgb: string;
    darkPrimaryRgb: string;
    textColorClass: string;
}

function getRandomTheme(): ThemeColor {
    const index = Math.floor(Math.random() * availableThemes.length);
    return availableThemes[index];
}

function generateProfessionalUnderline(seed: string, height = 10, width = 100): string {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
        hash = ((hash << 5) - hash) + seed.charCodeAt(i);
        hash = hash & hash;
    }

    // Subtle offsets derived from the seed for consistency and minimal variation
    const offsetX = (Math.abs(hash) % 20) - 10; // Range: -10 to 10
    const offsetY = (Math.abs(hash >> 8) % 8) - 4; // Range: -4 to 4

    const controlX = width / 2 + offsetX;
    const controlY = height / 2 + offsetY;

    return `M 0 ${height / 2} Q ${controlX} ${controlY} ${width} ${height / 2}`;
}

function truncateWords(text: string, wordLimit: number): string {
    const words = text.split(' ');
    if (words.length <= wordLimit) return text;
    return words.slice(0, wordLimit).join(' ') + '...';
}

function truncateText(text: string, limit: number): string {
    if (text.length <= limit) return text;
    return text.slice(0, limit) + '...';
}

function getFormatDistanceToNow(date: Date): string {
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    const intervals: { [key: string]: number } = {
        year: 31536000,
        month: 2592000,
        week: 604800,
        day: 86400,
        hour: 3600,
        minute: 60,
        second: 1
    };
    for (const interval in intervals) {
        const intervalSeconds = intervals[interval];
        const count = Math.floor(seconds / intervalSeconds);
        if (count >= 1) {
            return `${count} ${interval}${count > 1 ? 's' : ''} ago`;
        }
    }
    return 'just now';
}

function getRoleBadge(authorAssociation: string, isOwner: boolean): { label: string; className: string } | null {
    if (isOwner) {
        return {
            label: "Owner",
            className: "bg-secondary text-secondary-foreground border border-border",
        }
    }

    switch (authorAssociation) {
        case "CONTRIBUTOR":
            return {
                label: "Contributor",
                className: "bg-secondary text-secondary-foreground border border-border",
            }
        case "COLLABORATOR":
            return {
                label: "Collaborator",
                className: "bg-secondary text-secondary-foreground border border-border",
            }
        case "MEMBER":
            return {
                label: "Member",
                className: "bg-secondary text-secondary-foreground border border-border",
            }
        default:
            return null
    }
}

function hasUserReacted( reactionUsers: ReactionUser[], username: string, reactionType: ReactionKey): boolean {
    if (!username) return false
    return reactionUsers.some(
        (ru) => ru.user.login === username && ru.content === reactionType
    )
}

function getReactionCounts(reactions: Reactions) {
    return {
        thumbsUp: reactions["+1"] || 0,
        thumbsDown: reactions["-1"] || 0,
    }
}

export { generateProfessionalUnderline, getRandomTheme, truncateWords, truncateText, getFormatDistanceToNow, getRoleBadge, hasUserReacted, getReactionCounts };
