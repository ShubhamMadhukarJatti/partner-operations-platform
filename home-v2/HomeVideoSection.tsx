'use client'

import React from 'react'

import { EventVideoAndBriefGlance } from '../EventVideoAndBriefGlance'

const HomeVideoSection = () => {
  return (
    <div id='home-promo-video'>
      <EventVideoAndBriefGlance
        videoSrc='https://storage.googleapis.com/sharkdom_resources/hero_section/promo.mp4'
        videoPoster='https://storage.googleapis.com/sharkdom_resources/ads/hero_video.png'
        duration='1 min'
        buttonText='Watch Video'
      />
    </div>
  )
}

export default HomeVideoSection
