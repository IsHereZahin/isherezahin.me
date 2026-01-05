/**
 * SEO Configuration File
 * =====================
 * This is the single source of truth for all SEO-related data.
 * Update your personal information here, and it will reflect across the entire portfolio.
 */

// =============================================================================
// PERSONAL INFORMATION
// =============================================================================

export const PERSON = {
  // Basic Info
  name: {
    first: "Zahin",
    last: "Mohammad",
    full: "Zahin Mohammad",
    display: "Zahin Mohammad",
  },
  username: "isherezahin",
  email: "isherezahin@gmail.com",

  // Professional Info
  profession: {
    title: "Software Developer",
    company: "Self-Employed",
    companyType: "Freelance",
    description: "Freelance Software Development",
  },

  // Location
  location: {
    city: "Cox's Bazar",
    region: "Chittagong Division",
    country: "Bangladesh",
    countryCode: "BD",
  },

  // Languages
  languages: [
    { name: "English", code: "en" },
    { name: "Bengali", code: "bn" },
  ],

  // Bio & Description
  bio: {
    short: "A Software Developer from Cox's Bazar, Bangladesh",
    medium:
      "A Software Developer specializing in building high-performance web applications using React, Next.js, Node.js, and Laravel.",
    long: "Zahin Mohammad is a Software Developer from Cox's Bazar, Bangladesh, specializing in building high-performance and elegant web applications using React, Node.js, Laravel, and other modern web technologies.",
  },
} as const;

// =============================================================================
// SKILLS & EXPERTISE
// =============================================================================

export const SKILLS = {
  // Primary technologies
  primary: [
    "React",
    "Next.js",
    "Node.js",
    "TypeScript",
    "JavaScript",
    "Laravel",
    "PHP",
  ],

  // Databases
  databases: ["MongoDB", "PostgreSQL", "MySQL"],

  // Other technologies
  other: ["Tailwind CSS", "REST API", "GraphQL", "Git", "Docker"],

  // All skills combined for schema.org
  all: [
    "Web Development",
    "Software Engineering",
    "React.js",
    "Next.js",
    "Node.js",
    "TypeScript",
    "JavaScript",
    "Laravel",
    "PHP",
    "MongoDB",
    "PostgreSQL",
    "MySQL",
    "Tailwind CSS",
    "REST API",
    "GraphQL",
    "Full Stack Development",
    "Frontend Development",
    "Backend Development",
  ],
} as const;

// =============================================================================
// SOCIAL LINKS
// =============================================================================

export const SOCIAL_LINKS = {
  github: `https://github.com/${PERSON.username}`,
  linkedin: `https://www.linkedin.com/in/${PERSON.username}`,
  twitter: `https://x.com/${PERSON.username}`,
  instagram: `https://www.instagram.com/${PERSON.username}`,
  youtube: `https://www.youtube.com/@${PERSON.username}`,
  // Add more as needed
  // facebook: "",
  // dribbble: "",
  // behance: "",
} as const;

// =============================================================================
// WEBSITE CONFIGURATION
// =============================================================================

export const SITE = {
  // Domain & URLs
  domain: process.env.NEXT_PUBLIC_BASE_DOMAIN || "isherezahin.me",
  get url() {
    return `https://${this.domain}`;
  },

  // Site Name & Branding
  name: `${PERSON.name.full} - ${PERSON.profession.title}`,
  shortName: PERSON.name.full,

  // Logo & Images
  logo:
    process.env.NEXT_PUBLIC_SITE_USER_LOGO ||
    "https://res.cloudinary.com/dsh30sjju/image/upload/v1761056901/darklogo_eos1ps.png",
  favicon: "/assets/images/logoicon.png",
  ogImage: {
    width: 1200,
    height: 630,
    type: "image/png",
  },

  // Language
  locale: "en_US",
  language: "en",

  // Theme
  themeColor: {
    light: "#ffffff",
    dark: "#0a0a0a",
  },
} as const;

