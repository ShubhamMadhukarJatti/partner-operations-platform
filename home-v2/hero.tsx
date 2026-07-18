'use client'

import React, { useCallback, useLayoutEffect, useRef, useState } from 'react'
import { Bebas_Neue } from 'next/font/google'
import Image from 'next/image'
import Link from 'next/link'
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion
} from 'framer-motion'
import {
  AlertTriangle,
  ArrowRight,
  Layers,
  LineChart,
  Play,
  Zap
} from 'lucide-react'

import { cn } from '@/lib/utils'

import { TRUSTED_COMPANIES } from './trusted-partner-logos'

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  display: 'swap'
})

/** Seconds per full orbit (rings + nodes). Lower = faster. */
const ORBIT_DURATION = 38

/** Group 1511077524 — outer ring frame in 1440 artboard */
const FIGMA_FRAME_W = 1440
const ORBIT_BOX = 520.24
const FIGMA_GLOW_PX = 1044

const ORBIT_CANVAS_PAD_L = 87
/**
 * Canvas is wider than tall for badge clearance; the hub column uses a centered
 * square (`aspect-square h-full max-w-full`) so dashed rings are true circles.
 */
const ORBIT_CANVAS_W = 680
const ORBIT_CANVAS_H = 492

/**
 * Half-diameter of each dashed orbit in **hub-local px** (520.24² artboard).
 * Figma “circle 1” (innermost) → `inner`, “circle 2” → `mid`, `outer` = third ring.
 */
const ORBIT_RING_RADIUS_HUB_PX = {
  inner: 250.48 / 2,
  mid: 385.36 / 2,
  outer: 520.24 / 2
} as const

const pctX = (canvasX: number) => `${(canvasX / ORBIT_CANVAS_W) * 100}%`
const pctY = (canvasY: number) => `${(canvasY / ORBIT_CANVAS_H) * 100}%`

/** Gap between orbit node and card edge along the horizontal, hub-local px */
const ORBIT_CARD_NODE_GAP_HUB_PX = 14

/**
 * Pull node centers inward so the dot (17px + border) stays inside the dashed ring.
 * In screen px: ~half dot + small padding inside the 2px stroke; converted to hub via scale.
 */
const ORBIT_DOT_EDGE_INSET_PX = 11

/** Orbit node direction: degrees **clockwise from 3 o’clock** (east); +y is down. */
const ORBIT_NODE_DEG = {
  /** 12 o’clock — above hub */
  at12: 270,
  /** ~2 o’clock */
  at2: 330,
  /** ~7 o’clock */
  at7: 120,
  /** 8 o’clock — clockwise from 3 o’clock: 5 × 30° */
  at8: 150,
  /** 6 o’clock — below hub */
  at6: 90,
  /** 5:30 — between 5 and 6 (clockwise from 3 o’clock: 2.5 × 30°) */
  at530: 75
} as const

type OrbitBadgeBodyProps = {
  title: string
  subtitle: string
  icon: React.ElementType
  iconClassName: string
  iconTone?: 'light' | 'dark'
}

const OrbitBadgeBody = ({
  title,
  subtitle,
  icon: Icon,
  iconClassName,
  iconTone = 'light'
}: OrbitBadgeBodyProps) => (
  <div
    className={cn(
      'w-full rounded-[12px] border border-[#E2E4EB] bg-white',
      'shadow-[0px_1px_2px_rgba(14,17,27,0.05),0px_10px_28px_-8px_rgba(14,17,27,0.12)]'
    )}
  >
    <div className='flex min-h-[48px] items-center gap-2 px-2 py-1.5 sm:min-h-[50px] sm:gap-2 sm:px-2.5 sm:py-2'>
      <div
        className={cn(
          'flex size-[30px] shrink-0 items-center justify-center rounded-[8px] sm:size-8',
          iconClassName
        )}
      >
        <Icon
          className={cn(
            'size-[14px] sm:size-[15px]',
            iconTone === 'dark' ? 'text-[#2A1600]' : 'text-white'
          )}
          strokeWidth={2}
        />
      </div>
      <div className='min-w-0'>
        <p className='whitespace-normal break-words text-[13px] font-semibold leading-[17px] tracking-[-0.06px] text-[#0E111B] sm:text-[11.5px] sm:leading-[14px]'>
          {title}
        </p>
        <div className='mt-0.5 flex items-center gap-1 sm:mt-1 sm:gap-1.5'>
          <span
            className='size-1 shrink-0 rounded-full bg-[#04AB62] sm:size-[5px]'
            style={{ opacity: 0.96 }}
          />
          <p className='whitespace-normal break-words font-mono text-[11px] leading-[14px] tracking-[0.12px] text-[#757A87] sm:text-[10px] sm:leading-[13px] sm:tracking-[0.18px]'>
            {subtitle}
          </p>
        </div>
      </div>
    </div>
  </div>
)

