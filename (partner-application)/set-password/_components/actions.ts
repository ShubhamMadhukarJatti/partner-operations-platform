'use server'

import { cookies } from 'next/headers'

import { getValidPartnerToken, publicFetcher } from '@/lib/server'

export async function approvePartnerAction(email: string) {
  try {
    const data = await publicFetcher<any>('/api/v1/partner/approve', {
      method: 'POST',
      data: { email }
    })
    return { success: true, data }
  } catch (err: any) {
    console.error('approvePartnerAction error:', err)
    return {
      success: false,
      message: err.message || 'Failed to approve partner'
    }
  }
}

export async function sendOtpAction(email: string) {
  try {
    // 1. Proactively auto-approve in test backend
    try {
      await publicFetcher('/api/v1/partner/approve', {
        method: 'POST',
        data: { email }
      })
    } catch (err) {
      console.warn('Auto-approval step failed or was skipped:', err)
    }

    // 2. Send OTP code
    const data = await publicFetcher<any>('/api/v1/partner/auth/send-otp', {
      method: 'POST',
      data: { email }
    })
    return { success: true, data }
  } catch (err: any) {
    console.error('sendOtpAction error:', err)
    return {
      success: false,
      message: err.message || 'Failed to send verification code'
    }
  }
}

export async function verifyOtpAction(email: string, otp: string) {
  try {
    const response = await publicFetcher<any>(
      '/api/v1/partner/auth/verify-otp',
      {
        method: 'POST',
        data: { email, otp }
      }
    )

    // Support both flat response or nested structure
    const resData = response?.data || response
    const accessToken = resData?.accessToken || response?.accessToken
    const refreshToken = resData?.refreshToken || response?.refreshToken
    const userId = resData?.userId || response?.userId

    console.log(
      'verifyOtpAction: Verified token successfully extracted:',
      accessToken
    )

    if (accessToken && refreshToken && userId) {
      const cookieStore = cookies()
      const COOKIE_OPTIONS = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax' as const,
        path: '/',
        maxAge: 60 * 60 * 24 * 7 * 100
      }
      const user = {
        uid: userId,
        email: email
      }
      cookieStore.set('partnerAccessToken', accessToken, COOKIE_OPTIONS)
      cookieStore.set('partnerRefreshToken', refreshToken, COOKIE_OPTIONS)
      cookieStore.set('user', JSON.stringify(user), COOKIE_OPTIONS)
    }

    return { success: true, data: response }
  } catch (err: any) {
    console.error('verifyOtpAction error:', err)
    return {
      success: false,
      message: err.message || 'Invalid verification code'
    }
  }
}

export async function setPasswordAction(accessToken: string, password: string) {
  try {
    const formattedToken = accessToken.startsWith('Bearer ')
      ? accessToken
      : `Bearer ${accessToken}`
    const data = await publicFetcher<any>('/api/v1/partner/auth/password', {
      method: 'PUT',
      headers: {
        Authorization: formattedToken,
        Accept: 'application/hal+json'
      },
      data: {
        newPassword: password,
        retypePassword: password
      }
    })
    return { success: true, data }
  } catch (err: any) {
    console.error('setPasswordAction error:', err)
    return { success: false, message: err.message || 'Failed to save password' }
  }
}

export async function getPartnerSessionAction() {
  try {
    const cookieStore = cookies()
    const token = await getValidPartnerToken()
    const userCookie = cookieStore.get('user')?.value
    let user = null
    if (userCookie) {
      try {
        user = JSON.parse(userCookie)
      } catch (e) {
        console.error('getPartnerSessionAction JSON parse error:', e)
      }
    }
    return { token, user }
  } catch (err) {
    console.error('getPartnerSessionAction error:', err)
    return { token: null, user: null }
  }
}

export async function getPartnerProfileInfoAction(accessToken: string) {
  try {
    const formattedToken = accessToken.startsWith('Bearer ')
      ? accessToken
      : `Bearer ${accessToken}`
    const response = await publicFetcher<any>('/api/v1/partner/me/tier-info', {
      method: 'GET',
      headers: {
        Accept: 'application/hal+json',
        Authorization: formattedToken
      }
    })

    // The response has { success: true, data: { fullName, partnershipTier, email } }
    const resData = response?.data || response
    return { success: true, data: resData }
  } catch (err: any) {
    console.error('getPartnerProfileInfoAction error:', err)
    return {
      success: false,
      message: err.message || 'Failed to fetch tier info'
    }
  }
}

export async function submitPartnerLeadAction(token: string, payload: any) {
  try {
    const formattedToken = token.startsWith('Bearer ')
      ? token
      : `Bearer ${token}`
    const response = await publicFetcher<any>('/api/partner-leads', {
      method: 'POST',
      headers: {
        Accept: 'application/hal+json',
        Authorization: formattedToken
      },
      data: payload
    })
    const resData = response?.data || response
    return { success: true, data: resData }
  } catch (err: any) {
    console.error('submitPartnerLeadAction error:', err)
    return { success: false, message: err.message || 'Failed to submit lead' }
  }
}
