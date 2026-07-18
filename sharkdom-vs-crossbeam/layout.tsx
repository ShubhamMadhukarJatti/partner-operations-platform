import CrossbeamComparePageBackdrop from './_components/CrossbeamComparePageBackdrop'

export default function SharkdomVsCrossbeamLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div className='relative isolate'>
      <CrossbeamComparePageBackdrop />
      <div className='relative z-[2]'>{children}</div>
    </div>
  )
}
