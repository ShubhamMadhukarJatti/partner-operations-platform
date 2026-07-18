import type { ConfirmPlanLineItem } from '@/components/subscription/ConfirmPlanView'

/**
 * One-shot handoff from `/free-trial/plans` → `/free-trial/payment` only.
 * Not used to restore drafts on the plans page (avoids cross-user leakage on shared browsers).
 */
export const FREE_TRIAL_PAYMENT_SESSION_KEY = 'free-trial-payment-confirm-v1'

export type FreeTrialPlanSession = {
  /** Email from onboarding — used for free-trial-subscription-plans APIs */
  registrationEmail: string
  selectedFeatures: ConfirmPlanLineItem[]
  moduleNames: string[]
  currencyCode: 'INR' | 'USD'
  billingCycle: 'monthly' | 'yearly'
}

export function persistFreeTrialPlanSession(payload: FreeTrialPlanSession) {
  if (typeof window === 'undefined') return
  try {
    sessionStorage.setItem(
      FREE_TRIAL_PAYMENT_SESSION_KEY,
      JSON.stringify(payload)
    )
  } catch {
    // ignore quota / private mode
  }
}

export function clearFreeTrialPlanSession() {
  if (typeof window === 'undefined') return
  try {
    sessionStorage.removeItem(FREE_TRIAL_PAYMENT_SESSION_KEY)
  } catch {
    // ignore
  }
}

export function readFreeTrialPlanSession(): FreeTrialPlanSession | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = sessionStorage.getItem(FREE_TRIAL_PAYMENT_SESSION_KEY)
    if (!raw) return null
    const data = JSON.parse(raw) as Partial<FreeTrialPlanSession>
    if (
      typeof data.registrationEmail !== 'string' ||
      !data.registrationEmail.trim()
    ) {
      return null
    }
    if (
      !Array.isArray(data.selectedFeatures) ||
      !Array.isArray(data.moduleNames)
    ) {
      return null
    }
    const currencyCode =
      data.currencyCode === 'INR' || data.currencyCode === 'USD'
        ? data.currencyCode
        : 'USD'
    const billingCycle =
      data.billingCycle === 'monthly' || data.billingCycle === 'yearly'
        ? data.billingCycle
        : 'monthly'
    return {
      registrationEmail: data.registrationEmail.trim(),
      selectedFeatures: data.selectedFeatures as ConfirmPlanLineItem[],
      moduleNames: data.moduleNames,
      currencyCode,
      billingCycle
    }
  } catch {
    return null
  }
}

export function isFreeTrialPlanReadyForPayment(
  session: FreeTrialPlanSession | null
): session is FreeTrialPlanSession {
  return Boolean(
    session &&
      typeof session.registrationEmail === 'string' &&
      session.registrationEmail.trim().length > 0 &&
      session.selectedFeatures.length > 0 &&
      session.moduleNames.length > 0
  )
}
