import {
  sendUpdateEmailOtp,
  verifyUpdateEmailOtp
} from '@/services/user-profile'
import { useMutation } from '@tanstack/react-query'

import { showCustomToast } from '@/components/custom-toast'

export const useSendUpdateEmailOtp = () => {
  return useMutation({
    mutationFn: async ({
      originalEmail,
      newEmail
    }: {
      originalEmail: string
      newEmail: string
    }) => {
      return await sendUpdateEmailOtp(originalEmail, newEmail)
    },
    onSuccess: () => {
      showCustomToast(
        'Success',
        'Verification code sent to your email',
        'success',
        5000
      )
    },
    onError: () => {
      showCustomToast(
        'Error',
        'Failed to send verification code',
        'error',
        5000
      )
    }
  })
}

export const useVerifyUpdateEmailOtp = () => {
  return useMutation({
    mutationFn: async ({
      originalEmail,
      otp
    }: {
      originalEmail: string
      otp: string
    }) => {
      return await verifyUpdateEmailOtp(originalEmail, otp)
    },
    onSuccess: (data) => {
      console.log(data)
      showCustomToast('Success', 'Email updated successfully!', 'success', 5000)
    },
    onError: () => {
      showCustomToast('Error', 'Invalid verification code', 'error', 5000)
    }
  })
}
