export interface Lesson {
    _id?: string;
    dragId: string;
    title: string;
    order: number;
    contentType: "video" | "text" | "quiz";
    videoUrl?: string | null;
    content?: string | null;
    duration?: string | null;
    isFree?: boolean;
}

export interface Module {
    _id?: string;
    dragId: string;
    title: string;
    order: number;
    lessons: Lesson[];
}

let dragIdCounter = 0;
export function nextDragId() { return `drag-${++dragIdCounter}`; }

export const INPUT_CLASS = "w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary";
