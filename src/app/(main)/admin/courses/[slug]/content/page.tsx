"use client";

import ModuleEditor from "@/components/courses/ModuleEditor";
import { useParams, useRouter } from "next/navigation";

export default function CourseContentPage() {
    const params = useParams();
    const router = useRouter();
    const slug = params.slug as string;

    return (
        <ModuleEditor
            course={{ slug, title: "" }}
            onBack={() => router.push("/admin/courses")}
        />
    );
}
