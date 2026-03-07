import CourseDetailIndex from "@/components/courses/CourseDetailIndex";

interface CoursePageProps {
    params: Promise<{ slug: string }>;
}

export default async function CourseDetailPage({ params }: Readonly<CoursePageProps>) {
    const { slug } = await params;
    return <CourseDetailIndex slug={slug} />;
}
