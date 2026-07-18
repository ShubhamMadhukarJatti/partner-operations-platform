'use client'

import { create } from 'zustand'

export interface OnboardingFormData {
  step1: {
    name: string

    roleSpecs: string
  }
  step2: {
    about: string
    website: string
    sector: string
    companyType: string
    legalName: string
    briefDescription: string
    onboardedPartners: string
    visibility: boolean
  }
  step3: {
    preferredPartnershipTypes: string[]
    preferredSectors: string[]
  }
}

interface FormStore {
  step: number
  formData: OnboardingFormData
  setFormData: (data: Partial<OnboardingFormData>) => void
  nextStep: () => void
  setStep: (step: number) => void
  backStep: () => void
}

const initialState = {
  step: 1,
  formData: {
    step1: { name: '', roleSpecs: '' },
    step2: {
      about: '',
      website: '',
      sector: '',
      companyType: '',
      legalName: '',
      briefDescription: '',
      onboardedPartners: '',
      visibility: true
    },
    step3: {
      preferredPartnershipTypes: [],
      preferredSectors: []
    }
  }
}

const useFormStore = create<FormStore>((set) => ({
  ...initialState,

  setFormData: (data: Partial<OnboardingFormData>) =>
    set((state) => ({
      formData: { ...state.formData, ...data }
    })),
  backStep: () => set((state) => ({ step: Math.max(1, state.step - 1) })),
  nextStep: () => set((state) => ({ step: Math.min(4, state.step + 1) })),
  setStep: (step: number) => set({ step: Math.min(4, Math.max(1, step)) })
}))

export default useFormStore
