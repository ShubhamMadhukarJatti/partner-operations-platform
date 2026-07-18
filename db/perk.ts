'use server'

import { fetcher } from '@/lib/server'

type perkBody = {
  redeemedCount: number
  creationTimestamp: string
  lastUpdatedTimestamp: string
  perkDetails: string
  steps: [string]
  perkValue: string
  perkDuration: string
  clickedCount: number
  perkStatus: string
  perkUrl: string
  perkIcon: string
  perkName: string
}

export const getPerks = async () => {
  const res = await fetcher<any>('/perks?perkStatus=ACTIVE', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  return res
}

export const createPerk = async (perkBody: perkBody) => {
  const res = await fetcher<any>('/perks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: {
      redeemedCount: perkBody.redeemedCount,
      perkDetails: perkBody.perkDetails,
      perkUrl: perkBody.perkUrl,
      steps: perkBody.steps,
      perkValue: perkBody.perkValue,
      perkDuration: perkBody.perkDuration,
      clickedCount: perkBody.clickedCount,
      perkStatus: perkBody.perkStatus,
      perkIcon: perkBody.perkIcon,
      perkName: perkBody.perkName
    }
  })
  console.log('🚀🚀🚀 createPerk => res :: ', res)
  return res
}
