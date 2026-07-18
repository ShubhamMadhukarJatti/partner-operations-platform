import React, { useRef } from 'react'
import { useScroll } from 'framer-motion'

import Word from './Word'

type Props = {}
const paragraph =
  "No need to do all the research on the startup you want to approach for partnership with W.I.I.F.M (What's In It For Me) and then wait for the partnership to get acknowlegded. At Sharkdom, Our loyal startups community are open for partnership anytime of the day so start expanding your Partner Network to increase your signups, revenue using partnerships."

const ParagraphAnimation = () => {
  return (
    <div className='my-24 flex justify-center'>
      <Paragraph />
    </div>
  )
}

export default ParagraphAnimation

const Paragraph = (props: Props) => {
  const container = useRef(null)
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start end', 'end end']
  })

  const words = paragraph.split(' ')
  return (
    <p
      ref={container}
      className='flex max-w-2xl flex-wrap p-4 font-serif text-4xl font-medium  leading-[145%] text-[#333333] sm:text-[3.2rem]'
    >
      {words.map((word, i) => {
        const start = i / words.length
        const end = start + 1 / words.length

        return (
          <Word key={i} progress={scrollYProgress} range={[start, end]}>
            {word}
          </Word>
        )
      })}
    </p>
  )
}
