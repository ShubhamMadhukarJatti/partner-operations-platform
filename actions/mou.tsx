'use server'

import { fetcher, getServerUser } from '@/lib/server'

export async function signMouPdf(data: {
  mou: any
  organizationCollaborationId: number
  organizationId: number
  envelopeId: string
}) {
  await getServerUser()
  try {
    const { mou, organizationCollaborationId, organizationId, envelopeId } =
      data

    console.log(data)

    const result = await fetcher<any>(
      `/organizationCollaboration/sign-mou?organizationCollaborationId=${organizationCollaborationId}&organizationId=${organizationId}&envelopeId=${envelopeId}`,
      {
        method: 'POST',
        data: mou
      }
    )
    return result
  } catch (error) {
    console.error('Error:', error)
    throw new Error('A major error occurred while signing the PDF')
  }
}
