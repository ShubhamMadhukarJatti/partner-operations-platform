export default function ImpartnerTrustStrip() {
  const logos = ['RELOKART', 'Freshworks', 'wpmu/dev', 'CHARGIFI']
  return (
    <section className='mt-2 bg-white pb-12 pt-6 md:pb-16 md:pt-8'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='flex flex-col items-center gap-6 md:flex-row md:justify-center'>
          <div className='hidden h-px flex-1 bg-[#d3d7e2] md:block md:max-w-[160px]' />
          <p className='text-center font-mono text-[11px] uppercase tracking-[1.1px] text-[#757a87]'>
            Trusted by teams migrating from Impartner
          </p>
          <div className='hidden h-px flex-1 bg-[#d3d7e2] md:block md:max-w-[160px]' />
        </div>

        <div className='mt-10 flex flex-wrap items-center justify-center gap-x-12 gap-y-8 md:gap-x-16'>
          {logos.map((name) => (
            <span
              key={name}
              className='text-lg font-semibold tracking-tight text-[#757a87] opacity-75 md:text-xl'
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
