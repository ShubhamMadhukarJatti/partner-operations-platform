export const Hero = () => {
  return (
    <section className='mt-20 flex  flex-col items-center justify-center'>
      <div className='flex flex-col items-center justify-center gap-3'>
        <h1 className='relative z-10  mx-auto h-40 max-w-6xl  bg-gradient-to-r from-[#1D4ED8] to-[#55CBFB] bg-clip-text py-6 text-center text-3xl font-bold tracking-tight text-transparent sm:text-4xl lg:text-6xl'>
          <span className='text-black'>People behind dream of </span> Digitizing
          Partnerships
        </h1>
        <p className='relative z-10 mx-auto my-4 mt-2 max-w-3xl px-3 text-center text-base font-normal text-black/60 sm:text-lg md:mt-6 md:text-lg'>
          It started in final year of two college graduates working on their
          gaming startup when they realized that tyiing with indie-studios help
          them achieve bigger goals but this was extremely time consuming and
          delayed process, then saw this as an opportunity to effect the ‘Indian
          Startup Ecosytem’ in positive way by making partnerships less awkward
          and more faster and equally benefitted to some extent and making
          startups dependent on the ecosystem to some extent.
        </p>
        {/* <div className='flex gap-4'>
          <Button asChild variant={'secondary'}>
            <a href='https://play.google.com/store/apps/details?id=com.kalasa.porger&pcampaignid=web_share'>
              Download App
            </a>
          </Button>
          <Button asChild>
            <a href='https://calendly.com/sharkdom/customer-support'>
              Request A Demo
            </a>
          </Button>
        </div> */}
      </div>

      {/* <video className='w-full max-w-screen-xl' loop autoPlay muted>
        <source src='/videos/demo.mp4' type='video/mp4' />
        Your browser does not support the video tag.
      </video> */}
    </section>
  )
}
