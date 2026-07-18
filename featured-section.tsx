'use client'

import Image from 'next/image'
import FeaturedBG from '@/../public/assets/featuredbg.png'

const FeaturedSection = () => {
  return (
    <>
      <section className='bg-custom-gradient relative flex w-full flex-col items-center justify-center  gap-8 py-20'>
        <Image
          className='absolute bottom-0'
          src={FeaturedBG}
          width={1540}
          height={324}
          alt={''}
        />
        <h2 className='mb-5 flex justify-center text-center text-3xl font-semibold leading-normal sm:text-left'>
          Automating your partnership experience
        </h2>
        <p className='text-center'>
          Smart partnerships, 10+ filters, spam proof communications helps you
          find & make partnerships hassle free.
        </p>

        {/* <StickyScroll content={content} /> */}

        <div className='relative z-10 mt-11 flex w-full flex-col items-center rounded-3xl px-8 text-center sm:flex-row sm:px-52 sm:py-16 sm:text-left'>
          <div className='flex flex-col items-center justify-between gap-4 align-middle lg:items-start'>
            <p className='max-w-lg text-3xl font-semibold leading-relaxed'>
              Introducing smart partnerships
            </p>
            <p className='mb-6 max-w-lg text-lg leading-loose text-[#333333]'>
              Establish Smart Partnerships via our AI proposal generator with
              51:49 ratio distribution so you and your upcoming partnered
              startup can experience mutual benefit
            </p>

            {/*<div>
              <ul className='flex flex-col gap-4 text-muted-foreground'>
                <li className='flex items-center gap-4'>
                  <span className='rounded-full bg-primary p-1'>
                    <Check className='h-4 w-4  text-white' />
                  </span>
                  <p>One-click AI proposal generation</p>
                </li>
                <li className='flex items-center gap-4'>
                  <span className='rounded-full bg-primary p-1'>
                    <Check className='h-4 w-4  text-white' />
                  </span>
                  <p>48-hour average response time</p>
                </li>
                <li className='flex items-center gap-4'>
                  <span className='rounded-full bg-primary p-1'>
                    <Check className='h-4 w-4  text-white' />
                  </span>
                  <p>Automatic MOU creation</p>
                </li>
              </ul>
  </div>*/}
          </div>
          <div className='relative z-10 flex items-center justify-center sm:w-[627px]'>
            <video
              className='aspect-video w-full max-w-3xl rounded-lg object-cover shadow-lg'
              loop
              autoPlay
              muted
            >
              <source
                src='https://s3.ap-south-1.amazonaws.com/sharkdom.co.in/editable/sharkdom_promo_genz.mp4'
                type='video/mp4'
              />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>

        {/*<div className='sticky top-60 mt-32 flex w-full items-start rounded-3xl bg-white px-52 py-16 '>
          <div className='flex w-full flex-col items-center justify-center gap-4 lg:items-start'>
            <p className='max-w-lg text-3xl leading-relaxed'>
              Ideal matchmaking & more
            </p>
            <p className='mb-6 mt-3 max-w-lg leading-relaxed  text-muted-foreground'>
              Find Right Ideal Partners for your Startup using 10’s of filters
              to choose from
            </p>

            <div>
              <ul className='flex flex-col gap-4 text-muted-foreground'>
                <li className='flex items-center gap-4'>
                  <span className='rounded-full bg-primary p-1'>
                    <Check className='h-4 w-4  text-white' />
                  </span>
                  <p>Automated Partnership Meetings</p>
                </li>
                <li className='flex items-center gap-4'>
                  <span className='rounded-full bg-primary p-1'>
                    <Check className='h-4 w-4  text-white' />
                  </span>
                  <p>Cover all type of partnerships</p>
                </li>
                <li className='flex items-center gap-4'>
                  <span className='rounded-full bg-primary p-1'>
                    <Check className='h-4 w-4  text-white' />
                  </span>
                  <p>Community, Strategic, Brand licensing partnerships etc</p>
                </li>

                <li className='flex items-center gap-4'>
                  <span className='rounded-full bg-primary p-1'>
                    <Check className='h-4 w-4  text-white' />
                  </span>
                  <p>Verified startups and companies</p>
                </li>
              </ul>
            </div>
          </div>
          <div className='flex w-full items-center justify-center'>
            <video
              className='aspect-video w-full max-w-3xl rounded-lg border-[12px] border-muted object-cover'
              loop
              autoPlay
              muted
            >
              <source
                src='https://s3.ap-south-1.amazonaws.com/sharkdom.co.in/email_template/sharkdomfeature2.mp4'
                type='video/mp4'
              />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>

        <div className='sticky top-60 mt-32 flex w-full items-start rounded-3xl bg-white px-52 py-16 shadow-[rgba(0,0,0,0.1)_0px_-5px_5px_0px]'>
          <div className='flex w-full flex-col items-center justify-center gap-4 lg:items-start'>
            <p className='max-w-lg text-3xl leading-relaxed'>
              Clear proposal doubts with real time messaging
            </p>
            <p className='mb-6 mt-3 max-w-lg leading-relaxed  text-muted-foreground'>
              pace the process 3X by real-time messaging for clearing out
              dilemmas related to Offerings & Expectations of proposal received
            </p>

            <div>
              <ul className='flex flex-col gap-4 text-muted-foreground'>
                <li className='flex items-center gap-4'>
                  <span className='rounded-full bg-primary p-1'>
                    <Check className='h-4 w-4  text-white' />
                  </span>
                  <p>Avoid Proposal Spaming</p>
                </li>
                <li className='flex items-center gap-4'>
                  <span className='rounded-full bg-primary p-1'>
                    <Check className='h-4 w-4  text-white' />
                  </span>
                  <p>Autoreply bot to proposals</p>
                </li>
                <li className='flex items-center gap-4'>
                  <span className='rounded-full bg-primary p-1'>
                    <Check className='h-4 w-4  text-white' />
                  </span>
                  <p>Instant Meeting Requests</p>
                </li>

                <li className='flex items-center gap-4'>
                  <span className='rounded-full bg-primary p-1'>
                    <Check className='h-4 w-4  text-white' />
                  </span>
                  <p>Setting Restrictions</p>
                </li>
                <li className='flex items-center gap-4'>
                  <span className='rounded-full bg-primary p-1'>
                    <Check className='h-4 w-4  text-white' />
                  </span>
                  <p>Automated Partnership Meetings</p>
                </li>
              </ul>
            </div>
          </div>
          <div className='flex w-full items-center justify-center'>
            <video
              className='aspect-video  w-full max-w-3xl rounded-lg border-[12px] border-muted object-cover'
              loop
              autoPlay
              muted
            >
              <source
                src='https://s3.ap-south-1.amazonaws.com/sharkdom.co.in/email_template/sharkdomfeature3.mp4'
                type='video/mp4'
              />
              Your browser does not support the video tag.
            </video>
          </div>
  </div>*/}
      </section>

      {/*for mobile view*/}
      {/*
      <section className='container flex flex-col items-center justify-center gap-8 py-20 sm:hidden  lg:justify-between'>
        <h2 className='text-3xl font-semibold leading-normal '>
          Automating your partnership experience
        </h2>
      */}
      {/* <StickyScroll content={content} /> */}

      {/*<div className='mt-12 flex flex-col items-start'>
          <div className='flex w-full items-center justify-center'>
            <video
              className='aspect-video w-full max-w-3xl rounded-lg border-[12px] border-muted object-cover'
              loop
              autoPlay
              muted
            >
              <source
                src='https://s3.ap-south-1.amazonaws.com/sharkdom.co.in/email_template/sharkdomfeature1.mp4'
                type='video/mp4'
              />
              Your browser does not support the video tag.
            </video>
          </div>
          <div className='mt-8 flex w-full flex-col items-center justify-center gap-4 lg:items-start'>
            <p className='max-w-lg text-3xl leading-relaxed'>
              Introducing smart partnerships
            </p>
            <p className='mb-6 mt-3 max-w-lg leading-relaxed  text-muted-foreground'>
              Establish Smart Partnerships via our AI proposal generator with
              51:49 ratio distribution so you and your upcoming partnered
              startup can experience mutual benefit
            </p>

            <div className='flex w-full'>
              <ul className='flex flex-col gap-4 text-muted-foreground'>
                <li className='flex items-center gap-4'>
                  <span className='rounded-full bg-primary p-1'>
                    <Check className='h-4 w-4  text-white' />
                  </span>
                  <p>One-click AI proposal generation</p>
                </li>
                <li className='flex items-center gap-4'>
                  <span className='rounded-full bg-primary p-1'>
                    <Check className='h-4 w-4  text-white' />
                  </span>
                  <p>48-hour average response time</p>
                </li>
                <li className='flex items-center gap-4'>
                  <span className='rounded-full bg-primary p-1'>
                    <Check className='h-4 w-4  text-white' />
                  </span>
                  <p>Automatic MOU creation</p>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className='mt-32 flex flex-col items-start'>
          <div className='flex w-full items-center justify-center'>
            <video
              className='aspect-video w-full max-w-3xl rounded-lg border-[12px] border-muted object-cover'
              loop
              autoPlay
              muted
            >
              <source
                src='https://s3.ap-south-1.amazonaws.com/sharkdom.co.in/email_template/sharkdomfeature2.mp4'
                type='video/mp4'
              />
              Your browser does not support the video tag.
            </video>
          </div>
          <div className='mt-8 flex w-full flex-col items-center justify-center gap-4 lg:items-start'>
            <p className='max-w-lg text-3xl leading-relaxed'>
              Ideal matchmaking & more
            </p>
            <p className='mb-6 mt-3 max-w-lg leading-relaxed  text-muted-foreground'>
              Find Right Ideal Partners for your Startup using 10’s of filters
              to choose from
            </p>

            <div>
              <ul className='flex flex-col gap-4 text-muted-foreground'>
                <li className='flex items-center gap-4'>
                  <span className='rounded-full bg-primary p-1'>
                    <Check className='h-4 w-4  text-white' />
                  </span>
                  <p>Automated Partnership Meetings</p>
                </li>
                <li className='flex items-center gap-4'>
                  <span className='rounded-full bg-primary p-1'>
                    <Check className='h-4 w-4  text-white' />
                  </span>
                  <p>Cover all type of partnerships</p>
                </li>
                <li className='flex items-center gap-4'>
                  <span className='rounded-full bg-primary p-1'>
                    <Check className='h-4 w-4  text-white' />
                  </span>
                  <p>Community, Strategic, Brand licensing partnerships etc</p>
                </li>

                <li className='flex items-center gap-4'>
                  <span className='rounded-full bg-primary p-1'>
                    <Check className='h-4 w-4  text-white' />
                  </span>
                  <p>Verified startups and companies</p>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className='mt-32 flex flex-col items-start'>
          <div className='flex w-full items-center justify-center'>
            <video
              className='aspect-video  w-full max-w-3xl rounded-lg border-[12px] border-muted object-cover'
              loop
              autoPlay
              muted
            >
              <source
                src='https://s3.ap-south-1.amazonaws.com/sharkdom.co.in/email_template/sharkdomfeature3.mp4'
                type='video/mp4'
              />
              Your browser does not support the video tag.
            </video>
          </div>
          <div className='mt-8 flex-col items-center justify-center gap-4 lg:items-start'>
            <p className='max-w-lg text-3xl leading-relaxed'>
              Clear proposal doubts with real time messaging
            </p>
            <p className='mb-6 mt-3 max-w-lg leading-relaxed  text-muted-foreground'>
              pace the process 3X by real-time messaging for clearing out
              dilemmas related to Offerings & Expectations of proposal received
            </p>

            <div>
              <ul className='flex flex-col gap-4 text-muted-foreground'>
                <li className='flex items-center gap-4'>
                  <span className='rounded-full bg-primary p-1'>
                    <Check className='h-4 w-4  text-white' />
                  </span>
                  <p>Avoid Proposal Spaming</p>
                </li>
                <li className='flex items-center gap-4'>
                  <span className='rounded-full bg-primary p-1'>
                    <Check className='h-4 w-4  text-white' />
                  </span>
                  <p>Autoreply bot to proposals</p>
                </li>
                <li className='flex items-center gap-4'>
                  <span className='rounded-full bg-primary p-1'>
                    <Check className='h-4 w-4  text-white' />
                  </span>
                  <p>Instant Meeting Requests</p>
                </li>

                <li className='flex items-center gap-4'>
                  <span className='rounded-full bg-primary p-1'>
                    <Check className='h-4 w-4  text-white' />
                  </span>
                  <p>Setting Restrictions</p>
                </li>
                <li className='flex items-center gap-4'>
                  <span className='rounded-full bg-primary p-1'>
                    <Check className='h-4 w-4  text-white' />
                  </span>
                  <p>Automated Partnership Meetings</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>*/}
    </>
  )
}

