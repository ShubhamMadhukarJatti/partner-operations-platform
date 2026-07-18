import PartnerinsightComparePageBackdrop from './_components/PartnerinsightComparePageBackdrop'

export default function SharkdomVsPartnerinsightLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div className='relative isolate'>
      <PartnerinsightComparePageBackdrop />
      <div className='relative z-[2]'>{children}</div>
    </div>
  )
}
