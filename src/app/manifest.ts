import { MetadataRoute } from "next";
import { SITE, MANIFEST } from "@/config/seo.config";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: MANIFEST.name,
    short_name: MANIFEST.shortName,
    description: MANIFEST.description,
    start_url: MANIFEST.startUrl,
    display: MANIFEST.display,
    background_color: MANIFEST.backgroundColor,
    theme_color: MANIFEST.themeColor,
    orientation: MANIFEST.orientation,
    scope: MANIFEST.scope,
    lang: MANIFEST.lang,
    categories: [...MANIFEST.categories],
    icons: [
      {
        src: SITE.favicon,
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: SITE.favicon,
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
    screenshots: [
      {
        src: "/assets/images/dark.png",
        sizes: "1280x720",
        type: "image/png",
        form_factor: "wide",
        label: "Portfolio Homepage - Dark Mode",
      },
      {
        src: "/assets/images/light.png",
        sizes: "1280x720",
        type: "image/png",
        form_factor: "wide",
        label: "Portfolio Homepage - Light Mode",
      },
    ],
    shortcuts: [
      {
        name: "View Projects",
        short_name: "Projects",
        description: "Browse my portfolio projects",
        url: "/projects",
        icons: [{ src: SITE.favicon, sizes: "96x96" }],
      },
      {
        name: "Read Blog",
        short_name: "Blog",
        description: "Read my latest blog posts",
        url: "/blogs",
        icons: [{ src: SITE.favicon, sizes: "96x96" }],
      },
      {
        name: "About Me",
        short_name: "About",
        description: "Learn more about me",
        url: "/about",
        icons: [{ src: SITE.favicon, sizes: "96x96" }],
      },
    ],
    related_applications: [],
    prefer_related_applications: false,
    id: `https://${SITE.domain}`,
  };
}
