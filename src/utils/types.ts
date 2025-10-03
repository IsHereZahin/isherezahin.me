import { ReactNode } from "react";

interface SectionProps {
  id: string;
  children: ReactNode;
}

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
}

interface Project {
  id: string;
  title: string;
  slug: string;
  status: string;
  description: string;
  image: string;
  url: string | null;
}

interface ProjectsProps {
  projects: Project[];
}

interface CustomLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  target?: string;
  rel?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "underline" | "button";
}

interface DecorativeBlobProps {
  className?: string;
}

interface HighlightedWordProps {
  children: React.ReactNode;
  colorPrimary?: string;
  strokeLight?: string;
  strokeDark?: string;
}

interface SeeMoreProps {
  href: string;
  text?: string;
  className?: string;
}

interface StyledImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  overlayColor?: string; // e.g., "#FF6B35" for orange/red overlay
  overlayRotation?: string; // e.g., "rotate(-15deg)"
  overlayBorderRadius?: string; // e.g., "var(--radius-10)" or "10px"
  overlayPosition?: {
    bottom?: string;
    left?: string;
    width?: string;
    height?: string;
  };
}

interface ThemeColor {
  name: string;
  lightPrimary: string;
  darkPrimary: string;
  lightPrimaryRgb: string;
  darkPrimaryRgb: string;
  textColorClass: string;
}

interface HeroBannerProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
}

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
}

interface CustomLinkProps {
  id: number;
  date: string;
  readTime: number;
  views: number;
  title: string;
  href: string;
  excerpt: string;
  tags: string[];
  imageSrc: string;
  alt: string;
}

interface Blog {
    title: string
    excerpt: string
    image: string
    author: {
        name: string
        avatar: string
    }
    date: string
    readTime: string
    category: string
    href?: string
}

interface BlogsProps {
  blogs: Blog[];
}

interface Testimonial {
  id: number;
  quote: string;
  name: string;
  role: string;
}

interface TestimonialsProps {
  testimonials: Testimonial[];
}

interface StylishLinkProps {
  href: string;
  label?: string;
  color?: StringIterator;
}

export {
  Blog,
  BlogsProps,
  CustomLinkProps,
  DecorativeBlobProps,
  HeroBannerProps,
  HighlightedWordProps,
  ImageWithFallbackProps,
  Project,
  ProjectsProps,
  SectionHeaderProps,
  SectionProps,
  SeeMoreProps,
  StyledImageProps,
  StylishLinkProps,
  Testimonial,
  TestimonialsProps,
  ThemeColor,
};