type OrbitRingId = keyof typeof ORBIT_RING_RADIUS_HUB_PX

/** Match dashed ring spin so nodes ride the same direction per ring */
const ORBIT_RING_SPIN: Record<OrbitRingId, 'orbit-ring-cw' | 'orbit-ring-ccw'> =
  {
    inner: 'orbit-ring-cw',
    mid: 'orbit-ring-ccw',
    outer: 'orbit-ring-cw'
  }

/**
 * Declarative placement for one orbit “feature card” + its ring node.
 * Figma **circle 1** (innermost) → `ringId: 'inner'`, **circle 2** → `'mid'`.
 */
type OrbitFeatureCardLayout = {
  ringId: OrbitRingId
  /** Orbit node angle, degrees clockwise from 3 o’clock (east). */
  nodeAngleDegClockwiseFromEast: number
  /**
   * When true, the **orbit node is to the right of the card** (card sits west of the node).
   * When false, the **node is to the left of the card** (card sits east of the node).
   */
  orbitNodeIsRightOfCard: boolean
  cardWidthHubPx: number
  cardHeightHubPx: number
  /**
   * Shift the orbit node (and card, which is laid out from it). Hub-local px; +y is down.
   * Use for one-off fixes without changing other cards.
   */
  orbitNodeNudgeHubPx?: { x?: number; y?: number }
  /** Optional nudge after auto layout (hub-local px) */
  cardOffsetHubPx?: { x?: number; y?: number }
}

type OrbitFeatureCardProps = OrbitBadgeBodyProps & {
  layout: OrbitFeatureCardLayout
  hubRef: React.RefObject<HTMLDivElement | null>
  /** Incremented when the orbit hub first gets a non-zero size; re-syncs node positions. */
  orbitLayoutEpoch: number
}

/** Pixel offset of orbit node from hub center (same math as `onOrbitFrame` at `sweep`). */
function orbitNodeOffsetScreenPx(
  hubEl: HTMLElement,
  ringRadiusHubPx: number,
  angleRad: number,
  nx: number,
  ny: number,
  sweep: number
) {
  const side = hubEl.offsetWidth || 1
  const scale = side / ORBIT_BOX
  const insetHub = ORBIT_DOT_EDGE_INSET_PX / scale
  const rCap = Math.max(0, ringRadiusHubPx - insetHub)
  let xh = rCap * Math.cos(angleRad + sweep) + nx
  let yh = rCap * Math.sin(angleRad + sweep) + ny
  const dist = Math.hypot(xh, yh)
  if (dist > rCap && dist > 0) {
    xh = (xh / dist) * rCap
    yh = (yh / dist) * rCap
  }
  return { x: xh * scale, y: yh * scale }
}

/** Card widths from 1440px Figma frame (hub-local) */
const ORBIT_CARD_WIDTH = {
  onboarding: FIGMA_FRAME_W - 822 - 373.78,
  management: FIGMA_FRAME_W - 1176 - 39.48,
  attribution: FIGMA_FRAME_W - 727 - 481.92,
  activation: FIGMA_FRAME_W - 1137 - 71.92
} as const

const ORBIT_CARD_HEIGHT_HUB_PX = 55.88

