export const ParntershipNavigator = () => {
  return (
    <section className='container flex flex-col items-center justify-center gap-8 py-14 lg:flex-row lg:justify-between'>
      <div className='flex w-full flex-col items-center justify-center gap-4 lg:items-start'>
        <h2 className='text-3xl font-semibold leading-normal lg:max-w-sm'>
          <span className='text-[#2861e8]'>Partnership Navigator</span> for your
          Startup
        </h2>
        <p className='max-w-lg leading-relaxed'>
          A Dedicated Mediators & Facilitator for your Startup making sure both
          parties abide by the agreement.
        </p>
        <p className='max-w-lg leading-relaxed'>
          Funding was never and would never be something that a startup would
          depend on especially those yet to achieve scaling phase. partnering
          with relevant startups is a solution and We are your dedicated
          mediators and facilitators for your agreement
        </p>
      </div>
      <div className='flex w-full items-center justify-center'>
        <video
          className='aspect-video w-full max-w-3xl rounded-lg border-[12px] border-muted object-cover'
          loop
          autoPlay
          muted
        >
          {/* <source src='/videos/collabridge.mp4' type='video/mp4' /> */}
          Your browser does not support the video tag.
        </video>
      </div>
    </section>
  )
}
