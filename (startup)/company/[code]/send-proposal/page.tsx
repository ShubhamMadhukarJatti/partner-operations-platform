import { getConfigByType } from '@/lib/db/configuration'
import { getOrganizationById } from '@/lib/db/organization'
import { getServerUser } from '@/lib/server'

import PreviousProposals from '../../_components/PreviousProposals'
import SendProposalFlow from '../../_components/SendProposalFlow'
import SendProposalHeader from '../../_components/SendProposalHeader'

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
    getOrganizationById(code),

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
    <main className='flex h-screen flex-col'>
      <SendProposalHeader />
      <div className='flex flex-1 overflow-hidden border-t border-[#ccc]'>
        <div className='h-full w-64 overflow-y-auto'>
          <PreviousProposals />
        </div>
        <div className='flex-1 overflow-y-auto'>
          <SendProposalFlow
            receiverOrg={organization}
            userId={user?.uid!}
            token={token!}
            options={options}
          />
        </div>
      </div>
    </main>
  )
}

export default SendProposalPage
