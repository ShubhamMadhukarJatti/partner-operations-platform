import { ComponentType } from 'react'
import dynamic from 'next/dynamic'

// Loading component
const LoadingDiv = ({ className = 'h-32 w-full' }: { className?: string }) => (
  <div className={`animate-pulse rounded bg-gray-200 ${className}`} />
)

// Lazy load Lottie (most commonly used heavy component)
export const LazyLottie = dynamic(() => import('lottie-react'), {
  loading: () => <LoadingDiv className='h-32 w-32' />,
  ssr: false
})

// Optimized Framer Motion components
export const LazyMotionDiv = dynamic(
  () => import('framer-motion').then((mod) => ({ default: mod.motion.div })),
  {
    loading: () => <LoadingDiv />,
    ssr: false
  }
)

export const LazyMotionSection = dynamic(
  () =>
    import('framer-motion').then((mod) => ({ default: mod.motion.section })),
  {
    loading: () => <LoadingDiv />,
    ssr: false
  }
)

// Generic lazy wrapper for heavy components
export function createLazyComponent<T = any>(
  importFn: () => Promise<{ default: ComponentType<T> }>,
  fallback?: ComponentType
) {
  const FallbackComponent = fallback || (() => <LoadingDiv />)

  return dynamic(importFn, {
    loading: () => <FallbackComponent />,
    ssr: false
  })
}

// Helper function to create lazy components for specific paths
export const createLazyComponentFromPath = (
  path: string,
  loadingClassName?: string
) => {
  return dynamic(() => import(path), {
    loading: () => <LoadingDiv className={loadingClassName} />,
    ssr: false
  })
}
