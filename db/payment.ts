'use server'

import { fetcher } from '@/lib/server'

/** `redirect()` from Next.js throws this; must not be caught as a normal failure. */
function isNextjsRedirect(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'digest' in error &&
    typeof (error as { digest?: unknown }).digest === 'string' &&
    (error as { digest: string }).digest.startsWith('NEXT_REDIRECT')
  )
}

export const createUserSubscription = async (payload: any) => {
  try {
    const res = await fetcher<any>('/payment/subscription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      data: payload
    })

    return res
  } catch (error) {
    console.error(error)
    throw new Error('Error creating user subscription')
  }
}

export const upgradeUserSubscription = async (payload: any) => {
  try {
    console.log('responseInsideAPI', payload)

    const queryParams = new URLSearchParams(payload).toString()

    const res = await fetcher<any>(
      `/sharkdom-stripe/v1/subscription/upgrade?${queryParams}`,
      {
        method: 'POST'
      }
    )

    console.log('this is resssss', res)

    return res
  } catch (error) {
    console.error(error)
    throw new Error('Error upgrading user subscription')
  }
}

export const upgradeUserSubscriptionSeat = async (payload: any) => {
  try {
    const queryParams = new URLSearchParams(payload).toString()

    const res = await fetcher<any>(
      `/sharkdom-stripe/v1/subscription/upgrade-seat?${queryParams}`,
      {
        method: 'POST'
      }
    )

    return res
  } catch (error) {
    console.error(error)
    throw new Error('Error upgrading user subscription')
  }
}

export const createStripeCheckout = async (payload: any) => {
  try {
    const res = await fetcher<any>('/payment/stripe/checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      data: payload
    })

    return res
  } catch (error) {
    console.error(error)
    throw new Error('Error creating user subscription')
  }
}

export const createStripeCustomerCheckout = async (payload: any) => {
  const userId = payload.userId
  const planType = payload.planType
  const mode = payload.mode
  const successUrl = payload.successUrl
  const cancelUrl = payload.cancelUrl
  const couponCode = payload.couponCode

  const trailDays = payload.trailDays

  console.log({ userId, planType, mode, successUrl, cancelUrl })

  if (!(userId && planType && mode && successUrl && cancelUrl))
    throw new Error('Fields missing')
  try {
    const res = await fetcher<any>(
      `/sharkdom-stripe/v1/customer-checkout?userId=${userId}&planType=${planType}&mode=${mode}&successUrl=${successUrl}&cancelUrl=${cancelUrl}&trailDays=${trailDays}&couponCode=${couponCode}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )

    return res
  } catch (error) {
    console.error(error)
    throw new Error('Error creating user subscription')
  }
}

/**
 * Phase 1: Create Stripe Customer + Setup Intent in one call.
 * Calls our local Next.js API route: POST /api/v1/billing/setup-intents
 * Returns { success, data: { customerId, clientSecret, setupIntentId } }
 */
export const createCustomerAndSetupIntent = async (payload: {
  email?: string
  name?: string
}): Promise<any> => {
  try {
    const res = await fetch('/api/v1/billing/setup-intents', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    if (!res.ok) {
      const errData = await res.json()
      throw new Error(
        errData?.message ?? 'Failed to create customer & setup intent'
      )
    }

    return await res.json()
  } catch (error) {
    console.error('Error creating customer & setup intent:', error)
    throw error
  }
}

/**
 * Fetch existing billing customer from Sharkdom backend by userId.
 * POST /api/v1/billing/customer
 * Returns the full customer record including customerId (Stripe cus_xxx).
 */
export const fetchBillingCustomer = async (
  userId: string
): Promise<{
  id: number
  customerId: string
  organizationId: number[]
  firebaseUserId: string
  customerName: string
  customerEmail: string
  customerPhoneNumber: string | null
  checkoutSessions: any | null
  subscriptions: any | null
  cardDetails: any | null
}> => {
  try {
    const res = await fetcher<any>('/api/v1/billing/customer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      data: { userId }
    })

    return res
  } catch (error) {
    console.error('Error fetching billing customer:', error)
    throw new Error('Error fetching billing customer')
  }
}

export const verifyPayment = async (payload: any) => {
  try {
    const res = await fetcher<any>('/payment/callback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        accept: 'application/hal+json'
      },
      data: payload
    })

    return res
  } catch (error) {
    console.error(error)
    throw new Error('Error verifying payment')
  }
}

/**
 * Fetch all modules / products with pricing from the backend.
 * GET /api/products
 */
export const getModules = async (): Promise<any> => {
  try {
    const res = await fetcher<any>('/api/products', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    return res
  } catch (error) {
    console.error('Error fetching modules:', error)
    throw new Error('Error fetching modules')
  }
}

/**
 * Fetch Stripe product IDs for the given module names.
 * POST /api/v1/billing/products/by-modules
 */
export const fetchProductIdsByModules = async (
  moduleNames: string[]
): Promise<any> => {
  try {
    const res = await fetcher<any>('/api/v1/billing/products/by-modules', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      data: { moduleNames }
    })

    return res
  } catch (error) {
    console.error('Error fetching product IDs by modules:', error)
    throw new Error('Error fetching product IDs by modules')
  }
}

/**
 * Create a Setup Intent for a Stripe Customer
 * POST /api/v1/billing/setup-intents
 */
export const createSetupIntent = async (payload: {
  customerId: string
}): Promise<any> => {
  try {
    const res = await fetcher<any>('/api/v1/billing/setup-intents', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      data: payload
    })

    return res
  } catch (error) {
    console.error('Error creating setup intent:', error)
    throw new Error('Error creating setup intent')
  }
}

/**
 * Register a Stripe customer in Sharkdom's backend DB.
 * POST /api/v1/billing/customers
 * Must be called after creating the customer in Stripe but before saving cards.
 */
export const registerCustomerInDB = async (payload: {
  customerId: string
  name?: string
  email?: string
  phone?: string
}): Promise<any> => {
  try {
    const res = await fetcher<any>('/api/v1/billing/customers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        accept: 'application/hal+json'
      },
      data: {
        customerId: payload.customerId,
        'Customer Name': payload.name || '',
        'Customer Email': payload.email || '',
        customerPhoneNumber: payload.phone || '',
        cardDetails: [],
        checkoutSessions: [],
        subscriptions: []
      }
    })
    console.log('registerCustomerInDB success:', JSON.stringify(res))
    return res
  } catch (error: any) {
    console.error('registerCustomerInDB raw error:', {
      message: error?.message,
      status: error?.response?.status,
      data: error?.response?.data,
      config: error?.config?.url
    })
    throw error
  }
}

/**
 * Step A: Save a card (payment method) in Sharkdom's backend DB.
 * POST /api/v1/billing/customers/{customerId}/payment-methods
 */
export const saveCardInDB = async (
  customerId: string,
  paymentMethodId: string
): Promise<any> => {
  try {
    const res = await fetcher<any>(
      `/api/v1/billing/customers/${customerId}/payment-methods`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          accept: 'application/hal+json'
        },
        data: { paymentMethodId }
      }
    )
    console.log('saveCardInDB success:', JSON.stringify(res))
    return res
  } catch (error: any) {
    console.error('saveCardInDB raw error:', {
      message: error?.message,
      status: error?.response?.status,
      data: error?.response?.data,
      config: error?.config?.url
    })
    throw error
  }
}

/**
 * Step B: Set card as default payment method in Sharkdom's backend DB.
 * PUT /api/v1/billing/customers/{customerId}/payment-methods/{paymentMethodId}
 */
export const updateCardDetail = async (
  customerId: string,
  paymentMethodId: string
): Promise<any> => {
  try {
    const res = await fetcher<any>(
      `/api/v1/billing/customers/${customerId}/payment-methods/${paymentMethodId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          accept: 'application/hal+json'
        }
      }
    )
    console.log('updateCardDetail success:', JSON.stringify(res))
    return res
  } catch (error: any) {
    console.error('updateCardDetail raw error:', {
      message: error?.message,
      status: error?.response?.status,
      data: error?.response?.data,
      config: error?.config?.url
    })
    throw error
  }
}

