import ZohoComparePageBackdrop from './_components/ZohoComparePageBackdrop'

export default function SharkdomVsZohoLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div className='relative isolate'>
      <ZohoComparePageBackdrop />
      <div className='relative z-[2]'>{children}</div>
    </div>
  )
}
