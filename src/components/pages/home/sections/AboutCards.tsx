// Most of the code is from @nelsonlaidev
// ui concept | component - Thanks to @nelsonlaidev
// Copyright (c) 2023 Nelson Lai
// Source: https://github.com/nelsonlaidev
//
// Modified by: Zahin Mohammad

import { Section, SeeMore } from "@/components/ui"
import type { HomeContent } from "@/data/pages/home"
import CodingHours from '../components/CodingHours'
import Connect from '../components/Connect'
import FavoriteFramework from '../components/FavoriteFramework'
import LocationCard from '../components/LocationCard'
import StacksCard from '../components/StacksCard'

/** The bento grid of "about me" cards between the hero and the blog strip. */
export default function AboutCards({ cards }: { readonly cards: HomeContent["cards"] }) {
  return (
    <Section id='about-me' animate={true} delay={0.2}>
      <div className='mt-12 grid gap-4 md:grid-cols-2'>
        <div className='grid gap-4'>
          <LocationCard {...cards.location} />
          <StacksCard {...cards.stacks} />
        </div>
        <div className='grid gap-4'>
          <Connect label={cards.connect.label} />
          <div className='grid gap-4 [@media(min-width:450px)]:grid-cols-2'>
            <CodingHours {...cards.codingHours} />
            <FavoriteFramework {...cards.favoriteFramework} />
          </div>
        </div>
      </div>
      <div className='my-8 flex items-center justify-center'>
        <SeeMore href={cards.seeMore.href} text={cards.seeMore.text} className="mt-16" />
      </div>
    </Section>
  )
}
