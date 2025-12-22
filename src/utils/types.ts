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