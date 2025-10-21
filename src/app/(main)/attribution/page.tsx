import AttributionIndex from '@/components/pages/AttributionIndex';
import { MY_FULL_NAME } from "@/lib/constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Attribution | ${MY_FULL_NAME}`,
  description: "Journey to create isherezahin.me personal portfolio.",
};

export default function AttributionPage() {
  return (
    <AttributionIndex />
  )
}