export default FeaturedSection

const content = [
  {
    title: 'Introducing smart partnerships',
    description:
      'Establish Smart Partnerships via our AI proposal generator with 51:49 ratio distribution so you and your upcoming partnered startup can experience mutual benefit',
    // content: (
    //   <div className='flex h-full  w-full items-center justify-center text-white'>
    //     <video
    //       className='aspect-video w-full max-w-3xl rounded-lg border-[12px] border-muted object-cover'
    //       loop
    //       autoPlay
    //       muted
    //     >
    //       <source
    //         src='https://s3.ap-south-1.amazonaws.com/sharkdom.co.in/email_template/sharkdomfeature1.mp4'
    //         type='video/mp4'
    //       />
    //       Your browser does not support the video tag.
    //     </video>
    //   </div>
    // )
    content:
      'https://s3.ap-south-1.amazonaws.com/sharkdom.co.in/email_template/sharkdomfeature1.mp4'
  },
  {
    title: 'Ideal matchmaking & more',
    description:
      'Find Right Ideal Partners for your Startup using 10’s of filters to choose from',
    // content: (
    //   <div className='flex h-full  w-full items-center justify-center  text-white'>
    //     <video
    //       className='aspect-video w-full max-w-3xl rounded-lg border-[12px] border-muted object-cover'
    //       loop
    //       autoPlay
    //       muted
    //     >
    //       <source
    //         src='https://s3.ap-south-1.amazonaws.com/sharkdom.co.in/email_template/sharkdomfeature2.mp4'
    //         type='video/mp4'
    //       />
    //       Your browser does not support the video tag.
    //     </video>
    //   </div>
    // )

    content:
      'https://s3.ap-south-1.amazonaws.com/sharkdom.co.in/email_template/sharkdomfeature2.mp4'
  },
  {
    title: 'Clear proposal doubts with real time messaging',
    description:
      'Pace the process 3X by real-time messaging for clearing out dilemmas related to Offerings & Expectations of proposal received',
    // content: (
    //   <div className='flex h-full  w-full items-center justify-center  text-white'>
    //     <video
    //       className='aspect-video w-full max-w-3xl rounded-lg border-[12px] border-muted object-cover'
    //       loop
    //       autoPlay
    //       muted
    //     >
    //       <source
    //         src='https://s3.ap-south-1.amazonaws.com/sharkdom.co.in/email_template/sharkdomfeature3.mp4'
    //         type='video/mp4'
    //       />
    //       Your browser does not support the video tag.
    //     </video>
    //   </div>
    // )

    content: '/videos/demo.mp4'
  }
]
