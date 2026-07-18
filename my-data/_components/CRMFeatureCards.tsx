import React from 'react'
import { ArrowUpNarrowWide, Clock, Sparkles, Store } from 'lucide-react'

const cards = [
  {
    iconBgClass: 'bg-icon-bg-amber',
    icon: <Store className='h-5 w-5 text-icon-color-amber' />,
    stat: '200+',
    title: 'Vendors',
    desc: 'Overlap in the marketplace once you connect your CRM'
  },
  {
    iconBgClass: 'bg-icon-bg-amber',
    icon: <Clock className='h-5 w-5 text-icon-color-amber' />,
    stat: '4x',
    title: 'Faster Responses',
    desc: 'AI-powered insights help you respond to partners instantly with contextual data'
  },
  {
    iconBgClass: 'bg-icon-bg-green',
    icon: <ArrowUpNarrowWide className='h-5 w-5 text-icon-color-green' />,
    stat: '75%',
    title: 'Higher Success Rate',
    desc: 'Data-driven matching increases successful partnerships significantly'
  },
  {
    iconBgClass: 'bg-icon-blue-gradient',
    icon: <Sparkles className='h-5 w-5 text-primary-blue' />,
    stat: '90%',
    title: 'Smart Recommendations',
    desc: 'Get AI-curated partner suggestions based on your customer patterns'
  }
]

const CRMFeatureCards = React.memo(() => {
  return (
    <div className='flex flex-col gap-5 sm:flex-row'>
      {cards.map((card, i) => (
        <div
          key={i}
          className='flex h-[253px] flex-1 items-center justify-center overflow-hidden rounded-xl border border-text-20 bg-white'
        >
          <div className='flex flex-col items-center gap-1'>
            <div className='flex flex-col items-center gap-1.5'>
              <div className='flex flex-col items-center gap-2.5'>
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-full ${card.iconBgClass}`}
                >
                  {card.icon}
                </div>
                <div className='text-[20px] font-bold text-text-slate-900'>
                  {card.stat}
                </div>
              </div>
              <div className='text-center text-[14px] font-semibold leading-5 text-text-slate-900'>
                {card.title}
              </div>
            </div>
            <div className='max-w-[179px] text-center text-[12px] font-normal leading-4 text-text-card-muted'>
              {card.desc}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
})

CRMFeatureCards.displayName = 'CRMFeatureCards'

export default CRMFeatureCards
