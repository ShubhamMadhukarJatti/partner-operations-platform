import React from 'react'

export interface DynamicIconProps {
  color?: string
  size?: number // base width in px (keeps original aspect ratio)
  className?: string
  variant?: string // pass "current" to make stroke white
}

export const CurrentInActiveStateIcon: React.FC<DynamicIconProps> = ({
  color = '#6863FB',
  size = 16,
  className = '',
  variant
}) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={size}
      height={16}
      viewBox='0 0 27 24'
      fill='none'
      className={className}
      aria-hidden
    >
      <path
        d='M13.5 1.63672L1.5 22.364H25.5L13.5 1.63672Z'
        stroke='#6863FB'
        strokeWidth={2.18182}
        strokeLinejoin='round'
        fill='none'
      />
      <path
        d='M13.5 18.0007V18.5462M13.5 9.27344L13.5044 14.728'
        stroke='#6863FB'
        strokeWidth={2.18182}
        strokeLinecap='round'
        fill='none'
      />
    </svg>
  )
}

export const CurrentActiveStateIcon: React.FC<DynamicIconProps> = ({
  color = '#6863FB',
  size = 16,
  className = '',
  variant
}) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={size}
      height={16}
      viewBox='0 0 27 24'
      fill='none'
      className={className}
      aria-hidden
    >
      <path
        d='M13.5 1.63672L1.5 22.364H25.5L13.5 1.63672Z'
        stroke='#fff'
        strokeWidth={2.18182}
        strokeLinejoin='round'
        fill='none'
      />
      <path
        d='M13.5 18.0007V18.5462M13.5 9.27344L13.5044 14.728'
        stroke='#fff'
        strokeWidth={2.18182}
        strokeLinecap='round'
        fill='none'
      />
    </svg>
  )
}

