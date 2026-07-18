/**
 * Frame decor: rays begin *after* the corner squares along each stroke —
 * horizontal: white through box → short warm toward center; vertical: white through box → purple down.
 */

const L_RAIL_CX = 'calc(96 / 1408 * 100% + 0.5px)'
const R_RAIL_CX = 'calc(100% - (88 / 1408 * 100%) - 0.5px)'

/** Warm inward of squares; ray run +150% vs prior (48px → 120px → ends +132px from rail) */
const H_LINE =
  'linear-gradient(90deg, #fff 0%, #fff calc(96 / 1408 * 100% + 9px), rgba(255,230,220,1) calc(96 / 1408 * 100% + 12px), rgba(254,200,185,0.48) calc(96 / 1408 * 100% + 64.5px), #fff calc(96 / 1408 * 100% + 132px), #fff calc(100% - 88 / 1408 * 100% - 132px), rgba(254,200,185,0.48) calc(100% - 88 / 1408 * 100% - 64.5px), rgba(255,230,220,1) calc(100% - 88 / 1408 * 100% - 12px), #fff calc(100% - 88 / 1408 * 100% - 9px), #fff 100%)'

/** Purple below square; same +150% ray length (48px → 120px along stroke) */
const V_LINE =
  'linear-gradient(180deg, #fff 0%, #fff calc(4rem + 10px), rgba(245,240,255,1) calc(4rem + 12px), rgba(233,213,255,0.9) calc(4rem + 34.5px), rgba(196,181,253,0.4) calc(4rem + 72px), #fff calc(4rem + 132px), #fff 100%)'

const JUNCTION_SOFT =
  'radial-gradient(ellipse 90% 90% at center, rgba(255,255,255,0.95) 0%, rgba(255,245,250,0.35) 40%, transparent 68%)'

export default function CompareSectionFrameDecor() {
  return (
    <div
      aria-hidden
      className='pointer-events-none absolute inset-0 hidden lg:block'
    >
      {/* Corner glow + squares first so rays (stroke gradients) read as starting after the box */}
      <div
        className='absolute top-16 z-[1] size-[3.25rem] -translate-x-1/2 -translate-y-1/2 blur-md'
        style={{ left: L_RAIL_CX, background: JUNCTION_SOFT, opacity: 0.75 }}
      />
      <div
        className='absolute top-16 z-[1] size-[3.25rem] -translate-x-1/2 -translate-y-1/2 blur-md'
        style={{ left: R_RAIL_CX, background: JUNCTION_SOFT, opacity: 0.75 }}
      />

      <div
        className='absolute top-16 z-[2] size-4 -translate-x-1/2 -translate-y-1/2 rounded-[3px] bg-white shadow-[0_0_12px_rgba(255,255,255,0.95),0_0_18px_rgba(251,113,133,0.2),0_0_22px_rgba(139,92,246,0.22)]'
        style={{ left: L_RAIL_CX }}
      />
      <div
        className='absolute top-16 z-[2] size-4 -translate-x-1/2 -translate-y-1/2 rounded-[3px] bg-white shadow-[0_0_12px_rgba(255,255,255,0.95),0_0_18px_rgba(251,113,133,0.2),0_0_22px_rgba(139,92,246,0.22)]'
        style={{ left: R_RAIL_CX }}
      />

      {/* Strokes: z-0 so squares sit visually in front; gradients pick up after box edges */}
      <div
        className='absolute bottom-0 top-0 z-0 w-[2px] -translate-x-1/2'
        style={{
          left: L_RAIL_CX,
          background: V_LINE,
          boxShadow:
            'inset 0 0 2px rgba(167,139,250,0.28), inset 0 0 4px rgba(139,92,246,0.06), 0 0 6px rgba(255,255,255,0.7)'
        }}
      />
      <div
        className='absolute bottom-0 top-0 z-0 w-[2px] -translate-x-1/2'
        style={{
          left: R_RAIL_CX,
          background: V_LINE,
          boxShadow:
            'inset 0 0 2px rgba(167,139,250,0.28), inset 0 0 4px rgba(139,92,246,0.06), 0 0 6px rgba(255,255,255,0.7)'
        }}
      />

      <div
        className='absolute left-0 right-0 top-16 z-0 h-[2px] -translate-y-1/2'
        style={{
          background: H_LINE,
          boxShadow:
            'inset 0 1px 1px rgba(251,113,133,0.12), inset 0 -1px 1px rgba(251,113,133,0.08), 0 0 10px rgba(255,255,255,0.85), 0 0 3px rgba(255,255,255,0.55)'
        }}
      />
    </div>
  )
}
