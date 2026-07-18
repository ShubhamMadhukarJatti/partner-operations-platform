import { useCallback, useState } from 'react'
import { type EmailTemplate } from '@/constants/emailTemplates'

export type ComposerStep = 'compose' | 'select-template' | 'preview'

export interface EmailFormData {
  to: string
  subject: string
  body: string
  customPrompt: string
}

interface UseEmailComposerStepsReturn {
  currentStep: ComposerStep
  formData: EmailFormData
  goToTemplateSelection: () => void
  goBackToCompose: () => void
  goToPreview: () => void
  goBackFromPreview: () => void
  applyTemplate: (template: EmailTemplate) => void
  updateFormData: (updates: Partial<EmailFormData>) => void
}

export const useEmailComposerSteps = (
  initialFormData: EmailFormData
): UseEmailComposerStepsReturn => {
  const [currentStep, setCurrentStep] = useState<ComposerStep>('compose')
  const [formData, setFormData] = useState<EmailFormData>(initialFormData)

  const goToTemplateSelection = useCallback(() => {
    setCurrentStep('select-template')
  }, [])

  const goBackToCompose = useCallback(() => {
    setCurrentStep('compose')
  }, [])

  const goToPreview = useCallback(() => {
    setCurrentStep('preview')
  }, [])

  const goBackFromPreview = useCallback(() => {
    setCurrentStep('compose')
  }, [])

  const applyTemplate = useCallback((template: EmailTemplate) => {
    setFormData((prev) => ({
      ...prev,
      subject: template.subject,
      body: template.body
    }))
    setCurrentStep('compose')
  }, [])

  const updateFormData = useCallback((updates: Partial<EmailFormData>) => {
    setFormData((prev) => ({
      ...prev,
      ...updates
    }))
  }, [])

  return {
    currentStep,
    formData,
    goToTemplateSelection,
    goBackToCompose,
    goToPreview,
    goBackFromPreview,
    applyTemplate,
    updateFormData
  }
}
