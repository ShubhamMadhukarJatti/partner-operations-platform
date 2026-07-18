import { RootState } from '@/redux/store'
import { fetchPartnershipIntegrations } from '@/services/api-listing'
import { useQuery } from '@tanstack/react-query'
import { useSelector } from 'react-redux'

export const useGetPartnershipIntegration = (): any => {
  const saved = useSelector((state: RootState) => state.currentOrg)
  const { organization } = saved

  const query = useQuery({
    queryKey: ['api-listing', organization?.id],
    queryFn: async () => await fetchPartnershipIntegrations(organization?.id),
    enabled: !!organization?.id
  })
  return query
}