export const StarActiveIcon: React.FC<DynamicIconProps> = ({
  color = '#6863FB',
  size = 16,
  className = '',
  variant
}) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='16'
      height='16'
      viewBox='0 0 25 24'
      fill='none'
    >
      <path
        d='M11.7005 0.560948C11.7602 0.396578 11.869 0.254562 12.0122 0.1542C12.1554 0.0538391 12.326 0 12.5009 0C12.6757 0 12.8463 0.0538391 12.9895 0.1542C13.1327 0.254562 13.2415 0.396578 13.3012 0.560948L14.1152 2.7849C14.7535 4.52835 15.7644 6.11165 17.0772 7.42449C18.3901 8.73734 19.9734 9.74816 21.7168 10.3865L23.9391 11.2005C24.1034 11.2602 24.2454 11.369 24.3458 11.5122C24.4462 11.6554 24.5 11.826 24.5 12.0009C24.5 12.1757 24.4462 12.3463 24.3458 12.4895C24.2454 12.6327 24.1034 12.7415 23.9391 12.8012L21.7168 13.6152C19.9734 14.2535 18.3901 15.2644 17.0772 16.5772C15.7644 17.8901 14.7535 19.4734 14.1152 21.2168L13.3012 23.4391C13.2415 23.6034 13.1327 23.7454 12.9895 23.8458C12.8463 23.9462 12.6757 24 12.5009 24C12.326 24 12.1554 23.9462 12.0122 23.8458C11.869 23.7454 11.7602 23.6034 11.7005 23.4391L10.8865 21.2168C10.2482 19.4734 9.23734 17.8901 7.92449 16.5772C6.61165 15.2644 5.02835 14.2535 3.2849 13.6152L1.06095 12.8012C0.896578 12.7415 0.754562 12.6327 0.6542 12.4895C0.553839 12.3463 0.5 12.1757 0.5 12.0009C0.5 11.826 0.553839 11.6554 0.6542 11.5122C0.754562 11.369 0.896578 11.2602 1.06095 11.2005L3.2849 10.3865C5.02835 9.74816 6.61165 8.73734 7.92449 7.42449C9.23734 6.11165 10.2482 4.52835 10.8865 2.7849L11.7005 0.560948Z'
        fill='white'
      />
    </svg>
  )
}
export const StarInActiveIcon: React.FC<DynamicIconProps> = ({}) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='16'
      height='16'
      viewBox='0 0 25 24'
      fill='none'
    >
      <path
        d='M11.7005 0.560948C11.7602 0.396578 11.869 0.254562 12.0122 0.1542C12.1554 0.0538391 12.326 0 12.5009 0C12.6757 0 12.8463 0.0538391 12.9895 0.1542C13.1327 0.254562 13.2415 0.396578 13.3012 0.560948L14.1152 2.7849C14.7535 4.52835 15.7644 6.11165 17.0772 7.42449C18.3901 8.73734 19.9734 9.74816 21.7168 10.3865L23.9391 11.2005C24.1034 11.2602 24.2454 11.369 24.3458 11.5122C24.4462 11.6554 24.5 11.826 24.5 12.0009C24.5 12.1757 24.4462 12.3463 24.3458 12.4895C24.2454 12.6327 24.1034 12.7415 23.9391 12.8012L21.7168 13.6152C19.9734 14.2535 18.3901 15.2644 17.0772 16.5772C15.7644 17.8901 14.7535 19.4734 14.1152 21.2168L13.3012 23.4391C13.2415 23.6034 13.1327 23.7454 12.9895 23.8458C12.8463 23.9462 12.6757 24 12.5009 24C12.326 24 12.1554 23.9462 12.0122 23.8458C11.869 23.7454 11.7602 23.6034 11.7005 23.4391L10.8865 21.2168C10.2482 19.4734 9.23734 17.8901 7.92449 16.5772C6.61165 15.2644 5.02835 14.2535 3.2849 13.6152L1.06095 12.8012C0.896578 12.7415 0.754562 12.6327 0.6542 12.4895C0.553839 12.3463 0.5 12.1757 0.5 12.0009C0.5 11.826 0.553839 11.6554 0.6542 11.5122C0.754562 11.369 0.896578 11.2602 1.06095 11.2005L3.2849 10.3865C5.02835 9.74816 6.61165 8.73734 7.92449 7.42449C9.23734 6.11165 10.2482 4.52835 10.8865 2.7849L11.7005 0.560948Z'
        fill='#6863FB'
      />
    </svg>
  )
}
export const ManualOnboarding: React.FC<DynamicIconProps> = ({}) => {
  return (
    <svg
      width='105'
      height='104'
      viewBox='0 0 105 104'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      //   xmlns:xlink='http://www.w3.org/1999/xlink'
    >
      <rect
        x='1.5'
        y='1'
        width='102'
        height='102'
        rx='51'
        fill='#FEF2F2'
        stroke='#FE7D82'
        strokeWidth='2'
      />
      <rect
        x='24.5'
        y='24'
        width='56'
        height='56'
        fill='url(#pattern0_2539_60946)'
      />
      <defs>
        <pattern
          id='pattern0_2539_60946'
          patternContentUnits='objectBoundingBox'
          width='1'
          height='1'
        >
          {/* <use xlink:href='#image0_2539_60946' transform='scale(0.00195312)' /> */}
        </pattern>
        <image
          id='image0_2539_60946'
          width='512'
          height='512'
          preserveAspectRatio='none'
        />
      </defs>
    </svg>
  )
}

export const SharkDomAutomation: React.FC<DynamicIconProps> = ({}) => {
  return (
    <svg
      width='105'
      height='104'
      viewBox='0 0 105 104'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      //   xmlns:xlink='http://www.w3.org/1999/xlink'
    >
      <rect
        x='1.5'
        y='1'
        width='102'
        height='102'
        rx='51'
        fill='#EDFFF4'
        stroke='#5DF29A'
        strokeWidth='2'
      />
      <rect
        x='24.5'
        y='24'
        width='56'
        height='56'
        fill='url(#pattern0_2708_59115)'
      />
      <defs>
        <pattern
          id='pattern0_2708_59115'
          patternContentUnits='objectBoundingBox'
          width='1'
          height='1'
        ></pattern>
        <image
          id='image0_2708_59115'
          width='512'
          height='512'
          preserveAspectRatio='none'
        />
      </defs>
    </svg>
  )
}
