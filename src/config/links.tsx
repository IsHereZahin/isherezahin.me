import { SITE_GITHUB_URL, SITE_INSTAGRAM_URL, SITE_LINKEDIN_URL, SITE_X_URL, SITE_YOUTUBE_URL } from '@/lib/constants';
import { SiGithub, SiInstagram, SiX, SiYoutube } from '@icons-pack/react-simple-icons';
import { FlameIcon, LinkedinIcon, PencilIcon, UserCircleIcon } from 'lucide-react';
import type { Dictionary } from '@/i18n/dictionaries/en';
import { ComponentType, SVGProps } from 'react';

type SocialLinks = Array<{
  href: string
  title: string
  icon: ComponentType<SVGProps<SVGSVGElement>>;
}>

/** Key into `dict.nav` — the visible text comes from the active locale. */
type NavKey = keyof Dictionary['nav']

type FooterMenuItems = Array<{
  category: NavKey
  items: ReadonlyArray<{ href: string; key: NavKey }>
}>

export const HEADER_LINKS = [
  {
    icon: <UserCircleIcon className='size-3.5' />,
    href: '/about',
    key: 'about'
  },
  {
    icon: <PencilIcon className='size-3.5' />,
    href: '/blogs',
    key: 'blogs'
  },
  {
    icon: <FlameIcon className='size-3.5' />,
    href: '/projects',
    key: 'projects'
  }
] as const

export const FOOTER_MENU_ITEMS: FooterMenuItems = [
  {
    category: 'general',
    items: [
      { href: '/', key: 'home' },
      { href: '/blogs', key: 'blogs' },
      { href: '/projects', key: 'projects' },
      { href: '/about', key: 'about' },
    ],
  },
  {
    category: 'theWebsite',
    items: [
      { href: '/bucket-list', key: 'bucketList' },
      { href: '/uses', key: 'uses' },
      { href: '/attribution', key: 'attribution' },
      { href: '/guestbook', key: 'guestbook' },
    ],
  },
  {
    category: 'resources',
    items: [
      { href: '/book-notes', key: 'bookNotes' },
      { href: '/analytics', key: 'analytics' },
      { href: '/resume', key: 'resume' },
      { href: '/tools', key: 'tools' },
    ],
  },
  {
    category: 'legal',
    items: [
      { href: '/privacy-policy', key: 'privacyPolicy' },
      { href: '/terms-of-service', key: 'termsOfService' },
    ],
  },
] as const

export const SOCIAL_LINKS: SocialLinks = [
  {
    href: SITE_LINKEDIN_URL,
    title: 'LinkedIn',
    icon: LinkedinIcon
  },
  {
    href: SITE_GITHUB_URL,
    title: 'GitHub',
    icon: SiGithub
  },
  {
    href: SITE_INSTAGRAM_URL,
    title: 'Instagram',
    icon: SiInstagram
  },
  {
    href: SITE_X_URL,
    title: 'X',
    icon: SiX
  },
  {
    href: SITE_YOUTUBE_URL,
    title: 'YouTube',
    icon: SiYoutube
  }
]
