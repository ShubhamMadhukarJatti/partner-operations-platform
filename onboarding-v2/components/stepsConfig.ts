// src/app/onboarding-v2/components/stepsConfig.ts
import dynamic from 'next/dynamic'

export const stepsConfig = [
  { id: 1, component: dynamic(() => import('./steps/Step01')) },
  { id: 2, component: dynamic(() => import('./steps/Step02')) },
  { id: 3, component: dynamic(() => import('./steps/Step03')) },
  { id: 4, component: dynamic(() => import('./steps/Step04')) },
  { id: 5, component: dynamic(() => import('./steps/Step05')) },
  { id: 6, component: dynamic(() => import('./steps/Step06')) },
  { id: 7, component: dynamic(() => import('./steps/Step07')) },
  { id: 8, component: dynamic(() => import('./steps/Step08')) },
  { id: 9, component: dynamic(() => import('./steps/Step09')) },
  { id: 10, component: dynamic(() => import('./steps/Step10')) },
  { id: 11, component: dynamic(() => import('./steps/Step11')) },
  { id: 12, component: dynamic(() => import('./steps/Step12')) },
  { id: 13, component: dynamic(() => import('./steps/Step13')) },
  { id: 14, component: dynamic(() => import('./steps/Step14')) },
  { id: 15, component: dynamic(() => import('./steps/Step15')) }
]
