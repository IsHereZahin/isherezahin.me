// Most of the code is from @nelsonlaidev
// ui concept | component - Thanks to @nelsonlaidev
// Copyright (c) 2023 Nelson Lai
// Source: https://github.com/nelsonlaidev
//
// Modified by: Zahin Mohammad

import Section from '../ui/Section'
import SeeMore from '../ui/SeeMore'
import CodingHours from './CodingHours'
import Connect from './Connect'
import FavoriteFramework from './FavoriteFramework'
import LocationCard from './LocationCard'
import StacksCard from './StacksCard'

export default function AboutMe() {
  return (
    <Section id='about-me' animate={true}>
      <div className='mt-12 grid gap-4 md:grid-cols-2'>
        <div className='grid gap-4'>
          <LocationCard />
          <StacksCard />
        </div>
        <div className='grid gap-4'>
          <Connect />
          <div className='grid gap-4 [@media(min-width:450px)]:grid-cols-2'>
            <CodingHours />
            <FavoriteFramework />
          </div>
        </div>
      </div>
      <div className='my-8 flex items-center justify-center'>
        <SeeMore href="/about" text="Know more about me" className="mt-16" />
      </div>
    </Section>
  )
}


