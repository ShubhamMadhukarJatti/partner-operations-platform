// components/RevenueOpportunity.js

const RevenueOpportunity = () => {
  return (
    <section className='bg-white py-16'>
      <div className='mx-auto max-w-6xl px-4 sm:px-6 lg:px-8'>
        <div className='grid grid-cols-1 items-center gap-12 md:grid-cols-2'>
          {/* Left Column - Text */}
          <div>
            <h4 className='mb-4 text-sm uppercase tracking-wide text-gray-500'>
              Why Join?
            </h4>
            <h2 className='mb-4 text-3xl font-bold text-gray-900'>
              Your revenue opportunity awaits
            </h2>
            <p className='text-gray-700'>
              Join the ranks of 17,000+ active partners connecting with top
              software and tech brands to grow your product’s credibility.
            </p>
          </div>

          {/* Right Column - Metrics */}
          <div>
            <div className='grid  gap-y-6'>
              <div className='flex w-full items-center gap-12'>
                <p className='text-4xl font-bold text-blue-600'>875+</p>
                <p className='text-gray-600'>
                  top brands partnered inside platform
                </p>
              </div>

              <div className='flex w-full items-center gap-12'>
                <p className='text-4xl font-bold text-blue-600'>12K+</p>
                <p className='text-gray-600'>
                  in average partnership journeys driven by partners/month
                </p>
              </div>

              <div className='flex w-full items-center gap-12'>
                <p className='text-4xl font-bold text-blue-600'>$7K+</p>
                <p className='text-gray-600'>average revenue increase</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default RevenueOpportunity
