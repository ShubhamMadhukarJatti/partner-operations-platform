import { getPublicOrg } from '@/lib/db/organization'

import PublicProfile from './PublicProfile'

type Props = {
  code: number
}

const PublicProfileWrapper = async ({ code }: Props) => {
  const [publicOrg] = await Promise.all([await getPublicOrg(code)])

  return <PublicProfile code={code} publicOrg={publicOrg} />
}

export default PublicProfileWrapper
