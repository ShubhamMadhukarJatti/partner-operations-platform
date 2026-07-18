import React from 'react'
import Image from 'next/image'
import EcosystemImg from '@/../public/assets/ecosystem.png'

function Ecosystem() {
  return (
    <div className='my-28 flex flex-col justify-center space-y-4'>
      <h1 className='text-center font-extrabold text-[#0A1566] sm:text-xl md:text-2xl'>
        Take advantage of the startup ecosystem on Sharkdom
      </h1>
      <p className='text-center text-[#0A1566]'>
        Ecosystem partners? Strategic partners? Brand licensing partners?
        Sharkdom covers them all.{' '}
      </p>
      <Image
        className='self-center'
        src={EcosystemImg}
        width={783}
        height={655}
        alt='network of partners showing ecosystem on sharkdom'
      />
    </div>
  )
}

export default Ecosystem
