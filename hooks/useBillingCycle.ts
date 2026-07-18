'use client'

import { useCallback, useEffect, useState } from 'react'

type BillingCycle = 'monthly' | 'yearly'

const STORAGE_KEY = 'sharkdom-billing-cycle'
const EVENT_NAME = 'billing-cycle-change'

/**
 * Shared billing-cycle hook.
 * Uses sessionStorage + a custom DOM event so every component
 * on the same tab stays in sync (the `storage` event only fires cross-tab).
 */
export function useBillingCycle(
  initial: BillingCycle = 'monthly'
): [BillingCycle, (cycle: BillingCycle) => void] {
  const [cycle, setCycleState] = useState<BillingCycle>(() => {
    if (typeof window === 'undefined') return initial
    return (sessionStorage.getItem(STORAGE_KEY) as BillingCycle) || initial
  })

  // Persist + broadcast when changed
  const setCycle = useCallback((next: BillingCycle) => {
    sessionStorage.setItem(STORAGE_KEY, next)
    setCycleState(next)
    // Notify other hook instances on the same page
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: next }))
  }, [])

  // Listen for changes from other components
  useEffect(() => {
    const handler = (e: Event) => {
      const next = (e as CustomEvent<BillingCycle>).detail
      setCycleState(next)
    }
    window.addEventListener(EVENT_NAME, handler)
    return () => window.removeEventListener(EVENT_NAME, handler)
  }, [])

  return [cycle, setCycle]
}