// =============================================================================
// SEO KEYWORDS
// =============================================================================

export const SEO_KEYWORDS = [
  PERSON.name.full,
  PERSON.username,
  PERSON.profession.title,
  "Web Developer",
  "Full Stack Developer",
  "React Developer",
  "Node.js Developer",
  "Laravel Developer",
  "JavaScript Developer",
  "TypeScript Developer",
  "Next.js Developer",
  "Bangladesh Developer",
  `${PERSON.location.city} Developer`,
  "Portfolio",
  "Web Development",
  "Software Engineering",
  "Frontend Developer",
  "Backend Developer",
] as const;

// =============================================================================
// META TITLES & DESCRIPTIONS (Per Page)
// =============================================================================

export const PAGE_SEO = {
  home: {
    title: `${PERSON.name.full} | ${PERSON.profession.title}`,
    description: PERSON.bio.long,
  },
  about: {
    title: "About",
    description: `Learn more about ${PERSON.name.full}, a ${PERSON.profession.title} from ${PERSON.location.city}, ${PERSON.location.country}. Discover my skills, experience, and journey in web development.`,
  },
  blogs: {
    title: "Blog",
    description: `Read the latest blog posts by ${PERSON.name.full} about web development, programming, and technology insights.`,
  },
  projects: {
    title: "Projects",
    description: `Explore ${PERSON.name.full}'s portfolio of web development projects built with React, Next.js, Node.js, and more.`,
  },
  uses: {
    title: "Uses",
    description: "A comprehensive list of the hardware, software, and tools I use daily.",
  },
  guestbook: {
    title: "GuestBook",
    description: "Leave your thoughts, messages, or feedback on the Guestbook page.",
  },
  bucketList: {
    title: "Bucket List",
    description: "Dreams, goals, and adventures I'm chasing in this lifetime.",
  },
  sideQuests: {
    title: "Side Quests",
    description: `${PERSON.name.full}'s side projects and experimental work outside the main portfolio.`,
  },
  statistics: {
    title: "Statistics",
    description: `View visitor statistics and analytics for ${PERSON.name.full}'s portfolio website.`,
  },
  attribution: {
    title: "Attribution",
    description: `Journey to create ${PERSON.username}.me personal portfolio.`,
  },
  privacyPolicy: {
    title: "Privacy Policy",
    description: `Privacy policy for ${PERSON.name.full}'s portfolio website. Learn how your data is handled.`,
  },
  termsOfService: {
    title: "Terms of Service",
    description: `Terms of service for ${PERSON.name.full}'s portfolio website.`,
  },
  notFound: {
    title: "404 | Page Not Found",
    description: "The page you are looking for does not exist.",
  },
  blogNotFound: {
    title: "404 | Blog Not Found",
    description: "The blog post you are looking for does not exist.",
  },
  projectNotFound: {
    title: "404 | Project Not Found",
    description: "The project you are looking for does not exist.",
  },
} as const;

// =============================================================================
// SCHEMA.ORG STRUCTURED DATA
// =============================================================================