/**
 * Layout specs aligned with Figma (ring, clock, node vs card).
 * | Card | Figma ring | ~clock | Node vs card |
 * |------|------------|--------|----------------|
 * | Onboarding | 2 (mid) | 12 | node right of card |
 * | Management | 1 (inner) | 2 | node left of card |
 * | Attribution | 1 (inner) | 8 | node right of card |
 * | Activation | 2 (mid) | 5:30 | node left of card |
 */
const ORBIT_FEATURE_CARD_LAYOUTS = {
  onboarding: {
    ringId: 'mid' as const,
    nodeAngleDegClockwiseFromEast: ORBIT_NODE_DEG.at12,
    orbitNodeIsRightOfCard: true,
    cardWidthHubPx: ORBIT_CARD_WIDTH.onboarding,
    cardHeightHubPx: ORBIT_CARD_HEIGHT_HUB_PX
  },
  management: {
    ringId: 'inner' as const,
    nodeAngleDegClockwiseFromEast: ORBIT_NODE_DEG.at2,
    orbitNodeIsRightOfCard: false,
    cardWidthHubPx: ORBIT_CARD_WIDTH.management,
    cardHeightHubPx: ORBIT_CARD_HEIGHT_HUB_PX
  },
  attribution: {
    ringId: 'inner' as const,
    nodeAngleDegClockwiseFromEast: ORBIT_NODE_DEG.at8,
    orbitNodeIsRightOfCard: true,
    cardWidthHubPx: ORBIT_CARD_WIDTH.attribution,
    cardHeightHubPx: ORBIT_CARD_HEIGHT_HUB_PX,
    /** Light nudge after radial inset (keep inside ring). */
    orbitNodeNudgeHubPx: { x: 4, y: -8 }
  },
  activation: {
    ringId: 'mid' as const,
    nodeAngleDegClockwiseFromEast: ORBIT_NODE_DEG.at530,
    orbitNodeIsRightOfCard: false,
    cardWidthHubPx: ORBIT_CARD_WIDTH.activation,
    cardHeightHubPx: ORBIT_CARD_HEIGHT_HUB_PX,
    orbitNodeNudgeHubPx: { x: -4, y: -8 }
  }
} as const satisfies Record<string, OrbitFeatureCardLayout>

