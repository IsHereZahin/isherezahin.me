"use client";

import { motion } from 'motion/react';

type PageTitleProps = {
  title: string
  subtitle: string
  animate?: boolean
}

const animation = {
  hide: {
    x: -30,
    opacity: 0
  },
  show: {
    x: 0,
    opacity: 1
  }
}

export default function PageTitle({ title, subtitle, animate = true }: Readonly<PageTitleProps>) {

  return (
    <div className='text-start'>
      <motion.h1
        className='my-4 font-semibold text-3xl sm:text-4xl'
        {...(animate && {
          initial: animation.hide,
          animate: animation.show
        })}
      >
        {title}
      </motion.h1>
      <motion.h2
        className='mb-8 text-muted-foreground'
        {...(animate && {
          initial: animation.hide,
          animate: animation.show,
          transition: { delay: 0.1 }
        })}
      >
        {subtitle}
      </motion.h2>
    </div>
  )
}
