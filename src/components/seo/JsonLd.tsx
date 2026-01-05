import {
  PERSON,
  SITE,
  SKILLS,
  SOCIAL_LINKS,
  SCHEMA,
  getFullUrl,
} from "@/config/seo.config";

// Comprehensive Person Schema for Google Knowledge Panel
export function PersonJsonLd() {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${getFullUrl()}/#person`,
    name: PERSON.name.full,
    givenName: PERSON.name.first,
    familyName: PERSON.name.last,
    alternateName: SCHEMA.person.alternateName,
    url: getFullUrl(),
    image: {
      "@type": "ImageObject",
      url: SITE.logo,
      width: 400,
      height: 400,
      caption: `${PERSON.name.full} - ${PERSON.profession.title}`,
    },
    email: `mailto:${PERSON.email}`,
    jobTitle: PERSON.profession.title,
    description: PERSON.bio.medium,
    nationality: SCHEMA.person.nationality,
    address: SCHEMA.person.address,
    worksFor: SCHEMA.person.worksFor,
    alumniOf: {
      "@type": "EducationalOrganization",
      name: "University",
    },
    knowsAbout: SKILLS.all,
    knowsLanguage: SCHEMA.person.knowsLanguage,
    hasOccupation: SCHEMA.person.hasOccupation,
    sameAs: Object.values(SOCIAL_LINKS),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": getFullUrl("/about"),
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(personSchema),
      }}
    />
  );
}

// Website Schema with reference to Person
export function WebsiteJsonLd() {
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${getFullUrl()}/#website`,
    url: getFullUrl(),
    name: SITE.name,
    description: `Official portfolio and blog of ${PERSON.name.full}, a ${PERSON.profession.title} from ${PERSON.location.city}, ${PERSON.location.country}`,
    publisher: {
      "@id": `${getFullUrl()}/#person`,
    },
    author: {
      "@id": `${getFullUrl()}/#person`,
    },
    inLanguage: SITE.locale,
    copyrightYear: new Date().getFullYear(),
    copyrightHolder: {
      "@id": `${getFullUrl()}/#person`,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${getFullUrl()}/blogs?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(websiteSchema),
      }}
    />
  );
}

// ProfilePage Schema for About page - helps with Knowledge Panel
export function ProfilePageJsonLd() {
  const profilePageSchema = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": getFullUrl("/about"),
    url: getFullUrl("/about"),
    name: `About ${PERSON.name.full}`,
    description: `Learn more about ${PERSON.name.full}, a ${PERSON.profession.title} from ${PERSON.location.city}, ${PERSON.location.country}`,
    mainEntity: {
      "@id": `${getFullUrl()}/#person`,
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: getFullUrl(),
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "About",
          item: getFullUrl("/about"),
        },
      ],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(profilePageSchema),
      }}
    />
  );
}

