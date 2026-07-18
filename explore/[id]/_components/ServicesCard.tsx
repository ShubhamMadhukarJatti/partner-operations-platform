import React from 'react'

interface Service {
  service: string
}

interface ServicesCardProps {
  services: Service[]
}

const ServicesCard: React.FC<ServicesCardProps> = ({ services }) => {
  return (
    <div className='rounded-xl border bg-white'>
      <div className='flex flex-col'>
        <h2 className='w-full border-b px-4 py-3 text-shark-base font-bold text-text-100'>
          Services
        </h2>
        <div className='flex flex-col gap-4 p-4'>
          {services?.map(({ service }, index) => (
            <p key={index} className='text-sm font-normal text-[#5E7193]'>
              {service}
            </p>
          ))}
        </div>
      </div>
    </div>
  )
}

export default React.memo(ServicesCard)
