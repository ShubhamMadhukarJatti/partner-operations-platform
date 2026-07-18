/**
 * Flat tint behind nav + hero on the PartnerInsight compare route (no grid image / gradient wash).
 * Fixed z-[1] sits below NewHeader (z-[999]) and below page content (z-[2]).
 */
export default function PartnerinsightComparePageBackdrop() {
  return (
    <div
      aria-hidden
      className='pointer-events-none fixed inset-0 z-[1] bg-[#fafbff]'
    />
  )
}
