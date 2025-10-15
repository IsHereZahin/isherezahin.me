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
          className="py-4 overflow-hidden flex w-full h-full max-w-full max-h-full place-items-center m-0 p-2 list-none opacity-100 mask-[linear-gradient(to_right,_rgba(0,0,0,0)_0%,_rgb(0,0,0)_12.5%,_rgb(0,0,0)_87.5%,_rgba(0,0,0,0)_100%)]"
        >
          <div className='flex gap-6'>
            <div className="flex items-center justify-center size-14 bg-background shadow-feature-card rounded-[12px] flex-shrink-0">
              <SiReact className='size-9' title='React' />
            </div>
            <div className="flex items-center justify-center size-14 bg-background shadow-feature-card rounded-[12px] flex-shrink-0">
              <SiRedux className='size-9' title='Redux' />
            </div>
            <div className="flex items-center justify-center size-14 bg-background shadow-feature-card rounded-[12px] flex-shrink-0">
              <SiNextdotjs className='size-9' title='Next.js' />
            </div>
            <div className="flex items-center justify-center size-14 bg-background shadow-feature-card rounded-[12px] flex-shrink-0">
              <SiMongodb className='size-9' title='MongoDB' />
            </div>
            <div className="flex items-center justify-center size-14 bg-background shadow-feature-card rounded-[12px] flex-shrink-0">
              <SiLaravel className='size-9' title='Laravel' />
            </div>
            <div className="flex items-center justify-center size-14 bg-background shadow-feature-card rounded-[12px] flex-shrink-0">
              <SiVuedotjs className='size-9' title='Vue.js' />
            </div>
            <div className="flex items-center justify-center size-14 bg-background shadow-feature-card rounded-[12px] flex-shrink-0">
              <SiJavascript className='size-9' title='JavaScript' />
            </div>
            <div className="flex items-center justify-center size-14 bg-background shadow-feature-card rounded-[12px] flex-shrink-0">
              <SiTypescript className='size-9' title='TypeScript' />
            </div>
            <div className="flex items-center justify-center size-14 bg-background shadow-feature-card rounded-[12px] flex-shrink-0">
              <SiDocker className='size-9' title='Docker' />
            </div>
            <div className="flex items-center justify-center size-14 bg-background shadow-feature-card rounded-[12px] flex-shrink-0">
              <SiLinux className='size-9' title='Linux' />
            </div>
            <div className="flex items-center justify-center size-14 bg-background shadow-feature-card rounded-[12px] flex-shrink-0">
              <SiGit className='size-9' title='Git' />
            </div>
            <div className="flex items-center justify-center size-14 bg-background shadow-feature-card rounded-[12px] flex-shrink-0 mr-5">
              <SiFigma className='size-9' title='Figma' />
            </div>
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
          className="py-4 overflow-hidden flex w-full h-full max-w-full max-h-full place-items-center m-0 p-2 list-none opacity-100 mask-[linear-gradient(to_right,_rgba(0,0,0,0)_0%,_rgb(0,0,0)_12.5%,_rgb(0,0,0)_87.5%,_rgba(0,0,0,0)_100%)]"
        >
          <div className='flex gap-6'>
            <div className="flex items-center justify-center size-14 bg-background shadow-feature-card rounded-[12px] flex-shrink-0">
              <SiTailwindcss className='size-9' title='Tailwind CSS' />
            </div>
            <div className="flex items-center justify-center size-14 bg-background shadow-feature-card rounded-[12px] flex-shrink-0">
              <SiBootstrap className='size-9' title='Bootstrap' />
            </div>
            <div className="flex items-center justify-center size-14 bg-background shadow-feature-card rounded-[12px] flex-shrink-0">
              <SiPython className='size-9' title='Python' />
            </div>
            <div className="flex items-center justify-center size-14 bg-background shadow-feature-card rounded-[12px] flex-shrink-0">
              <SiPhp className='size-9' title='PHP' />
            </div>
            <div className="flex items-center justify-center size-14 bg-background shadow-feature-card rounded-[12px] flex-shrink-0">
              <SiMysql className='size-9' title='MySQL' />
            </div>
            <div className="flex items-center justify-center size-14 bg-background shadow-feature-card rounded-[12px] flex-shrink-0">
              <SiFirebase className='size-9' title='Firebase' />
            </div>
            <div className="flex items-center justify-center size-14 bg-background shadow-feature-card rounded-[12px] flex-shrink-0">
              <SiVite className='size-9' title='Vite' />
            </div>
            <div className="flex items-center justify-center size-14 bg-background shadow-feature-card rounded-[12px] flex-shrink-0">
              <SiCloudflare className='size-9' title='Cloudflare' />
            </div>
            <div className="flex items-center justify-center size-14 bg-background shadow-feature-card rounded-[12px] flex-shrink-0">
              <SiMarkdown className='size-9' title='Markdown' />
            </div>
            <div className="flex items-center justify-center size-14 bg-background shadow-feature-card rounded-[12px] flex-shrink-0">
              <SiPostman className='size-9' title='Postman' />
            </div>
            <div className="flex items-center justify-center size-14 bg-background shadow-feature-card rounded-[12px] flex-shrink-0 mr-5">
              <SiNodedotjs className='size-9' title='Node.js' />
            </div>
          </div>
        </Marquee>
      </div>
    </div>
  )
}