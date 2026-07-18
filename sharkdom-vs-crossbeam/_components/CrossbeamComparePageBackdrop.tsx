/**
 * Flat tint behind nav + hero on the Crossbeam compare route (no grid image / gradient wash).
 */
export default function CrossbeamComparePageBackdrop() {
  return (
    <div
      aria-hidden
      className='pointer-events-none fixed inset-0 z-[1] bg-[#fafbff]'
    />
  )
}
