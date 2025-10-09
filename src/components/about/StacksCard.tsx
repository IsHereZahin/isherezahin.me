'use client'

import {
  SiBootstrap,
  SiCloudflare,
  SiDocker,
  SiFigma,
  SiFirebase,
  SiGit,
  SiJavascript,
  SiLaravel,
  SiLinux,
  SiMarkdown,
  SiMongodb,
  SiMysql,
  SiNextdotjs,
  SiNodedotjs,
  SiPhp,
  SiPostman,
  SiPython,
  SiReact,
  SiRedux,
  SiTailwindcss,
  SiTypescript,
  SiVite,
  SiVuedotjs
} from '@icons-pack/react-simple-icons'
import { ZapIcon } from 'lucide-react'
import Marquee from 'react-fast-marquee'

export default function StacksCard() {
  return (
    <div className='flex h-64 flex-col gap-4 overflow-hidden rounded-xl p-4 shadow-feature-card lg:p-6 bg-card'>
      <div className='flex items-center gap-2'>
        <ZapIcon className='h-4 w-4 flex-shrink-0' />
        <h2 className='text-base font-medium'>Languages and Tools</h2>
      </div>
      <div className='flex-1 overflow-hidden'>
        <Marquee
          speed={30}
          gradient={true}
          gradientColor={[200, 200, 200] as unknown as string}
          pauseOnHover={true}
          className='py-4 overflow-hidden'
        >
          <div className='flex gap-6'>
            <SiReact className='size-10 flex-shrink-0' title='React' />
            <SiRedux className='size-10 flex-shrink-0' title='Redux' />
            <SiNextdotjs className='size-10 flex-shrink-0' title='Next.js' />
            <SiMongodb className='size-10 flex-shrink-0' title='MongoDB' />
            <SiLaravel className='size-10 flex-shrink-0' title='Laravel' />
            <SiVuedotjs className='size-10 flex-shrink-0' title='Vue.js' />
            <SiJavascript className='size-10 flex-shrink-0' title='JavaScript' />
            <SiTypescript className='size-10 flex-shrink-0' title='TypeScript' />
            <SiDocker className='size-10 flex-shrink-0' title='Docker' />
            <SiLinux className='size-10 flex-shrink-0' title='Linux' />
            <SiGit className='size-10 flex-shrink-0' title='Git' />
            <SiFigma className='size-10 flex-shrink-0 mr-6' title='Figma' />
          </div>
        </Marquee>
      </div>
      <div className='flex-1 overflow-hidden'>
        <Marquee
          direction='right'
          speed={30}
          gradient={true}
          gradientColor={[200, 200, 200] as unknown as string}
          pauseOnHover={true}
          className='py-4 overflow-hidden'
        >
          <div className='flex gap-6'>
            <SiTailwindcss className='size-10 flex-shrink-0' title='Tailwind CSS' />
            <SiBootstrap className='size-10 flex-shrink-0' title='Bootstrap' />
            <SiPython className='size-10 flex-shrink-0' title='Python' />
            <SiPhp className='size-10 flex-shrink-0' title='PHP' />
            <SiMysql className='size-10 flex-shrink-0' title='MySQL' />
            <SiFirebase className='size-10 flex-shrink-0' title='Firebase' />
            <SiVite className='size-10 flex-shrink-0' title='Vite' />
            <SiCloudflare className='size-10 flex-shrink-0' title='Cloudflare' />
            <SiMarkdown className='size-10 flex-shrink-0' title='Markdown' />
            <SiPostman className='size-10 flex-shrink-0' title='Postman' />
            <SiNodedotjs className='size-10 flex-shrink-0 mr-6' title='Node.js' />
          </div>
        </Marquee>
      </div>
    </div>
  )
}

