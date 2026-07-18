'use client'

const OPTIONS = ['1 Week', '15 days', '30 days', '90 days'] as const

export type FrequencyOption = (typeof OPTIONS)[number]

type RefreshFrequencyProps = {
  value?: FrequencyOption
  onChange?: (val: FrequencyOption) => void
}

export default function RefreshFrequency({
  value = '1 Week',
  onChange
}: RefreshFrequencyProps) {
  return (
    <div className='flex flex-col gap-3'>
      <p className='text-sm font-normal text-[#2C3853]'>
        How frequently do you want the data to be refreshed?{' '}
        <span className='text-red-500'>*</span>
      </p>
      <div className='flex items-center gap-6'>
        {OPTIONS.map((option) => {
          const isActive = value === option
          return (
            <button
              key={option}
              type='button'
              onClick={() => onChange?.(option)}
              className='flex items-center gap-2 transition-all'
            >
              {/* Radio circle */}
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 18,
                  height: 18,
                  borderRadius: '50%',
                  border: isActive ? '2px solid #6863FB' : '2px solid #D1D5DB',
                  background: 'transparent',
                  flexShrink: 0,
                  transition: 'all 0.15s ease'
                }}
              >
                {isActive && (
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: '#6863FB',
                      display: 'block'
                    }}
                  />
                )}
              </span>
              <span
                className='text-sm transition-all'
                style={{
                  color: isActive ? '#303030' : '#6A7282',
                  fontWeight: isActive ? 500 : 400
                }}
              >
                {option}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
