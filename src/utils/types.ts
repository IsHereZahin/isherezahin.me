import { ObjectId } from 'mongodb';
export type PopupState = "color" | "language" | "command" | "profile" | null;
export type ThemeMode = "light" | "dark";

export interface Blog {
    id: string;
    date: string;
    views: number;
    likes: number;
    title: string;
    slug: string;
    excerpt: string;
    tags: string[];
    imageSrc: string;
    content: string;
    published: boolean;
}

export interface BlogDocument {
    _id: ObjectId;
    date: Date;
    views: number;
    likes: number;
    type: string;
    title: string;
    slug: string;
    excerpt: string;
    tags: string[];
    imageSrc: string;
    content: string;
    published: boolean;
}

export interface Project {
    id: string;
    date: string;
    views: number;
    likes: number;
    title: string;
    slug: string;
    excerpt: string;
    categories: string;
    company: string;
    duration: string;
    status: string;
    tags: string[];
    imageSrc: string;
    liveUrl?: string;
    githubUrl?: string;
    content: string;
    published: boolean;
}

export interface ProjectDocument {
    _id: ObjectId;
    date: Date;
    views: number;
    likes: number;
    type: string;
    title: string;
    slug: string;
    excerpt: string;
    categories: string;
    company: string;
    duration: string;
    status: string;
    tags: string[];
    imageSrc: string;
    liveUrl?: string;
    githubUrl?: string;
    content: string;
    published: boolean;
}

export interface ChatContextType {
    unreadCount: number;
    refreshUnreadCount: () => Promise<void>;
    globalHideStatus: boolean;
    isStatusLoading: boolean;
    toggleGlobalStatus: () => Promise<void>;
}

// Start of Saylo Types
export interface Reactions {
    like: number;
    love: number;
    haha: number;
    fire: number;
}

export type ReactionType = "like" | "love" | "haha" | "fire";

export interface Saylo {
    id: string;
    content: string;
    authorName: string | null;
    authorImage: string | null;
    category: string | null;
    images: string[];
    videos: string[];
    reactions: Reactions;
    published: boolean;
    visibility: "public" | "authenticated" | "private";
    discussionNumber?: number | null;
    createdAt: string;
    updatedAt: string;
}

export interface Category {
    id: string;
    name: string;
    color: string | null;
}

export interface SaylosResponse {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    saylos: Saylo[];
}

export interface MediaItem {
    url: string;
    type: "image" | "video";
}
// End of Saylo Types