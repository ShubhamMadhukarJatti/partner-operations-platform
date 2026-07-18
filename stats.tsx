export const Stats = () => {
  return (
    <section className='flex flex-col items-center justify-center rounded-2xl bg-primary p-6 text-primary-foreground lg:p-10'>
      <h2 className='text-center text-2xl font-semibold tracking-tight sm:text-3xl'>
        Building Stronger startup partnerships across India.
      </h2>
      <span className='mt-2 text-balance text-center'>
        a few of our stats from the past year that we&apos;re proud of.
      </span>
      <div className='mt-4 grid w-full grid-cols-2 place-items-center gap-4 md:grid-cols-4'>
        <div className='flex flex-col items-center justify-center gap-1 text-center'>
          <h3 className='text-2xl font-semibold'>450+</h3>
          <span>Partnerships</span>
        </div>
        <div className='flex flex-col items-center justify-center gap-1 text-center'>
          <h3 className='text-2xl font-semibold'>5000+</h3>
          <span>Startups</span>
        </div>
        <div className='flex flex-col items-center justify-center gap-1 text-center'>
          <h3 className='text-2xl font-semibold'>125+</h3>
          <span>Investors</span>
        </div>
        <div className='flex flex-col items-center justify-center gap-1 text-center'>
          <h3 className='text-2xl font-semibold'>20+</h3>
          <span>Company growth</span>
        </div>
      </div>
    </section>
  )
}
