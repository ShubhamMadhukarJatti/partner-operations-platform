import Image from 'next/image'
import Avatar1 from '@/../public/assets/avatar1.png'
import Avatar2 from '@/../public/assets/Avatar2.png'
import Bubble1 from '@/../public/assets/bubble1.png'
import Bubble2 from '@/../public/assets/bubble2.png'
import Bubble3 from '@/../public/assets/bubble3.png'
import AIProposal from '@/../public/assets/oneclickproposal.png'
import SignMOU from '@/../public/assets/signmou.png'
import Strategic from '@/../public/assets/strategic.svg'
import VerifiedStartups from '@/../public/assets/verifiedstartups.png'
import { CircleCheck } from 'lucide-react'

import { WobbleCard } from '@/components/ui/wobble-card'

function MoreFeatures() {
  return (
    <div className='pb-32 pt-20 sm:px-52'>
      <h1 className='pb-12 text-center text-3xl font-medium text-[#0A1566]'>
        More features for your Startup
      </h1>
      <div className='grid-cols-3 grid-rows-3 gap-4 space-y-4 px-4 sm:grid sm:space-y-0 sm:px-0'>
        {/*Types of partnerships*/}

        <WobbleCard containerClassName='col-start-1 col-end-2 row-start-1 row-end-3 bg-[#E8C7F7] '>
          <h1 className='text-2xl font-medium'>7+ type of partnerships</h1>
          <p className='text-[#333333B2]'>
            Create partnership for all startup need
          </p>
          <ul className='space-y-3 pt-8'>
            <li>
              <Image
                className=''
                src={Strategic}
                width={320}
                height={20}
                alt='strategic partnership on sharkdom'
              />
            </li>
            <li className='flex gap-x-2 rounded-lg bg-white p-2'>
              <CircleCheck color='#039855' />
              Brand partnership
            </li>
            <li className='flex gap-x-2 rounded-lg bg-white p-2'>
              <CircleCheck color='#039855' />
              Sales partnership
            </li>
            <li className='flex gap-x-2 rounded-lg bg-white p-2'>
              <CircleCheck color='#039855' />
              Community partnership
            </li>
            <li className='flex gap-x-2 rounded-lg bg-white p-2'>
              <CircleCheck color='#039855' />
              Co-marketing partnership
            </li>
            <li className='flex gap-x-2 rounded-lg bg-white p-2'>
              <CircleCheck color='#039855' />
              Technology partnership
            </li>
          </ul>
        </WobbleCard>
        {/*verified startups*/}
        <WobbleCard
          className='flex justify-between'
          containerClassName='col-start-1 col-end-3 row-start-3 row-end-4 flex flex-col justify-between bg-[#90D7F6]'
        >
          <div className='flex flex-col sm:p-4'>
            <h1 className='text-2xl font-medium'>1000+ Verified startups</h1>
            <p className='text-[#333333B2]'>Real startups, real founders</p>
          </div>
          <div>
            <Image
              className=''
              src={VerifiedStartups}
              width={406}
              height={361}
              alt='verified startups on sharkdom'
            />
          </div>
        </WobbleCard>
        {/*one click proposal*/}
        <WobbleCard containerClassName='col-start-2 col-end-3 row-start-2 row-end-3 justify-center h-full bg-[#8BE8E2]'>
          <div className='flex flex-col'>
            <Image
              className='self-center'
              src={AIProposal}
              width={160}
              height={160}
              alt='one click AI proposals on sharkdom'
            />
          </div>
          <div className='sm:p-4'>
            <h1 className='text-2xl font-medium'>1-click proposals</h1>
            <p className='text-[#333333B2]'>Create proposals using AI</p>
          </div>
        </WobbleCard>

        {/*MOU hassle free*/}
        <WobbleCard
          className='flex '
          containerClassName='col-start-2 col-end-4 row-start-1 row-end-2   bg-[#F1D7A6]'
        >
          <div className='flex flex-col justify-end sm:p-4'>
            <h1 className='text-2xl font-medium'>Sign MOU hassle free</h1>
            <p className='text-[#333333B2]'>
              Get MOU signed with magic links, no signup required
            </p>
          </div>
          <div>
            <Image
              className='h-full'
              src={SignMOU}
              width={370}
              height={340}
              alt='Sign MOU hassle free on sharkdom'
            />
          </div>
        </WobbleCard>
        {/*negotiate faster*/}
        <WobbleCard containerClassName='col-start-3 col-end-4 row-start-2 row-end-4  bg-[#80FFAB] '>
          <h1 className='text-2xl font-medium'>Negotiate faster</h1>
          <p className='text-[#333333B2]'>
            Spam free inbox, Autoreply bot, clarify proposal terms, automatic
            meetings
          </p>
          <div className='flex pt-8'>
            <Image
              className='h-min'
              src={Avatar1}
              width={30}
              height={30}
              alt='user chat avatar'
            />
            <Image
              className=''
              src={Bubble1}
              width={105}
              height={86}
              alt='spam free inbox'
            />
          </div>
          <div className='flex justify-end pt-4'>
            <Image
              className=''
              src={Bubble2}
              width={105}
              height={86}
              alt='bot chat avatar'
            />
            <Image
              className='h-min rounded-2xl'
              src={Avatar2}
              width={20}
              height={20}
              alt='auto reply bot'
            />
          </div>
          <div className='flex pt-4'>
            <Image
              className='h-min rounded-2xl'
              src={Avatar1}
              width={30}
              height={30}
              alt='user chat avatar'
            />
            <Image
              className=''
              src={Bubble3}
              width={153}
              height={86}
              alt='clarify proposal terms in inbox'
            />
          </div>
        </WobbleCard>
      </div>
    </div>
  )
}

export default MoreFeatures