// Complete Knowledge Graph Schema - combines all schemas
export function KnowledgeGraphJsonLd() {
  const graphSchema = {
    "@context": "https://schema.org",
    "@graph": [
      // Person Entity
      {
        "@type": "Person",
        "@id": `${getFullUrl()}/#person`,
        name: PERSON.name.full,
        givenName: PERSON.name.first,
        familyName: PERSON.name.last,
        alternateName: SCHEMA.person.alternateName,
        url: getFullUrl(),
        image: {
          "@type": "ImageObject",
          "@id": `${getFullUrl()}/#personimage`,
          url: SITE.logo,
          width: 400,
          height: 400,
          caption: PERSON.name.full,
          inLanguage: SITE.locale,
        },
        email: `mailto:${PERSON.email}`,
        jobTitle: PERSON.profession.title,
        description: PERSON.bio.medium,
        nationality: {
          "@type": "Country",
          name: PERSON.location.country,
        },
        address: SCHEMA.person.address,
        worksFor: {
          "@type": "Organization",
          name: PERSON.profession.company,
        },
        knowsAbout: SKILLS.all,
        sameAs: Object.values(SOCIAL_LINKS),
      },
      // Website Entity
      {
        "@type": "WebSite",
        "@id": `${getFullUrl()}/#website`,
        url: getFullUrl(),
        name: `${PERSON.name.full} - Portfolio`,
        description: `Official portfolio of ${PERSON.name.full}`,
        publisher: {
          "@id": `${getFullUrl()}/#person`,
        },
        inLanguage: SITE.locale,
        potentialAction: {
          "@type": "SearchAction",
          target: `${getFullUrl()}/blogs?search={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      // Organization (for professional context)
      {
        "@type": "Organization",
        "@id": `${getFullUrl()}/#organization`,
        name: PERSON.name.full,
        url: getFullUrl(),
        logo: {
          "@type": "ImageObject",
          url: SITE.logo,
          width: 400,
          height: 400,
        },
        founder: {
          "@id": `${getFullUrl()}/#person`,
        },
        sameAs: [SOCIAL_LINKS.github, SOCIAL_LINKS.linkedin],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(graphSchema),
      }}
    />
  );
}

// Blog Article Schema
interface BlogJsonLdProps {
  title: string;
  description: string;
  image: string;
  datePublished: string;
  dateModified?: string;
  slug: string;
  tags?: string[];
}

export function BlogJsonLd({
  title,
  description,
  image,
  datePublished,
  dateModified,
  slug,
  tags,
}: Readonly<BlogJsonLdProps>) {
  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": getFullUrl(`/blogs/${slug}`),
    headline: title,
    description: description,
    image: {
      "@type": "ImageObject",
      url: image,
      width: 1200,
      height: 630,
    },
    datePublished: datePublished,
    dateModified: dateModified || datePublished,
    author: {
      "@type": "Person",
      "@id": `${getFullUrl()}/#person`,
      name: PERSON.name.full,
      url: getFullUrl(),
    },
    publisher: {
      "@type": "Person",
      "@id": `${getFullUrl()}/#person`,
      name: PERSON.name.full,
      logo: {
        "@type": "ImageObject",
        url: SITE.logo,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": getFullUrl(`/blogs/${slug}`),
    },
    keywords: tags?.join(", "),
    inLanguage: SITE.locale,
    isPartOf: {
      "@id": `${getFullUrl()}/#website`,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(blogSchema),
      }}
    />
  );
}

// Project/Portfolio Item Schema
interface ProjectJsonLdProps {
  title: string;
  description: string;
  image: string;
  datePublished: string;
  dateModified?: string;
  slug: string;
  tags?: string[];
}

export function ProjectJsonLd({
  title,
  description,
  image,
  datePublished,
  dateModified,
  slug,
  tags,
}: Readonly<ProjectJsonLdProps>) {
  const projectSchema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": getFullUrl(`/projects/${slug}`),
    name: title,
    description: description,
    image: {
      "@type": "ImageObject",
      url: image,
      width: 1200,
      height: 630,
    },
    dateCreated: datePublished,
    dateModified: dateModified || datePublished,
    creator: {
      "@type": "Person",
      "@id": `${getFullUrl()}/#person`,
      name: PERSON.name.full,
    },
    author: {
      "@type": "Person",
      "@id": `${getFullUrl()}/#person`,
      name: PERSON.name.full,
    },
    keywords: tags?.join(", "),
    inLanguage: SITE.locale,
    isPartOf: {
      "@id": `${getFullUrl()}/#website`,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(projectSchema),
      }}
    />
  );
}

// Breadcrumb Schema
export function BreadcrumbJsonLd({
  items,
}: Readonly<{
  items: { name: string; url: string }[];
}>) {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(breadcrumbSchema),
      }}
    />
  );
}

// FAQ Schema for pages with Q&A content
export function FAQJsonLd({
  questions,
}: Readonly<{
  questions: { question: string; answer: string }[];
}>) {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map((q) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: q.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(faqSchema),
      }}
    />
  );
}

// ItemList Schema for blog/project listing pages
export function ItemListJsonLd({
  items,
  listType = "blog",
}: Readonly<{
  items: { name: string; url: string; image?: string; position: number }[];
  listType?: "blog" | "project";
}>) {
  const listSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map((item) => ({
      "@type": "ListItem",
      position: item.position,
      item: {
        "@type": listType === "blog" ? "BlogPosting" : "CreativeWork",
        name: item.name,
        url: item.url,
        image: item.image,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(listSchema),
      }}
    />
  );
}
