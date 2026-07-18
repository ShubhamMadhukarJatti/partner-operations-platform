'use client'

import { create } from 'zustand'

// Define the Pricing type
type Pricing = {
  id: number
  creationTimestamp: string
  lastUpdatedTimestamp: string
  type: string
  key: string
  value: string
  webApplicable: boolean
  appApplicable: boolean
  backendApplicable: boolean
  active: boolean
}

type AppState = {
  upgradePopup: boolean
  pricing: Pricing[] // Array of Pricing objects
  toggleUpgradePopUp: () => void
  setPricing: (newPricing: Pricing[]) => void // Function to update pricing
}

export const useUpgradeStore = create<AppState>()((set) => ({
  upgradePopup: false,
  pricing: [], // Initialize the pricing array
  toggleUpgradePopUp: () =>
    set((state) => ({ upgradePopup: !state.upgradePopup })),
  setPricing: (newPricing) => set(() => ({ pricing: newPricing })) // Update pricing array
}))