/**
 * Remove a payment method from the billing customer (backend + Stripe sync as implemented server-side).
 * DELETE /api/v1/billing/customers/{customerId}/payment-methods/{paymentMethodId}
 */
export const deleteBillingPaymentMethod = async (
  customerId: string,
  paymentMethodId: string
): Promise<any> => {
  try {
    const res = await fetcher<any>(
      `/api/v1/billing/customers/${customerId}/payment-methods/${paymentMethodId}`,
      {
        method: 'DELETE',
        headers: {
          accept: 'application/hal+json'
        }
      }
    )
    console.log('deleteBillingPaymentMethod success:', JSON.stringify(res))
    return res
  } catch (error: any) {
    if (isNextjsRedirect(error)) throw error
    console.error('deleteBillingPaymentMethod raw error:', {
      message: error?.message,
      status: error?.response?.status,
      data: error?.response?.data,
      config: error?.config?.url
    })
    throw error
  }
}

/**
 * Create a subscription via the new module-based API.
 * POST /sharkdom-stripe/v1/subscription/create
 */
export const createModuleSubscription = async (payload: {
  customerId: string
  productIds: string[]
  interval: string
  amount: number
  currency: string
  trialPeriodDays: number
}): Promise<any> => {
  try {
    const res = await fetcher<any>('/sharkdom-stripe/v1/subscription/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      data: payload
    })

    return res
  } catch (error) {
    if (isNextjsRedirect(error)) throw error
    console.error('Error creating module subscription:', error)
    throw new Error('Error creating module subscription')
  }
}

/**
 * Module subscription plan / org billing profile for the current session org.
 * GET /api/v1/billing — no parameters (organization resolved server-side from auth).
 */
