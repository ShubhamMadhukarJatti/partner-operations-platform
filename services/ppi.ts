import { fetcher } from '@/lib/server'

export const createProject = async (payload: any) => {
  const response = await fetcher(`/ppi/create-project`, {
    method: 'POST',
    data: payload
  })

  return response
}

export const updateProject = async (payload: any) => {
  const response = await fetcher(`/ppi/update`, {
    method: 'POST',
    data: payload
  })

  return response
}

export const createVersion = async (payload: any) => {
  const response = await fetcher(`/ppi/create-version`, {
    method: 'POST',
    data: payload
  })

  return response
}

export const deploy = async (payload: any) => {
  const response = await fetcher(`/ppi/deployments`, {
    method: 'POST',
    data: payload
  })

  return response
}
