import MainLayout from "@/components/layouts/MainLayout";
import MotionWrapper from "@/components/motion/MotionWrapper";
import { Button, Heading } from "@/components/ui";
import { METADATA } from "@/config/seo.config";
import { en } from "@/i18n/dictionaries/en";
import { Home } from "lucide-react";

export const metadata = METADATA.notFound;

/**
 * `not-found` renders outside the route's params, so there is no locale to read
 * here — Next renders it for unmatched paths in any language. English it is.
 */
export default function NotFound() {
  const dict = en;

  return (
    <MainLayout>
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8">

        {/* Big 404 Number */}
        <MotionWrapper delay={0.2}>
          <Heading text="404" size="2xl" />
        </MotionWrapper>

        {/* Message */}
        <MotionWrapper delay={0.4}>
          <h2 className="text-2xl sm:text-3xl font-semibold text-secondary-foreground mb-4">
            {dict.notFound.title}
          </h2>
        </MotionWrapper>

        {/* Go Home Button */}
        <MotionWrapper delay={0.6}>
          <Button href="/" text={dict.notFound.action} icon={<Home className="h-4 w-4" />} />
        </MotionWrapper>
      </div>
    </MainLayout>
  );
}
