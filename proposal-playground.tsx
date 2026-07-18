export const ProposalPlayground = () => {
  return (
    <section className='container flex flex-col items-center justify-center gap-8 py-14 lg:flex-row-reverse lg:justify-between'>
      <div className='flex w-full flex-col items-center justify-center gap-4 lg:items-start'>
        <h2 className='text-3xl font-semibold leading-normal text-primary lg:max-w-sm'>
          Proposal Playground
        </h2>
        <p className='max-w-lg leading-relaxed'>
          Generate partnership proposals with ease using AI.
        </p>
        <p className='max-w-lg leading-relaxed'>
          Our AI-powered proposal generator helps you create partnership
          proposals in minutes tailored to your startup&apos;s partnership
          needs.
        </p>
      </div>
      <div className='flex w-full items-center justify-center'>
        <video
          className='aspect-video w-full max-w-3xl rounded-lg border-[12px] border-muted object-contain'
          loop
          autoPlay
          muted
        >
          <source src='/videos/proposal-playground.mp4' type='video/mp4' />
          Your browser does not support the video tag.
        </video>
      </div>
    </section>
  )
}
