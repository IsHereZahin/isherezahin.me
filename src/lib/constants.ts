// constants.ts
export const IS_PRODUCTION = process.env.NODE_ENV === 'production';
export const IS_SERVER = typeof window === 'undefined';

// Personal Information
export const MY_NAME = process.env.NEXT_PUBLIC_MY_NAME || "Zahin";
export const MY_FULL_NAME = process.env.NEXT_PUBLIC_MY_FULL_NAME || "Zahin Mohammad";
export const MY_USERNAME = process.env.NEXT_PUBLIC_MY_USERNAME || "isherezahin";
export const MY_DESIGNATION = process.env.NEXT_PUBLIC_MY_DESIGNATION || "Software Developer";
export const SITE_USER_LOGO = process.env.NEXT_PUBLIC_SITE_USER_LOGO || "https://res.cloudinary.com/dsh30sjju/image/upload/v1761056901/darklogo_eos1ps.png";

export const MY_MAIL = `${MY_USERNAME}@gmail.com`;

export const SITE_GITHUB_URL = `https://github.com/${MY_USERNAME}`;
export const SITE_INSTAGRAM_URL = `https://www.instagram.com/${MY_USERNAME}`;
export const SITE_X_URL = `https://x.com/${MY_USERNAME}`;
export const SITE_YOUTUBE_URL = `https://www.youtube.com/@${MY_USERNAME}`;
export const SITE_LINKEDIN_URL = `https://www.linkedin.com/in/${MY_USERNAME}`;

// Section IDs
export const HERO_SECTION_ID = process.env.NEXT_PUBLIC_HERO_SECTION_ID || '1';

// OG Image
export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;
export const OG_IMAGE_TYPE = 'image/png';

// Giscus
export const commentFlag = IS_PRODUCTION || process.env.NEXT_PUBLIC_FLAG_COMMENT === "true";
export const AMA_DISCUSSION_URL  = process.env.NEXT_PUBLIC_AMA_DISCUSSION_URL || '';
