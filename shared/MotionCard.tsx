import { AnimatePresence, motion } from 'framer-motion'

const AnimatedCard: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const variants = {
    hidden: {
      opacity: 0,
      y: 50
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut'
      }
    }
  }

  return (
    <AnimatePresence>
      {
        <motion.div
          className='card'
          initial='hidden'
          animate='visible'
          exit='hidden'
          variants={variants}
        >
          {children}
          {/* Your card content goes here */}
        </motion.div>
      }
    </AnimatePresence>
  )
}

export default AnimatedCard
