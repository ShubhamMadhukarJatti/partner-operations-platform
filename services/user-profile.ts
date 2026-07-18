import { fetcher } from '@/lib/server'

export const sendUpdateEmailOtp = async (
  originalEmail: string,
  newEmail: string
) => {
  const response = await fetcher(`/email/sendEmailUpdate`, {
    method: 'POST',
    data: {
      originalEmail,
      newEmail
    }
  })

  return response
}

export const verifyUpdateEmailOtp = async (
  originalEmail: string,
  otp: string
) => {
  const response = await fetcher(
    `/email/verifyUpdateEmail?originalEmail=${originalEmail}&otp=${otp}`,
    {
      method: 'POST'
    }
  )

  return response
}
