'use client'

import Steps from './how-it-works-step'

const points = [
  {
    step: 1,
    title: ' Find Right Partners',
    desc: "Using 10's of filters choose your Ideal Partner depending on your end-goal",
    img: '/assets/pie-chart.svg',
    alt: 'pie chart icon'
  },
  {
    step: 2,
    title: '  Generate Proposal',
    desc: 'Use Sharkdom’s Smart Partnerships solution to generate best proposal',
    img: '/assets/generate-proposal.svg',
    alt: 'partnership proposal icon'
  },
  {
    step: 3,
    title: ' Wait for Acknowlegment',
    desc: 'Decreasing waiting period from weeks to hours',
    img: '/assets/hour-glass.svg',
    alt: 'hourglass icon'
  },
  {
    step: 4,
    title: ' Clarify Terms',
    desc: 'Clarify terms via our In-House meeting solution, Partner valve Room & other tools',
    img: '/assets/terms-clarify.svg',
    alt: 'terms clarification icon'
  },
  {
    step: 5,
    title: ' Co-Sign MOU',
    desc: 'Our platform would be generatign the final MOU & having it signed by both parties',
    img: '/assets/sign-mou.svg',
    alt: 'MOU sign icon'
  },
  {
    step: 6,
    title: 'Create Joint Referral Program',
    desc: 'Create shout-out program, referral program and get new signups via your partner network',
    img: '/assets/referral.svg',
    alt: 'referral program icon'
  }
]

function HowItWorks() {
  return (
    <div className='flex w-full flex-col items-center justify-center px-8 py-24 sm:flex-row'>
      <div className=' flex w-full max-w-7xl flex-col flex-col items-center '>
        <div className=''>
          <h1 className='w-max rounded-lg bg-white p-2 text-4xl font-bold text-[#1D2939]'>
            How it works?
          </h1>
        </div>
        <div className='relative z-[99] mt-16 flex flex-col gap-12 sm:w-2/3'>
          {points.map((step) => (
            <Steps step={step} key={step.step} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default HowItWorks
