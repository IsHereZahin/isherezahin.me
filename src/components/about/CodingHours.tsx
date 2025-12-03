import { ClockIcon } from 'lucide-react'

export default function CodingHours() {
  return (
    <div className='flex flex-col gap-4 sm:gap-6 rounded-xl p-4 shadow-feature-card lg:p-6'>
      <div className='flex items-center gap-2'>
        <ClockIcon className='size-4 sm:size-[18px]' />
        <h2 className='text-xs sm:text-sm font-medium text-muted-foreground'>Coding Hours</h2>
      </div>
      <div className='flex grow items-center justify-center text-2xl sm:text-3xl md:text-4xl font-semibold text-foreground'>
        15,600 hrs
      </div>
    </div>
  )
}
