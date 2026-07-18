import React from 'react'

const WhySharkdom: React.FC = () => {
  return (
    <section className='bg-[#F5F5F7] py-16'>
      <div className='mx-auto mb-12 text-center lg:max-w-3xl'>
        <h2 className='text-sm font-semibold tracking-wide text-gray-500'>
          WHY SHARKDOM
        </h2>
        <h1 className='mb-4 mt-2 text-4xl font-bold'>
          What makes Sharkdom the best place to find quality Partnerships?
        </h1>
        <p className='mx-auto max-w-2xl text-gray-600'>
          &quot;Sharkdom&quot; helps you onboard new partners based on your
          needs, manage your current and new partner pipeline, crafted specially
          for the founding team without any prior knowledge or expertise on
          partnership process.
        </p>
      </div>

      <div className='mx-auto grid grid-cols-1 gap-6 px-6 md:grid-cols-2 lg:max-w-5xl'>
        {/* Enterprise Compliance */}
        <div className='rounded-3xl bg-white p-6'>
          <h3 className='mb-2 text-lg font-semibold'>Enterprise Compliance</h3>
          <p className='mb-4 text-gray-600'>
            Sharkdom&apos;s platform is HIPAA, GDPR, and SOC-2 compliant with
            end-to-end encryption, robust infrastructure that safeguards your
            communications and ensures data privacy.
          </p>
          {/* <div className="flex space-x-4">
            <img src="/path-to-icon1.png" alt="Compliance Icon" className="w-12 h-12"/>
            <img src="/path-to-icon2.png" alt="Compliance Icon" className="w-12 h-12"/>
            <img src="/path-to-icon3.png" alt="Compliance Icon" className="w-12 h-12"/>
          </div> */}
        </div>

        {/* No Deal Handling Experience Required */}
        <div className='rounded-3xl bg-white p-6'>
          <h3 className='mb-2 text-lg font-semibold'>
            No deal handling Experience required
          </h3>
          <p className='mb-4 text-gray-600'>
            Experience unparalleled reliability without any prior expertise on
            handling the partnerships with our AI powered automated solutions.
          </p>
          {/* <img src="/path-to-icon4.png" alt="Partner Channel Icon" className="w-full h-auto"/> */}
        </div>

        {/* Filters to get you Started */}
        <div className='rounded-3xl bg-white p-6'>
          <h3 className='mb-2 text-lg font-semibold'>
            Filters to get you Started
          </h3>
          <p className='mb-4 text-gray-600'>
            Experience dozens of filters to help you find Right Partners at the
            right time depending on your business requirements.
          </p>
          {/* <img src="/path-to-icon5.png" alt="Filters Icon" className="w-full h-auto"/> */}
        </div>

        {/* Timeline to Track */}
        <div className='rounded-3xl bg-white p-6'>
          <h3 className='mb-2 text-lg font-semibold'>Timeline to track</h3>
          <p className='mb-4 text-gray-600'>
            Access detailed analytics to each step in each of your partnerships
            inside our dashboard so if you ever switch your partnership
            in-charge, the new person can fill the shoes with ease.
          </p>
          {/* <img src="/path-to-icon6.png" alt="Timeline Icon" className="w-full h-auto"/> */}
        </div>

        {/* Rate your Partners */}
        <div className='rounded-3xl bg-white p-6'>
          <h3 className='mb-2 text-lg font-semibold'>Rate your Partners</h3>
          <p className='mb-4 text-gray-600'>
            Add your contribution to Sharkdom&apos;s Network by rating your
            partner based on the delivery of service promised during the
            beginning of your partnerships.
          </p>
          {/* <img src="/path-to-icon7.png" alt="Rate Icon" className="w-full h-auto"/> */}
        </div>

        {/* All at One Place */}
        <div className='rounded-3xl bg-white p-6'>
          <h3 className='mb-2 text-lg font-semibold'>All at one place</h3>
          <p className='mb-4 text-gray-600'>
            With Sharkdom, whether to find a new partner or manage pipeline of
            existing partners, you need not move into any other platform as
            everything is handled inside Sharkdom.
          </p>
          {/* <img src="/path-to-icon8.png" alt="All at One Place Icon" className="w-full h-auto"/> */}
        </div>
      </div>
    </section>
  )
}

export default WhySharkdom
