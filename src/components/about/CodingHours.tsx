import { ClockIcon } from 'lucide-react'

export default function CodingHours() {
  return (
    <div className='flex flex-col gap-6 rounded-xl p-4 shadow-feature-card lg:p-6'>
      <div className='flex items-center gap-2'>
        <ClockIcon className='size-[18px]' />
        <h2 className='text-sm'>Coding Hours</h2>
      </div>
      <div className='flex grow items-center justify-center text-4xl font-semibold'>
        15,600 hrs
      </div>
    </div>
  )
}
