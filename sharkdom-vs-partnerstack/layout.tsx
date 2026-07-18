import PartnerstackComparePageBackdrop from './_components/PartnerstackComparePageBackdrop'

export default function SharkdomVsPartnerstackLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div className='relative isolate'>
      <PartnerstackComparePageBackdrop />
      <div className='relative z-[2]'>{children}</div>
    </div>
  )
}
