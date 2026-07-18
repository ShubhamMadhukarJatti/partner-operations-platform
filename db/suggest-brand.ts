import { fetcher } from '@/lib/server'

export const suggestBrand = async (data: any) => {
  try {
    const result = await fetcher<any>('/suggestion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      data
    })

    return result
  } catch (error) {
    console.error('Error :', error)
    throw error
  }
}