export const SCHEMA = {
  // Person schema data
  person: {
    "@type": "Person" as const,
    name: PERSON.name.full,
    givenName: PERSON.name.first,
    familyName: PERSON.name.last,
    alternateName: [PERSON.username, "isherezahin", PERSON.name.first],
    email: `mailto:${PERSON.email}`,
    jobTitle: PERSON.profession.title,
    description: PERSON.bio.medium,
    nationality: {
      "@type": "Country" as const,
      name: PERSON.location.country,
      sameAs: "https://en.wikipedia.org/wiki/Bangladesh",
    },
    address: {
      "@type": "PostalAddress" as const,
      addressLocality: PERSON.location.city,
      addressRegion: PERSON.location.region,
      addressCountry: PERSON.location.countryCode,
    },
    worksFor: {
      "@type": "Organization" as const,
      name: PERSON.profession.company,
      description: PERSON.profession.description,
    },
    hasOccupation: {
      "@type": "Occupation" as const,
      name: PERSON.profession.title,
      occupationLocation: {
        "@type": "Country" as const,
        name: PERSON.location.country,
      },
      description: "Develops web applications and software solutions",
      skills: SKILLS.primary.join(", "),
    },
    knowsAbout: SKILLS.all,
    knowsLanguage: PERSON.languages.map((lang) => ({
      "@type": "Language" as const,
      name: lang.name,
      alternateName: lang.code,
    })),
    sameAs: Object.values(SOCIAL_LINKS),
  },

  // Organization schema data
  organization: {
    "@type": "Organization" as const,
    name: PERSON.name.full,
    description: PERSON.profession.description,
    sameAs: [SOCIAL_LINKS.github, SOCIAL_LINKS.linkedin],
  },
} as const;

// =============================================================================
// OPEN GRAPH DEFAULTS
// =============================================================================

export const OPEN_GRAPH = {
  type: "website" as const,
  locale: SITE.locale,
  siteName: SITE.domain,
  title: PAGE_SEO.home.title,
  description: PERSON.bio.long,
  images: [
    {
      url: SITE.logo,
      width: SITE.ogImage.width,
      height: SITE.ogImage.height,
      alt: `${PERSON.name.full} - ${PERSON.profession.title}`,
      type: SITE.ogImage.type,
    },
  ],
} as const;

// =============================================================================
// TWITTER CARD DEFAULTS
// =============================================================================

export const TWITTER = {
  card: "summary_large_image" as const,
  site: `@${PERSON.username}`,
  creator: `@${PERSON.username}`,
  title: PAGE_SEO.home.title,
  description: PERSON.bio.medium,
  images: [SITE.logo],
} as const;

// =============================================================================
// ROBOTS & CRAWLING
// =============================================================================

export const ROBOTS = {
  index: true,
  follow: true,
  nocache: false,
  googleBot: {
    index: true,
    follow: true,
    noimageindex: false,
    "max-video-preview": -1,
    "max-image-preview": "large" as const,
    "max-snippet": -1,
  },
} as const;

// =============================================================================
// MANIFEST DATA (PWA)
// =============================================================================

export const MANIFEST = {
  name: `${PERSON.name.full} - ${PERSON.profession.title}`,
  shortName: PERSON.name.full,
  description: PERSON.bio.medium,
  startUrl: "/",
  display: "standalone" as const,
  backgroundColor: SITE.themeColor.dark,
  themeColor: SITE.themeColor.dark,
  orientation: "portrait-primary" as const,
  scope: "/",
  lang: SITE.language,
  categories: ["portfolio", "technology", "blog", "development"],
} as const;

// =============================================================================
// VERIFICATION CODES (Add your own)
// =============================================================================

export const VERIFICATION = {
  google: process.env.GOOGLE_SITE_VERIFICATION || "",
  bing: process.env.BING_SITE_VERIFICATION || "",
  yandex: process.env.YANDEX_SITE_VERIFICATION || "",
  pinterest: process.env.PINTEREST_SITE_VERIFICATION || "",
} as const;

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Generate a page title with the site name
 */
export function getPageTitle(pageTitle: string): string {
  return `${pageTitle} | ${PERSON.name.full}`;
}

/**
 * Generate full URL for a path
 */
export function getFullUrl(path: string = ""): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `https://${SITE.domain}${cleanPath}`;
}

/**
 * Get canonical URL for a page
 */
export function getCanonicalUrl(path: string = ""): string {
  return getFullUrl(path);
}

/**
 * Generate breadcrumb items
 */
export function getBreadcrumbs(
  items: { name: string; path: string }[]
): { name: string; url: string }[] {
  return [
    { name: "Home", url: getFullUrl() },
    ...items.map((item) => ({
      name: item.name,
      url: getFullUrl(item.path),
    })),
  ];
}

