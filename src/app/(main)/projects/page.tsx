import ProjectsIndex from '@/components/pages/ProjectsIndex';
import { MY_FULL_NAME } from "@/lib/constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: `Projects | ${MY_FULL_NAME}`,
};

export default function ProjectsPage() {
    return (
        <ProjectsIndex />
    )
}
