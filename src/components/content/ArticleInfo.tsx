// ui concept | component - Thanks to @nelsonlaidev
// Copyright (c) 2023 Nelson Lai
// Source: https://github.com/nelsonlaidev
//
// Modified by: Zahin Mohammad

import AnimatedNumber from "@/components/ui/AnimatedNumber";
import BlurImage from "@/components/ui/BlurImage";
import { MY_NAME, SITE_GITHUB_URL, SITE_USER_LOGO } from "@/lib/constants";
import Link from "next/link";

interface ArticleInfoProps {
  viewCount: number;
  commentCount: number;
  formattedDate: string;
}

// Dummy NumberFlow component
const NumberFlow = ({ value }: { value: number }) => (
  <span className="font-medium">{value}</span>
);

export default function ArticleInfo({ viewCount = 0, commentCount = 0, formattedDate = "null" }: Readonly<ArticleInfoProps>) {
  return (
    <div className="max-w-3xl mx-auto mt-16 px-4 sm:px-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
      <div className="space-y-1 md:mx-auto">
        <div className="text-muted-foreground">Written by</div>
        <Link
          href={SITE_GITHUB_URL}
          className="flex items-center gap-2"
        >
          <BlurImage
            src={SITE_USER_LOGO!}
            className="size-6 rounded-full"
            width={1024}
            height={1024}
            alt={`${MY_NAME}'s Logo`}
          />
          {MY_NAME}
        </Link>
      </div>

      <div className="space-y-1 md:mx-auto">
        <div className="text-muted-foreground">Published on</div>
        <div>{formattedDate}</div>
      </div>

      <div className="space-y-1 md:mx-auto">
        <div className="text-muted-foreground">Views</div>
        {(viewCount ?? 0) > 0 ? (
          <AnimatedNumber value={viewCount} />
        ) : (
          <span className="tabular-nums">--</span>
        )}
      </div>

      <div className="space-y-1 md:mx-auto">
        <div className="text-muted-foreground">Comments</div>
        <NumberFlow value={commentCount} />
      </div>
    </div>
  );
}
