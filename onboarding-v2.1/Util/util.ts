import { StepOption } from '../types/types'

export const updateStepSelection = (
  steps: StepOption[],
  stepId: StepOption['id'],
  mode: 'select' | 'toggle' = 'select'
): StepOption[] => {
  return steps.map((step) => ({
    ...step,
    isSelected:
      step.id === stepId
        ? mode === 'toggle'
          ? !step.isSelected
          : true
        : mode === 'select'
          ? false
          : step.isSelected
  }))
}

export const isStepValid = (step: number, state: any): boolean => {
  switch (step) {
    case 1:
      return state.name?.trim() !== ''
    case 2:
      return state.websiteUrl?.trim() !== ''
    case 3:
      return state.currentRole !== ''
    case 4:
      return state.marketSegment !== ''
    case 5:
      return state.partnershipTeamStrength !== ''
    case 6:
      return state.currentPartnersCount !== ''
    case 7:
      return state.goalToUseSharkdom !== ''
    case 8:
      return Array.isArray(state.reagon) && state.reagon.length > 0
    case 9:
      return (
        state.partnershipType?.trim() !== '' &&
        state.partnershipType?.trim().length > 0
      )
    case 10:
      return true // Final step doesn't need validation
    default:
      return false
  }
}

type StepData = string | boolean | string[]

export const updateSelection = (
  data: StepData,
  options: StepOption[]
): StepOption[] => {
  console.log('updateSelection called with:', { data, dataType: typeof data })

  const selectionValues: string[] =
    typeof data === 'boolean'
      ? [data ? 'Yes' : 'No']
      : Array.isArray(data)
        ? data
        : typeof data === 'string' && data.includes(',')
          ? data
              .split(',')
              .map((v) => v.trim())
              .filter((v) => v !== '')
          : data
            ? [data]
            : []

  console.log('selectionValues:', selectionValues)

  const result = options.map((option) => ({
    ...option,
    isSelected:
      selectionValues.includes(option.name) ||
      selectionValues.includes(option.apiValue || '')
  }))

  console.log(
    'updateSelection result:',
    result.map((r) => ({ name: r.name, isSelected: r.isSelected }))
  )

  return result
}
