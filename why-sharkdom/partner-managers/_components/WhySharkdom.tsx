import React from 'react'
import Image from 'next/image'

const WhySharkdom: React.FC = () => {
  return (
    <section className='bg-[#F5F5F7] py-8 pb-16'>
      <div className='mx-auto mb-12 text-center lg:max-w-3xl'>
        <h2 className='text-sm font-semibold tracking-[2.5px] text-[#474747]'>
          WHY SHARKDOM
        </h2>
        <h1 className='mb-4 mt-2 text-4xl/[48px] font-bold'>
          What makes Sharkdom the best place to find quality Partnerships?
        </h1>
        <p className='mx-auto max-w-2xl font-normal text-[#47474799]'>
          &quot;Sharkdom&quot; helps you onboard new partners based on your
          needs, manage your current and new partner pipeline, crafted specially
          for the founding team without any prior knowledge or expertise on
          partnership process.
        </p>
      </div>

      <div className='mx-auto grid grid-cols-1 gap-6 px-6 md:grid-cols-2 lg:max-w-5xl'>
        {/* Enterprise Compliance */}
        <div className='rounded-3xl bg-white p-6 pb-0'>
          <h3 className='mb-2 text-xl font-bold'>Enterprise Compliance</h3>
          <p className='mb-4 max-w-full text-sm font-normal text-[#999999] md:max-w-[85%]'>
            Sharkdom&apos;s platform is HIPAA, GDPR, and SOC-2 compliant with
            end-to-end encryption, robust infrastructure that safeguards your
            communications and ensures data privacy.
          </p>

          <img
            src='/icons/compliance-svg.svg'
            alt='Compliance Icon'
            className='mx-auto w-[85%]'
          />
          {/* <div className="flex space-x-4">
            <img src="/path-to-icon2.png" alt="Compliance Icon" className="w-12 h-12"/>
            <img src="/path-to-icon3.png" alt="Compliance Icon" className="w-12 h-12"/>
          </div> */}
        </div>

        {/* No Deal Handling Experience Required */}
        <div className='relative overflow-hidden rounded-3xl bg-white p-6 pb-0'>
          <h3 className='mb-2 text-xl font-bold'>
            No deal handling Experience required
          </h3>
          <p className='mb-4 max-w-full text-sm font-normal text-[#999999] md:max-w-[85%]'>
            Experience unparalleled reliability without any prior expertise on
            handling the partnerships with our AI powered automated solutions.
          </p>

          {/* <div className='mx-auto w-[288px] border border-[#2748B7] rounded-[20px] h-[108px] py-2'>
            <div className='w-[213px] mx-auto relative'>
            <Image src={'/icons/three-dots-svg.svg'} className='float-right absolute t-0' alt="" width={29} height={7} />
              <div className='bg-[#0062F11A] mx-auto w-[213px] h-[34px] mt-8'></div>
              </div>
          </div> */}
          {/* <img src="/filters-svg.svg" alt="Partner Channel Icon" className="w-full h-auto"/> */}
        </div>

        {/* Filters to get you Started */}
        <div className='rounded-3xl bg-white p-6 pb-0'>
          <h3 className='mb-2 text-xl font-bold'>Filters to get you Started</h3>
          <p className='mb-4 max-w-full text-sm font-normal text-[#999999] md:max-w-[85%]'>
            Experience dozens of filters to help you find Right Partners at the
            right time depending on your business requirements.
          </p>
          <img
            src='/icons/filters-svg.svg'
            alt='Filters Icon'
            className='mx-auto w-[80%]'
          />
        </div>

        {/* Timeline to Track */}
        <div className='rounded-3xl bg-white p-6 pb-1'>
          <h3 className='mb-2 text-xl font-bold'>Timeline to track</h3>
          <p className='mb-4 max-w-full text-sm font-normal text-[#999999] md:max-w-[85%]'>
            Access detailed analytics to each step in each of your partnerships
            inside our dashboard so if you ever switch your partnership
            in-charge, the new person can fill the shoes with ease.
          </p>
          <img
            src='/icons/timeline-svg.svg'
            alt='Filters Icon'
            className='mx-auto w-[70%]'
          />
        </div>

        {/* Rate your Partners */}
        <div className='rounded-3xl bg-white p-6 pb-0'>
          <h3 className='mb-2 text-xl font-bold'>Rate your Partners</h3>
          <p className='mb-4 max-w-full text-sm font-normal text-[#999999] md:max-w-[85%]'>
            Add your contribution to Sharkdom&apos;s Network by rating your
            partner based on the delivery of service promised during the
            beginning of your partnerships.
          </p>
          <img
            src='/icons/rate-svg.svg'
            alt='Filters Icon'
            className='mx-auto h-[150px] w-[70%] -translate-y-6'
          />
        </div>

        {/* All at One Place */}
        <div className='rounded-3xl bg-white p-6 pb-0'>
          <h3 className='mb-2 text-xl  font-bold text-[#231E16]'>
            All at one place
          </h3>
          <p className='mb-4 max-w-full text-sm font-normal text-[#999999] md:max-w-[85%]'>
            With Sharkdom, whether to find a new partner or manage pipeline of
            existing partners, you need not move into any other platform as
            everything is handled inside Sharkdom.
          </p>
          <img
            src='/icons/all-at-one-svg.svg'
            alt='Filters Icon'
            className='mx-auto h-[131px] w-[60%] -translate-y-6'
          />
        </div>
      </div>
    </section>
  )
}

export default WhySharkdom
