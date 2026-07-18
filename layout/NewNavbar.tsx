'use client'

import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ChevronDown } from 'lucide-react'

import { Button } from '@/components/ui/button'

function NewNav() {
  // openId is the id of the currently open dropdown, or null
  const [openId, setOpenId] = useState<string | null>(null)
  const navRef = useRef<HTMLDivElement | null>(null)

  // toggle helper
  const toggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id))
  }

  // close when clicking outside the nav or pressing Escape
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!navRef.current) return
      if (!navRef.current.contains(e.target as Node)) {
        setOpenId(null)
      }
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenId(null)
    }

    document.addEventListener('click', onDocClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('click', onDocClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [])

  return (
    <nav
      ref={navRef}
      className='hidden md:flex md:flex-row md:items-center lg:flex lg:gap-4'
    >
      {/* Platform */}
      <div className='relative'>
        <button
          aria-expanded={openId === 'platform'}
          aria-controls='platform-menu'
          onClick={() => toggle('platform')}
          className='dropbtn flex flex-row items-center gap-1 rounded-3xl px-3 py-2 text-sm font-normal text-black/60
 hover:bg-[#f7f9fc] hover:text-[#6863FB]'
        >
          Platform <ChevronDown size={18} />
        </button>

        {/* Menu (rendered on click) */}
        {openId === 'platform' && (
          <div
            id='platform-menu'
            role='menu'
            className='absolute -left-36 z-50 mt-6 w-[74rem] rounded-[12px] border border-[#E7ECF6] bg-white shadow-[0px_4px_4px_#8B8B8B26]'
          >
            <div className='flex flex-row'>
              <div className='px-8 pt-16'>
                <div className=' gap-3'>
                  <div className=' grid'>
                    <div className='mb-5 grid grid-cols-3 gap-4'>
                      {/* Section 1 on hover*/}
                      <div className='flex flex-col gap-2 rounded-lg border border-[#C8CFDC] p-5'>
                        <Link href='/discover' onClick={() => setOpenId(null)}>
                          <div className='mb-2 flex items-center gap-2'>
                            <Image
                              src='/icons/marketplace.svg'
                              alt='marketplace'
                              width={24}
                              height={24}
                            />
                            <h6
                              style={{ fontSize: '14px' }}
                              className='text-sm text-black'
                            >
                              Marketplace
                            </h6>
                          </div>
                          <p className='text-xs'>
                            Find Ideal Partner from over 2.7k+ companies
                          </p>
                        </Link>
                      </div>

                      {/* Section 2 */}
                      <Link
                        href='/partner-mapping-resource'
                        onClick={() => setOpenId(null)}
                      >
                        <div className='flex flex-col gap-2 rounded-lg border border-[#C8CFDC] p-5'>
                          <div className='flex items-center gap-2 '>
                            <Image
                              src='/icons/timeline.svg'
                              alt='timeline'
                              width={24}
                              height={24}
                            />
                            <h6
                              style={{ fontSize: '14px' }}
                              className='text-sm text-black'
                            >
                              Partner Mapping
                            </h6>
                          </div>
                          <p className='text-xs'>
                            Take joint actions on similar audience b/w your
                            partners
                          </p>
                        </div>
                      </Link>

                      {/* Section 3 */}
                      <div className='flex flex-col gap-2 rounded-lg border border-[#C8CFDC] p-5'>
                        <div className='flex items-center gap-2'>
                          <Image
                            src='/icons/persona.svg'
                            alt='persona'
                            width={24}
                            height={24}
                          />
                          <h6
                            style={{ fontSize: '14px' }}
                            className='text-sm text-black'
                          >
                            Persona Evaluation
                          </h6>
                        </div>
                        <p className='text-xs'>
                          Get customised product market fit companies
                        </p>
                      </div>
                    </div>

                    <div className='grid grid-cols-1 gap-4 md:grid-cols-3 '>
                      {/* Value Metrics */}
                      <div className='flex flex-col gap-2 rounded-lg border border-[#C8CFDC] p-5'>
                        <div className='flex items-center gap-2'>
                          <Image
                            src='/icons/valve.svg'
                            alt='valve'
                            width={24}
                            height={24}
                          />
                          <h6
                            style={{ fontSize: '14px' }}
                            className='text-sm text-black'
                          >
                            Value Metrics
                          </h6>
                        </div>
                        <p className='text-xs'>
                          Maintain track records of all your partner activities
                        </p>
                      </div>

                      {/* Compatibility Checker */}
                      <div className='flex flex-col gap-2 rounded-lg border border-[#C8CFDC] p-5'>
                        <div className='flex items-center gap-2'>
                          <Image
                            src='/icons/compatibility.svg'
                            alt='compatibility'
                            width={24}
                            height={24}
                          />
                          <h6
                            style={{ fontSize: '14px' }}
                            className='text-sm text-black'
                          >
                            Compatibility Checker
                          </h6>
                        </div>
                        <p className='text-xs'>
                          Get customised product market fit companies
                        </p>
                      </div>

                      {/* Referral Dashboard */}
                      <div className='flex flex-col gap-2 rounded-lg border border-[#C8CFDC] p-5'>
                        <div className='flex items-center gap-2'>
                          <Image
                            src='/icons/referral.svg'
                            alt='referral'
                            width={24}
                            height={24}
                          />
                          <h6
                            style={{ fontSize: '14px' }}
                            className='text-sm text-black'
                          >
                            Referral Dashboard
                          </h6>
                        </div>
                        <p className='text-xs'>
                          Maintain track records of all your partner activities
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className='col-span-1 ml-6 pb-4 pl-4 pr-4 pt-10'>
                <div className='flex h-full flex-col justify-between gap-4 border-l border-l-[#C8CFDC] pl-10'>
                  <div>
                    <span
                      style={{ color: '#2A3241', fontSize: '16px' }}
                      className='align-middle text-base font-medium tracking-[0.04em]'
                    >
                      Book a Demo
                    </span>
                    <div className='mt-3'>
                      <Image
                        src={'/assets/book-a-demo.png'}
                        alt='book-a-demo'
                        width={290}
                        height={160}
                      />
                    </div>

                    <p className='py-2 text-sm'>
                      Know how Sharkdom can help your business succeed
                    </p>

                    <Link
                      href='/book-demo'
                      onClick={() => setOpenId(null)}
                      className='mb-6 mt-5 flex w-full max-w-[284px] items-center justify-center gap-2 rounded-[9px] border border-black bg-white px-6 py-2 text-sm text-[#2A3241] sm:px-8 sm:py-[10px] sm:text-xs'
                    >
                      Schedule my Demo
                      <ArrowRight width={16} height={16} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Why Prefer Sharkdom */}
      <div className='relative'>
        <button
          aria-expanded={openId === 'why'}
          aria-controls='why-menu'
          onClick={() => toggle('why')}
          className='dropbtn flex flex-row items-center gap-1 rounded-3xl px-3 py-2 text-sm font-normal text-black/60
 hover:bg-[#f7f9fc] hover:text-[#6863FB]'
        >
          Why Prefer Sharkdom <ChevronDown size={18} />
        </button>

        {openId === 'why' && (
          <div
            id='why-menu'
            role='menu'
            className='absolute -left-64 z-50 mt-4 w-[74rem] rounded-[12px] border border-[#E7ECF6] bg-white shadow-[0px_4px_4px_#8B8B8B26]'
          >
            {/* ... menu body (kept identical to your markup) */}
            <div className=''>
              <div className='grid grid-cols-12 '>
                <div className='col-span-4 p-6'>
                  <h6
                    style={{ fontSize: '14px', color: '#242424' }}
                    className='mb-4 px-4 font-bold text-black'
                  >
                    Sharkdom For
                  </h6>
                  <div className='grid grid-cols-2 gap-8'>
                    <div className='col-span-2 flex flex-col gap-4'>
                      <div className='flex flex-col gap-2'>
                        <div className='flex items-center justify-between gap-2'>
                          <Link
                            href={'/why-sharkdom/partner-managers'}
                            onClick={() => setOpenId(null)}
                            className='flex w-full items-center justify-between gap-2'
                          >
                            <div className='flex w-3/4 items-center gap-2 rounded-[8px] px-4 py-2 transition hover:bg-[#FFF1CD]'>
                              <Image
                                src={'/icons/user-change.svg'}
                                alt='user-change-icon'
                                width={20}
                                height={20}
                              />
                              <span className='align-middle font-inter text-[14px] font-normal leading-[24px] tracking-normal text-black'>
                                Partner Manager
                              </span>
                            </div>
                          </Link>
                        </div>
                      </div>

                      {/* other links here (added onClick to close) */}
                      <Link
                        href={'/why-sharkdom/product-manager'}
                        onClick={() => setOpenId(null)}
                        className='flex w-full items-center justify-between gap-2'
                      >
                        <div className='flex w-3/4 items-center gap-2 rounded-[8px] px-4 py-2 transition hover:bg-[#FFF1CD]'>
                          <Image
                            src={'/icons/user-circle.svg'}
                            alt='user-circle-icon'
                            width={20}
                            height={20}
                          />
                          <span className='align-middle font-inter text-[14px] font-normal leading-[24px] tracking-normal text-black'>
                            Product Manager
                          </span>
                        </div>
                      </Link>

                      <Link
                        href={'/why-sharkdom/sales-team'}
                        onClick={() => setOpenId(null)}
                        className='flex w-full items-center justify-between gap-2'
                      >
                        <div className='flex w-3/4 items-center gap-2 rounded-[8px] px-4 py-2 transition hover:bg-[#FFF1CD]'>
                          <Image
                            src={'/icons/briefcase.svg'}
                            alt='briefcase-icon'
                            width={20}
                            height={20}
                          />
                          <span className='align-middle font-inter text-[14px] font-normal leading-[24px] tracking-normal text-black'>
                            Sales Team
                          </span>
                        </div>
                      </Link>

                      <Link
                        href={'/why-sharkdom/growth-team'}
                        onClick={() => setOpenId(null)}
                        className='flex w-full items-center justify-between gap-2'
                      >
                        <div className='flex w-3/4 items-center gap-2 rounded-[8px] px-4 py-2 transition hover:bg-[#FFF1CD]'>
                          <Image
                            src={'/icons/chart-bar-alt.svg'}
                            alt='chart-bar-alt-icon'
                            width={20}
                            height={20}
                          />
                          <span className='align-middle font-inter text-[14px] font-normal leading-[24px] tracking-normal text-black'>
                            Growth Team
                          </span>
                        </div>
                      </Link>

                      <Link
                        href={'/why-sharkdom/founder'}
                        onClick={() => setOpenId(null)}
                        className='flex w-full items-center justify-between gap-2'
                      >
                        <div className='flex w-3/4 items-center gap-2 rounded-[8px] px-4 py-2 transition hover:bg-[#FFF1CD]'>
                          <Image
                            src={'/icons/user-viewfinder.svg'}
                            alt='user-viewfinder-icon'
                            width={20}
                            height={20}
                          />
                          <span className='align-middle font-inter text-[14px] font-normal leading-[24px] tracking-normal text-black'>
                            Founders
                          </span>
                        </div>
                      </Link>
                    </div>

                    <div className='col-span-1 flex flex-col gap-4'></div>
                  </div>
                </div>

                <div className='col-span-4 p-6'>
                  <h6
                    style={{ fontSize: '14px', color: '#242424' }}
                    className='mb-4 px-4 font-bold text-black'
                  >
                    Integrations
                  </h6>
                  <ul className='flex flex-col gap-4'>
                    <li className='mb-2 flex w-3/4 items-center gap-2 rounded-[8px] px-4 py-2 transition hover:bg-[#fef3c7]'>
                      <Link
                        href='/integration'
                        onClick={() => setOpenId(null)}
                        className='flex items-center gap-3 text-sm'
                      >
                        <Image
                          src='/icons/google-meet-icon.svg'
                          alt='google-meet-icon'
                          width={24}
                          height={24}
                        />
                        <span className='font-inter text-[14px] font-normal leading-[24px] tracking-normal text-black'>
                          Google Meet
                        </span>
                      </Link>
                    </li>

                    <li className='mb-2 flex w-3/4 items-center gap-2 rounded-[8px] px-4 py-2 transition hover:bg-[#fef3c7]'>
                      <Link
                        href='/integration'
                        onClick={() => setOpenId(null)}
                        className='flex items-center gap-3 text-sm'
                      >
                        <Image
                          src='/icons/docusign-icon.svg'
                          alt='docusign-icon'
                          width={24}
                          height={24}
                        />
                        <span className='font-inter text-[14px] font-normal leading-[24px] tracking-normal text-black'>
                          Docusign
                        </span>
                      </Link>
                    </li>

                    <li className='mb-2 flex w-3/4 items-center gap-2 rounded-[8px] px-4 py-2 transition hover:bg-[#fef3c7]'>
                      <Link
                        href='/integration'
                        onClick={() => setOpenId(null)}
                        className='flex items-center gap-3 text-sm'
                      >
                        <Image
                          src='/icons/hubspot-icon.svg'
                          alt='hubspot-icon'
                          width={24}
                          height={24}
                        />
                        <span className='font-inter text-[14px] font-normal leading-[24px] tracking-normal text-black'>
                          HubSpot
                        </span>
                      </Link>
                    </li>

                    <li className='mb-2 flex w-3/4 items-center gap-2 rounded-[8px] px-4 py-2 transition hover:bg-[#fef3c7]'>
                      <Link
                        href='/integration'
                        onClick={() => setOpenId(null)}
                        className='flex items-center gap-3 text-sm'
                      >
                        <div className='relative flex h-6 w-8 items-center'>
                          <div className='absolute left-0 z-10 h-6 w-6 overflow-hidden rounded-full'>
                            <Image
                              src='/icons/sharkdom-meet-icon.svg'
                              alt='sharkdom-meet-icon'
                              width={24}
                              height={24}
                            />
                          </div>
                          <div className='absolute left-3 z-20 h-6 w-6 overflow-hidden rounded-full'>
                            <Image
                              src='/icons/mailchimp-icon.svg'
                              alt='mailchimp-icon'
                              width={24}
                              height={24}
                            />
                          </div>
                        </div>
                        <span className='font-inter text-[14px] font-normal leading-[24px] tracking-normal text-black'>
                          See All Integrations
                        </span>
                      </Link>
                    </li>
                  </ul>
                </div>
                <div className='col-span-4 bg-[#DADEFB40] p-6 lg:p-10'>
                  <div className='flex h-full flex-col justify-center'>
                    <span
                      style={{ color: '#2A3241', fontSize: '16px' }}
                      className='align-middle text-base font-medium leading-6 tracking-[0.04em]'
                    >
                      Book a Demo
                    </span>

                    <span
                      style={{ color: '#8B8B8B', fontSize: '12px' }}
                      className='py-2 text-xs font-normal leading-[21px] tracking-[0.04em]'
                    >
                      Explore why Sharkdom is the best alternative for Managing
                      New and Old Partnerships
                    </span>

                    <ul>
                      <li className='mb-2 flex items-center gap-2'>
                        <Image
                          src='/icons/check-circle.svg'
                          alt='mailchimp-icon'
                          color='#242424'
                          width={22}
                          height={22}
                        />
                        <span
                          style={{ color: '#242424', fontSize: '14px' }}
                          className='align-middle text-sm font-normal leading-6 tracking-normal'
                        >
                          Partner Onboarding
                        </span>
                      </li>
                      <li className='mb-2 flex items-center gap-2 text-sm font-semibold text-black'>
                        <Image
                          src='/icons/check-circle.svg'
                          alt='mailchimp-icon'
                          color='#242424'
                          width={22}
                          height={22}
                        />

                        <span
                          style={{ color: '#242424', fontSize: '14px' }}
                          className='align-middle text-sm font-normal leading-6 tracking-normal'
                        >
                          Partner Enablement
                        </span>
                      </li>
                      <li className='mb-2 flex items-center gap-2 text-sm font-semibold text-black'>
                        <Image
                          src='/icons/check-circle.svg'
                          alt='mailchimp-icon'
                          color='#242424'
                          width={22}
                          height={22}
                        />

                        <span
                          style={{ color: '#242424', fontSize: '14px' }}
                          className='align-middle text-sm font-normal leading-6 tracking-normal'
                        >
                          Partner Marketing
                        </span>
                      </li>
                      <li className='mb-2 flex items-center gap-2 text-sm font-semibold text-black'>
                        <Image
                          src='/icons/check-circle.svg'
                          alt='mailchimp-icon'
                          color='#242424'
                          width={22}
                          height={22}
                        />

                        <span
                          style={{ color: '#242424', fontSize: '14px' }}
                          className='align-middle text-sm font-normal leading-6 tracking-normal'
                        >
                          PRM
                        </span>
                      </li>
                    </ul>

                    <Link
                      href='/book-demo'
                      className='mt-5 flex w-full max-w-[284px] items-center justify-center gap-2 rounded-[9px] border border-black bg-white px-6 py-2 text-sm text-[#2A3241] sm:px-8 sm:py-[10px] sm:text-xs'
                    >
                      Try free demo
                      <ArrowRight width={16} height={16} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Customer Stories */}
      <div className='relative'>
        <button
          aria-expanded={openId === 'stories'}
          aria-controls='stories-menu'
          onClick={() => toggle('stories')}
          className='dropbtn flex flex-row items-center gap-1 rounded-3xl px-3 py-2 text-sm font-normal text-black/60
 hover:bg-[#f7f9fc] hover:text-[#6863FB]'
        >
          Customer Stories <ChevronDown size={18} />
        </button>

        {openId === 'stories' && (
          <div
            id='stories-menu'
            role='menu'
            className='absolute left-0 z-50 mt-2 w-[420px] rounded-[12px] border border-[#E7ECF6] bg-white shadow-[0px_4px_4px_#8B8B8B26]'
          >
            <div className='p-6'>
              <div className='flex flex-col gap-3'>
                <Link
                  href='https://www.sharkdom.com/blog/how-dweepkart-transformed-its-partner-management-pipeline-using-sharkdom'
                  onClick={() => setOpenId(null)}
                  className='rounded-[8px] px-4 py-3 transition hover:bg-[#f7f9fc]'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  <span className='font-inter text-[14px] font-medium leading-[20px] text-black'>
                    Dweepkart
                  </span>
                </Link>
                <Link
                  href='/blog/how-sharkdom-ended-attribution-argument-once-and-for-all-for-stacktr-partner-network'
                  onClick={() => setOpenId(null)}
                  className='rounded-[8px] px-4 py-3 transition hover:bg-[#f7f9fc]'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  <span className='font-inter text-[14px] font-medium leading-[20px] text-black'>
                    Stacktr
                  </span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Pricing */}
      <div>
        <Link
          href={'/pricing'}
          className='dropbtn rounded-3xl px-3 py-2 text-sm font-normal text-black/60
 hover:bg-[#f7f9fc] hover:text-[#6863FB]'
        >
          Pricing
        </Link>
      </div>

      {/* Resources */}
      <div className='relative'>
        <button
          aria-expanded={openId === 'resources'}
          aria-controls='resources-menu'
          onClick={() => toggle('resources')}
          className='dropbtn flex flex-row items-center gap-1 rounded-3xl px-3 py-2 text-sm font-normal text-black/60
 hover:bg-[#f7f9fc] hover:text-[#6863FB]'
        >
          Resources <ChevronDown size={18} />
        </button>

        {openId === 'resources' && (
          <div
            id='resources-menu'
            role='menu'
            className='absolute -left-[660px] z-50 mt-6 w-[74rem]  rounded-[12px] border border-[#E7ECF6] bg-white shadow-[0px_4px_4px_#8B8B8B26]'
          >
            <div className='grid grid-cols-12'>
              <div className='col-span-3 flex flex-col gap-3 p-6 lg:p-6'>
                <div className='flex flex-col items-start rounded-[12px] bg-[#DADEFB40] pb-4 pt-4 text-left'>
                  <div className='flex flex-col items-center self-center rounded-[12px] bg-white p-3 text-left'>
                    <Image
                      src={'/icons/Sharkdom 3.svg'}
                      alt='Sharkdom 3'
                      width={200}
                      height={100}
                    />
                    <div className='mt-3 w-full' style={{ maxWidth: '200px' }}>
                      <p className='text-left text-[12px] text-black sm:text-[13px] lg:text-[14px]'>
                        Tips for B2B Growth Partnerships
                      </p>
                    </div>
                  </div>
                </div>

                {/* <div className='bg-[#DADEFB40] pt-4 pb-4 flex flex-col items-start text-left rounded-[12px]'>
              <div className="mr-4 ml-4  flex-col items-center p-6 rounded-[12px] bg-white max-w-sm mx-auto">
                <Image
                  src={'/icons/Sharkdom 3.svg'}
                  alt='Sharkdom 3'
                  width={180}
                  height={100}
                />

                <div className='mt-3 self-center text-left'>
                  <p className='text-sm text-black' style={{ fontSize: '14px' }}>
                    Tips for B2B Growth Partnerships
                  </p>
                </div>
              </div>
            </div> */}
              </div>

              <div className='col-span-3 flex w-full flex-col p-6 lg:p-6'>
                <div className='w-full'>
                  <span className='mb-5 px-4 align-middle text-[14px] font-bold leading-[24px] text-[#242424]'>
                    Company & media
                  </span>
                  <Link
                    href={'/about-us'}
                    className='mb-3 mt-3 flex w-fit w-full items-center gap-3 rounded-[8px] px-4 py-2 transition hover:bg-[#FFF1CD]'
                  >
                    <Image
                      alt='about-us'
                      src={'/icons/users-group.svg'}
                      width={24}
                      height={24}
                    />
                    <p style={{ fontSize: '14px' }} className='text-black'>
                      About Us
                    </p>
                  </Link>
                  <Link
                    href={'https://www.youtube.com/@sharkdomIndia'}
                    className='mb-6 flex w-full items-center gap-3 rounded-[8px] px-4 py-2 transition hover:bg-[#FFF1CD]'
                  >
                    <Image
                      alt='youtube'
                      src={'/icons/youtube.svg'}
                      width={24}
                      height={24}
                    />
                    <p style={{ fontSize: '14px' }} className='text-black'>
                      Youtube
                    </p>
                  </Link>
                </div>

                <div>
                  <span className='mb-5 px-4 align-middle text-[14px] font-bold leading-[24px] text-[#242424]'>
                    Branding Resources
                  </span>
                  <Link
                    href={'/branding'}
                    className='mb-6 mt-3 flex w-fit w-full items-center gap-3 rounded-[8px] px-4 py-2 transition hover:bg-[#FFF1CD]'
                  >
                    <Image
                      alt='about-us'
                      src={'/icons/users-group.svg'}
                      width={24}
                      height={24}
                    />
                    <p style={{ fontSize: '14px' }} className='text-black'>
                      Get Branding Resources
                    </p>
                  </Link>
                </div>
              </div>

              <div className='col-span-6 m-5 flex flex-col rounded-[12px] bg-[#DADEFB40] p-6 lg:p-10'>
                <h5 className='mb-2 align-middle text-[16px] font-normal leading-[24px] tracking-[0.04em] text-[#2A3241]'>
                  Featured Blogs
                </h5>
                <div className='flex gap-4'>
                  <Image
                    src={'/icons/featured-blog.svg'}
                    alt='featured-blog'
                    width={217} // wider
                    height={125} // taller
                  />

                  <div className='flex flex-col justify-center'>
                    <h6 className='font-semibold text-black'>
                      How Sharkdom’s account maaping stand out from other PRM’s
                    </h6>
                    <p className='text-sm'>
                      Sharkdom uses advanced cognitive AI algorithms to offer
                      deeper insights into partner prospects, beyond traditional
                      account mapping and populations for market dynamics
                    </p>
                  </div>
                </div>

                <Link
                  href={
                    '/blog/how-sharkdom-s-account-mapping-differs-from-other-prm-solutions'
                  }
                  className='mb-6 mt-5 flex w-full max-w-[284px] items-center justify-center gap-2 rounded-[9px] border border-black bg-white px-6 py-2 text-sm text-[#2A3241] sm:px-8 sm:py-[10px] sm:text-xs'
                >
                  View Blog
                  <ArrowRight width={16} height={16} />
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default NewNav
