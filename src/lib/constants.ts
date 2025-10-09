export const IS_PRODUCTION = process.env.NODE_ENV === 'production';
export const IS_SERVER = typeof window === 'undefined';

export const MY_NAME = process.env.NEXT_PUBLIC_MY_NAME;
export const MY_USERNAME = process.env.NEXT_PUBLIC_MY_USERNAME;

export const MY_MAIL = `${MY_USERNAME}@gmail.com`;

export const SITE_GITHUB_URL = `https://github.com/${MY_USERNAME}`;
export const SITE_INSTAGRAM_URL = `https://www.instagram.com/${MY_USERNAME}`;
export const SITE_X_URL = `https://x.com/${MY_USERNAME}`;
export const SITE_YOUTUBE_URL = `https://www.youtube.com/@${MY_USERNAME}`;
export const SITE_LINKEDIN_URL = `https://www.linkedin.com/in/${MY_USERNAME}`;

export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;
export const OG_IMAGE_TYPE = 'image/png';