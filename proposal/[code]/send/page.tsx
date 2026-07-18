import { getConfigByType } from '@/lib/db/configuration'
import { getOrgByCode } from '@/lib/db/organization'
import { getServerUser } from '@/lib/server'

import CreateProposal from '../../_components/create-proposal-v2'

export const dynamic = 'force-dynamic'

type Props = {}

const SendProposalPage = async ({
  params: { code }
}: {
  params: { code: number }
}) => {
  const [
    organization,
    { user, token },
    playgroundOptions,
    playgroundOptionHints
  ] = await Promise.all([
    getOrgByCode(code),

    getServerUser(),
    getConfigByType('PLAYGROUND'),
    getConfigByType('PLAYGROUND_HINT')
  ])

  const options = playgroundOptions.map((option) => {
    const hint =
      playgroundOptionHints.find((hint) => hint.key === option.key)?.value || ''
    const category = option.key.split('_')[0]
    return { option: option.value, hint, category }
  })

  return (
    <main className='flex h-full flex-col'>
      <div className='!hide-scrollbar flex-1 overflow-y-auto '>
        <CreateProposal
          receiverOrg={organization}
          userId={user?.uid!}
          token={token!}
          options={options}
        />
      </div>
    </main>
  )
}

export default SendProposalPage
