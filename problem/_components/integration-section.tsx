import Image from 'next/image'

const IntegrationSection = () => {
  return (
    <section className='bg-white py-16'>
      <div className='mx-auto max-w-6xl px-4 sm:px-6 lg:px-8'>
        <div className='flex flex-col items-center justify-between gap-16 md:flex-row'>
          {/* Text Section */}
          <div className='mb-8 md:mb-0 md:w-3/5'>
            <h3 className='mb-4 text-sm uppercase tracking-wide text-gray-600'>
              Flexible Integrations
            </h3>
            <h2 className='mb-4 text-3xl font-bold text-gray-900'>
              Connects to every other kind of stack
            </h2>
            <p className='mb-4 text-gray-700'>
              Sharkdom connects with the most common marketing, sales, and
              business intelligence software.
            </p>
            <p className='text-gray-700'>
              Want to build a custom connection of your own? You can with the
              Sharkdom API, currently in Beta version.
            </p>
          </div>

          {/* Logos Section */}
          <div className='grid grid-cols-2 items-center gap-8 md:w-2/5'>
            <Image
              src='/hubspot.svg' // Replace with your image
              alt='HubSpot'
              width={158}
              height={46}
            />
            <Image
              src='/slack.svg' // Replace with your image
              alt='Slack'
              width={160}
              height={40}
            />
            <Image
              src='/salesforce.jpeg'
              alt='Salesforce'
              width={132}
              height={93}
            />
            <Image
              src='/sheets.svg' // Replace with your image
              alt='Google Sheets'
              width={215}
              height={60}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default IntegrationSection
