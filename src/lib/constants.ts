// constants.ts
export const IS_PRODUCTION = process.env.NODE_ENV === 'production';
export const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';
export const IS_SERVER = typeof window === 'undefined';

// Personal Information
export const MY_NAME = process.env.NEXT_PUBLIC_MY_NAME || "Zahin";
export const MY_FULL_NAME = process.env.NEXT_PUBLIC_MY_FULL_NAME || "Zahin Mohammad";
export const MY_USERNAME = process.env.NEXT_PUBLIC_MY_USERNAME || "isherezahin";
export const MY_DESIGNATION = process.env.NEXT_PUBLIC_MY_DESIGNATION || "Software Developer";
export const SITE_USER_LOGO = process.env.NEXT_PUBLIC_SITE_USER_LOGO || "https://res.cloudinary.com/dsh30sjju/image/upload/v1761056901/darklogo_eos1ps.png";

export const MY_MAIL = `${MY_USERNAME}@gmail.com`;
export const MY_LOCATION = "Cox's Bazar, Bangladesh";

// Social Media Links
export const SITE_GITHUB_URL = `https://github.com/${MY_USERNAME}`;
export const SITE_INSTAGRAM_URL = `https://www.instagram.com/${MY_USERNAME}`;
export const SITE_X_URL = `https://x.com/${MY_USERNAME}`;
export const SITE_YOUTUBE_URL = `https://www.youtube.com/@${MY_USERNAME}`;
export const SITE_LINKEDIN_URL = `https://www.linkedin.com/in/${MY_USERNAME}`;

// Base Domain
export const BASE_DOMAIN = process.env.NEXT_PUBLIC_BASE_DOMAIN || "isherezahin.me";
export const BASE_URL = `https://${BASE_DOMAIN}`;

// SEO Keywords
export const SEO_KEYWORDS = [
  MY_FULL_NAME,
  MY_USERNAME,
  MY_DESIGNATION,
  "Web Developer",
  "Full Stack Developer",
  "React Developer",
  "Node.js Developer",
  "Laravel Developer",
  "JavaScript Developer",
  "TypeScript Developer",
  "Next.js Developer",
  "Bangladesh Developer",
  "Cox's Bazar Developer",
  "Portfolio",
  "Web Development",
  "Software Engineering",
  "Frontend Developer",
  "Backend Developer",
];

// Section IDs
export const HERO_SECTION_ID = process.env.NEXT_PUBLIC_HERO_SECTION_ID || '1';

// OG Image
export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;
export const OG_IMAGE_TYPE = 'image/png';

// GitHub Configuration
export const AUTH_GITHUB_ID = process.env.AUTH_GITHUB_ID!;
export const AUTH_GITHUB_SECRET = process.env.AUTH_GITHUB_SECRET!;
export const GITHUB_REPO_OWNER = process.env.NEXT_PUBLIC_GITHUB_REPO_OWNER!;
export const GITHUB_REPO_NAME = process.env.NEXT_PUBLIC_GITHUB_REPO_NAME!;
export const GITHUB_ACCESS_TOKEN = process.env.GITHUB_ACCESS_TOKEN;

// Google Configuration
export const AUTH_GOOGLE_ID = process.env.AUTH_GOOGLE_ID!;
export const AUTH_GOOGLE_SECRET = process.env.AUTH_GOOGLE_SECRET!;

// Cloudinary Configuration
export const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;

// MongoDB Configuration
export const MONGODB_URI = process.env.MONGODB_URI;

// Email Configuration (SMTP)
export const MAIL_MAILER = process.env.MAIL_MAILER || 'smtp';
export const MAIL_HOST = process.env.MAIL_HOST;
export const MAIL_PORT = process.env.MAIL_PORT ? parseInt(process.env.MAIL_PORT) : 2525;
export const MAIL_USERNAME = process.env.MAIL_USERNAME;
export const MAIL_PASSWORD = process.env.MAIL_PASSWORD;
export const MAIL_FROM_ADDRESS = process.env.MAIL_FROM_ADDRESS;
export const MAIL_FROM_NAME = process.env.NEXT_PUBLIC_MY_NAME;
