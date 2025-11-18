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
}