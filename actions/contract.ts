'use server'

import { fetcher, getServerUser } from '@/lib/server'

export const getContractByEmail = async (email1: string, email2: string) => {
  await getServerUser()

  try {
    const data = await fetcher<any>(
      `/organizationCollaboration/contract?org1Email=${email1}&org2Email=${email2}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json-patch+json'
        }
      }
    )
    console.log({ data })
    return data
  } catch (error: any) {
    console.error('error', error.message)
    throw new Error('Error getting contact')
  }
}

export const uploadContractFile = async (
  email1: string,
  email2: string,
  formData: any
) => {
  await getServerUser()

  try {
    const data = await fetcher<any>(
      `/organizationCollaboration/upload-contract?org1Email=${email1}&org2Email=${email2}`,
      {
        method: 'POST',
        data: formData
      }
    )
    console.log({ data })
    return data
  } catch (error: any) {
    console.error('error', error.message)
    throw new Error('Error uploading contract file')
  }
}
