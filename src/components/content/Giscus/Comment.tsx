"use client";

import { commentFlag } from "@/lib/constants";
import useTheme from "@/lib/hooks/useTheme";
import Giscus, { Repo } from "@giscus/react";

export default function Comment() {
  const theme = useTheme();
  return commentFlag ? (
    <Giscus
      key={theme}
      repo={process.env.NEXT_PUBLIC_GISCUS_REPO as Repo}
      repoId={process.env.NEXT_PUBLIC_GISCUS_REPO_ID || ""}
      category="General"
      categoryId={process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID || ""}
      mapping="pathname"
      strict="1"
      reactionsEnabled="0" // 1 = enable / 0 = disable // enable this if you want like and dislike buttons on your Guestbook page
      emitMetadata="0"
      inputPosition="top"
      theme={theme}
      lang="en"
      loading="lazy"
    />
  ) : null;
}
