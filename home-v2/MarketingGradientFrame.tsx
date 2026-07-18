'use client'

import type { CSSProperties, ReactNode } from 'react'

import { cn } from '@/lib/utils'

/**
 * Figma 2147205427 `linear-gradient(90deg, rgba(185,207,255,0.56), rgba(222,176,255,0.56))`
 * composited on white — opaque RGB stops so the fill always reads in the browser (no “missing” gradient).
 */
export const marketingFrameLinearBackgroundStyle: CSSProperties = {
  background:
    'linear-gradient(90deg, rgb(216, 230, 255) 0%, rgb(236, 211, 255) 100%)'
}

/** Tailwind mirror (opaque endpoints ≈ Figma-on-white). */
export const marketingFrameGradientClass =
  'bg-gradient-to-r from-[rgb(216,230,255)] to-[rgb(236,211,255)]'

/** Node 947:28525 — soft mesh (radials) + light base, matching Figma “airy” background. */
export const marketplaceMeshBackgroundStyle: CSSProperties = {
  backgroundColor: '#FAFAFF',
  backgroundImage: `
    radial-gradient(ellipse 95% 65% at 50% -12%, rgba(255, 255, 255, 0.98) 0%, transparent 52%),
    radial-gradient(ellipse 75% 55% at -5% 5%, rgba(216, 229, 255, 0.55) 0%, transparent 48%),
    radial-gradient(ellipse 75% 55% at 105% 5%, rgba(243, 225, 255, 0.52) 0%, transparent 48%),
    radial-gradient(ellipse 90% 50% at 50% 105%, rgba(240, 242, 251, 0.75) 0%, transparent 50%),
    linear-gradient(180deg, #FAFAFF 0%, #F5F5FC 55%, #F8F9FD 100%)
  `
}

type MarketingGradientFrameProps = {
  children: ReactNode
  className?: string
  /** Marketplace-style grid lines + corner chips (lightweight approximation). */
  showGridDecor?: boolean
  /** `mesh` = Figma 947:28525 pastel mesh; `linear` = shared rgba linear strip (e.g. testimonials). */
  variant?: 'linear' | 'mesh'
}

export function MarketingGradientFrame({
  children,
  className,
  showGridDecor = false,
  variant = 'linear'
}: MarketingGradientFrameProps) {
  const shellClassName = cn(
    'relative mx-auto w-full max-w-[1408px] overflow-hidden rounded-[8px]',
    variant === 'mesh' &&
      'isolate border border-[#D8E3FF]/55 shadow-[0px_1px_0px_rgba(255,255,255,0.9)_inset]',
    className
  )

  /** Dedicated layer so the gradient always paints behind content (same visual as Figma frame fill). */
  if (variant === 'linear') {
    return (
      <div
        className={cn(
          shellClassName,
          'bg-[linear-gradient(90deg,rgb(216,230,255)_0%,rgb(236,211,255)_100%)]'
        )}
        style={marketingFrameLinearBackgroundStyle}
      >
        {showGridDecor ? <FrameGridDecor /> : null}
        <div className='relative z-[1]'>{children}</div>
      </div>
    )
  }

  return (
    <div className={shellClassName} style={marketplaceMeshBackgroundStyle}>
      {showGridDecor ? <FrameGridDecor /> : null}
      <div className='relative z-[1]'>{children}</div>
    </div>
  )
}

function FrameGridDecor() {
  /**
   * Node 947:28525 — 1408px reference. Verticals: left 96px, right 88px.
   * Horizontals at top 64px: span 0→643px and 769px→end (126px gap for INTRODUCING).
   */
  const lineColor = 'bg-[#F1F0FF]'
  const horizontalTop = 'top-16'
  const verticalRailLeft = '96px'
  const verticalRailRight = '88px'
  const nodeTop = 'top-14'
  const nodeLeft = '88px'
  const nodeRight = '80px'
  const leftSpanPct = `${(643 / 1408) * 100}%`
  const rightStartPct = `${(769 / 1408) * 100}%`

  return (
    <div
      aria-hidden
      className='pointer-events-none absolute inset-0 z-0 overflow-hidden'
    >
      <div
        className={cn('absolute bottom-0 top-0 w-1', lineColor)}
        style={{ left: verticalRailLeft }}
      />
      <div
        className={cn('absolute bottom-0 top-0 w-1', lineColor)}
        style={{ right: verticalRailRight }}
      />

      <div
        className={cn(
          'absolute size-4 rounded-[3px] bg-white shadow-sm',
          nodeTop
        )}
        style={{ left: nodeLeft }}
      />
      <div
        className={cn(
          'absolute size-4 rounded-[3px] bg-white shadow-sm',
          nodeTop
        )}
        style={{ right: nodeRight }}
      />

      {/* Horizontals at y=64px: 0→643px and 769px→end (126px center gap for INTRODUCING) */}
      <div
        className={cn('absolute left-0 h-1', lineColor, horizontalTop)}
        style={{ width: leftSpanPct }}
      />
      <div
        className={cn('absolute h-1', lineColor, horizontalTop)}
        style={{ left: rightStartPct, right: 0 }}
      />
    </div>
  )
}
