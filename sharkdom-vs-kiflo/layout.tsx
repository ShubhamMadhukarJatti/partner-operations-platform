import KifloComparePageBackdrop from './_components/KifloComparePageBackdrop'

export default function SharkdomVsKifloLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div className='relative isolate'>
      <KifloComparePageBackdrop />
      <div className='relative z-[2]'>{children}</div>
    </div>
  )
}
