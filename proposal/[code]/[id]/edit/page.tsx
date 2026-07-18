import { getCollaborationDetailsById } from '@/lib/db/collaboration'
import { getConfigByType } from '@/lib/db/configuration'
import { getOrgByCode } from '@/lib/db/organization'
import { getServerUser } from '@/lib/server'

import EditProposal from '../../../_components/edit-proposal'

export const dynamic = 'force-dynamic'

const SendProposalPage = async ({
  params: { code, id }
}: {
  params: { code: number; id: number }
}) => {
  const [
    organization,
    collabDetails,
    { user, token },
    playgroundOptions,
    playgroundOptionHints
  ] = await Promise.all([
    getOrgByCode(code),

    getCollaborationDetailsById(id),

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
      <div className='!hide-scrollbar flex-1 overflow-y-auto '>
        <EditProposal
          receiverOrg={organization}
          userId={user?.uid!}
          token={token!}
          options={options}
          offers={
            collabDetails.partnershipMouVersions[
              collabDetails.partnershipMouVersions.length - 1
            ].receiverBenefits
          }
          expectations={
            collabDetails.partnershipMouVersions[
              collabDetails.partnershipMouVersions.length - 1
            ].senderBenefits
          }
        />
      </div>
    </main>
  )
}

export default SendProposalPage
