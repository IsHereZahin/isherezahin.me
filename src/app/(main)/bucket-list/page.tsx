import BucketListIndex from "@/components/pages/BucketListIndex";
import { MY_FULL_NAME } from "@/lib/constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: `Bucket List | ${MY_FULL_NAME}`,
    description: "Dreams, goals, and adventures I'm chasing in this lifetime.",
};

export default function BucketListPage() {
    return <BucketListIndex />;
}
