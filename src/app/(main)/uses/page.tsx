import type { Metadata } from "next";
import { MY_FULL_NAME } from "@/lib/constants";
import UsesIndex from "@/components/pages/UsesIndex";

export const metadata: Metadata = {
    title: `Uses | ${MY_FULL_NAME}`,
    description: "A comprehensive list of the hardware, software, and tools I use daily.",
}

export default function UsesPage() {
    return (
        <UsesIndex />
    )
}