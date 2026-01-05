import { MetadataRoute } from "next";
import { getFullUrl } from "@/config/seo.config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/admin/",
          "/profile/",
          "/auth/",
          "/_next/",
          "/private/",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/api/", "/admin/", "/profile/", "/auth/"],
      },
      {
        userAgent: "Bingbot",
        allow: "/",
        disallow: ["/api/", "/admin/", "/profile/", "/auth/"],
      },
    ],
    sitemap: `${getFullUrl()}/sitemap.xml`,
    host: getFullUrl(),
  };
}
