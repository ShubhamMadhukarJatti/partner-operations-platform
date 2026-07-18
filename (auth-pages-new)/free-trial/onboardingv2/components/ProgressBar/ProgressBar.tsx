// import React from 'react'

// interface StepProgressBarProps {
//   totalSteps: number
//   currentStep: number
// }

// export const StepProgressBar: React.FC<StepProgressBarProps> = ({
//   totalSteps,
//   currentStep
// }) => {
//   const progressPercent = Math.min((currentStep / totalSteps) * 100, 100)

//   return (
//     <div className='flex w-full flex-col gap-2'>
//       <div className='relative h-2 w-full rounded bg-gray-200'>
//         <div
//           className='absolute left-0 top-0 h-2 rounded bg-green-500'
//           style={{ width: `${progressPercent}%` }}
//         />
//       </div>
//     </div>
//   )
// }
import React from 'react'

interface StepProgressBarProps {
  totalSteps: number
  currentStep: number
}

export const StepProgressBar: React.FC<StepProgressBarProps> = ({
  totalSteps,
  currentStep
}) => {
  return (
    <div className='flex w-full items-center justify-center gap-2'>
      {Array.from({ length: totalSteps }).map((_, index) => (
        <div
          key={index}
          className={`h-2 w-20 rounded-full transition-colors duration-300 ${
            index < currentStep ? 'bg-[#3E50F7]' : 'bg-[#D9D9D9]'
          }`}
        />
      ))}
    </div>
  )
}
