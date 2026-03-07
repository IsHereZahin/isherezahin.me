import LessonViewer from "@/components/courses/LessonViewer";
import { Suspense } from "react";

interface LearnPageProps {
    params: Promise<{ slug: string }>;
}

export default async function LearnPage({ params }: Readonly<LearnPageProps>) {
    const { slug } = await params;
    return (
        <Suspense fallback={<div className="px-6 py-16 text-center text-muted-foreground">Loading...</div>}>
            <LessonViewer slug={slug} />
        </Suspense>
    );
}
