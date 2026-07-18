import { useEffect, useState } from 'react'
import { RootState } from '@/redux/store'
import axios from 'axios'
import { useSelector } from 'react-redux'

import { CampaignPipelineI } from '../interfaces'

export const useCampaigns = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { loading: orgLoading, organization } = useSelector(
    (state: RootState) => state.currentOrg
  )
  const [campaignTriggers, setCampaignTriggers] = useState<CampaignPipelineI[]>(
    []
  )

  useEffect(() => {
    const fetchEmailDomainRecords = async () => {
      setLoading(true)
      try {
        setError(null)

        const { data } = await axios.get(
          `/api/campaign/triggers?organizationId=${organization.id}`
        )

        setCampaignTriggers(data.campaignTriggers)
      } catch (err: any) {
        setError(err?.message || 'Something went wrong!')
      }
      setLoading(false)
    }

    if (organization.id) {
      fetchEmailDomainRecords()
    }
  }, [organization])

  return { loading, error, campaignTriggers }
}
