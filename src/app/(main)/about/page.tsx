import AboutIndex from '@/components/pages/AboutIndex';
import { MY_FULL_NAME } from "@/lib/constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: `About | ${MY_FULL_NAME}`,
};

export default function AboutPage() {
    return (
        <AboutIndex />
    )
}