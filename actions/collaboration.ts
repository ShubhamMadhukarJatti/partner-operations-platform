'use server'

import { revalidatePath } from 'next/cache'

import { fetcher, getServerUser } from '@/lib/server'

// accept proposal
type AcceptProposalProps = {
  recieverOrgId: number
  senderOrgId: number
}

export const acceptProposal = async ({
  recieverOrgId,
  senderOrgId
}: AcceptProposalProps) => {
  const { user } = await getServerUser()
  try {
    const data = await fetcher<any>(
      `/organizationCollaboration/acceptCollabRequest?receiverOrganizationId=${recieverOrgId}&senderOrganizationId=${senderOrgId}&acceptorUserId=${user?.uid}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )

    revalidatePath('/dashboard')

    return data
  } catch (error) {
    console.error(error)
    throw new Error('Error accepting proposal')
  }
}

// reject proposal
export const rejectProposal = async (collabId: number) => {
  await getServerUser()
  try {
    await fetcher<void>(`/organizationCollaboration/id?id=${collabId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json-patch+json'
      },
      data: [
        {
          op: 'replace',
          path: '/status',
          value: 'REJECTED'
        }
      ]
    })
    revalidatePath('/dashboard')
  } catch (error: any) {
    console.error(error)
    throw new Error('Error rejecting proposal')
  }
}

// request modifications in proposal
export const editProposal = async (
  collabId: string | number,
  payload: any
): Promise<any | null> => {
  await getServerUser()
  try {
    console.log(payload)

    const data = await fetcher<any>(
      `/organizationCollaboration/${collabId}/edit`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        data: payload
      }
    )

    console.log(data)
    return data
  } catch (error) {
    console.error(error)
    throw new Error('Error accepting proposal')
  }
}