// =============================================================================
// COMPLETE METADATA OBJECTS (Import these directly in pages)
// =============================================================================

import type { Metadata, Viewport } from "next";

/**
 * Viewport configuration for the entire site
 */
export const VIEWPORT_CONFIG: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: SITE.themeColor.light },
    { media: "(prefers-color-scheme: dark)", color: SITE.themeColor.dark },
  ],
  colorScheme: "dark light",
};

/**
 * Root layout metadata (used in app/layout.tsx)
 */
export const ROOT_METADATA: Metadata = {
  metadataBase: new URL(`https://${SITE.domain}`),
  title: {
    default: PAGE_SEO.home.title,
    template: `%s | ${PERSON.name.full}`,
  },
  description: PAGE_SEO.home.description,
  keywords: [...SEO_KEYWORDS],
  authors: [{ name: PERSON.name.full, url: `https://${SITE.domain}` }],
  creator: PERSON.name.full,
  publisher: PERSON.name.full,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: SITE.favicon, sizes: "32x32", type: "image/png" },
      { url: SITE.favicon, sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: SITE.favicon, sizes: "180x180", type: "image/png" }],
    shortcut: SITE.favicon,
  },
  manifest: "/manifest.webmanifest",
  openGraph: {
    type: "website",
    locale: SITE.locale,
    url: `https://${SITE.domain}`,
    siteName: SITE.domain,
    title: PAGE_SEO.home.title,
    description: `Explore ${PERSON.name.full}'s portfolio, web development projects, and blog posts. Learn more about web technologies and personal insights.`,
    images: [
      {
        url: SITE.logo,
        width: SITE.ogImage.width,
        height: SITE.ogImage.height,
        alt: `${PERSON.name.full} - ${PERSON.profession.title} Portfolio`,
        type: SITE.ogImage.type,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: `@${PERSON.username}`,
    creator: `@${PERSON.username}`,
    title: PAGE_SEO.home.title,
    description: `${PERSON.name.full}'s portfolio showcasing web development projects, technical blog posts, and insights about modern web technologies.`,
    images: [
      {
        url: SITE.logo,
        alt: `${PERSON.name.full} - ${PERSON.profession.title}`,
      },
    ],
  },
  robots: ROBOTS,
  alternates: {
    canonical: `https://${SITE.domain}`,
  },
  category: "technology",
  classification: "Portfolio",
  referrer: "origin-when-cross-origin",
  other: {
    "google-site-verification": VERIFICATION.google,
    "msvalidate.01": VERIFICATION.bing,
  },
};

/**
 * Page-specific metadata objects
 */
export const METADATA = {
  home: {
    title: PAGE_SEO.home.title,
  } as Metadata,

  about: {
    title: PAGE_SEO.about.title,
    description: PAGE_SEO.about.description,
    keywords: [...SEO_KEYWORDS, "about", "biography", "skills", "experience"],
    openGraph: {
      title: `About ${PERSON.name.full}`,
      description: PAGE_SEO.about.description,
      url: `https://${SITE.domain}/about`,
      type: "profile",
    },
    alternates: {
      canonical: `https://${SITE.domain}/about`,
    },
  } as Metadata,

  blogs: {
    title: PAGE_SEO.blogs.title,
    description: PAGE_SEO.blogs.description,
    keywords: [...SEO_KEYWORDS, "blog", "articles", "tutorials", "web development"],
    openGraph: {
      title: PAGE_SEO.blogs.title,
      description: PAGE_SEO.blogs.description,
      url: `https://${SITE.domain}/blogs`,
      type: "website",
    },
    alternates: {
      canonical: `https://${SITE.domain}/blogs`,
    },
  } as Metadata,

  projects: {
    title: PAGE_SEO.projects.title,
    description: PAGE_SEO.projects.description,
    keywords: [...SEO_KEYWORDS, "projects", "portfolio", "work", "case studies"],
    openGraph: {
      title: PAGE_SEO.projects.title,
      description: PAGE_SEO.projects.description,
      url: `https://${SITE.domain}/projects`,
      type: "website",
    },
    alternates: {
      canonical: `https://${SITE.domain}/projects`,
    },
  } as Metadata,

  uses: {
    title: PAGE_SEO.uses.title,
    description: PAGE_SEO.uses.description,
    keywords: [...SEO_KEYWORDS, "uses", "tools", "setup", "hardware", "software"],
    openGraph: {
      title: PAGE_SEO.uses.title,
      description: PAGE_SEO.uses.description,
      url: `https://${SITE.domain}/uses`,
    },
    alternates: {
      canonical: `https://${SITE.domain}/uses`,
    },
  } as Metadata,

  guestbook: {
    title: PAGE_SEO.guestbook.title,
    description: PAGE_SEO.guestbook.description,
    openGraph: {
      title: PAGE_SEO.guestbook.title,
      description: PAGE_SEO.guestbook.description,
      url: `https://${SITE.domain}/guestbook`,
    },
    alternates: {
      canonical: `https://${SITE.domain}/guestbook`,
    },
  } as Metadata,

  bucketList: {
    title: PAGE_SEO.bucketList.title,
    description: PAGE_SEO.bucketList.description,
    openGraph: {
      title: PAGE_SEO.bucketList.title,
      description: PAGE_SEO.bucketList.description,
      url: `https://${SITE.domain}/bucket-list`,
    },
    alternates: {
      canonical: `https://${SITE.domain}/bucket-list`,
    },
  } as Metadata,

  sideQuests: {
    title: PAGE_SEO.sideQuests.title,
    description: PAGE_SEO.sideQuests.description,
    openGraph: {
      title: PAGE_SEO.sideQuests.title,
      description: PAGE_SEO.sideQuests.description,
      url: `https://${SITE.domain}/side-quests`,
    },
    alternates: {
      canonical: `https://${SITE.domain}/side-quests`,
    },
  } as Metadata,

  statistics: {
    title: PAGE_SEO.statistics.title,
    description: PAGE_SEO.statistics.description,
    openGraph: {
      title: PAGE_SEO.statistics.title,
      description: PAGE_SEO.statistics.description,
      url: `https://${SITE.domain}/statistics`,
    },
    alternates: {
      canonical: `https://${SITE.domain}/statistics`,
    },
  } as Metadata,

  attribution: {
    title: PAGE_SEO.attribution.title,
    description: PAGE_SEO.attribution.description,
    openGraph: {
      title: PAGE_SEO.attribution.title,
      description: PAGE_SEO.attribution.description,
      url: `https://${SITE.domain}/attribution`,
    },
    alternates: {
      canonical: `https://${SITE.domain}/attribution`,
    },
  } as Metadata,

  privacyPolicy: {
    title: PAGE_SEO.privacyPolicy.title,
    description: PAGE_SEO.privacyPolicy.description,
    robots: { index: false, follow: false },
  } as Metadata,

  termsOfService: {
    title: PAGE_SEO.termsOfService.title,
    description: PAGE_SEO.termsOfService.description,
    robots: { index: false, follow: false },
  } as Metadata,

  notFound: {
    title: PAGE_SEO.notFound.title,
    description: PAGE_SEO.notFound.description,
    robots: { index: false, follow: false },
  } as Metadata,

  blogNotFound: {
    title: PAGE_SEO.blogNotFound.title,
    description: PAGE_SEO.blogNotFound.description,
    robots: { index: false, follow: false },
  } as Metadata,

  projectNotFound: {
    title: PAGE_SEO.projectNotFound.title,
    description: PAGE_SEO.projectNotFound.description,
    robots: { index: false, follow: false },
  } as Metadata,
};
