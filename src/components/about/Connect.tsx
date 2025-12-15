import { ReferralLink } from "@/components/ui"
import { SOCIAL_LINKS } from '@/config/links'
import { LinkIcon } from 'lucide-react'

export default function Connect() {
  return (
    <div className='flex flex-col gap-4 sm:gap-6 rounded-xl p-4 shadow-feature-card lg:p-6'>
      <div className='flex items-center gap-2'>
        <LinkIcon className='size-4 sm:size-[18px]' />
        <h2 className='text-xs sm:text-sm font-medium text-muted-foreground'>Connect</h2>
      </div>
      <div className='flex flex-col gap-3 sm:gap-4 px-2'>
        {SOCIAL_LINKS.map((link) => {
          const { href, title, icon } = link

          const Icon = icon

          return (
            <ReferralLink key={href} href={href}>
              <div className='flex w-fit items-center gap-2 sm:gap-3 text-muted-foreground transition-colors hover:text-foreground'>
                <Icon className='size-4 sm:size-[18px]' />
                <span className='text-sm sm:text-base'>{title}</span>
              </div>
            </ReferralLink>
          )
        })}
      </div>
    </div>
  )
}
