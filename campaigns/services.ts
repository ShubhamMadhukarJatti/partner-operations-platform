import axios from 'axios'

import { CampaignByIDResponseI } from './interfaces'

export const createCampaignTemplate = async (templateData: any) => {
  const { data } = await axios.post(`/api/campaign/trigger/general`, {
    data: templateData
  })

  return data
}
export const getCampaignById = async (
  id: string
): Promise<CampaignByIDResponseI> => {
  const { data } = await axios.get(`/api/campaign/triggers/${id}`)

  return data
}

export const updateCampaignTemplate = async (templateData: any) => {
  const { data } = await axios.patch(`/api/campaign/updateTrigger`, {
    data: templateData
  })

  return data
}

export const getPartners = async (organizationId: string) => {
  const { data } = await axios.get(
    `/api/organization/partner?organizationId=${organizationId}`
  )

  return data
}