const OrbitFeatureCard = ({
  layout,
  hubRef,
  orbitLayoutEpoch,
  ...body
}: OrbitFeatureCardProps) => {
  const reduceMotion = useReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const ringRadiusHubPx = ORBIT_RING_RADIUS_HUB_PX[layout.ringId]
  const angleRad = (layout.nodeAngleDegClockwiseFromEast * Math.PI) / 180
  const nudge = layout.orbitNodeNudgeHubPx
  const nx = nudge?.x ?? 0
  const ny = nudge?.y ?? 0
  const { cardWidthHubPx, cardHeightHubPx } = layout
  const gap = ORBIT_CARD_NODE_GAP_HUB_PX

  const armCw = ORBIT_RING_SPIN[layout.ringId] === 'orbit-ring-cw'

  /** Hub-fraction → `cqw` / `cqh` (no rotation on subtree — badges stay vertical) */
  const cqw = (hubPx: number) => `calc(${(hubPx / ORBIT_BOX) * 100} * 1cqw)`
  const cqh = (hubPx: number) => `calc(${(hubPx / ORBIT_BOX) * 100} * 1cqh)`

  const cardLeftOffset = layout.orbitNodeIsRightOfCard
    ? `calc(-1 * (${cqw(cardWidthHubPx)} + ${cqw(gap)}))`
    : cqw(gap)
  const cardTopOffset = `calc(-1 * ${cqh(cardHeightHubPx / 2)})`

  const onOrbitFrame = useCallback(
    (t: number) => {
      const el = hubRef.current
      if (!el) return
      let sweep = 0
      if (!reduceMotion) {
        const tSec = t / 1000
        const u =
          ((((tSec % ORBIT_DURATION) + ORBIT_DURATION) % ORBIT_DURATION) /
            ORBIT_DURATION) *
          2 *
          Math.PI
        sweep = armCw ? u : -u
      }
      const { x: px, y: py } = orbitNodeOffsetScreenPx(
        el,
        ringRadiusHubPx,
        angleRad,
        nx,
        ny,
        sweep
      )
      x.set(px)
      y.set(py)
    },
    [hubRef, reduceMotion, ringRadiusHubPx, angleRad, nx, ny, armCw, x, y]
  )

  // Avoid frame-0 clutter: motion values default to 0,0 so all dots/badges stack until positioned.
  // The hub often reports offsetWidth 0 for one or more frames (aspect-square + container queries);
  // a single rAF retry was not enough on Safari / some Chromium builds — parent bumps orbitLayoutEpoch
  // when ResizeObserver sees a real size.
  useLayoutEffect(() => {
    const apply = () => {
      const el = hubRef.current
      if (!el?.offsetWidth) return false
      const { x: px, y: py } = orbitNodeOffsetScreenPx(
        el,
        ringRadiusHubPx,
        angleRad,
        nx,
        ny,
        0
      )
      x.set(px)
      y.set(py)
      return true
    }
    if (apply()) return
    let raf = 0
    let attempts = 0
    const maxAttempts = 12
    const retry = () => {
      if (apply() || attempts >= maxAttempts) return
      attempts += 1
      raf = requestAnimationFrame(retry)
    }
    raf = requestAnimationFrame(retry)
    return () => cancelAnimationFrame(raf)
  }, [hubRef, ringRadiusHubPx, angleRad, nx, ny, x, y, orbitLayoutEpoch])

  useAnimationFrame(onOrbitFrame)

  const dotNode = (
    <div
      aria-hidden
      className='pointer-events-none box-border size-[17px] -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-white bg-[#ADAFFF]'
    />
  )

  return (
    <div className='pointer-events-none absolute left-1/2 top-1/2 z-[30] w-0 -translate-x-1/2 -translate-y-1/2'>
      <motion.div
        className='relative h-0 w-0 overflow-visible'
        style={{ x, y }}
      >
        <div className='pointer-events-none absolute left-0 top-0 z-[8]'>
          {dotNode}
        </div>
        <div
          className='absolute z-[35] w-[min(244px,85vw)] max-w-[244px] xs:max-w-[244px]'
          style={{
            left: cardLeftOffset,
            top: cardTopOffset,
            width: cqw(cardWidthHubPx)
          }}
        >
          <OrbitBadgeBody {...body} />
        </div>
      </motion.div>
    </div>
  )
}

const RotatingRing = ({
  diameterPx,
  direction
}: {
  diameterPx: number
  direction: 'cw' | 'ccw'
}) => {
  const sizePct = (diameterPx / ORBIT_BOX) * 100
  return (
    <div
      className='pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'
      style={{ width: `${sizePct}%`, height: `${sizePct}%` }}
    >
      <div
        aria-hidden
        className='box-border h-full w-full rounded-full border-2 border-dashed border-white'
        style={{
          animation: `${
            direction === 'cw' ? 'orbit-ring-cw' : 'orbit-ring-ccw'
          } ${ORBIT_DURATION}s linear infinite`,
          willChange: 'transform',
          backfaceVisibility: 'hidden'
        }}
      />
    </div>
  )
}

const BOOK_DEMO_CTA_LABEL = 'Book a 20-min demo'
const WATCH_TOUR_CTA_LABEL = 'Watch 2-min tour'

/** Same footprint: height + corner radius for both hero CTAs */
const HERO_CTA_DIMS =
  'inline-flex h-[50px] items-center justify-center gap-2 rounded-[10px] px-8 font-jakarta text-base font-bold'

