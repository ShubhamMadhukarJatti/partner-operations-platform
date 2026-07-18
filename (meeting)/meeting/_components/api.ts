const API_BASE_URL: string = 'https://api.videosdk.live'
const VIDEOSDK_TOKEN: string | undefined =
  process.env.NEXT_PUBLIC_VIDEOSDK_TOKEN
const API_AUTH_URL: string | undefined = process.env.NEXT_PUBLIC_AUTH_URL

export const getToken = async (): Promise<string> => {
  if (VIDEOSDK_TOKEN && API_AUTH_URL) {
    throw new Error('Provide only ONE PARAMETER - either Token or Auth API')
  } else if (VIDEOSDK_TOKEN) {
    return VIDEOSDK_TOKEN
  } else if (API_AUTH_URL) {
    const res = await fetch(`${API_AUTH_URL}/get-token`, {
      method: 'GET'
    })
    const { token } = await res.json()
    return token
  } else {
    throw new Error('Please add a token or Auth Server URL')
  }
}

export const createMeeting = async ({
  token
}: {
  token: string
}): Promise<string> => {
  const url: string = `${API_BASE_URL}/v2/rooms`

  const options = {
    method: 'POST',
    headers: { Authorization: token, 'Content-Type': 'application/json' }
  }

  const { roomId } = await fetch(url, options)
    .then((response) => response.json())
    .catch((error) => {
      throw new Error(error)
    })

  return roomId
}

export const validateMeeting = async ({
  roomId,
  token
}: {
  roomId: string
  token: string
}): Promise<boolean> => {
  const url: string = `${API_BASE_URL}/v2/rooms/validate/${roomId}`

  const options = {
    method: 'GET',
    headers: { Authorization: token, 'Content-Type': 'application/json' }
  }

  const result = await fetch(url, options)
    .then((response) => response.json())
    .catch((error) => {
      throw new Error(error)
    })

  return result ? result.roomId === roomId : false
}
