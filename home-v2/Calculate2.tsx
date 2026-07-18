'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import MaxWidthWrapper from '@/components/ui/max-width-wrapper'
import { Slider } from '@/components/ui/slider'
import { BorderBeam } from '@/components/magicui/border-beam'

// Utility function to format currency values
const formatCurrency = (value: number): string => {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`
  } else if (value >= 1000) {
    return `$${(value / 1000).toFixed(1)}K`
  } else {
    return `$${value.toLocaleString()}`
  }
}

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
    handleChange(val)
  }
  return (
    <div className='flex flex-col gap-2'>
      <div className='mb-1 flex items-center justify-between'>
        <span className='text-sm font-medium text-[#1B1D21]'>{title}</span>
        <div className='inline-flex items-center rounded border border-[#E5E7EB] px-2 py-1'>
          <Input
            type='number'
            value={value as any}
            onChange={handleInputChange}
            className='w-16 min-w-[3.5rem] bg-transparent text-right text-sm font-medium text-[#000000] focus:outline-none'
            aria-label='amount'
          />

          <span className='text-sm font-medium'>{maxValue()?.format}</span>
        </div>
      </div>
      <Slider
        onValueChange={(val) => handleChange(val[0])}
        value={[value]}
        defaultValue={[0]}
        min={maxValue()?.min}
        max={maxValue()?.max}
        step={1}
        className={cn('w-full')}
        // className={cn('w-full [&_.slider-track]:bg-[#E5E7EB] [&_.slider-range]:bg-[#00AD3C] [&_[role=slider]]:bg-[#00AD3C] [&_span[data-orientation=horizontal]]:bg-[#00AD3C]')}
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

const Calculate2 = () => {
  const [values, setValues] = useState<CalculateValueType>({
    workHours: 12,
    cost: 100,
    activePartners: 6,
    efficiency: 2
  })
  const [analyticsValue, setAnalyticsValue] = useState({
    currentCost: 0,
    afterSharkdomCost: 0,
    roiEstimation: 0,
    totalTimemSaved: 0,
    costReduction: 0
  })

  const calculateValues = (values: CalculateValueType) => {
    const workHours = values.workHours || 1
    const cost = values.cost || 1
    const activePartners = values.activePartners || 1
    const efficiency = values.efficiency || 1

    // Calculate current cost based on manual work
    const currentCost =
      ((workHours / 2) * cost * activePartners * efficiency) / 1.73

    // Calculate after Sharkdom cost (more efficient - using deterministic factor)
    const efficiencyFactor = 2.5 + efficiency / 10 // More partners = better efficiency
    const afterSharkdomCost = currentCost / efficiencyFactor

    // Calculate cost reduction percentage
    const costReduction =
      ((currentCost - afterSharkdomCost) / currentCost) * 100

    // Calculate ROI estimation (based on cost reduction and efficiency)
    const roiEstimation = (costReduction / 100) * 300 + efficiency * 5

    // Calculate time saved (based on efficiency gains and work hours)
    const totalTimemSaved = workHours * (efficiency / 5) + activePartners * 2

    return {
      currentCost: Math.round(currentCost),
      afterSharkdomCost: Math.round(afterSharkdomCost),
      costReduction: Math.round(costReduction),
      roiEstimation: Math.round(roiEstimation),
      totalTimemSaved: Math.round(totalTimemSaved)
    }
  }

  const handleGetStarted = (values: CalculateValueType) => {
    const newAnalytics = calculateValues(values)
    setAnalyticsValue(newAnalytics)
  }

  // Auto-calculate when values change
  useEffect(() => {
    const newAnalytics = calculateValues(values)
    setAnalyticsValue(newAnalytics)
  }, [values])

  return (
    <div className='mx-auto  max-w-7xl py-6'>
      <p className='mb-2 text-center text-3xl font-medium text-[#1E1E1E] lg:text-4xl'>
        See How Much You Can{' '}
        <span className='relative inline-block md:w-[300px] lg:w-[360px]'>
          <span className='relative z-10'>Save with Sharkdom</span>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='360'
            height='9'
            viewBox='0 0 458 9'
            fill='none'
            className='hidden md:block lg:block'
          >
            <path
              d='M9.91907 3.90622C13.4979 3.92027 17.2473 3.88787 20.8262 3.85481C22.36 3.86083 23.7235 3.81906 25.2573 3.82509C31.7336 3.75628 38.2098 3.68747 44.6861 3.61866C52.5257 3.5552 60.1951 3.44395 68.0347 3.3805C79.1127 3.23551 90.1904 3.13765 101.268 2.99267C103.825 2.95559 106.381 2.96562 108.938 2.92854C115.414 2.85973 121.89 2.79092 128.366 2.76923C134.842 2.70042 141.319 2.63161 147.795 2.60992C150.351 2.57284 152.908 2.53576 155.464 2.54579C165.69 2.49171 176.085 2.43829 186.311 2.3842C192.617 2.36184 198.922 2.33948 205.399 2.27067C207.955 2.28071 210.341 2.24296 212.897 2.25299C222.782 2.24469 232.836 2.23705 242.721 2.22874C252.605 2.22044 262.319 2.21146 272.204 2.20315C274.76 2.21319 277.316 2.22323 280.043 2.23394C286.519 2.25937 292.824 2.28413 299.3 2.30956C309.355 2.34904 319.239 2.38785 329.294 2.38022C332.532 2.39293 335.77 2.40565 339.008 2.41836C345.825 2.44513 352.642 2.4719 359.458 2.49867C359.97 2.50067 360.651 2.50335 361.162 2.50536C345.825 2.49225 330.316 2.47847 314.978 2.51248C308.502 2.53417 302.197 2.50941 295.721 2.5311C292.994 2.5204 290.097 2.50902 287.37 2.54543C277.997 2.55575 268.794 2.61385 259.421 2.62417C248.684 2.67625 237.947 2.68121 227.211 2.73329C225.336 2.72593 223.632 2.76635 221.757 2.75899C215.962 2.83048 210.338 2.85552 204.544 2.927C192.955 3.02286 181.366 3.11871 169.777 3.21457C168.073 3.20787 166.368 3.2483 164.664 3.28873C159.04 3.36089 153.245 3.4795 147.621 3.55165C137.395 3.69998 127.339 3.84898 117.114 3.99731C114.387 4.03372 111.489 4.11658 108.762 4.153C102.286 4.26893 95.8094 4.38486 89.3328 4.54791C81.152 4.70427 72.8007 4.85995 64.6199 5.01631C53.2007 5.2542 41.6112 5.49141 30.192 5.7293C27.4651 5.76571 24.7381 5.84924 21.8408 5.88498C16.8981 6.00694 11.9554 6.12889 7.0127 6.25084C6.50145 6.24884 5.98982 6.34107 5.98908 6.52955C5.98853 6.67091 6.49923 6.81428 7.01048 6.81629C8.88509 6.82365 10.5891 6.87746 12.4637 6.88482C12.1219 7.11908 11.951 7.25977 11.9504 7.40113C11.9484 7.91945 13.4803 8.39668 15.5253 8.40471C29.671 8.22465 43.6464 7.99681 57.7919 7.86387C70.0626 7.77069 82.3334 7.63039 94.6041 7.53722C108.068 7.4016 121.702 7.26666 135.166 7.17816C139.426 7.14777 143.687 7.11738 147.948 7.03987C149.141 7.04456 150.334 7.00212 151.697 7.00748C173.511 6.95177 195.326 6.84895 217.14 6.79325C228.729 6.74451 240.488 6.69645 252.077 6.69483C256.337 6.66444 260.427 6.68051 264.688 6.65012C287.013 6.64354 309.338 6.63697 331.663 6.63039C341.207 6.62075 350.751 6.6111 360.294 6.60146C368.475 6.58646 376.655 6.61858 384.835 6.55646C391.652 6.53611 398.299 6.46797 405.116 6.44762C408.524 6.41388 411.933 6.42726 415.171 6.39286C422.84 6.28161 430.51 6.17037 438.179 6.05912C437.667 6.24559 437.666 6.52831 437.835 6.71746C438.005 6.95373 438.515 7.14422 439.367 7.24181C440.048 7.33872 441.071 7.43698 441.753 7.34542C443.458 7.16363 445.163 6.98184 446.697 6.79938C446.697 6.79938 446.697 6.79938 446.527 6.79871C446.697 6.79938 446.697 6.75226 446.868 6.75293C447.038 6.7536 447.209 6.70715 447.209 6.70715L447.038 6.70648C447.891 6.61558 448.743 6.52469 449.766 6.38735C450.619 6.29645 451.642 6.15911 452.494 6.06821C453.517 5.93087 454.37 5.79285 455.393 5.65551C456.416 5.51816 457.099 5.14388 457.101 4.81404C457.101 4.62556 456.931 4.48353 456.591 4.29371C456.251 4.10389 455.4 3.86495 454.548 3.81448C453.696 3.76401 452.844 3.71355 451.992 3.7102C451.822 3.70953 451.651 3.70886 451.481 3.70819C450.97 3.70619 450.288 3.70351 449.777 3.74862C448.413 3.79039 447.22 3.83282 445.857 3.82747C444.834 3.82346 443.811 3.86656 442.618 3.86188C439.721 3.89762 436.994 3.93403 434.097 4.0169C433.415 4.01422 432.563 4.05799 431.881 4.05532C432.222 3.96242 432.393 3.86884 432.394 3.7746C432.564 3.68103 432.565 3.58679 432.565 3.49255C432.565 3.44543 432.566 3.35119 432.736 3.30474C432.737 3.2105 432.737 3.11626 432.567 3.06847C432.567 3.06847 432.737 3.06914 432.737 3.02202C433.249 2.92979 433.761 2.83756 434.102 2.65042C434.444 2.51039 434.615 2.32258 434.615 2.1341C434.616 1.94562 434.446 1.80359 434.106 1.61377C433.936 1.56598 433.766 1.47108 433.596 1.42329C433.085 1.27992 432.574 1.23079 432.063 1.18166C431.041 1.08341 429.848 1.0316 428.655 1.02692C427.633 1.0229 426.78 1.01956 425.758 1.01554C424.395 1.01019 423.031 1.00484 421.668 0.999482C419.793 0.99212 417.748 0.98409 415.874 0.976729C410.761 0.956653 405.649 0.936577 400.536 0.916501C395.764 0.897763 390.822 0.878356 386.05 0.859619C381.62 0.84222 377.359 0.825489 372.928 0.80809C355.375 0.739163 337.992 0.718024 320.439 0.696217C307.317 0.691808 294.194 0.6874 281.072 0.635871C275.278 0.613119 269.313 0.636817 263.518 0.661184C250.396 0.703896 237.273 0.699487 224.151 0.742199C220.402 0.727477 216.652 0.759874 212.903 0.745152C210.688 0.736452 208.642 0.775542 206.427 0.766842C193.475 0.857343 180.522 0.947844 167.57 1.03834C163.65 1.07007 159.73 1.1018 155.64 1.13286C153.425 1.12416 151.209 1.16258 148.993 1.201C136.041 1.33862 123.259 1.47691 110.306 1.61453C103.659 1.68268 97.0127 1.75082 90.3658 1.86608C78.9471 2.00972 67.5283 2.15337 56.2797 2.3448C46.3947 2.49447 36.5099 2.59701 26.6251 2.69956C25.0911 2.74066 23.5574 2.73463 21.853 2.77506C19.2965 2.81214 16.7403 2.80211 14.1838 2.83919C11.9676 3.01897 9.58175 3.0096 7.36631 3.0009C7.19663 2.81175 6.51551 2.66771 6.00407 2.71283C4.4703 2.7068 3.10677 2.74857 1.57282 2.78967C0.890961 2.83411 0.208917 2.92567 0.0377584 3.11348C-0.133585 3.34842 0.376745 3.58602 1.05823 3.63582C1.73972 3.68562 2.42121 3.73541 3.1027 3.78521C3.78419 3.83501 4.29545 3.83702 4.97712 3.83969C6.68112 3.8935 8.21489 3.89953 9.91907 3.90622ZM408.704 3.96431C410.749 3.97234 412.965 3.98104 415.01 3.98907C415.18 4.1311 415.52 4.22667 415.861 4.32225C415.008 4.31891 414.156 4.36268 413.474 4.36C411.941 4.35398 410.407 4.39508 408.873 4.38906C402.056 4.40941 395.409 4.47755 388.592 4.4979C385.525 4.53298 382.457 4.56805 379.39 4.556C374.618 4.53727 369.675 4.56498 364.904 4.54624C353.826 4.54986 342.919 4.55416 331.842 4.55778C310.369 4.5677 289.066 4.57829 267.593 4.58821C252.255 4.5751 236.917 4.65623 221.579 4.73737C198.572 4.8355 175.394 4.88585 152.387 4.98399C147.785 5.01304 143.184 5.04209 138.582 5.11827C125.459 5.25522 112.337 5.34505 99.2135 5.482C86.4314 5.62029 73.4791 5.71079 60.6969 5.84908C59.504 5.8444 58.3109 5.88683 57.118 5.88215C60.5267 5.80129 64.1057 5.76823 67.5144 5.68737C79.615 5.49928 91.7159 5.26408 103.817 5.07599C108.077 4.99848 112.338 4.92097 116.429 4.84279C118.644 4.80437 120.86 4.76595 122.905 4.77398C135.687 4.63569 148.299 4.44961 160.911 4.31065C163.297 4.2729 165.853 4.23582 168.239 4.19807C171.818 4.165 175.397 4.13193 178.805 4.14532C191.758 4.05481 204.71 3.96431 217.663 3.87381C220.56 3.83807 223.457 3.84945 226.184 3.81303C226.865 3.81571 227.718 3.81906 228.399 3.82173C230.444 3.82976 232.489 3.83779 234.364 3.79803C247.316 3.75465 260.439 3.75906 273.391 3.71568C279.356 3.69198 285.321 3.66828 291.285 3.69171C310.543 3.72021 329.971 3.74938 349.228 3.77788C369.337 3.85684 389.106 3.88735 408.704 3.96431Z'
              fill='#5B76FF'
            />
          </svg>
        </span>
      </p>

      <p className='mx-auto mb-8 text-center text-base/[24px] text-[#9CA3AF]'>
        Discover how our platform streamlines and tracks your
        partnerships—saving time and money.
      </p>

      <div className='flex flex-col gap-8  bg-white p-4  md:flex-row md:p-10'>
        {/* Left: Sliders */}
        <div className='hover-scale-smooth flex flex-[2] flex-col justify-between gap-10 rounded-2xl border border-[#E5E7EB] p-8'>
          <div className='flex flex-col gap-12 pt-2'>
            <ValueItem
              sliderValueType='workHours'
              title={'Manual work hours spent on partner management'}
              value={values.workHours}
              handleChange={(val) => setValues({ ...values, workHours: val })}
            />
            <ValueItem
              sliderValueType='cost'
              title={'Costs of multiple tools'}
              value={values.cost}
              handleChange={(val) => setValues({ ...values, cost: val })}
            />
            <ValueItem
              sliderValueType='activePartners'
              title={'Number of active partnerships'}
              value={values.activePartners}
              handleChange={(val) =>
                setValues({ ...values, activePartners: val })
              }
            />
            <ValueItem
              sliderValueType='efficiency'
              title={'Size of your partnership team'}
              value={values.efficiency}
              handleChange={(val) => setValues({ ...values, efficiency: val })}
            />
          </div>
          <div className='mt-6 flex flex-col gap-4  md:flex-row'>
            {/* <Button
              onClick={() => handleGetStarted(values)}
              className='justify-center rounded-full bg-[#6863FB] px-6 py-2.5 text-sm font-semibold text-white '
              type='button'
            >
              Talk to an Expert
            </Button> */}
            <Link
              href='/book-demo'
              className='justify-center rounded-full bg-[#6863FB] px-6 py-2.5 text-sm font-semibold text-white '
            >
              Talk to an Expert
            </Link>
          </div>
        </div>
        {/* Right: Chart and Stats */}
        <div className='flex flex-[1] flex-col justify-between gap-6 md:pl-8'>
          <div className='mx-auto max-w-xs'>
            {/* Outer purple background */}
            <div className='hover-scale-smooth space-y-3 rounded-2xl bg-[#6863FB] px-4 py-5'>
              {/* Costs Section */}
              <div className='rounded-lg bg-white px-4 py-5'>
                <div className='flex items-start justify-between'>
                  {/* Current cost */}
                  <div className='flex flex-1 flex-col items-center border-r-[2px] border-dashed border-[#E5E7EB] pr-3'>
                    <span className='text-lg'>😌</span>
                    <span className='mt-1 text-xs text-[#6B6B6B]'>
                      Current cost
                    </span>
                    <span className='mt-1 text-2xl font-semibold text-[#111827]'>
                      {formatCurrency(analyticsValue.currentCost)}
                    </span>
                  </div>

                  {/* After Sharkdom */}
                  <div className='flex flex-1 flex-col items-center pl-3'>
                    <span className='text-lg'>🤩</span>
                    <span className='mt-1 text-xs text-[#6B6B6B]'>
                      After sharkdom
                    </span>
                    <span className='mt-1 text-2xl font-semibold text-[#2563EB]'>
                      {formatCurrency(analyticsValue.afterSharkdomCost)}
                    </span>
                    <span className='mt-2 bg-[#119F0A] px-3 py-1 text-xs font-semibold text-white'>
                      Save {analyticsValue.costReduction}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Time Saved */}
              <div className='rounded-lg bg-white px-4 py-5 text-center'>
                <div className='text-xs'>TIME SAVED</div>
                <div className='mt-1 text-xl font-semibold text-[#2563EB]'>
                  {analyticsValue.totalTimemSaved} hrs
                </div>
              </div>

              {/* ROI */}
              <div className='rounded-lg bg-white px-4 py-5 text-center'>
                <div className='text-xs'>
                  ROI ESTIMATION VIA PARTNER CHANNELS
                </div>
                <div className='mt-1 text-xl font-semibold text-[#2563EB]'>
                  {analyticsValue.roiEstimation}%
                </div>
              </div>

              {/* Cost Reduction */}
              <div className='rounded-lg bg-white px-4 py-5 text-center'>
                <div className='text-xs'>COST REDUCTION</div>
                <div className='mt-1 text-xl font-semibold text-[#2563EB]'>
                  {analyticsValue.costReduction}%
                </div>
              </div>
            </div>
          </div>
        </div>

        {false && (
          <div className='flex flex-1 flex-col justify-between gap-6 md:pl-8'>
            {/* Bar Chart */}
            <div className='mb-2 flex h-[180px] flex-col items-center justify-center'>
              <div className='flex w-full items-end justify-center gap-8'>
                {/* Current cost bar */}
                <div className='flex flex-col items-center'>
                  <span className='mb-2 text-sm font-semibold text-[#A0A0A0]'>
                    {formatCurrency(analyticsValue.currentCost)}
                  </span>
                  <div className='h-[110px] w-12 rounded-t-lg bg-[#E5E7EB]' />
                </div>
                {/* After Sharkdom bar */}
                <div className='flex flex-col items-center'>
                  <span className='mb-2 text-sm font-semibold text-[#00AD3C]'>
                    {formatCurrency(analyticsValue.afterSharkdomCost)}
                  </span>
                  <div className='h-[65px] w-12 rounded-t-lg bg-[#2563EB]' />
                </div>
              </div>
              {/* Legend */}
              <div className='mt-4 flex justify-center gap-6'>
                <div className='flex items-center gap-2 text-xs text-[#A0A0A0]'>
                  <span className='inline-block h-4 w-4 rounded bg-[#E5E7EB]' />{' '}
                  Current cost
                </div>
                <div className='flex items-center gap-2 text-xs text-[#00AD3C]'>
                  <span className='inline-block h-4 w-4 rounded bg-[#2563EB]' />{' '}
                  After Sharkdom
                </div>
              </div>
            </div>
            {/* Stats */}
            <div className='mt-2 flex flex-col gap-2'>
              <div className='flex justify-between py-1 text-sm'>
                <span className='text-[#A0A0A0]'>Total time saved</span>
                <span className='font-bold text-[#151552]'>
                  {analyticsValue.totalTimemSaved} hrs
                </span>
              </div>
              <div className='flex justify-between py-1 text-sm'>
                <span className='text-[#A0A0A0]'>
                  ROI estimation via partner channels
                </span>
                <span className='font-bold text-[#151552]'>
                  {analyticsValue.roiEstimation}%
                </span>
              </div>
              <div className='flex justify-between py-1 text-sm'>
                <span className='text-[#A0A0A0]'>Cost reduction</span>
                <span className='font-bold text-[#151552]'>
                  {analyticsValue.costReduction}%
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Calculate2