const BookDemoCtaLink = () => (
  <Link
    href='/book-demo'
    className={cn(
      HERO_CTA_DIMS,
      'relative z-10 border border-[#1f2633] bg-[#2A3241] text-white',
      'shadow-[0px_4px_0px_0px_#7688A8]',
      'transition hover:translate-y-px hover:shadow-[0px_3px_0px_0px_#7688A8]',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6863FB]/40',
      'active:translate-y-[3px] active:shadow-none'
    )}
  >
    <span className='inline-block min-w-[18ch] shrink-0 whitespace-nowrap text-left text-white'>
      {BOOK_DEMO_CTA_LABEL}
    </span>
    <ArrowRight className='h-5 w-5 shrink-0' strokeWidth={2.5} aria-hidden />
  </Link>
)

const WatchTourCtaLink = () => (
  <Link
    href='/#home-promo-video'
    scroll={true}
    className={cn(
      HERO_CTA_DIMS,
      'relative z-10 border border-[#2A3241] bg-white text-[#2A3241]',
      'shadow-[0px_4px_0px_0px_#6863FB]',
      'transition hover:translate-y-px hover:bg-transparent hover:shadow-[0px_3px_0px_0px_#6863FB]',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6863FB]/40',
      'active:translate-y-[3px] active:shadow-none'
    )}
  >
    <span
      className='flex size-[22px] shrink-0 items-center justify-center rounded-full bg-[#EAEDFF]'
      aria-hidden
    >
      <Play className='ml-0.5 h-2.5 w-2.5 fill-[#2A3241]' />
    </span>
    <span className='inline-block min-w-[17ch] shrink-0 whitespace-nowrap text-left text-[#2A3241]'>
      {WATCH_TOUR_CTA_LABEL}
    </span>
  </Link>
)

