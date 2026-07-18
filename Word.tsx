import React from 'react'
import { motion, useTransform } from 'framer-motion'

type Props = {
  paragraph: string
}

const Word = ({ children, progress, range }: any) => {
  const opacity = useTransform(progress, range, [0, 1])
  return (
    <span className='relative mr-3 mt-0.5'>
      <span className='absolute opacity-20'>{children}</span>
      <motion.span style={{ opacity: opacity }}>{children}</motion.span>
    </span>
  )
}

export default Word
