// src/app/(main)/projects/[slug]/page.tsx
import ProjectDetailsIndex from "@/components/pages/ProjectDetailsIndex";
import { ProjectJsonLd, BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { ProjectModel } from "@/database/models/project-model";
import dbConnect from "@/database/services/mongo";
import { PERSON, TWITTER, getFullUrl, getBreadcrumbs } from "@/config/seo.config";
import type { Metadata } from "next";

interface ProjectDetailsPageProps {
  params: { slug: string };
}

interface ProjectDocument {
  title: string;
  excerpt: string;
  imageSrc: string;
  tags?: string[];
  date?: Date;
  updatedAt?: Date;
  createdAt?: Date;
}

export async function generateMetadata({
  params,
}: ProjectDetailsPageProps): Promise<Metadata> {
  const { slug } = await params;
  await dbConnect();
  const project = (await ProjectModel.findOne({
    slug,
    published: true,
  }).lean()) as ProjectDocument | null;

  if (!project) {
    return {
      title: "Project Not Found",
    };
  }

  const title = project.title;
  const description = project.excerpt;
  const url = getFullUrl(`/projects/${slug}`);

  return {
    title,
    description,
    keywords: project.tags,
    authors: [{ name: PERSON.name.full, url: getFullUrl() }],
    openGraph: {
      title,
      description,
      url,
      type: "article",
      publishedTime: project.date?.toISOString(),
      modifiedTime: project.updatedAt?.toISOString(),
      authors: [PERSON.name.full],
      tags: project.tags,
      images: [
        {
          url: project.imageSrc,
          width: 1200,
          height: 630,
          alt: project.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: TWITTER.site,
      creator: TWITTER.creator,
      title,
      description,
      images: [project.imageSrc],
    },
    alternates: {
      canonical: url,
    },
  };
}

export default async function ProjectDetailsPage({
  params,
}: Readonly<ProjectDetailsPageProps>) {
  const { slug } = await params;
  await dbConnect();
  const project = (await ProjectModel.findOne({
    slug,
    published: true,
  }).lean()) as ProjectDocument | null;

  return (
    <>
      {project && (
        <>
          <ProjectJsonLd
            title={project.title}
            description={project.excerpt}
            image={project.imageSrc}
            datePublished={
              project.date?.toISOString() || new Date().toISOString()
            }
            dateModified={project.updatedAt?.toISOString()}
            slug={slug}
            tags={project.tags}
          />
          <BreadcrumbJsonLd
            items={getBreadcrumbs([
              { name: "Projects", path: "/projects" },
              { name: project.title, path: `/projects/${slug}` },
            ])}
          />
        </>
      )}
      <ProjectDetailsIndex slug={slug} />
    </>
  );
}
