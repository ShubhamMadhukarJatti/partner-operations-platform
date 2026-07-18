import Image from 'next/image'
import LogoIcon from '@/../public/icons/logo-white.svg'
import { AlertTriangle, Check } from 'lucide-react'

import MaxWidthWrapper from '@/components/ui/max-width-wrapper'

export default function ComparisonCards() {
  return (
    <MaxWidthWrapper className='mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-10'>
      <div className='flex flex-col items-center justify-center px-10 pb-10'>
        <p className='text-3xl font-medium'>
          Partner Onboarding, Refined for Revenue.
        </p>
        <p className='text-base text-gray-500'>
          Turn partner enablement into a predictable revenue engine with
          Sharkdom.
        </p>
      </div>
      <div className='grid gap-8 md:grid-cols-2'>
        {/* Card - Manual onboarding */}
        <article className='flex flex-col overflow-hidden rounded-2xl border border-gray-100 '>
          {/* header */}
          <div className='bg-[#6C7078] p-6 text-center text-white'>
            <h4 className='text-xl font-semibold'>Manual onboarding</h4>
          </div>

          {/* body */}
          <div className='flex-1 bg-white px-6 pb-6 pt-10'>
            <div className='flex flex-col items-center text-center'>
              <div className='flex items-center justify-center gap-2 pb-6'>
                <div className='text-2xl'>🤔</div>
                <h5 className='text-lg font-medium text-[#1B1D21]'>
                  Partner Confusion
                </h5>
              </div>

              {/* center icon */}
              <div className='my-4'>
                <div className='flex h-12 w-12 items-center justify-center rounded-full bg-red-100'>
                  {/* small chart tick svg */}
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='68'
                    height='68'
                    viewBox='0 0 68 68'
                    fill='none'
                    aria-hidden
                  >
                    <circle
                      cx='34'
                      cy='34'
                      r='34'
                      fill='url(#paint0_linear_2495_50684)'
                    />
                    <path
                      d='M19.207 42.0325C19.3583 42.3969 19.6479 42.6864 20.0123 42.8377C20.1915 42.9141 20.384 42.9547 20.5789 42.957H28.0351C28.4306 42.957 28.8099 42.7999 29.0895 42.5203C29.3692 42.2406 29.5263 41.8613 29.5263 41.4658C29.5263 41.0703 29.3692 40.691 29.0895 40.4113C28.8099 40.1317 28.4306 39.9746 28.0351 39.9746H24.1728L32.5087 31.6386L37.4149 36.5597C37.5535 36.6994 37.7184 36.8104 37.9002 36.8861C38.0819 36.9618 38.2768 37.0008 38.4737 37.0008C38.6705 37.0008 38.8654 36.9618 39.0471 36.8861C39.2289 36.8104 39.3938 36.6994 39.5324 36.5597L48.4798 27.6123C48.6196 27.4737 48.7305 27.3087 48.8062 27.127C48.8819 26.9453 48.9209 26.7504 48.9209 26.5535C48.9209 26.3567 48.8819 26.1618 48.8062 25.98C48.7305 25.7983 48.6196 25.6334 48.4798 25.4948C48.3412 25.355 48.1762 25.244 47.9945 25.1683C47.8128 25.0926 47.6179 25.0536 47.421 25.0536C47.2242 25.0536 47.0293 25.0926 46.8475 25.1683C46.6658 25.244 46.5009 25.355 46.3623 25.4948L38.4737 33.3983L33.5675 28.4772C33.4289 28.3374 33.264 28.2265 33.0822 28.1508C32.9005 28.0751 32.7056 28.0361 32.5087 28.0361C32.3119 28.0361 32.117 28.0751 31.9353 28.1508C31.7535 28.2265 31.5886 28.3374 31.45 28.4772L22.0701 37.8719V34.0097C22.0701 33.6142 21.913 33.2349 21.6334 32.9552C21.3537 32.6755 20.9744 32.5184 20.5789 32.5184C20.1834 32.5184 19.8041 32.6755 19.5245 32.9552C19.2448 33.2349 19.0877 33.6142 19.0877 34.0097V41.4658C19.09 41.6607 19.1306 41.8532 19.207 42.0325Z'
                      fill='white'
                    />
                    <defs>
                      <linearGradient
                        id='paint0_linear_2495_50684'
                        x1='34'
                        y1='0'
                        x2='34'
                        y2='68'
                        gradientUnits='userSpaceOnUse'
                      >
                        <stop stopColor='#FF848A' />
                        <stop offset='1' stopColor='#F1252E' />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>

              <p className='mb-2 mt-4 text-2xl font-semibold text-[#F1252E]'>
                40% Revenue loss
              </p>
              <p className='max-w-sm pt-4 text-sm text-gray-500'>
                Every inefficient onboarding process creates confusion, delays
                deals, and loses revenue. The chaos compounds as your partner
                network grows.
              </p>
            </div>
          </div>

          {/* bottom pale list */}
          <div className='border-t border-gray-100 bg-[#F3F8FF] px-6 py-6'>
            <h6 className='mb-4 text-base font-medium'>
              Hidden cost of Onboarding chaos
            </h6>
            <ul className='space-y-6'>
              <li className='flex items-start items-center gap-3'>
                <AlertTriangle
                  size={16}
                  strokeWidth={2}
                  className='text-[#F1252E]'
                />
                <span className='text-sm text-gray-500'>
                  Inconsistent partner training
                </span>
              </li>

              <li className='flex items-start items-center gap-3'>
                <AlertTriangle
                  size={16}
                  strokeWidth={2}
                  className='text-[#F1252E]'
                />
                <span className='text-sm text-gray-500'>
                  Manual documentation sharing
                </span>
              </li>

              <li className='flex items-start items-center gap-3'>
                <AlertTriangle
                  size={16}
                  strokeWidth={2}
                  className='text-[#F1252E]'
                />
                <span className='text-sm text-gray-500'>
                  No progress tracking
                </span>
              </li>

              <li className='flex items-start items-center gap-3'>
                <AlertTriangle
                  size={16}
                  strokeWidth={2}
                  className='text-[#F1252E]'
                />
                <span className='text-sm text-gray-500'>
                  Fragmented communication
                </span>
              </li>
            </ul>
          </div>
        </article>

        {/* Card - Sharkdom Automation */}
        <article className='flex flex-col overflow-hidden rounded-2xl border border-gray-100 '>
          {/* header - gradient */}
          <div
            className='flex items-center justify-center p-6 text-center'
            style={{
              // background: 'linear-gradient(90deg,#287BFF 0%,#09B2E1 100%)'
              background: `linear-gradient(87deg, #287BFF 48.36%, #09B2E1 102.15%)`
            }}
          >
            <div className='flex gap-1'>
              <Image src={LogoIcon} alt='logo' height={100} width={100} />
              <p className='text-xl font-medium text-white'>Automation</p>
            </div>
          </div>

          {/* body */}
          <div className='flex-1 bg-white px-6 pb-6 pt-8'>
            {/* make this relative so spring svg can be absolutely positioned */}
            <div className='relative flex flex-col items-center text-center'>
              <div className='flex items-center justify-center gap-2 pb-2'>
                <div className='text-2xl'>😎</div>
                <h5 className='text-lg font-medium text-[#1B1D21]'>
                  Consistant process
                </h5>
              </div>

              {/* center icon + spring wrapper */}
              <div className='relative flex gap-20 pl-32'>
                <div className='flex  items-center justify-between rounded-full '>
                  {/* green gradient circle icon (keeps your original look) */}
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='50'
                    height='50'
                    viewBox='0 0 69 68'
                    fill='none'
                    aria-hidden
                  >
                    <circle
                      cx='34.5'
                      cy='34'
                      r='34'
                      fill='url(#paint0_linear_2495_50734)'
                    />
                    <path
                      d='M49.3018 25.9753C49.1505 25.611 48.8609 25.3214 48.4965 25.1701C48.3173 25.0937 48.1247 25.0531 47.9299 25.0508H40.4737C40.0782 25.0508 39.6989 25.2079 39.4193 25.4876C39.1396 25.7672 38.9825 26.1465 38.9825 26.542C38.9825 26.9375 39.1396 27.3168 39.4193 27.5965C39.6989 27.8761 40.0782 28.0332 40.4737 28.0332H44.336L36 36.3692L31.0939 31.4481C30.9553 31.3084 30.7903 31.1974 30.6086 31.1217C30.4269 31.046 30.232 31.007 30.0351 31.007C29.8383 31.007 29.6434 31.046 29.4616 31.1217C29.2799 31.1974 29.115 31.3084 28.9764 31.4481L20.029 40.3955C19.8892 40.5341 19.7783 40.6991 19.7026 40.8808C19.6269 41.0625 19.5879 41.2574 19.5879 41.4543C19.5879 41.6511 19.6269 41.8461 19.7026 42.0278C19.7783 42.2095 19.8892 42.3744 20.029 42.5131C20.1676 42.6528 20.3326 42.7638 20.5143 42.8395C20.696 42.9152 20.8909 42.9542 21.0878 42.9542C21.2846 42.9542 21.4795 42.9152 21.6613 42.8395C21.843 42.7638 22.0079 42.6528 22.1465 42.5131L30.0351 34.6096L34.9413 39.5306C35.0799 39.6704 35.2448 39.7813 35.4266 39.857C35.6083 39.9327 35.8032 39.9717 36 39.9717C36.1969 39.9717 36.3918 39.9327 36.5735 39.857C36.7553 39.7813 36.9202 39.6704 37.0588 39.5306L46.4386 30.1359V33.9981C46.4386 34.3936 46.5958 34.7729 46.8754 35.0526C47.1551 35.3323 47.5344 35.4894 47.9299 35.4894C48.3254 35.4894 48.7047 35.3323 48.9843 35.0526C49.264 34.7729 49.4211 34.3936 49.4211 33.9981V26.542C49.4187 26.3471 49.3782 26.1546 49.3018 25.9753Z'
                      fill='white'
                    />
                    <defs>
                      <linearGradient
                        id='paint0_linear_2495_50734'
                        x1='34.5'
                        y1='0'
                        x2='34.5'
                        y2='68'
                        gradientUnits='userSpaceOnUse'
                      >
                        <stop stopColor='#45DA80' />
                        <stop offset='1' stopColor='#00A443' />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='74'
                  height='121'
                  viewBox='0 0 74 131'
                  fill='none'
                >
                  <path
                    d='M22.0668 118.694C22.7182 118.852 22.9219 119.019 23.1846 119.029C40.6584 115.855 54.904 107.36 64.7585 92.3897C67.2563 88.6155 68.7249 84.273 69.2311 79.6547C70.4019 69.7655 65.2238 60.6761 56.1799 56.6237C51.4783 54.4849 46.6075 53.2618 41.4058 54.3183C40.2385 56.4591 39.149 58.6293 37.8853 60.5553C35.8088 63.6874 32.9578 65.8134 29.121 66.3185C26.287 66.7583 23.9549 65.8742 23.1836 64.1565C22.1712 61.902 22.998 59.7213 24.6877 58.3131C27.0318 56.3513 29.6279 54.6632 32.2426 53.1603C33.9401 52.2005 35.9377 51.6217 37.7799 50.9839C39.795 41.6821 32.8946 34.7902 21.5566 34.6783C20.7732 35.8065 19.9603 37.0127 19.0991 38.1114C15.8023 42.1171 11.5973 44.5314 6.31305 44.3986C4.2889 44.3439 2.2569 43.8407 1.32226 41.6157C0.628667 39.9275 1.45545 37.7468 3.52601 36.0376C6.84638 33.377 10.7935 32.112 14.8556 31.247C16.2874 30.9881 17.7192 30.7292 19.1215 30.5482C22.7341 16.3292 14.191 2.04452 0.152701 2.95768C0.614299 1.97467 0.861365 1.08847 1.34948 0.739061C1.94485 0.341237 2.91806 0.353895 3.67674 0.463376C10.7568 1.72236 16.6026 4.82948 19.8247 11.5739C22.2755 16.6007 23.1873 21.9348 23.0077 27.5677C22.9751 28.3571 22.9426 29.1464 22.9878 29.9653C22.9583 30.0431 23.0842 30.18 23.3066 30.5315C24.0357 30.7189 24.8908 31.0431 25.805 31.2115C36.8417 33.5252 41.2202 38.392 42.3489 49.9547C43.3998 49.9969 44.6062 50.0979 45.7644 50.0916C52.5178 50.336 58.5626 52.4496 63.8583 56.7734C72.4906 63.7874 75.6464 74.6934 72.2712 85.7066C70.4453 91.6952 67.3087 96.9197 63.1429 101.576C53.0221 112.793 40.6994 119.969 25.5372 121.97C24.7677 122.124 23.9499 122.17 23.1804 122.323C23.0731 122.372 22.9364 122.498 22.526 122.877C24.9328 124.502 27.5089 125.212 30.0555 125.999C32.4949 126.835 35.071 127.544 37.7731 128.39C36.7722 130.327 35.3886 130.693 33.8899 130.66C32.158 130.537 30.3671 130.571 28.7828 130.059C24.526 128.624 20.221 127.081 16.0341 125.226C12.78 123.725 12.5263 121.58 15.0368 119.414C20.409 114.859 25.859 110.334 31.309 105.808C32.2075 105.08 33.2024 104.566 34.4709 103.8C35.2983 106.073 34.2039 107.084 33.2169 108.046C29.4457 111.426 25.9078 114.895 22.0668 118.694ZM4.54018 40.1634C10.1697 41.496 14.8116 39.3364 16.8755 34.596C12.4138 35.5768 8.1962 36.3829 4.54018 40.1634ZM26.2382 62.1968C31.238 62.8453 34.5957 60.5552 35.9305 55.6275C32.0317 56.9998 28.5805 58.3637 26.2382 62.1968Z'
                    fill='#10B151'
                  />
                </svg>
                {/* spring doodle SVG - absolute positioned, visible on sm+ */}
              </div>

              <p className='mb-2 text-2xl font-semibold text-[#00A443]'>
                3x Faster Growth
              </p>
              <p className='max-w-sm pt-4 text-sm text-gray-500'>
                Sharkdom&apos;s automated enablement platform creates
                consistent, scalable partner experiences that drive predictable
                revenue growth.
              </p>
            </div>
          </div>

          {/* bottom pale list */}
          <div className='border-t border-gray-100 bg-[#F3F8FF] px-6 py-6'>
            <h6 className='mb-4 text-base font-medium'>
              Measurable Impact with Sharkdom
            </h6>
            <ul className='space-y-6'>
              <li className='flex items-start items-center gap-3'>
                <div className='inline-flex h-4 w-4 items-center justify-center rounded-full border-2 border-[#00A443]'>
                  <Check
                    size={12}
                    strokeWidth={3.2}
                    className='text-[#00A443]'
                  />
                </div>

                <span className='text-sm text-gray-500'>
                  Partners complete onboarding successfully
                </span>
              </li>

              <li className='flex items-start items-center gap-3'>
                <div className='inline-flex h-4 w-4 items-center justify-center rounded-full border-2 border-[#00A443]'>
                  <Check
                    size={12}
                    strokeWidth={3.2}
                    className='text-[#00A443]'
                  />
                </div>
                <span className='text-sm text-gray-500'>
                  Average partner activation time
                </span>
              </li>

              <li className='flex items-start items-center gap-3'>
                <div className='inline-flex h-4 w-4 items-center justify-center rounded-full border-2 border-[#00A443]'>
                  <Check
                    size={12}
                    strokeWidth={3.2}
                    className='text-[#00A443]'
                  />
                </div>
                <span className='text-sm text-gray-500'>
                  Boost in partner-driven revenue
                </span>
              </li>

              <li className='flex items-start items-center gap-3'>
                <div className='inline-flex h-4 w-4 items-center justify-center rounded-full border-2 border-[#00A443]'>
                  <Check
                    size={12}
                    strokeWidth={3.2}
                    className='text-[#00A443]'
                  />
                </div>
                <span className='text-sm text-gray-500'>
                  Self-service enablement resources
                </span>
              </li>
            </ul>
          </div>
        </article>
      </div>
    </MaxWidthWrapper>
  )
}
