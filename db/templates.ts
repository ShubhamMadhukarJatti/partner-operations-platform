'use server'

import { TemplateResponse } from '@/types'

import { fetcher } from '@/lib/server'

export const getAllTemplate = async (): Promise<TemplateResponse[]> => {
  try {
    const data = await fetcher<TemplateResponse[]>('/api/templates', {
      method: 'GET'
    })

    return data
  } catch (error) {
    console.error(error)
    throw new Error('Error fetching organization followers')
  }
}

export const getTemplateById = async (
  id: string | number
): Promise<any | null> => {
  try {
    const data = await fetcher<any>(`/api/templates/${id}`, {
      method: 'GET'
    })
    return data
  } catch (error) {
    console.error(error)
    throw new Error('Error getting organization')
  }
}
