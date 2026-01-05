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
    alternateName: PERSON.name.alternativeNames,
    url: getFullUrl(),
    // Profile Image - Critical for Knowledge Panel
    image: {
      "@type": "ImageObject",
      "@id": `${getFullUrl()}/#primaryimage`,
      url: PERSON.image.url,
      width: PERSON.image.width,
      height: PERSON.image.height,
      caption: PERSON.image.altText,
      contentUrl: PERSON.image.url,
    },
    email: `mailto:${PERSON.email}`,
    jobTitle: PERSON.profession.title,
    description: PERSON.bio.long,
    // Birth information - Important for identity
    ...(PERSON.birthDate && { birthDate: PERSON.birthDate }),
    birthPlace: SCHEMA.person.birthPlace,
    gender: PERSON.gender,
    nationality: SCHEMA.person.nationality,
    homeLocation: SCHEMA.person.homeLocation,
    address: SCHEMA.person.address,
    worksFor: SCHEMA.person.worksFor,
    knowsAbout: SKILLS.all,
    knowsLanguage: SCHEMA.person.knowsLanguage,
    hasOccupation: SCHEMA.person.hasOccupation,
    // sameAs links - Critical for Knowledge Panel recognition
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

// Complete Knowledge Graph Schema - combines all schemas for Google Knowledge Panel
export function KnowledgeGraphJsonLd() {
  // Build person entity with optional fields
  const personEntity: Record<string, unknown> = {
    "@type": "Person",
    "@id": `${getFullUrl()}/#person`,
    name: PERSON.name.full,
    givenName: PERSON.name.first,
    familyName: PERSON.name.last,
    alternateName: PERSON.name.alternativeNames,
    url: getFullUrl(),
    // Profile Image - Important for Knowledge Panel display
    image: {
      "@type": "ImageObject",
      "@id": `${getFullUrl()}/#primaryimage`,
      url: PERSON.image.url,
      width: PERSON.image.width,
      height: PERSON.image.height,
      caption: PERSON.image.altText,
      contentUrl: PERSON.image.url,
      inLanguage: SITE.locale,
    },
    email: `mailto:${PERSON.email}`,
    jobTitle: PERSON.profession.title,
    description: PERSON.bio.long,
    // Birth information - Critical for identity verification
    ...(PERSON.birthDate && { birthDate: PERSON.birthDate }),
    birthPlace: {
      "@type": "Place",
      name: `${PERSON.birthPlace.city}, ${PERSON.birthPlace.country}`,
      address: {
        "@type": "PostalAddress",
        addressLocality: PERSON.birthPlace.city,
        addressCountry: PERSON.birthPlace.country,
      },
    },
    gender: PERSON.gender,
    nationality: {
      "@type": "Country",
      name: PERSON.location.country,
      sameAs: "https://en.wikipedia.org/wiki/Bangladesh",
    },
    homeLocation: {
      "@type": "Place",
      name: `${PERSON.location.city}, ${PERSON.location.country}`,
      address: {
        "@type": "PostalAddress",
        addressLocality: PERSON.location.city,
        addressRegion: PERSON.location.region,
        addressCountry: PERSON.location.countryCode,
      },
    },
    address: SCHEMA.person.address,
    worksFor: {
      "@type": "Organization",
      name: PERSON.profession.company,
      description: PERSON.profession.description,
    },
    hasOccupation: {
      "@type": "Occupation",
      name: PERSON.profession.title,
      occupationLocation: {
        "@type": "Country",
        name: PERSON.location.country,
      },
      description: "Develops web applications and software solutions",
      skills: SKILLS.primary.join(", "),
    },
    knowsAbout: SKILLS.all,
    knowsLanguage: PERSON.languages.map((lang) => ({
      "@type": "Language",
      name: lang.name,
      alternateName: lang.code,
    })),
    // sameAs - Critical for Knowledge Panel (links to verified profiles)
    sameAs: Object.values(SOCIAL_LINKS),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${getFullUrl()}/about`,
    },
  };

  // Add education if provided (alumniOf - shown in Knowledge Panel)
  if ("education" in PERSON && Array.isArray(PERSON.education) && PERSON.education.length > 0) {
    personEntity.alumniOf = PERSON.education.map((edu: { institution: string; degree?: string; field?: string; startDate?: string; endDate?: string }) => ({
      "@type": "EducationalOrganization",
      name: edu.institution,
      ...(edu.degree && {
        alumni: {
          "@type": "Person",
          "@id": `${getFullUrl()}/#person`,
        },
      }),
    }));
  }

  // Add spouse if provided (shown in Knowledge Panel like Tahsan's)
  if ("spouse" in PERSON && PERSON.spouse && typeof PERSON.spouse === "object" && "name" in PERSON.spouse) {
    const spouseData = PERSON.spouse as { name: string; marriageDate?: string };
    personEntity.spouse = {
      "@type": "Person",
      name: spouseData.name,
      ...(spouseData.marriageDate && { marriageDate: spouseData.marriageDate }),
    };
  }

  // Add awards if provided
  if ("awards" in PERSON && Array.isArray(PERSON.awards) && PERSON.awards.length > 0) {
    personEntity.award = PERSON.awards.map((award: { name: string; date?: string; description?: string }) => award.name);
  }

  // Add notable works if provided (like songs/movies for artists)
  if (PERSON.notableWorks && PERSON.notableWorks.length > 0) {
    personEntity.hasCreated = PERSON.notableWorks.map((work: { name: string; url?: string; description?: string; dateCreated?: string }) => ({
      "@type": "CreativeWork",
      name: work.name,
      ...(work.url && { url: work.url }),
      ...(work.description && { description: work.description }),
      ...(work.dateCreated && { dateCreated: work.dateCreated }),
      creator: {
        "@id": `${getFullUrl()}/#person`,
      },
    }));
  }

  const graphSchema = {
    "@context": "https://schema.org",
    "@graph": [
      // Person Entity - Primary entity for Knowledge Panel
      personEntity,
      // Website Entity
      {
        "@type": "WebSite",
        "@id": `${getFullUrl()}/#website`,
        url: getFullUrl(),
        name: `${PERSON.name.full} - Portfolio`,
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
      },
      // WebPage Entity for homepage
      {
        "@type": "WebPage",
        "@id": `${getFullUrl()}/#webpage`,
        url: getFullUrl(),
        name: `${PERSON.name.full} | ${PERSON.profession.title}`,
        description: PERSON.bio.long,
        isPartOf: {
          "@id": `${getFullUrl()}/#website`,
        },
        about: {
          "@id": `${getFullUrl()}/#person`,
        },
        primaryImageOfPage: {
          "@id": `${getFullUrl()}/#primaryimage`,
        },
        inLanguage: SITE.locale,
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
