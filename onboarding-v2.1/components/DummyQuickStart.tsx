'use client'

import React from 'react'
import Image from 'next/image'
import {
  IconAdjustments,
  IconAffiliate,
  IconArrowsRightLeft,
  IconAwardFilled,
  IconBell,
  IconBook2,
  IconCategory,
  IconChartPie2Filled,
  IconDatabase,
  IconDragDrop,
  IconHistory,
  IconHours24,
  IconPuzzle,
  IconRepeat,
  IconSchool,
  IconSearch,
  IconSend,
  IconTag,
  IconUsers
} from '@tabler/icons-react'

export const DummyQuickStart = () => {
  return (
    <div className='flex min-h-screen overflow-hidden bg-gray-50 font-sans'>
      {/* Fake Sidebar */}
      <aside className='hidden w-64 flex-shrink-0 flex-col border-r border-gray-200 bg-white md:flex'>
        <div className='flex h-16 items-center border-b border-gray-100 px-6'>
          <Image
            src='/icons/logo.png'
            alt='Sharkdom'
            height={28}
            width={120}
            className='object-contain'
          />
        </div>
        <div className='flex-1 p-4'>
          {/* Role Switcher */}
          <div className='mb-6 flex items-center justify-between rounded-xl border border-[#E9D5FF] bg-[#F5F0FF] p-3'>
            <div className='flex items-center gap-3'>
              <IconUsers className='h-5 w-5 text-[#8B5CF6]' stroke={2} />
              <div className='flex flex-col'>
                <span className='mb-1 text-[10px] font-bold uppercase leading-none tracking-wider text-[#A7A6CC]'>
                  Role
                </span>
                <span className='text-[15px] font-medium leading-none text-[#4A5565]'>
                  Partner
                </span>
              </div>
            </div>
            <IconRepeat className='h-5 w-5 text-[#8B5CF6]' stroke={2} />
          </div>

          {/* Mock Sidebar items */}
          <div className='space-y-1'>
            <div className='flex h-10 cursor-pointer items-center rounded-lg px-3 text-sm text-[#4A5565] hover:bg-gray-50'>
              <IconAdjustments
                className='mr-3 h-[18px] w-[18px] text-[#4A5565]'
                stroke={1.5}
              />
              Quick Start
            </div>
            <div className='flex h-10 cursor-pointer items-center justify-between rounded-lg px-3 text-sm text-[#4A5565] hover:bg-gray-50'>
              <div className='flex items-center'>
                <IconUsers
                  className='mr-3 h-[18px] w-[18px] text-[#4A5565]'
                  stroke={1.5}
                />
                Partner Onboarding
              </div>
              <svg
                className='h-[14px] w-[14px] text-gray-500'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M9 5l7 7-7 7'
                />
              </svg>
            </div>
            <div className='flex h-10 cursor-pointer items-center justify-between rounded-lg px-3 text-sm text-[#4A5565] hover:bg-gray-50'>
              <div className='flex items-center'>
                <IconCategory
                  className='mr-3 h-[18px] w-[18px] text-[#4A5565]'
                  stroke={1.5}
                />
                Partner Program
              </div>
              <svg
                className='h-[14px] w-[14px] text-gray-500'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M9 5l7 7-7 7'
                />
              </svg>
            </div>

            <div className='flex h-10 cursor-pointer items-center justify-between rounded-lg px-3 text-sm text-[#4A5565] hover:bg-gray-50'>
              <div className='flex items-center'>
                <IconSchool
                  className='mr-3 h-[18px] w-[18px] text-[#4A5565]'
                  stroke={1.5}
                />
                Partner Enablement
              </div>
              <svg
                className='h-[14px] w-[14px] text-gray-500'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M5 15l7-7 7 7'
                />
              </svg>
            </div>
            <div className='mb-2 ml-9 mt-1 flex flex-col space-y-3'>
              <div className='flex cursor-pointer items-center gap-3 text-[14px] text-[#4A5565] hover:text-[#6863FB]'>
                <IconBook2
                  className='h-[18px] w-[18px] text-[#4A5565]'
                  stroke={1.5}
                />
                My Courses
              </div>
            </div>

            <div className='flex h-10 cursor-pointer items-center justify-between rounded-lg px-3 text-sm text-[#4A5565] hover:bg-gray-50'>
              <div className='flex items-center'>
                <IconTag
                  className='mr-3 h-[18px] w-[18px] text-[#4A5565]'
                  stroke={1.5}
                />
                Deals
              </div>
              <svg
                className='h-[14px] w-[14px] text-gray-500'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M5 15l7-7 7 7'
                />
              </svg>
            </div>
            <div className='mb-2 ml-9 mt-2 flex flex-col space-y-4'>
              <div className='flex cursor-pointer items-center gap-3 text-[14px] text-[#4A5565] hover:text-[#6863FB]'>
                <IconArrowsRightLeft
                  className='h-[18px] w-[18px] text-[#4A5565]'
                  stroke={1.5}
                />
                Cosell
              </div>
              <div className='flex cursor-pointer items-center gap-3 text-[14px] text-[#4A5565] hover:text-[#6863FB]'>
                <IconHistory
                  className='h-[18px] w-[18px] text-[#4A5565]'
                  stroke={1.5}
                />
                Resell
              </div>
              <div className='flex cursor-pointer items-center gap-3 text-[14px] text-[#4A5565] hover:text-[#6863FB]'>
                <IconAffiliate
                  className='h-[18px] w-[18px] text-[#4A5565]'
                  stroke={1.5}
                />
                Partner Mapping
              </div>
            </div>

            <div className='flex h-10 cursor-pointer items-center justify-between rounded-lg px-3 text-sm text-[#4A5565] hover:bg-gray-50'>
              <div className='flex items-center'>
                <IconSend
                  className='mr-3 h-[18px] w-[18px] text-[#4A5565]'
                  stroke={1.5}
                />
                Outreach
              </div>
              <svg
                className='h-[14px] w-[14px] text-gray-500'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M9 5l7 7-7 7'
                />
              </svg>
            </div>

            <div className='mx-3 my-4 h-px bg-gray-100'></div>

            <div className='flex h-10 cursor-pointer items-center rounded-lg px-3 text-sm text-[#4A5565] hover:bg-gray-50'>
              <IconPuzzle
                className='mr-3 h-[18px] w-[18px] text-[#4A5565]'
                stroke={1.5}
              />
              Integration
            </div>
            <div className='flex h-10 cursor-pointer items-center rounded-lg px-3 text-sm text-[#4A5565] hover:bg-gray-50'>
              <IconDatabase
                className='mr-3 h-[18px] w-[18px] text-[#4A5565]'
                stroke={1.5}
              />
              Data Pipeline
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className='flex min-w-0 flex-1 flex-col bg-white'>
        {/* Fake Topbar */}
        <header className='flex h-16 flex-shrink-0 items-center justify-between border-b border-gray-100 bg-white px-6'>
          <div className='flex-1'></div>
          <div className='flex items-center space-x-4'>
            <button className='text-gray-400 hover:text-gray-500'>
              <IconSearch className='h-5 w-5' />
            </button>
            <button className='text-gray-400 hover:text-gray-500'>
              <IconBell className='h-5 w-5' />
            </button>
            <div className='flex h-8 w-8 items-center justify-center rounded-full bg-[#6863FB] text-sm font-medium text-white'>
              JD
            </div>
          </div>
        </header>

        {/* Fake Quick Start Content */}
        <div className='pointer-events-none flex-1 overflow-auto'>
          <div className='mx-auto max-w-7xl px-6 py-10 opacity-60'>
            <div className='flex flex-col items-center'>
              <div className='max-w-xl text-center'>
                <h1 className='text-xl font-bold'>
                  Turn Your Actions Into Rewards
                </h1>
                <p className='mt-2 text-gray-500'>
                  Unlock exclusive perks, credits, and early access features as
                  you explore everything Sharkdom has to offer. Complete
                  milestones, earn rewards, and maximize your platform
                  experience.
                </p>
              </div>
            </div>

            {/* Fake Milestone Progress */}
            <div className='my-10'>
              <div className='w-full rounded-xl border border-gray-200 bg-white p-6 shadow-sm'>
                <div className='h-4 w-full overflow-hidden rounded-full bg-gray-100'>
                  <div className='h-full w-[20%] rounded-full bg-[#6863FB]'></div>
                </div>
                <div className='mt-4 flex justify-between'>
                  <div className='text-center'>
                    <div className='mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-[#6863FB] text-sm font-bold text-white'>
                      1
                    </div>
                    <p className='text-xs font-medium text-gray-600'>
                      Onboarding
                    </p>
                  </div>
                  <div className='text-center'>
                    <div className='mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-sm font-bold text-gray-400'>
                      2
                    </div>
                    <p className='text-xs font-medium text-gray-400'>
                      First Partner
                    </p>
                  </div>
                  <div className='text-center'>
                    <div className='mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-sm font-bold text-gray-400'>
                      3
                    </div>
                    <p className='text-xs font-medium text-gray-400'>
                      First Deal
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className='my-10'>
              <div className='flex flex-col items-center rounded-2xl bg-gradient-to-br from-[#514dc7] to-[#6a65fb] px-4 py-10 text-white md:px-10'>
                <h2 className='mb-2 text-center text-xl font-semibold'>
                  What You'll Unlock
                </h2>
                <p className='mb-8 text-center text-sm font-normal text-white/80'>
                  Every milestone brings you closer to exclusive rewards and
                  enhanced platform capabilities
                </p>
                <div className='mx-auto grid w-full max-w-5xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4'>
                  <div className='flex flex-col items-center text-center'>
                    <IconAwardFilled className='mb-4 h-12 w-12 text-white' />
                    <p className='text-md font-semibold text-white'>
                      Badges & Recognition
                    </p>
                    <p className='mt-1 text-sm text-white/80'>
                      Earn exclusive badges for your achievements
                    </p>
                  </div>
                  <div className='flex flex-col items-center text-center'>
                    <IconChartPie2Filled className='mb-4 h-12 w-12 text-white' />
                    <p className='text-md font-semibold text-white'>
                      Extra Analytics Credits
                    </p>
                    <p className='mt-1 text-sm text-white/80'>
                      Unlock additional mapping and reporting credits
                    </p>
                  </div>
                  <div className='flex flex-col items-center text-center'>
                    <IconDragDrop className='mb-4 h-12 w-12 text-white' />
                    <p className='text-md font-semibold text-white'>
                      Early Access Features
                    </p>
                    <p className='mt-1 text-sm text-white/80'>
                      Get first access to new Sharkdom capabilities
                    </p>
                  </div>
                  <div className='flex flex-col items-center text-center'>
                    <IconHours24 className='mb-4 h-12 w-12 text-white' />
                    <p className='text-md font-semibold text-white'>
                      Priority Support
                    </p>
                    <p className='mt-1 text-sm text-white/80'>
                      Jump the queue with premium support access
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
