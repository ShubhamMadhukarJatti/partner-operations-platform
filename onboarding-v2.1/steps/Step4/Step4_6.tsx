import React from 'react'

export interface Step4_6Props {
  firstName?: string
  onExplore?: () => void
  onBookDemo?: () => void
  onGoToDashboard?: () => void
  onPartnerMapping?: () => void
}

export const Step4_6: React.FC<Step4_6Props> = ({
  firstName = 'John',
  onExplore,
  onBookDemo,
  onGoToDashboard,
  onPartnerMapping
}) => {
  return (
    <div className='mx-auto inline-flex w-[720px] flex-col items-center justify-start gap-10 rounded-2xl bg-white p-12'>
      <div className='flex flex-col items-start justify-start gap-1 self-stretch'>
        <div className='flex flex-col justify-center break-words font-inter text-2xl font-semibold text-[#101828]'>
          You’re all set, {firstName}
        </div>
        <div className='flex flex-col justify-center self-stretch break-words font-inter text-2xl font-normal text-[#A7A6CC]'>
          Your workspace is ready.
        </div>
      </div>

      <div className='flex flex-col items-start justify-start gap-4 self-stretch'>
        <div className='flex flex-col justify-center self-stretch break-words font-inter text-xs font-medium uppercase text-[#6A7282]'>
          Here’s what’s waiting for you
        </div>
        <div className='inline-flex items-start justify-start gap-2 self-stretch'>
          {/* Card 1 */}
          <div className='inline-flex flex-1 flex-col items-start justify-start gap-8 rounded-2xl p-5 outline outline-1 outline-offset-[-1px] outline-[#F3F4F6]'>
            <div className='break-words font-inter text-2xl font-medium text-[#101828]'>
              124
            </div>
            <div className='inline-flex items-center justify-start gap-1 self-stretch'>
              <div className='flex h-4 w-4 items-center justify-center'>
                <img
                  src='/onBoarding-v2.1/dweep.svg'
                  alt='Dweep AI'
                  className='h-full w-full'
                />
              </div>
              <div
                className='flex-1 break-words font-inter text-sm font-medium'
                style={{
                  backgroundImage:
                    'linear-gradient(122.24deg, #D588FC 16.63%, #007BFF 44.4%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                Dweep AI credits
              </div>
            </div>
          </div>
          {/* Card 2 */}
          <div className='inline-flex flex-1 flex-col items-start justify-start gap-8 rounded-2xl p-5 outline outline-1 outline-offset-[-1px] outline-[#F3F4F6]'>
            <div className='break-words font-inter text-2xl font-medium text-[#101828]'>
              20+
            </div>
            <div className='inline-flex items-center justify-start gap-1 self-stretch'>
              <div className='relative flex h-4 w-4 items-center justify-center overflow-hidden'>
                <img
                  src='/onBoarding-v2.1/access.svg'
                  alt='Access'
                  className='h-full w-full'
                />
              </div>
              <div className='flex-1 break-words font-inter text-sm font-medium text-[#4A5565]'>
                Integrations
              </div>
            </div>
          </div>
          {/* Card 3 */}
          <div className='inline-flex flex-1 flex-col items-start justify-start gap-8 rounded-2xl p-5 outline outline-1 outline-offset-[-1px] outline-[#F3F4F6]'>
            <div className='inline-flex items-center justify-start gap-1 self-stretch'>
              <div className='break-words font-inter text-2xl font-medium text-[#101828]'>
                B
              </div>
              <div className='relative flex h-4 w-4 items-center justify-center'>
                <svg
                  width='10'
                  height='10'
                  viewBox='0 0 24 24'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M5 12H19M19 12L12 5M19 12L12 19'
                    stroke='#C4CDD5'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
              </div>
              <div className='break-words font-inter text-2xl font-medium text-[#101828]'>
                B
              </div>
            </div>
            <div className='inline-flex items-center justify-start gap-1 self-stretch'>
              <div className='relative flex h-4 w-4 items-center justify-center'>
                <svg
                  width='14'
                  height='14'
                  viewBox='0 0 24 24'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z'
                    stroke='#6863FB'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
              </div>
              <div className='flex-1 break-words font-inter text-sm font-medium text-[#4A5565]'>
                Profile configured
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='flex flex-col items-start justify-start gap-4 self-stretch'>
        <div className='flex flex-col justify-center self-stretch break-words font-inter text-xs font-medium uppercase text-[#6A7282]'>
          SUGGESTED FIRST STEPS
        </div>
        <div className='flex flex-col items-start justify-start gap-4 self-stretch'>
          <div className='h-0 self-stretch outline outline-[0.5px] outline-offset-[-0.25px] outline-[#F3F4F6]'></div>

          <div className='inline-flex items-center justify-start gap-6 self-stretch rounded-md py-2'>
            <div className='inline-flex h-12 w-12 flex-col items-center justify-center rounded-lg bg-gradient-to-br from-[rgba(213,136,251,0.1)] to-[rgba(0,123,255,0.1)] p-3'>
              <img
                src='/onBoarding-v2.1/dweep.svg'
                alt='Dweep AI'
                className='h-full w-full'
              />
            </div>
            <div className='inline-flex flex-1 flex-col items-start justify-start gap-2'>
              <div className='flex flex-col items-start justify-start gap-1 self-stretch'>
                <div className='flex flex-col justify-center self-stretch break-words font-inter text-base font-medium text-[#4A5565]'>
                  <div className='flex items-center gap-[4px]'>
                    <span>Run your first</span>
                    <img
                      src='/onBoarding-v2.1/dweep.svg'
                      alt='Dweep AI'
                      className='h-[18px] w-[18px]'
                    />
                    <span
                      style={{
                        backgroundImage:
                          'linear-gradient(122.24deg, #D588FC 16.63%, #007BFF 44.4%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                      }}
                    >
                      Dweep
                    </span>
                    <span>scout</span>
                  </div>
                </div>
                <div className='flex flex-col justify-center self-stretch break-words font-inter text-sm font-normal text-[#6A7282]'>
                  Describe a partner and we’ll find best matches
                </div>
              </div>
            </div>
            <button
              onClick={onExplore}
              className='flex cursor-pointer items-center justify-start hover:opacity-80'
            >
              <div className='flex items-center justify-center gap-1 overflow-hidden rounded-lg shadow-[0px_1px_2px_rgba(10,12.67,18,0.05)]'>
                <div className='break-words font-inter text-sm font-medium leading-tight text-[#6863FB]'>
                  Explore
                </div>
                <div className='relative h-4 w-4'>
                  <div
                    className='absolute left-[2px] top-[3px] h-[10px] w-3 bg-[#6863FB]'
                    style={{
                      maskImage:
                        "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 10' fill='none'%3E%3Cpath d='M7.16667 1.66666L10.5 4.99999M10.5 4.99999L7.16667 8.33332M10.5 4.99999H1.5' stroke='black' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")",
                      WebkitMaskImage:
                        "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 10' fill='none'%3E%3Cpath d='M7.16667 1.66666L10.5 4.99999M10.5 4.99999L7.16667 8.33332M10.5 4.99999H1.5' stroke='black' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")",
                      maskRepeat: 'no-repeat',
                      WebkitMaskRepeat: 'no-repeat',
                      maskPosition: 'center',
                      WebkitMaskPosition: 'center'
                    }}
                  />
                </div>
              </div>
            </button>
          </div>

          <div className='h-0 self-stretch outline outline-[0.5px] outline-offset-[-0.25px] outline-[#F3F4F6]'></div>

          <div className='inline-flex items-center justify-start gap-6 self-stretch rounded-md py-2'>
            <div className='relative inline-flex h-12 w-12 flex-col items-center justify-center rounded-lg bg-[#EEF6FF] p-3'>
              <div className='absolute inset-0 m-auto flex h-5 w-5 items-center justify-center'>
                <svg
                  width='20'
                  height='20'
                  viewBox='0 0 24 24'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M21 16V8C21 6.89543 20.1046 6 19 6H5C3.89543 6 3 6.89543 3 8V16C3 17.1046 3.89543 18 5 18H19C20.1046 18 21 17.1046 21 16Z'
                    stroke='#6863FB'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                  <path
                    d='M12 6V3'
                    stroke='#6863FB'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
              </div>
            </div>
            <div className='inline-flex flex-1 flex-col items-start justify-start gap-2'>
              <div className='flex flex-col items-start justify-start gap-1 self-stretch'>
                <div className='flex flex-col justify-center self-stretch break-words font-inter text-base font-medium text-[#4A5565]'>
                  Set up partner mapping
                </div>
                <div className='flex flex-col justify-center self-stretch break-words font-inter text-sm font-normal text-[#6A7282]'>
                  See account overlap with your first partner
                </div>
              </div>
            </div>
            <button
              onClick={onPartnerMapping}
              className='flex cursor-pointer items-center justify-start hover:opacity-80'
            >
              <div className='flex items-center justify-center gap-1 overflow-hidden rounded-lg shadow-[0px_1px_2px_rgba(10,12.67,18,0.05)]'>
                <div className='break-words font-inter text-sm font-medium leading-tight text-[#6863FB]'>
                  Set up
                </div>
                <div className='relative h-4 w-4'>
                  <div
                    className='absolute left-[2px] top-[3px] h-[10px] w-3 bg-[#6863FB]'
                    style={{
                      maskImage:
                        "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 10' fill='none'%3E%3Cpath d='M7.16667 1.66666L10.5 4.99999M10.5 4.99999L7.16667 8.33332M10.5 4.99999H1.5' stroke='black' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")",
                      WebkitMaskImage:
                        "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 10' fill='none'%3E%3Cpath d='M7.16667 1.66666L10.5 4.99999M10.5 4.99999L7.16667 8.33332M10.5 4.99999H1.5' stroke='black' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")",
                      maskRepeat: 'no-repeat',
                      WebkitMaskRepeat: 'no-repeat',
                      maskPosition: 'center',
                      WebkitMaskPosition: 'center'
                    }}
                  />
                </div>
              </div>
            </button>
          </div>
          <div className='h-0 self-stretch outline outline-[0.5px] outline-offset-[-0.25px] outline-[#F3F4F6]'></div>
        </div>
      </div>

      <div className='inline-flex items-center justify-start gap-4 self-stretch'>
        <button
          onClick={onBookDemo}
          className='flex cursor-pointer items-start justify-start hover:opacity-80'
        >
          <div className='flex items-center justify-center gap-2 overflow-hidden rounded-lg bg-white px-6 py-3 outline outline-1 outline-offset-[-1px] outline-[#CCCCCC]'>
            <div className='relative h-4 w-4'>
              <div
                className='absolute left-[2px] top-[1px] h-[13px] w-3 bg-[#212B36]'
                style={{
                  maskImage:
                    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 13' fill='none'%3E%3Cpath d='M9.33333 2.16666H2.66667C1.93029 2.16666 1.33333 2.76362 1.33333 3.49999V10.1667C1.33333 10.903 1.93029 11.5 2.66667 11.5H9.33333C10.0697 11.5 10.6667 10.903 10.6667 10.1667V3.49999C10.6667 2.76362 10.0697 2.16666 9.33333 2.16666Z' stroke='black' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='M8.66667 1.5V2.83333M3.33333 1.5V2.83333M1.33333 5.5H10.6667' stroke='black' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")",
                  WebkitMaskImage:
                    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 13' fill='none'%3E%3Cpath d='M9.33333 2.16666H2.66667C1.93029 2.16666 1.33333 2.76362 1.33333 3.49999V10.1667C1.33333 10.903 1.93029 11.5 2.66667 11.5H9.33333C10.0697 11.5 10.6667 10.903 10.6667 10.1667V3.49999C10.6667 2.76362 10.0697 2.16666 9.33333 2.16666Z' stroke='black' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='M8.66667 1.5V2.83333M3.33333 1.5V2.83333M1.33333 5.5H10.6667' stroke='black' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")",
                  maskRepeat: 'no-repeat',
                  WebkitMaskRepeat: 'no-repeat',
                  maskPosition: 'center',
                  WebkitMaskPosition: 'center'
                }}
              />
            </div>
            <div className='break-words font-inter text-sm font-semibold leading-tight text-[#1A1A1A]'>
              Book a demo
            </div>
          </div>
        </button>
        <button
          onClick={onGoToDashboard}
          className='flex flex-1 cursor-pointer items-start justify-start hover:opacity-90'
        >
          <div className='flex flex-1 items-center justify-center gap-2 overflow-hidden rounded-lg bg-[#6863FB] px-6 py-3 shadow-[0px_1px_2px_rgba(10,12.67,18,0.05)] outline outline-1 outline-offset-[-1px] outline-[#6863FB]'>
            <div className='break-words font-inter text-sm font-semibold leading-tight text-white'>
              Go to dashboard
            </div>
            <div className='relative h-4 w-4'>
              <div
                className='absolute left-[2px] top-[3px] h-[10px] w-3 bg-white'
                style={{
                  maskImage:
                    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 10' fill='none'%3E%3Cpath d='M7.16667 1.66666L10.5 4.99999M10.5 4.99999L7.16667 8.33332M10.5 4.99999H1.5' stroke='black' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")",
                  WebkitMaskImage:
                    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 10' fill='none'%3E%3Cpath d='M7.16667 1.66666L10.5 4.99999M10.5 4.99999L7.16667 8.33332M10.5 4.99999H1.5' stroke='black' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")",
                  maskRepeat: 'no-repeat',
                  WebkitMaskRepeat: 'no-repeat',
                  maskPosition: 'center',
                  WebkitMaskPosition: 'center'
                }}
              />
            </div>
          </div>
        </button>
      </div>
    </div>
  )
}
