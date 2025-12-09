import BlogIndex from '@/components/pages/BlogsIndex';
import { MY_FULL_NAME } from "@/lib/constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: `Blogs | ${MY_FULL_NAME}`,
};

export default function BlogsPage() {
    return (
        <BlogIndex />
    )
}
