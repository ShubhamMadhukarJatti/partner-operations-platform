// // components/LeftBannerCarousel.tsx

// import { useEffect, useMemo, useState } from 'react'
// import Image, { StaticImageData } from 'next/image'

// import { cn } from '@/lib/utils'

// type Props = {
//   images: (StaticImageData | string)[]
//   intervalMs?: number // default 3500 (3.5s)
//   className?: string // control height/width outside
//   rounded?: string // tailwind radius class
// }

// const LeftBannerCarousel = ({
//   images,
//   intervalMs = 3500,
//   className,
//   rounded = 'rounded-2xl'
// }: Props) => {
//   const count = images.length
//   const clones = useMemo(
//     () => [images[count - 1], ...images, images[0]],
//     [images, count]
//   )

//   const [index, setIndex] = useState(1) // start at first real slide
//   const [animate, setAnimate] = useState(true)
//   const [hovered, setHovered] = useState(false)

//   // autoplay
//   useEffect(() => {
//     if (hovered) return
//     const id = setInterval(() => {
//       setIndex((i) => i + 1)
//       setAnimate(true)
//     }, intervalMs)
//     return () => clearInterval(id)
//   }, [intervalMs, hovered])

//   // seamless loop reset
//   const onEnd = () => {
//     if (index === clones.length - 1) {
//       setAnimate(false)
//       setIndex(1)
//     } else if (index === 0) {
//       setAnimate(false)
//       setIndex(clones.length - 2)
//     }
//   }
//   // re-enable animation next tick after a jump
//   useEffect(() => {
//     if (!animate) {
//       const id = requestAnimationFrame(() =>
//         requestAnimationFrame(() => setAnimate(true))
//       )
//       return () => cancelAnimationFrame(id)
//     }
//   }, [animate])

//   const active = (index - 1 + count) % count

//   return (
//     <div
//       className={cn(
//         'relative w-full max-w-[638px] overflow-hidden overflow-hidden rounded-2xl bg-gray-200',
//         rounded,
//         'h-full', // default height; override via className
//         className
//       )}
//       onMouseEnter={() => setHovered(true)}
//       onMouseLeave={() => setHovered(false)}
//     >
//       {/* Top-left indicators (active is wider) */}
//       <div className='bg-red absolute left-3 top-3 z-20 flex items-center gap-1.5'>
//         {images.map((_, i) => (
//           <span
//             key={i}
//             className={cn(
//               'h-1.5 rounded-full transition-all',
//               i === active ? 'w-6 bg-[#3E50F7]' : 'w-2 bg-[#3E50F7]/30'
//             )}
//             aria-label={`Slide ${i + 1}${i === active ? ' (active)' : ''}`}
//           />
//         ))}
//       </div>

//       {/* Slides */}
//       <div
//         className='flex h-full'
//         style={{
//           width: `${clones.length * 100}%`,
//           transform: `translateX(-${index * (100 / clones.length)}%)`,
//           transition: animate ? 'transform 500ms ease-in-out' : 'none'
//         }}
//         onTransitionEnd={onEnd}
//       >
//         {clones.map((src, i) => (
//           <div
//             key={i}
//             className='relative h-full w-full shrink-0 grow-0 basis-full'
//           >
//             <Image
//               src={src}
//               alt={`banner-${i}`}
//               fill
//               className='object-cover'
//               priority={i === 1}
//               sizes='(max-width: 768px) 100vw, 33vw'
//             />
//           </div>
//         ))}
//       </div>
//     </div>
//   )
// }
// export default LeftBannerCarousel
