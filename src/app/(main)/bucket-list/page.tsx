import BucketListIndex from "@/components/pages/BucketListIndex";
import { METADATA } from "@/config/seo.config";

export const metadata = METADATA.bucketList;

export default function BucketListPage() {
  return <BucketListIndex />;
}
