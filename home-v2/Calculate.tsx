'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Star } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import MaxWidthWrapper from '@/components/ui/max-width-wrapper'
import { Slider } from '@/components/ui/slider'
import { BorderBeam } from '@/components/magicui/border-beam'

type sliderValueType = 'workHours' | 'cost' | 'activePartners' | 'efficiency'

const ValueItem: React.FC<{
  title: string
  value: number
  handleChange: (val: number) => void
  sliderValueType: sliderValueType
}> = ({ title, value, handleChange, sliderValueType }) => {
  const maxValue = () => {
    if (sliderValueType === 'workHours')
      return { min: 6, max: 120, format: 'hrs' }
    if (sliderValueType === 'cost') return { min: 0, max: 1500, format: '$' }
    if (sliderValueType === 'activePartners')
      return { min: 0, max: 100, format: '' }
    if (sliderValueType === 'efficiency') return { min: 0, max: 50, format: '' }
    else return { min: 0, max: 0, format: '' }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value)
    if (val > maxValue()?.max || val < maxValue()?.min) return
    // console.log(maxValue()?.max)
    handleChange(val)
  }
  return (
    <div className='flex  flex-col gap-3'>
      <div className='relative flex items-center justify-between'>
        <p className='text-sm text-[#242424]'>{title}</p>
        <Input
          type='number'
          className='relative max-w-[65px] rounded-[4px] border border-[#7688A8] px-3 py-1.5 text-sm text-[#242424]'
          value={value}
          onChange={(e) => handleInputChange(e)}
        />
        <div className='absolute right-2 top-1/2 -translate-y-1/2 transform text-sm text-[#242424]'>
          {maxValue()?.format}
        </div>
      </div>
      <Slider
        onValueChange={(val) => handleChange(val[0])}
        value={[value]}
        defaultValue={[0]}
        min={maxValue()?.min}
        max={maxValue()?.max}
        step={1}
        className={cn('w-full', '')}
      />
    </div>
  )
}

type CalculateValueType = {
  workHours: number
  cost: number
  activePartners: number
  efficiency: number
}

const roles = [
  {
    title: 'Partner Manager',
    description:
      'Expand reach through partner-led marketing with real performance tracking.',
    icon: '/icons/user-change.svg',
    activeIcon: '/icons/user-change-filled.svg',
    active: true,
    redirect: '/why-sharkdom/product-manager',
    bgImage: '/assets/partner-manager-bg.svg'
  },
  {
    title: 'Founders',
    description:
      'Expand reach through partner-led marketing with real performance tracking.',
    icon: '/icons/founder.svg',
    activeIcon: '/icons/founder-active.svg',
    active: false,
    redirect: '/why-sharkdom/founder',
    bgImage: '/assets/partner-manager-bg.svg'
  },
  {
    title: 'Growth Team',
    description:
      'Expand reach through partner-led marketing with real performance tracking.',
    icon: '/icons/growth-filled.svg',
    activeIcon: '/icons/growth.svg',
    active: false,
    redirect: '/why-sharkdom/growth-team',
    bgImage: '/assets/partner-manager-bg.svg'
  },
  {
    title: 'Sales Team',
    description:
      'Expand reach through partner-led marketing with real performance tracking.',
    icon: '/icons/briefcase.svg',
    activeIcon: '/icons/briefcase-filled.svg',
    active: false,
    redirect: '/why-sharkdom/sales-team',
    bgImage: '/assets/partner-manager-bg.svg'
  },
  {
    title: 'Product Manager',
    description:
      'Expand reach through partner-led marketing with real performance tracking.',
    icon: '/icons/user-circle.svg',
    activeIcon: '/icons/user-circle-filled.svg',
    active: false,
    redirect: '/why-sharkdom/product-managers',
    bgImage: '/assets/partner-manager-bg.svg'
  }
]

