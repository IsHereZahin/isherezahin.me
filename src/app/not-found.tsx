import type { Metadata } from "next";
import Link from "next/link";

import MainLayout from "@/components/layouts/MainLayout";
import Heading from "@/components/ui/Heading";

export const metadata: Metadata = {
  title: "404 | Page Not Found",
};

export default function NotFound() {
  return (
    <MainLayout>
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8">
        {/* Big 404 Number */}
        <Heading text="404" size="2xl" />

        {/* Message */}
        <h2 className="text-2xl sm:text-3xl font-semibold text-muted-foreground mb-4">
          Oops! Page Not Found
        </h2>

        {/* Go Home Button */}
        <Link
          href="/"
          className="inline-block px-6 py-2 text-background font-medium rounded-lg shadow-feature-card bg-foreground hover:bg-foreground/90 transition"
        >
          Go Back Home
        </Link>
      </div>
    </MainLayout>
  );
}