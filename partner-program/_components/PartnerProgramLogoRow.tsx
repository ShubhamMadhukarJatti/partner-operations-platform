import MaxWidthWrapper from '@/components/ui/max-width-wrapper'

const logos = ['RELOKART', 'Freshworks', 'wpmu/dev', 'CHARGIFI'] as const

/** Figma 819:21605 — “Section - LOGOS” uses w-[1200px] (full divider + row width) */
const TRUSTED_STRIP_MAX = 'max-w-[min(1200px,100%)]'

export function PartnerProgramLogoRow() {
  return (
    <section className='bg-white py-10 sm:py-12'>
      <MaxWidthWrapper className='px-4 sm:px-6'>
        <div
          className={`mx-auto flex w-full flex-col items-center gap-5 ${TRUSTED_STRIP_MAX}`}
        >
          <div className='flex w-full items-center gap-3'>
            <div className='h-px flex-1 bg-[#d3d7e2]' />
            <p className='shrink-0 text-center text-[11px] font-normal uppercase tracking-[1.1px] text-[#757a87]'>
              Trusted by teams migrating from Crossbeam
            </p>
            <div className='h-px flex-1 bg-[#d3d7e2]' />
          </div>
          <ul className='flex w-full flex-wrap items-center justify-center gap-8 sm:gap-12 md:gap-16'>
            {logos.map((name) => (
              <li
                key={name}
                className='text-center text-lg font-semibold text-[#757a87] opacity-75 sm:text-xl'
              >
                {name}
              </li>
            ))}
          </ul>
        </div>
      </MaxWidthWrapper>
    </section>
  )
}
