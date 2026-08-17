import type { HomeContent } from '@/data/pages/home'
import type { StackIcon } from '@/data/types'
import { ZapIcon } from 'lucide-react'
import Marquee from 'react-fast-marquee'

const MARQUEE_CLASS =
  "py-4 overflow-hidden flex w-full h-full max-w-full max-h-full place-items-center m-0 p-2 list-none opacity-100 mask-[linear-gradient(to_right,_rgba(0,0,0,0)_0%,_rgb(0,0,0)_12.5%,_rgb(0,0,0)_87.5%,_rgba(0,0,0,0)_100%)]"

function StackRow({ items, direction }: Readonly<{ items: StackIcon[]; direction?: 'left' | 'right' }>) {
  return (
    <div className='flex-1 overflow-hidden'>
      <Marquee
        direction={direction}
        speed={30}
        gradient={true}
        gradientColor={[200, 200, 200] as unknown as string}
        pauseOnHover={true}
        className={MARQUEE_CLASS}
      >
        <div className='flex gap-6'>
          {items.map(({ icon: Icon, title }, index) => (
            <div
              key={title}
              className={`flex items-center justify-center size-14 bg-background shadow-feature-card rounded-[12px] flex-shrink-0 ${index === items.length - 1 ? 'mr-5' : ''}`}
            >
              <Icon className='size-9' title={title} />
            </div>
          ))}
        </div>
      </Marquee>
    </div>
  )
}

export default function StacksCard({ label, rowOne, rowTwo }: Readonly<HomeContent["cards"]["stacks"]>) {
  return (
    <div className='flex h-56 sm:h-64 flex-col gap-3 sm:gap-4 overflow-hidden rounded-xl p-4 shadow-feature-card lg:p-6'>
      <div className='flex items-center gap-2'>
        <ZapIcon className='h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0' />
        <h2 className='text-sm sm:text-base font-medium text-foreground'>{label}</h2>
      </div>
      <StackRow items={rowOne} />
      <StackRow items={rowTwo} direction='right' />
    </div>
  )
}
