import { Check } from 'lucide-react'

const steps = [
  { label: 'Connect / upload' },
  { label: 'Mapping' },
  { label: 'Preview' },
  { label: 'Finish' }
]

const DataPipelineStepper = ({ current }: { current: number }) => {
  return (
    <div className='mx-auto flex w-fit items-center justify-center gap-4'>
      {steps.map((step, i) => {
        const isCompleted = i + 1 < current
        const isActive = i + 1 === current
        const isFuture = i + 1 > current
        const isLast = i === steps.length - 1

        return (
          <div key={step.label} className='flex items-center gap-4'>
            <div className='flex items-center gap-2.5'>
              {/* Completed State */}
              {isCompleted && (
                <div className='flex h-[20px] w-[20px] shrink-0 items-center justify-center rounded-full bg-[#00B066]'>
                  <Check className='h-3 w-3 text-white' strokeWidth={4} />
                </div>
              )}

              {/* Active State */}
              {isActive && (
                <svg
                  className='h-[20px] w-[20px] shrink-0 text-[#6863FB]'
                  viewBox='0 0 20 20'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <circle
                    cx='10'
                    cy='10'
                    r='8'
                    stroke='currentColor'
                    strokeWidth='1.5'
                    strokeLinecap='round'
                    strokeDasharray='10 2.56'
                  />
                </svg>
              )}

              {/* Future State */}
              {isFuture && (
                <div className='flex h-[20px] w-[20px] shrink-0 items-center justify-center rounded-full border-[1.5px] border-[#CBD5E1]'></div>
              )}

              <span
                className={`text-[15px] ${
                  isActive
                    ? 'font-bold text-[#6863FB]'
                    : 'font-medium text-[#64748B]'
                }`}
              >
                {step.label}
              </span>
            </div>

            {/* Connecting Line */}
            {!isLast && <div className='h-[1px] w-[32px] bg-[#CBD5E1]' />}
          </div>
        )
      })}
    </div>
  )
}

export default DataPipelineStepper
