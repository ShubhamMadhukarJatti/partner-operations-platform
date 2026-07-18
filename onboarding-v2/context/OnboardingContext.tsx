'use client'

import React, { createContext, ReactNode, useContext, useReducer } from 'react'

interface OnboardingState {
  step1: string
  step2: string
  step3: string
  step4: string
  step5: string
  step6: string
  step7: string
  step8: string
  step9: string
  step10: string
  step11: string
  step12: string
  step13: string
  step14: string[]
  step15: string
}

type OnboardingAction =
  | {
      type: 'UPDATE_STEP'
      step: keyof OnboardingState
      value: string | string[]
    }
  | { type: 'RESET_STATE' }

const initialState: OnboardingState = {
  step1: '',
  step2: '',
  step3: '',
  step4: '',
  step5: '',
  step6: '',
  step7: '',
  step8: '',
  step9: '',
  step10: '',
  step11: '',
  step12: '',
  step13: '',
  step14: [],
  step15: ''
}

const onboardingReducer = (
  state: OnboardingState,
  action: OnboardingAction
): OnboardingState => {
  switch (action.type) {
    case 'UPDATE_STEP':
      return {
        ...state,
        [action.step]: action.value
      }
    case 'RESET_STATE':
      return initialState
    default:
      return state
  }
}

interface OnboardingContextType {
  state: OnboardingState
  updateStep: (step: keyof OnboardingState, value: string | string[]) => void
  resetState: () => void
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(
  undefined
)

export const OnboardingProvider: React.FC<{ children: ReactNode }> = ({
  children
}) => {
  const [state, dispatch] = useReducer(onboardingReducer, initialState)

  const updateStep = (
    step: keyof OnboardingState,
    value: string | string[]
  ) => {
    dispatch({ type: 'UPDATE_STEP', step, value })
  }

  const resetState = () => {
    dispatch({ type: 'RESET_STATE' })
  }

  return (
    <OnboardingContext.Provider value={{ state, updateStep, resetState }}>
      {children}
    </OnboardingContext.Provider>
  )
}

export const useOnboarding = () => {
  const context = useContext(OnboardingContext)
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider')
  }
  return context
}