const Calculate = () => {
  const [values, setValues] = useState<CalculateValueType>({
    workHours: 6,
    cost: 1,
    activePartners: 1,
    efficiency: 1
  })
  const [analyticsValue, setAnalyticsValue] = useState({
    currentCost: 0,
    afterSharkdomCost: 0,
    roiEstimation: 0,
    totalTimemSaved: 0,
    costReduction: 0
  })

  const [activeTab, setActiveTab] = useState(0)

  const handleGetStarted = (values: CalculateValueType) => {
    const workHours = values.workHours || 1
    const cost = values.cost || 1
    const activePartners = values.activePartners || 1
    const efficiency = values.efficiency || 1

    const currentCost =
      ((workHours / 2) * cost * activePartners * efficiency) / 1.73

    const afterSharkdomCost =
      currentCost / (Math.random() * (4.9 - 1.73) + 1.73)

    const costReduction = (currentCost - afterSharkdomCost) / currentCost
    const roiEstimation = costReduction * 4
    const totalTimemSaved = (roiEstimation + costReduction) * 4
    console.log({ costReduction, afterSharkdomCost })

    return setAnalyticsValue({
      currentCost,
      afterSharkdomCost,
      costReduction,
      roiEstimation,
      totalTimemSaved
    })
  }

  const tabData = [
    {
      id: 'partnership-roles',
      title: 'Partnership Roles',
      icon: '/icons/user-change.svg',
      filledIcon: '/icons/user-change-filled.svg',
      tabContent: () => (
        <div
          key={'partnership-roles'}
          className='flex w-full flex-col gap-10 bg-white  px-3 py-10 lg:px-10 '
        >
          <div className='flex flex-col gap-6'>
            <h3 className='text-sm font-semibold text-[#242424] lg:text-base'>
              Why Sharkdoms works best for Partnership Roles
            </h3>
            <ul className='w-full max-w-[273px] list-disc pl-4 text-sm/6 text-[#4D5C78]'>
              <li>Flexible workflows for partnership roles</li>
              <li>Partnership journey trail</li>
              <li>Direct communication channels</li>
              <li>Measuring partner-driven revenue</li>
            </ul>
          </div>
          <div className='flex w-full max-w-[462px] gap-4'>
            <Image
              src='/testimonials/client-1.png'
              alt=''
              width={100}
              height={100}
              className='h-fit shrink-0 overflow-hidden rounded-full bg-[#A9ADFF]'
            />
            <div className='flex flex-col gap-3'>
              <div className='flex flex-col gap-2 lg:flex-row'>
                <div className='flex gap-2'>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star
                      key={index}
                      fill='#F94F2F'
                      stroke='#F94F2F'
                      size={20}
                    />
                  ))}
                </div>

                {/* <Image
                  src='/testimonials/whalesbook.png'
                  alt=''
                  width={145}
                  height={21}
                /> */}
              </div>
              <blockquote className='text-sm font-normal text-[#4D5C78]'>
                &quot;Made it extremely easy for our small partnership team to
                keep up with our partner network expansion and maintaining the
                communication with ease&quot;
              </blockquote>
            </div>
          </div>
          <div className='mt-4 flex flex-col gap-4 lg:flex-row'>
            <Link
              href=''
              className='w-full rounded-[48px] bg-[#2748B7] px-4 py-2.5 text-center text-sm font-bold text-white lg:w-auto'
            >
              Sharkdom for PM&apos;s
            </Link>
            <Link
              href='/book-demo'
              className='w-full rounded-[48px] border border-[#151552] bg-white px-4 py-2.5 text-center text-sm font-bold text-[#151552] lg:w-auto '
            >
              Get a free demo
            </Link>
          </div>
        </div>
      )
    },
    {
      id: 'product-management',
      title: 'Product Management Roles',
      icon: '/icons/user-circle.svg',
      filledIcon: '/icons/user-circle-filled.svg',
      tabContent: () => (
        <div
          key={'product-management'}
          className='flex w-full flex-col gap-10 bg-white p-10 '
        >
          <div className='flex flex-col gap-6'>
            <h3 className='text-base font-semibold text-[#242424]'>
              Why Sharkdoms works best for Partnership Roles
            </h3>
            <ul className='max-w-[273px] list-disc pl-4 text-sm/6 text-[#4D5C78]'>
              <li>Flexible workflows for partnership roles</li>
              <li>Partnership journey trail</li>
              <li>Direct communication channels</li>
              <li>Measuring partner-driven revenue</li>
            </ul>
          </div>
          <div className='flex w-full max-w-[462px] gap-4'>
            <Image
              src='/testimonials/client-2.png'
              alt=''
              width={100}
              height={100}
              className='h-[100px] shrink-0 overflow-hidden rounded-full bg-[#A9ADFF]'
            />
            <div className='flex flex-col gap-3'>
              <div className='flex gap-2'>
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star key={index} fill='#F94F2F' stroke='#F94F2F' size={20} />
                ))}

                {/* <Image
                  src='/testimonials/whalesbook.png'
                  alt=''
                  width={145}
                  height={21}
                /> */}
              </div>
              <blockquote className='text-sm font-normal text-[#4D5C78]'>
                &quot;Having small partnership team was always havoc to do
                detail research on each potential partner which was really
                soughted ou by the platform reducing our efforts on researching
                on partnerships with lower results.&quot;
              </blockquote>
            </div>
          </div>
          <div className='flex gap-3'>
            <Link
              href=''
              className='mt-4 rounded-[48px] bg-[#2748B7] px-4 py-2.5 text-sm font-bold text-white'
            >
              Sharkdom for Product Team
            </Link>
            <Link
              href='/book-demo'
              className='mt-4 rounded-[48px] border border-[#151552] bg-white px-4 py-2.5 text-sm font-bold text-[#151552] '
            >
              Get a free demo
            </Link>
          </div>
        </div>
      )
    },
    {
      id: 'Sales-team',
      title: 'Sales Team',
      icon: '/icons/briefcase.svg',
      filledIcon: '/icons/briefcase-filled.svg',
      tabContent: () => (
        <div
          key={'sales-team'}
          className='flex w-full flex-col gap-10 bg-white p-10 '
        >
          <div className='flex flex-col gap-6'>
            <h3 className='text-base font-semibold text-[#242424]'>
              Why Sharkdoms works best for Partnership Roles
            </h3>
            <ul className='max-w-[273px] list-disc pl-4 text-sm/6 text-[#4D5C78]'>
              <li>Flexible workflows for partnership roles</li>
              <li>Partnership journey trail</li>
              <li>Direct communication channels</li>
              <li>Measuring partner-driven revenue</li>
            </ul>
          </div>
          <div className='flex w-full max-w-[462px] gap-4'>
            <Image
              src='/testimonials/client-3.png'
              alt=''
              width={100}
              height={100}
              className='h-[100px] shrink-0 overflow-hidden rounded-full bg-[#A9ADFF]'
            />
            <div className='flex flex-col gap-3'>
              <div className='flex gap-2'>
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star key={index} fill='#F94F2F' stroke='#F94F2F' size={20} />
                ))}

                {/* <Image
                  src='/testimonials/whalesbook.png'
                  alt=''
                  width={145}
                  height={21}
                /> */}
              </div>
              <blockquote className='text-sm font-normal text-[#4D5C78]'>
                &quot;Changing our GTM strategy to Partner based really helped
                us achieve 240% boost in our sales in first 3 months from bunch
                of our reliable partners within sharkdom&quot;
              </blockquote>
            </div>
          </div>
          <div className='flex gap-3'>
            <Link
              href=''
              className='mt-4 rounded-[48px] bg-[#2748B7] px-4 py-2.5 text-sm font-bold text-white'
            >
              Sharkdom for Sales Team
            </Link>
            <Link
              href='/book-demo'
              className='mt-4 rounded-[48px] border border-[#151552] bg-white px-4 py-2.5 text-sm font-bold text-[#151552] '
            >
              Get a free demo
            </Link>
          </div>
        </div>
      )
    },
    {
      id: 'growth-team',
      title: 'Growth Team',
      icon: '/icons/growth.svg',
      filledIcon: '/icons/growth-filled.svg',
      tabContent: () => (
        <div
          key={'growth-team'}
          className='flex w-full flex-col gap-10 bg-white p-10 '
        >
          <div className='flex flex-col gap-6'>
            <h3 className='text-base font-semibold text-[#242424]'>
              Why Sharkdoms works best for Partnership Roles
            </h3>
            <ul className='max-w-[273px] list-disc pl-4 text-sm/6 text-[#4D5C78]'>
              <li>Flexible workflows for partnership roles</li>
              <li>Partnership journey trail</li>
              <li>Direct communication channels</li>
              <li>Measuring partner-driven revenue</li>
            </ul>
          </div>
          <div className='flex w-full max-w-[462px] gap-4'>
            <Image
              src='/testimonials/client-4.png'
              alt=''
              width={100}
              height={100}
              className='h-[100px] shrink-0 overflow-hidden rounded-full bg-[#A9ADFF]'
            />
            <div className='flex flex-col gap-3'>
              <div className='flex gap-2'>
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star key={index} fill='#F94F2F' stroke='#F94F2F' size={20} />
                ))}

                {/* <Image
                  src='/testimonials/whalesbook.png'
                  alt=''
                  width={145}
                  height={21}
                /> */}
              </div>
              <blockquote className='text-sm font-normal text-[#4D5C78]'>
                &quot;For us finding partners that could drive our revenue and
                awareness was well soughted by Sharkdom&apos;s internal GTM
                approach solution&quot;
              </blockquote>
            </div>
          </div>
          <div className='flex gap-3'>
            <Link
              href=''
              className='mt-4 rounded-[48px] bg-[#2748B7] px-4 py-2.5 text-sm font-bold text-white'
            >
              Sharkdom for Growth Team
            </Link>
            <Link
              href='/book-demo'
              className='mt-4 rounded-[48px] border border-[#151552] bg-white px-4 py-2.5 text-sm font-bold text-[#151552] '
            >
              Get a free demo
            </Link>
          </div>
        </div>
      )
    },
    {
      id: 'Founders',
      title: 'Founders',
      icon: '/icons/founder.svg',
      filledIcon: '/icons/founder-filled.svg',
      tabContent: () => (
        <div
          key={'founders'}
          className='flex w-full flex-col gap-10 bg-white p-10 '
        >
          <div className='flex flex-col gap-6'>
            <h3 className='text-base font-semibold text-[#242424]'>
              Why Sharkdoms works best for Partnership Roles
            </h3>
            <ul className='w-full max-w-[273px] list-disc pl-4 text-sm/6 text-[#4D5C78]'>
              <li>Flexible workflows for partnership roles</li>
              <li>Partnership journey trail</li>
              <li>Direct communication channels</li>
              <li>Measuring partner-driven revenue</li>
            </ul>
          </div>
          <div className='flex w-full max-w-[462px] gap-4'>
            <Image
              src='/testimonials/client-5.png'
              alt=''
              width={100}
              height={100}
              className='h-fit shrink-0 overflow-hidden rounded-full bg-[#A9ADFF]'
            />
            <div className='flex flex-col gap-3'>
              <div className='flex gap-2'>
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star key={index} fill='#F94F2F' stroke='#F94F2F' size={20} />
                ))}

                {/* <Image
                  src='/testimonials/whalesbook.png'
                  alt=''
                  width={145}
                  height={21}
                /> */}
              </div>
              <blockquote className='text-sm font-normal text-[#4D5C78]'>
                &quot;We always had a huge entry barrier when it comes to
                communicating with our partner&apos;s team but using partner
                space and other channels did got us better results as both are
                teams were in sync&quot;
              </blockquote>
            </div>
          </div>
          <div className='flex gap-3'>
            <Link
              href=''
              className='mt-4 rounded-[48px] bg-[#2748B7] px-4 py-2.5 text-sm font-bold text-white'
            >
              Sharkdom for Founders
            </Link>
            <Link
              href='/book-demo'
              className='mt-4 rounded-[48px] border border-[#151552] bg-white px-4 py-2.5 text-sm font-bold text-[#151552] '
            >
              Get a free demo
            </Link>
          </div>
        </div>
      )
    }
  ]

  return (
    <div className='mx-auto mt-6 max-w-7xl px-2 py-6 md:px-4'>
      <p className='mb-2 text-center text-3xl font-medium text-[#1E1E1E] lg:text-4xl'>
        <span className='relative inline-block md:w-[210px] lg:w-[260px]'>
          <span className='relative z-10'> Who Can Use </span>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='319'
            height='9'
            viewBox='0 0 319 9'
            fill='none'
            className='hidden md:block lg:block'
          >
            <path
              d='M6.92114 4.52356C9.41872 4.52356 12.0352 4.47644 14.5328 4.42932C15.6032 4.42932 16.5547 4.3822 17.6251 4.3822C22.1445 4.28796 26.6639 4.19372 31.1834 4.09948C36.6543 4.00524 42.0062 3.86387 47.4771 3.76963C55.2077 3.58115 62.9383 3.43979 70.669 3.25131C72.4529 3.20419 74.2369 3.20419 76.0209 3.15707C80.5403 3.06283 85.0598 2.96859 89.5792 2.92147C94.0986 2.82722 98.6181 2.73298 103.138 2.68586C104.921 2.63874 106.705 2.59162 108.489 2.59162C115.625 2.49738 122.88 2.40314 130.016 2.3089C134.417 2.26178 138.817 2.21466 143.337 2.12042C145.121 2.12042 146.786 2.0733 148.57 2.0733C155.468 2.02618 162.485 1.97906 169.383 1.93194C176.281 1.88482 183.06 1.8377 189.958 1.79058C191.742 1.79058 193.526 1.79058 195.429 1.79058C199.949 1.79058 204.349 1.79058 208.868 1.79058C215.886 1.79058 222.784 1.79058 229.801 1.74346C232.06 1.74346 234.32 1.74346 236.58 1.74346C241.337 1.74346 246.094 1.74346 250.852 1.74346C251.208 1.74346 251.684 1.74346 252.041 1.74346C241.337 1.79058 230.514 1.8377 219.81 1.93194C215.291 1.97906 210.89 1.97906 206.371 2.02618C204.468 2.02618 202.446 2.02618 200.543 2.0733C194.002 2.12042 187.58 2.21466 181.038 2.26178C173.546 2.35602 166.053 2.40314 158.56 2.49738C157.252 2.49738 156.062 2.5445 154.754 2.5445C150.711 2.63874 146.786 2.68586 142.742 2.7801C134.655 2.92147 126.567 3.06283 118.48 3.20419C117.29 3.20419 116.101 3.25131 114.912 3.29843C110.987 3.39267 106.943 3.53403 103.019 3.62827C95.8826 3.81675 88.8656 4.00524 81.7297 4.19372C79.8267 4.24084 77.8049 4.33508 75.902 4.3822C71.3825 4.52356 66.8631 4.66492 62.3437 4.8534C56.6349 5.04188 50.8072 5.23037 45.0985 5.41885C37.13 5.70157 29.0426 5.98429 21.0741 6.26702C19.1712 6.31414 17.2683 6.40838 15.2464 6.4555C11.7974 6.59686 8.34832 6.73822 4.89928 6.87958C4.54249 6.87958 4.18569 6.97382 4.18569 7.1623C4.18569 7.30366 4.54249 7.44503 4.89928 7.44503C6.20754 7.44503 7.39687 7.49215 8.70512 7.49215C8.46726 7.72775 8.34832 7.86911 8.34832 8.01047C8.34832 8.5288 9.41872 9 10.8459 9C20.7173 8.7644 30.4698 8.48168 40.3412 8.29319C48.9043 8.15183 57.4674 7.96335 66.0306 7.82199C75.4262 7.63351 84.9408 7.44503 94.3365 7.30367C97.3098 7.25654 100.283 7.20942 103.256 7.11518C104.089 7.11518 104.922 7.06806 105.873 7.06806C121.096 6.9267 136.32 6.73822 151.543 6.59686C159.63 6.50262 167.837 6.40838 175.924 6.36126C178.897 6.31414 181.752 6.31414 184.725 6.26702C200.305 6.17277 215.886 6.07853 231.466 5.98429C238.126 5.93717 244.786 5.89005 251.446 5.84293C257.155 5.79581 262.864 5.79581 268.573 5.70157C273.33 5.65445 277.968 5.56021 282.726 5.51309C285.104 5.46597 287.483 5.46597 289.743 5.41885C295.095 5.27749 300.447 5.13613 305.798 4.99476C305.442 5.18325 305.442 5.46597 305.561 5.65445C305.68 5.89005 306.036 6.07853 306.631 6.17277C307.107 6.26702 307.82 6.36126 308.296 6.26702C309.485 6.07853 310.675 5.89005 311.745 5.70157C311.745 5.70157 311.745 5.70157 311.626 5.70157C311.745 5.70157 311.745 5.65445 311.864 5.65445C311.983 5.65445 312.102 5.60733 312.102 5.60733H311.983C312.578 5.51309 313.172 5.41885 313.886 5.27749C314.481 5.18325 315.194 5.04188 315.789 4.94764C316.502 4.80628 317.097 4.66492 317.811 4.52356C318.524 4.3822 319 4.00524 319 3.67539C319 3.48691 318.881 3.34555 318.643 3.15707C318.405 2.96859 317.811 2.73298 317.216 2.68586C316.621 2.63874 316.027 2.59162 315.432 2.59162C315.313 2.59162 315.194 2.59162 315.075 2.59162C314.718 2.59162 314.243 2.59162 313.886 2.63874C312.934 2.68586 312.102 2.73298 311.15 2.73298C310.437 2.73298 309.723 2.7801 308.891 2.7801C306.869 2.82722 304.966 2.87435 302.944 2.96859C302.468 2.96859 301.874 3.01571 301.398 3.01571C301.636 2.92147 301.755 2.82722 301.755 2.73298C301.874 2.63874 301.874 2.5445 301.874 2.45026C301.874 2.40314 301.874 2.3089 301.993 2.26178C301.993 2.16754 301.993 2.0733 301.874 2.02618C301.874 2.02618 301.993 2.02618 301.993 1.97906C302.349 1.88482 302.706 1.79058 302.944 1.60209C303.182 1.46073 303.301 1.27225 303.301 1.08377C303.301 0.895288 303.182 0.753927 302.944 0.565445C302.825 0.518325 302.706 0.424084 302.587 0.376963C302.23 0.235602 301.874 0.188482 301.517 0.141361C300.803 0.0471204 299.971 0 299.138 0C298.425 0 297.83 0 297.116 0C296.165 0 295.213 0 294.262 0C292.954 0 291.527 0 290.218 0C286.65 0 283.082 0 279.514 0C276.184 0 272.735 0 269.405 0C266.313 0 263.34 0 260.247 0C247.997 0 235.866 0.0471204 223.616 0.0942408C214.458 0.141361 205.301 0.188482 196.143 0.188482C192.099 0.188482 187.936 0.235602 183.893 0.282723C174.735 0.376963 165.577 0.424084 156.419 0.518325C153.803 0.518325 151.186 0.565445 148.57 0.565445C147.024 0.565445 145.596 0.612565 144.05 0.612565C135.011 0.753927 125.973 0.895288 116.934 1.03665C114.198 1.08377 111.463 1.13089 108.608 1.17801C107.062 1.17801 105.516 1.22513 103.97 1.27225C94.9312 1.46073 86.0112 1.64921 76.9724 1.8377C72.334 1.93194 67.6956 2.02618 63.0573 2.16754C55.0888 2.35602 47.1203 2.5445 39.2708 2.7801C32.3727 2.96859 25.4746 3.10995 18.5765 3.25131C17.5061 3.29843 16.4357 3.29843 15.2464 3.34555C13.4624 3.39267 11.6784 3.39267 9.89445 3.43979C8.34832 3.62827 6.68327 3.62827 5.13715 3.62827C5.01822 3.43979 4.54249 3.29843 4.18569 3.34555C3.1153 3.34555 2.16384 3.39267 1.09344 3.43979C0.617713 3.48691 0.141983 3.58115 0.0230509 3.76963C-0.0958816 4.00524 0.260916 4.24084 0.736646 4.28796C1.21238 4.33508 1.68811 4.3822 2.16384 4.42932C2.63957 4.47644 2.99636 4.47644 3.47209 4.47644C4.66142 4.52356 5.73181 4.52356 6.92114 4.52356ZM285.223 3.01571C286.65 3.01571 288.196 3.01571 289.624 3.01571C289.743 3.15707 289.98 3.25131 290.218 3.34555C289.624 3.34555 289.029 3.39267 288.553 3.39267C287.483 3.39267 286.412 3.43979 285.342 3.43979C280.585 3.48691 275.946 3.58115 271.189 3.62827C269.048 3.67539 266.908 3.72251 264.767 3.72251C261.437 3.72251 257.988 3.76963 254.658 3.76963C246.927 3.81675 239.315 3.86387 231.585 3.91099C216.599 4.00524 201.733 4.09948 186.747 4.19372C176.043 4.24084 165.339 4.3822 154.635 4.52356C138.579 4.71204 122.405 4.8534 106.349 5.04188C103.138 5.089 99.9263 5.13613 96.7152 5.23037C87.5574 5.41885 78.3996 5.56021 69.2418 5.74869C60.3218 5.93717 51.283 6.07853 42.363 6.26702C41.5305 6.26702 40.698 6.31414 39.8654 6.31414C42.2441 6.2199 44.7417 6.17277 47.1203 6.07853C55.5645 5.84293 64.0087 5.56021 72.4529 5.32461C75.4262 5.23037 78.3996 5.13613 81.2539 5.04188C82.8001 4.99476 84.3462 4.94764 85.7734 4.94764C94.6933 4.75916 103.494 4.52356 112.295 4.33508C113.96 4.28796 115.744 4.24084 117.409 4.19372C119.907 4.1466 122.405 4.09948 124.783 4.09948C133.822 3.95812 142.861 3.81675 151.9 3.67539C153.922 3.62827 155.944 3.62827 157.846 3.58115C158.322 3.58115 158.917 3.58115 159.393 3.58115C160.82 3.58115 162.247 3.58115 163.555 3.53403C172.594 3.43979 181.752 3.39267 190.791 3.29843C194.953 3.25131 199.116 3.20419 203.279 3.20419C216.718 3.15707 230.276 3.10995 243.716 3.06283C257.75 3.06283 271.546 3.01571 285.223 3.01571Z'
              fill='#5B76FF'
            />
          </svg>
        </span>
        <span className='font-semibold text-[#6366F1]'>Sharkdom?</span>
      </p>

      <p className='mx-auto mb-8 text-center text-base/[24px] text-[#9CA3AF]'>
        Seamless partner pipeline, built for every role.
      </p>
      {/* First row: 2 cards */}
      <div className='mb-5 grid grid-cols-1 gap-5 md:grid-cols-[2fr_3fr]'>
        {roles.slice(0, 2).map((role, idx) => (
          <Link href={role.redirect} key={role.title} className='h-full'>
            <div
              className={`group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white 
          bg-cover bg-center p-6 text-[#151552] transition-all duration-200 hover:border-transparent hover:text-white md:p-8`}
            >
              {/* Background Image */}
              <div className='absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100'>
                <Image
                  src={role.bgImage}
                  alt={`${role.title} background`}
                  fill
                  className='object-cover'
                />
              </div>

              {/* Icon + Title */}
              <div className='relative z-10 mb-2 flex items-center gap-3'>
                <Image
                  src={role.icon}
                  alt={role.title}
                  width={32}
                  height={32}
                  className='shrink-0 group-hover:hidden'
                />
                <Image
                  src={role.activeIcon}
                  alt={role.title}
                  width={32}
                  height={32}
                  className='hidden shrink-0 group-hover:block'
                />
                <span className='text-lg font-semibold md:text-xl'>
                  {role.title}
                </span>
              </div>

              {/* Description */}
              <div className='relative z-10 mb-2 text-sm'>
                {role.description}
              </div>

              {/* Arrow */}
              <span
                className={`group relative z-10 flex w-16 items-center justify-center rounded-3xl border border-[#726EE3] p-1 transition-colors duration-200 group-hover:border-white group-hover:text-white ${
                  idx === 0
                    ? 'text-white'
                    : 'text-[#736FE3] group-hover:text-white'
                }`}
              >
                <a href='#' className='flex items-center justify-center'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='24'
                    height='24'
                    viewBox='0 0 24 24'
                    fill='none'
                    className='stroke-[#726EE3] transition-colors duration-200 group-hover:stroke-white'
                  >
                    <path
                      d='M18.25 13.5V5.75M18.25 5.75H10.5M18.25 5.75L6.5 17.5'
                      strokeWidth='1.5'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                  </svg>
                </a>
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* Second row: 3 cards */}
      <div className='grid grid-cols-1 gap-5 md:grid-cols-3'>
        {roles.slice(2).map((role) => (
          <Link href={role.redirect} key={role.title}>
            <div
              key={role.title}
              className='group relative flex min-h-[170px] flex-col justify-between overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white p-6 text-[#151552] transition-all duration-200 hover:border-transparent hover:text-white md:p-8'
            >
              {/* Background Image */}
              <div className='absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100'>
                <Image
                  src={role.bgImage}
                  alt={`${role.title} background`}
                  fill
                  className='object-cover'
                />
                {/* <div className='absolute inset-0 bg-[#2563EB]/90' /> */}
              </div>

              <div className='relative z-10 mb-2 flex items-center gap-3'>
                <Image
                  src={role.icon}
                  alt={role.title}
                  width={32}
                  height={32}
                  className='shrink-0 group-hover:hidden'
                />
                <Image
                  src={role.activeIcon}
                  alt={role.title}
                  width={32}
                  height={32}
                  className='hidden shrink-0 group-hover:block'
                />
                <span className='text-lg font-semibold md:text-xl'>
                  {role.title}
                </span>
              </div>
              <div className='relative z-10 mb-2 text-sm'>
                {role.description}
              </div>
              <span className='group relative z-10 flex  w-16 items-center justify-center rounded-3xl border border-[#726EE3] p-1 transition-colors duration-200 group-hover:border-white group-hover:text-white'>
                <a href='#' className='flex items-center justify-center'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='24'
                    height='24'
                    viewBox='0 0 24 24'
                    fill='none'
                    className='stroke-[#726EE3] transition-colors duration-200 group-hover:stroke-white'
                  >
                    <path
                      d='M18.25 13.5V5.75M18.25 5.75H10.5M18.25 5.75L6.5 17.5'
                      strokeWidth='1.5'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                  </svg>
                </a>
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Calculate