export const fetchBillingOrgProfile = async (): Promise<any | null> => {
  try {
    const res = await fetcher<any>('/api/v1/billing', {
      method: 'GET',
      headers: {
        accept: 'application/hal+json'
      }
    })
    return res
  } catch (error) {
    if (isNextjsRedirect(error)) throw error
    console.warn('fetchBillingOrgProfile failed:', error)
    return null
  }
}

/**
 * Save organization billing profile.
 * POST /api/v1/billing
 */
export const saveOrgProfile = async (payload: {
  modules: string[]
  numberOfSeats: number
  price: number
  organizationName: string
  country: string
  address: string
  gstInId: string
}): Promise<any> => {
  try {
    const res = await fetcher<any>('/api/v1/billing', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      data: payload
    })

    return res
  } catch (error) {
    if (isNextjsRedirect(error)) throw error
    console.error('Error saving org profile:', error)
    throw new Error('Error saving organization profile')
  }
}

/**
 * Update organization billing fields only (no modules/seats/price).
 * PUT /api/v1/billing — org resolved from auth.
 */
export const updateOrgProfile = async (payload: {
  organizationName: string
  country: string
  address: string
  gstInId: string
}): Promise<any> => {
  try {
    const res = await fetcher<any>('/api/v1/billing', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/hal+json'
      },
      data: payload
    })

    return res
  } catch (error) {
    if (isNextjsRedirect(error)) throw error
    console.error('Error updating org profile:', error)
    const msg =
      error instanceof Error
        ? error.message
        : 'Error updating organization profile'
    throw new Error(msg)
  }
}

/**
 * Free-trial subscription plan by email (path param). GET — no body.
 */
export const fetchFreeTrialSubscriptionPlanByEmail = async (
  email: string
): Promise<any | null> => {
  const trimmed = email?.trim()
  if (!trimmed) return null
  try {
    const encoded = encodeURIComponent(trimmed)
    const res = await fetcher<any>(
      `/api/v1/free-trial-subscription-plans/email/${encoded}`,
      {
        method: 'GET',
        headers: {
          accept: 'application/hal+json'
        }
      }
    )
    return res
  } catch (error) {
    if (isNextjsRedirect(error)) throw error
    console.warn('fetchFreeTrialSubscriptionPlanByEmail failed:', error)
    return null
  }
}

/** Payload for POST/PUT `/api/v1/free-trial-subscription-plans/email/{email}`. */
export type FreeTrialSubscriptionPlanPayload = {
  numberOfSeats: number
  price: number
  organizationName: string
  country: string
  address: string
  gstInId: string
}

/**
 * Save free-trial subscription plan / org fields for email. POST same path as GET.
 */
export const saveFreeTrialSubscriptionPlanByEmail = async (
  email: string,
  payload: FreeTrialSubscriptionPlanPayload
): Promise<any> => {
  const trimmed = email?.trim()
  if (!trimmed) throw new Error('Email is required')
  try {
    const encoded = encodeURIComponent(trimmed)
    const res = await fetcher<any>(
      `/api/v1/free-trial-subscription-plans/email/${encoded}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/hal+json'
        },
        data: payload
      }
    )
    return res
  } catch (error) {
    if (isNextjsRedirect(error)) throw error
    console.error('Error saving free trial subscription plan:', error)
    const msg =
      error instanceof Error
        ? error.message
        : 'Error saving free trial subscription plan'
    throw new Error(msg)
  }
}

/**
 * Update free-trial subscription plan / org fields for email (e.g. after Edit Info).
 * PUT `/api/v1/free-trial-subscription-plans/email/{email}` — same JSON body as POST.
 */
export const updateFreeTrialSubscriptionPlanByEmail = async (
  email: string,
  payload: FreeTrialSubscriptionPlanPayload
): Promise<any> => {
  const trimmed = email?.trim()
  if (!trimmed) throw new Error('Email is required')
  try {
    const encoded = encodeURIComponent(trimmed)
    const res = await fetcher<any>(
      `/api/v1/free-trial-subscription-plans/email/${encoded}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/hal+json'
        },
        data: payload
      }
    )
    return res
  } catch (error) {
    if (isNextjsRedirect(error)) throw error
    console.error('Error updating free trial subscription plan:', error)
    const msg =
      error instanceof Error
        ? error.message
        : 'Error updating free trial subscription plan'
    throw new Error(msg)
  }
}

/**
 * Create a subscription via the billing API.
 * POST /api/v1/billing/subscriptions
 */
export const createBillingSubscription = async (payload: {
  customerId: string
  productIds: string[]
  interval: string
  amount: number
  currency: string
  trialPeriodDays: number
}): Promise<any> => {
  try {
    const res = await fetcher<any>('/api/v1/billing/subscriptions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      data: payload,
      timeout: 30000 // Subscription creation can take time
    })

    return res
  } catch (error: any) {
    if (isNextjsRedirect(error)) throw error
    // Preserve the ACTUAL error message from the backend
    const backendMessage =
      error?.response?.data?.message ??
      error?.response?.data?.errorMessage ??
      error?.message ??
      'Error creating billing subscription'

    throw new Error(backendMessage)
  }
}
