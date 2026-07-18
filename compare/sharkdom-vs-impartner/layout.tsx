import ImpartnerComparePageBackdrop from './_components/ImpartnerComparePageBackdrop'

export default function SharkdomVsImpartnerLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div className='relative isolate'>
      <ImpartnerComparePageBackdrop />
      <div className='relative z-[2]'>{children}</div>
    </div>
  )
}
