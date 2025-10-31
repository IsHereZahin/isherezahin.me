import { SITE_GITHUB_URL, SITE_INSTAGRAM_URL, SITE_LINKEDIN_URL, SITE_X_URL, SITE_YOUTUBE_URL } from '@/lib/constants';
import { SiGithub, SiInstagram, SiX, SiYoutube } from '@icons-pack/react-simple-icons';
import { FlameIcon, LayoutDashboard, LinkedinIcon, MessageCircleIcon, MonitorIcon, PencilIcon, UserCircleIcon } from 'lucide-react';
import { ComponentType, SVGProps } from 'react';

type SocialLinks = Array<{
  href: string
  title: string
  icon: ComponentType<SVGProps<SVGSVGElement>>;
}>

type FooterMenuItems = Array<{
  category: string
  items: Array<{ href: string; label: string }>
}>

export const ADMIN_LINKS = [
  {
    icon: <LayoutDashboard className='size-3.5' />,
    href: '/admin',
    key: 'dashboard'
  },
  {
    icon: <PencilIcon className='size-3.5' />,
    href: '/admin/blogs',
    key: 'blogs'
  },
  {
    icon: <FlameIcon className='size-3.5' />,
    href: '/admin/projects',
    key: 'projects'
  },
  {
    icon: <MonitorIcon className='size-3.5' />,
    href: '/admin/users',
    key: 'users'
  }
] as const

export const HEADER_LINKS = [
  {
    icon: <PencilIcon className='size-3.5' />,
    href: '/blogs',
    key: 'blogs'
  },
  {
    icon: <MessageCircleIcon className='size-3.5' />,
    href: '/guestbook',
    key: 'guestbook'
  },
  {
    icon: <FlameIcon className='size-3.5' />,
    href: '/projects',
    key: 'projects'
  },
  {
    icon: <UserCircleIcon className='size-3.5' />,
    href: '/about',
    key: 'about'
  },
  {
    icon: <MonitorIcon className='size-3.5' />,
    href: '/uses',
    key: 'uses'
  }
] as const

export const FOOTER_MENU_ITEMS: FooterMenuItems = [
  {
    category: 'General',
    items: [
      { href: '/home', label: 'Home' },
      { href: '/blog', label: 'Blog' },
      { href: '/projects', label: 'Projects' },
      { href: '/about', label: 'About' },
    ],
  },
  {
    category: 'The Website',
    items: [
      { href: '/bucket-list', label: 'Bucket List' },
      { href: '/uses', label: 'Uses' },
      { href: '/attribution', label: 'Attribution' },
      { href: '/guest-book', label: 'Guest Book' },
    ],
  },
  {
    category: 'Resources',
    items: [
      { href: '/book-notes', label: 'Book Notes' },
      { href: '/analytics', label: 'Analytics' },
      { href: '/resume', label: 'Resume' },
      { href: '/tools', label: 'Tools' },
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