const Hero = () => {
  const orbitHubRef = useRef<HTMLDivElement>(null)
  const [orbitLayoutEpoch, setOrbitLayoutEpoch] = useState(0)

  useLayoutEffect(() => {
    const el = orbitHubRef.current
    if (!el) return

    let cancelled = false
    let sawNonZeroLayout = false

    const bumpIfSized = () => {
      if (cancelled || sawNonZeroLayout) return
      const w = el.getBoundingClientRect().width
      if (w > 0) {
        sawNonZeroLayout = true
        setOrbitLayoutEpoch((n) => n + 1)
      }
    }

    let rafOuter = 0
    let rafInner = 0
    rafOuter = requestAnimationFrame(() => {
      rafInner = requestAnimationFrame(bumpIfSized)
    })

    let ro: ResizeObserver | null = null
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(() => bumpIfSized())
      ro.observe(el)
    }

    return () => {
      cancelled = true
      cancelAnimationFrame(rafOuter)
      cancelAnimationFrame(rafInner)
      ro?.disconnect()
    }
  }, [])

  return (
    <section className='relative w-full overflow-x-hidden bg-white pb-12 pt-2 lg:rounded-t-2xl lg:pb-16'>
      <div className='mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8'>
        <div className='grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-x-6 lg:gap-y-5 xl:gap-x-10 xl:gap-y-7'>
          {/* —— Row 1 left: copy + CTAs + trust —— */}
          <div className='relative z-20 flex max-w-[777px] flex-col lg:self-start lg:pl-4 xl:pl-6'>
            {/* NEW pill */}
            <div className='mb-6 inline-flex h-[34px] w-fit items-center gap-2 rounded-full border border-[#D3D7E2] bg-white py-1 pl-1 pr-3'>
              <span className='rounded-full bg-[#2C2D5A] px-2 py-0.5 text-[10.5px] font-semibold uppercase tracking-[0.04em] text-white'>
                NEW
              </span>
              <span className='text-xs font-medium tracking-[-0.08px] text-[#3E424D]'>
                AI-powered partner workflows, now live
              </span>
              <span className='text-xs text-[#757A87]' aria-hidden>
                →
              </span>
            </div>

            <h1 className='font-jakarta text-4xl font-bold leading-[1.12] tracking-tight text-[#101828] sm:text-5xl lg:text-[52px] lg:leading-[1.08] xl:text-[62px] xl:leading-[69px]'>
              AI Workforce for partnership teams for{' '}
              <span className='text-[#2563EB]'>modern day approach.</span>
            </h1>

            <p className='mt-5 max-w-xl text-[17px] leading-7 tracking-[-0.08px] text-[#3E424D] sm:text-[19px] sm:leading-[28px]'>
              <span className='font-semibold text-[#6366F1]'>Sharkdom</span>{' '}
              recruits, activates and attributes every partner so your channel
              team ships revenue, not slide decks. One platform, every partner
              motion, zero spreadsheets.
            </p>

            <div className='relative z-30 mt-8 flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-5'>
              <BookDemoCtaLink />
              <WatchTourCtaLink />
            </div>

            {/* Avatar stack + trust */}
            <div className='mt-8 flex flex-wrap items-center gap-3'>
              <p className='max-w-md text-[16.3415px] leading-[21px] tracking-[-0.1px] text-[#757A87]'>
                Trusted by{' '}
                <span className='font-medium text-[#2A3241]'>420+</span>{' '}
                partnership teams
              </p>
            </div>
          </div>

          {/* —— Row 1 right: orbit only —— */}
          <div className='relative z-0 mx-auto flex w-full max-w-[640px] justify-center overflow-visible lg:mx-0 lg:max-w-none lg:justify-end lg:self-start'>
            <div className='relative w-[160%] max-w-[680px] shrink-0 overflow-visible sm:w-full sm:max-w-[min(680px,100%)] sm:shrink lg:mr-[-24px]'>
              <div
                className='relative z-0 w-full overflow-visible rounded-[20px] sm:rounded-[24px]'
                style={{ aspectRatio: `${ORBIT_CANVAS_W} / ${ORBIT_CANVAS_H}` }}
              >
                {/* Ellipse 3124 — full orbit canvas so wash sits behind badges (not only hub) */}
                <div
                  aria-hidden
                  className='pointer-events-none absolute inset-0 z-0 rounded-[inherit]'
                  style={{
                    background:
                      'radial-gradient(68% 52% at 50% 46%, rgba(104, 99, 251, 0.22) 0%, rgba(132, 171, 255, 0.17) 40%, rgba(255, 255, 255, 0.65) 70%, #FFFFFF 100%)'
                  }}
                />
                <div
                  className='absolute top-0 flex h-full justify-center overflow-visible'
                  style={{
                    left: pctX(ORBIT_CANVAS_PAD_L),
                    width: pctX(ORBIT_BOX)
                  }}
                >
                  <div
                    ref={orbitHubRef}
                    className='relative aspect-square h-full max-w-full overflow-visible [container-type:size]'
                  >
                    <div
                      className='pointer-events-none absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-90'
                      style={{
                        width: `${(FIGMA_GLOW_PX / ORBIT_BOX) * 100}%`,
                        height: `${(FIGMA_GLOW_PX / ORBIT_BOX) * 100}%`,
                        background:
                          'radial-gradient(50% 50% at 50% 50%, rgba(104, 99, 251, 0.2) 0%, rgba(132, 171, 255, 0.16) 55%, rgba(255, 255, 255, 0) 100%)'
                      }}
                    />
                    <RotatingRing diameterPx={250.48} direction='cw' />
                    <RotatingRing diameterPx={385.36} direction='ccw' />
                    <RotatingRing diameterPx={520.24} direction='cw' />
                    <div className='absolute left-1/2 top-1/2 z-[15] flex size-[112.67px] -translate-x-1/2 -translate-y-1/2 items-center justify-center overflow-hidden rounded-[64.7818px] bg-white shadow-lg ring-1 ring-black/[0.04]'>
                      <Image
                        src='/assets/home/here_circle_logo.png'
                        alt='Sharkdom'
                        width={88}
                        height={88}
                        unoptimized
                        priority
                        className='size-[72px] object-contain sm:size-20'
                      />
                    </div>
                    <OrbitFeatureCard
                      hubRef={orbitHubRef}
                      orbitLayoutEpoch={orbitLayoutEpoch}
                      title='Partner Onboarding'
                      subtitle='Certify & enable at scale'
                      icon={AlertTriangle}
                      iconClassName='bg-[#1779E1]'
                      layout={ORBIT_FEATURE_CARD_LAYOUTS.onboarding}
                    />
                    <OrbitFeatureCard
                      hubRef={orbitHubRef}
                      orbitLayoutEpoch={orbitLayoutEpoch}
                      title='Partner Management'
                      subtitle='Tiers, MDF & deal desk'
                      icon={Layers}
                      iconClassName='bg-[#CEB92D]'
                      iconTone='dark'
                      layout={ORBIT_FEATURE_CARD_LAYOUTS.management}
                    />
                    <OrbitFeatureCard
                      hubRef={orbitHubRef}
                      orbitLayoutEpoch={orbitLayoutEpoch}
                      title='Partner Attribution'
                      subtitle='Multi-touch, every deal'
                      icon={LineChart}
                      iconClassName='bg-[#04AB62]'
                      layout={ORBIT_FEATURE_CARD_LAYOUTS.attribution}
                    />
                    <OrbitFeatureCard
                      hubRef={orbitHubRef}
                      orbitLayoutEpoch={orbitLayoutEpoch}
                      title='Partner Activation'
                      subtitle='Go-live in under 7 days'
                      icon={Zap}
                      iconClassName='bg-[#EE343B]'
                      layout={ORBIT_FEATURE_CARD_LAYOUTS.activation}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* —— Row 2 left: stats (aligned with Live activity on lg) —— */}
          <div className='relative z-10 flex max-w-[777px] flex-col lg:self-start lg:pl-4 xl:pl-6'>
            <div className='grid grid-cols-2 gap-x-6 gap-y-6 border-t border-dashed border-[#D3D7E2] pt-5 md:grid-cols-4'>
              <div>
                <div
                  className={cn(
                    'flex items-baseline gap-0.5 text-[#2A3241]',
                    bebasNeue.className
                  )}
                >
                  <span className='text-[38px] leading-none tracking-[-1.14px]'>
                    3
                  </span>
                  <span className='text-[32px] leading-none tracking-[-1.14px]'>
                    ×
                  </span>
                </div>
                <p className='mt-2 text-xs leading-4 tracking-[-0.08px] text-[#757A87]'>
                  Faster partner activation
                </p>
              </div>
              <div>
                <div
                  className={cn(
                    'flex items-baseline gap-0.5 text-[#2A3241]',
                    bebasNeue.className
                  )}
                >
                  <span className='text-[38px] leading-none tracking-[-1.14px]'>
                    100
                  </span>
                  <span className='text-xl leading-none tracking-[-1.14px]'>
                    %
                  </span>
                </div>
                <p className='mt-2 text-xs leading-4 tracking-[-0.08px] text-[#757A87]'>
                  Multi-touch attribution
                </p>
              </div>
              <div>
                <div
                  className={cn(
                    'text-[38px] leading-none tracking-[-1.14px] text-[#2A3241]',
                    bebasNeue.className
                  )}
                >
                  24/7
                </div>
                <p className='mt-2 text-xs leading-4 tracking-[-0.08px] text-[#757A87]'>
                  Automated partner scouting
                </p>
              </div>
              <div>
                <div
                  className={cn(
                    'text-[38px] leading-none tracking-[-1.14px] text-[#2A3241]',
                    bebasNeue.className
                  )}
                >
                  0
                </div>
                <p className='mt-2 text-xs leading-4 tracking-[-0.08px] text-[#757A87]'>
                  Spreadsheets to maintain
                </p>
              </div>
            </div>
          </div>

          {/* —— Row 2 right: Live activity —— */}
          <div className='relative mx-auto flex w-full max-w-[640px] justify-center overflow-visible lg:mx-0 lg:max-w-none lg:justify-end lg:self-start'>
            <div className='relative w-full max-w-[min(680px,100%)] overflow-visible lg:mr-[-24px]'>
              <motion.div
                initial={false}
                animate={{ y: [-3, 3, -3] }}
                transition={{
                  duration: 6,
                  ease: 'easeInOut',
                  repeat: Infinity,
                  delay: 0.3
                }}
                className='relative z-[25] w-full rounded-[17.7284px] border-[1.10803px] border-[#E2E4EB] bg-white shadow-[0px_1.10803px_2.21606px_rgba(14,17,27,0.05),0px_13.2963px_35.4569px_-8.86422px_rgba(14,17,27,0.14)]'
              >
                <div className='flex items-center justify-between border-b border-transparent px-[21px] pb-1 pt-[16.62px]'>
                  <p className='font-mono text-[11.0803px] font-normal uppercase leading-[14px] tracking-[1.10803px] text-[#757A87]'>
                    Live activity · your workspace
                  </p>
                  <div className='flex items-center gap-2'>
                    <span
                      className='h-[6.65px] w-8 rounded-full bg-[#04AB62]/30'
                      aria-hidden
                    />
                    <span className='font-mono text-[11.0803px] uppercase leading-[14px] tracking-[1.10803px] text-[#04AB62]'>
                      Live
                    </span>
                  </div>
                </div>
                <div className='space-y-2 px-[21px] pb-4 pt-2'>
                  <div className='flex items-start gap-2'>
                    <div className='flex size-[22.16px] shrink-0 items-center justify-center rounded-[6.64817px] bg-[#D64651] text-[11.0803px] font-bold leading-[14px] text-white'>
                      A
                    </div>
                    <div className='min-w-0 flex-1'>
                      <p className='text-[14.4044px] font-bold leading-[19px] tracking-[-0.089px] text-[#0E111B]'>
                        Alicia R. closed $42K co-sell with Vertex
                      </p>
                    </div>
                    <span className='shrink-0 font-mono text-[12.1883px] leading-4 tracking-[-0.089px] text-[#757A87]'>
                      2m ago
                    </span>
                  </div>
                  <div className='flex items-start gap-2 opacity-45'>
                    <div className='flex size-[22.16px] shrink-0 items-center justify-center rounded-[6.64817px] bg-[#6054EC] text-[11.0803px] font-bold leading-[14px] text-white'>
                      ✦
                    </div>
                    <div className='min-w-0 flex-1'>
                      <p className='text-[14.4044px] font-bold leading-[19px] tracking-[-0.089px] text-[#0E111B]'>
                        Activation Agent sourced 3 qualified partners
                      </p>
                    </div>
                    <span className='shrink-0 font-mono text-[12.1883px] leading-4 tracking-[-0.089px] text-[#757A87]'>
                      6m ago
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Partner strip — same logo set + infinite scroll as MakeYourBusiness; matches section width */}
        <div className='relative mt-8 w-full lg:mt-10'>
          <div className='flex items-center gap-4'>
            <div className='h-px flex-1 bg-[#D3D7E2]' />
            <p className='shrink-0 font-mono text-xs uppercase tracking-[0.96px] text-[#757A87]'>
              Powering partnerships at
            </p>
            <div className='h-px flex-1 bg-[#D3D7E2]' />
          </div>
          <div className='mt-6 w-full overflow-hidden'>
            <div
              className='flex gap-6 sm:gap-10'
              style={{
                width: 'max-content',
                animation: 'heroPartnerSeamlessScroll 30s linear infinite'
              }}
            >
              {Array.from({ length: 8 }).map((_, setIndex) => (
                <React.Fragment key={setIndex}>
                  {TRUSTED_COMPANIES.map((company) => (
                    <div
                      key={`${setIndex}-${company.altText}`}
                      className='flex h-[72px] w-[132px] shrink-0 items-center justify-center rounded-xl px-3 sm:h-[80px] sm:w-[160px]'
                    >
                      <Image
                        src={company.thumbnailUrl}
                        alt={company.altText}
                        width={180}
                        height={80}
                        className='h-auto max-h-10 w-full object-contain sm:max-h-12'
                      />
                    </div>
                  ))}
                </React.Fragment>
              ))}
            </div>
          </div>
          <style jsx>{`
            @keyframes heroPartnerSeamlessScroll {
              from {
                transform: translateX(0);
              }
              to {
                transform: translateX(-12.5%);
              }
            }
          `}</style>
        </div>
      </div>
    </section>
  )
}

export default Hero
