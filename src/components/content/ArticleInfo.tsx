// ui concept | component - Thanks to @nelsonlaidev
// Copyright (c) 2023 Nelson Lai
// Source: https://github.com/nelsonlaidev
//
// Modified by: Zahin Mohammad

import { MY_NAME, SITE_GITHUB_URL, SITE_USER_LOGO } from "@/lib/constants";
import Link from "next/link";
import BlurImage from "../ui/BlurImage";

interface ArticleInfoProps {
  viewCount: number;
  commentCount: number;
  formattedDate: string;
}

// Dummy NumberFlow component
const NumberFlow = ({ value }: { value: number }) => (
  <span className="font-medium">{value}</span>
);

export default function BlogHeaderDemo({ viewCount = 1, commentCount = 0, formattedDate = "23 Nov 2022" }: Readonly<ArticleInfoProps>) {
  return (
    <div className="grid grid-cols-2 text-sm max-md:gap-4 md:grid-cols-4">
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
        <NumberFlow value={viewCount} />
      </div>

      <div className="space-y-1 md:mx-auto">
        <div className="text-muted-foreground">Comments</div>
        <NumberFlow value={commentCount} />
      </div>
    </div>
  );
}
