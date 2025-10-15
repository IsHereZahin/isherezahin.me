import type { Metadata } from "next";

import MainLayout from "@/components/layouts/MainLayout";
import Button from "@/components/ui/Button";
import Heading from "@/components/ui/Heading";
import { Home } from "lucide-react";

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
        <h2 className="text-2xl sm:text-3xl font-semibold text-secondary-foreground mb-4">
          Oops! Page Not Found
        </h2>

        {/* Go Home Button */}
        <Button href="/" text="Go Back Home" icon={<Home className="h-4 w-4" />} />
      </div>
    </MainLayout>
  );
}