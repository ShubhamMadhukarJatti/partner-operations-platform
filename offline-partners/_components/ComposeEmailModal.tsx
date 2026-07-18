'use client'

import React, {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react'
import dynamic from 'next/dynamic'
import { useParams, useSearchParams } from 'next/navigation'
import { IconArrowBackUp, IconCircleCheckFilled } from '@tabler/icons-react'
import { ArrowLeft, ArrowRight, Eye, Loader2, Star, X } from 'lucide-react'

// @ts-ignore: CSS import without type declarations is intentional (side-effect import for ReactQuill)
import 'react-quill/dist/quill.snow.css'

import {
  EMAIL_QUICK_ACTIONS,
  EMAIL_TONE_STYLES,
  type EmailQuickAction,
  type EmailToneStyle
} from '@/constants/emailComposer'
import { type EmailTemplate } from '@/constants/emailTemplates'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { showCustomToast } from '@/components/custom-toast'

import { useEmailComposerSteps } from '../_hooks/useEmailComposerSteps'
import styles from './ComposeEmailModal.module.css'
import EmailPreview from './EmailPreview'
import EmailTemplateSelector from './EmailTemplateSelector'

const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
  loading: () => (
    <div className='h-48 w-full animate-pulse rounded-lg bg-gray-100' />
  )
})

interface PartnerDetails {
  name?: string
  partnerName?: string
  company?: string
  companyName?: string
  lifecycleStage?: string
  lifecycle_stage?: string
  status?: string
  stage?: string
  engagementLevel?: string
  engagement_level?: string
  engagement?: string
  focusArea?: string
  focus_area?: string
  preferredPartnershipTypes?: Array<{ area?: string | null }>
  preferredSectors?: Array<{ area?: string | null }>
  recentActivity?: string
  recent_activity?: string
  lastActivity?: string
  lastUpdatedNote?: string
  manager?: {
    name?: string
    email?: string
    tone_style?: string
    toneStyle?: string
  }
  partnerManagerName?: string
  partnerManagerEmail?: string
  assignedManagerName?: string
  assignedManagerEmail?: string
  additional_notes?: string
  additionalNotes?: string
  briefDescription?: string
  remarks?: string
  tags?: string[]
  triggerType?: string
  maxDrafts?: number
}

interface EmailAgentDraft {
  subject: string
  body: string
  tone?: string
  cta?: string
  estimated_reply_probability?: number
  rationale?: string
}

interface EmailAgentGeneratePayload {
  partner: {
    partner_name: string
    company: string
    lifecycle_stage: string
    engagement_level: string
    focus_area: string
    recent_activity: string
    manager: {
      name: string
      email: string
      tone_style: EmailToneStyle
    }
    additional_notes: string
  }
  trigger_type: string
  max_drafts: number
}

interface EmailAgentGenerateResponse {
  drafts?: EmailAgentDraft[]
}

interface ComposeEmailModalProps {
  open: boolean
  onClose: () => void
  recipientEmail?: string
  recipientName?: string
  partnerDetails?: PartnerDetails
  currentOrganization?: Record<string, any>
  inDummyFlow?: boolean
}

// Inner component that uses useSearchParams
const ComposeEmailModalInner: React.FC<ComposeEmailModalProps> = ({
  open,
  onClose,
  recipientEmail = '',
  recipientName = '',
  partnerDetails,
  currentOrganization,
  inDummyFlow = false
}) => {
  const params = useParams()
  const searchParams = useSearchParams()
  const externalPartnerCode =
    (params?.id as string | undefined) ?? searchParams.get('code')

  const resolvedRecipient = useMemo(() => {
    if (
      typeof recipientEmail === 'string' &&
      recipientEmail.trim().length > 0
    ) {
      return recipientEmail.trim()
    }

    if (typeof recipientName === 'string' && recipientName.trim().length > 0) {
      return recipientName.trim()
    }

    return ''
  }, [recipientEmail, recipientName])

  const {
    currentStep,
    formData,
    goToTemplateSelection,
    goBackToCompose,
    goToPreview,
    goBackFromPreview,
    applyTemplate,
    updateFormData
  } = useEmailComposerSteps({
    to: resolvedRecipient,
    subject: '',
    body: '',
    customPrompt: ''
  })

  const determineInitialToneStyle = (): EmailToneStyle => {
    const manager = partnerDetails?.manager
    const managerTone =
      (manager as { tone_style?: string } | undefined)?.tone_style ||
      (manager as { toneStyle?: string } | undefined)?.toneStyle ||
      null

    const candidate = managerTone || currentOrganization?.preferredTone || null

    if (typeof candidate === 'string') {
      const normalized = candidate.trim().toUpperCase()
      if (EMAIL_TONE_STYLES.includes(normalized as EmailToneStyle)) {
        return normalized as EmailToneStyle
      }
    }

    return 'PROFESSIONAL'
  }

  const [selectedTags, setSelectedTags] = useState<EmailQuickAction[]>([])
  const [toneStyle, setToneStyle] = useState<EmailToneStyle>(() =>
    determineInitialToneStyle()
  )
  const [draftOptions, setDraftOptions] = useState<EmailTemplate[]>([])
  const [isGeneratingDrafts, setIsGeneratingDrafts] = useState(false)
  const [generationError, setGenerationError] = useState<string | null>(null)
  const [isSending, setIsSending] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  const resolvedTriggerType = useMemo(() => {
    const candidate = partnerDetails?.triggerType
    if (typeof candidate === 'string' && candidate.trim().length > 0) {
      return candidate
    }
    return 'Deal Update Reminder'
  }, [partnerDetails?.triggerType])

  const resolvedMaxDrafts = useMemo(() => {
    const candidate = partnerDetails?.maxDrafts
    const parsed = Number(candidate)
    if (Number.isFinite(parsed) && parsed > 0) {
      return Math.min(parsed, 5)
    }
    return 2
  }, [partnerDetails?.maxDrafts])

  useEffect(() => {
    if (formData.to !== resolvedRecipient) {
      updateFormData({ to: resolvedRecipient })
    }
  }, [formData.to, resolvedRecipient, updateFormData])

  const handleInputChange = (
    field: 'to' | 'subject' | 'body' | 'customPrompt',
    value: string
  ) => {
    updateFormData({ [field]: value })
  }

  const handleTagSelect = (tag: EmailQuickAction) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

  const buildEmailAgentPayload =
    useCallback((): EmailAgentGeneratePayload | null => {
      const partnerName =
        partnerDetails?.partnerName ||
        partnerDetails?.name ||
        recipientName ||
        resolvedRecipient

      const companyName =
        partnerDetails?.company ||
        partnerDetails?.companyName ||
        partnerDetails?.name ||
        currentOrganization?.name ||
        partnerName ||
        ''

      if (!partnerName || !companyName) {
        return null
      }

      const lifecycleStage =
        partnerDetails?.lifecycle_stage ||
        partnerDetails?.lifecycleStage ||
        partnerDetails?.status ||
        partnerDetails?.stage ||
        'Active'

      const engagementLevel =
        partnerDetails?.engagement_level ||
        partnerDetails?.engagementLevel ||
        partnerDetails?.engagement ||
        'Medium'

      const focusAreaCandidates: string[] = []
      if (partnerDetails?.focus_area || partnerDetails?.focusArea) {
        focusAreaCandidates.push(
          partnerDetails?.focus_area || partnerDetails?.focusArea || ''
        )
      }
      if (Array.isArray(partnerDetails?.preferredPartnershipTypes)) {
        focusAreaCandidates.push(
          partnerDetails?.preferredPartnershipTypes
            .map((item) => item?.area)
            .filter(Boolean)
            .join(', ')
        )
      }
      if (focusAreaCandidates.length === 0) {
        focusAreaCandidates.push('Co-selling')
      }

      const recentActivity =
        partnerDetails?.recent_activity ||
        partnerDetails?.recentActivity ||
        partnerDetails?.lastActivity ||
        partnerDetails?.lastUpdatedNote ||
        'Engaged recently'

      const managerName =
        partnerDetails?.manager?.name ||
        partnerDetails?.partnerManagerName ||
        partnerDetails?.assignedManagerName ||
        currentOrganization?.primaryContactName ||
        currentOrganization?.name ||
        'Sharkdom Team'

      const managerEmail =
        partnerDetails?.manager?.email ||
        partnerDetails?.partnerManagerEmail ||
        partnerDetails?.assignedManagerEmail ||
        currentOrganization?.primaryEmail ||
        'hello@sharkdom.com'

      const additionalNotesPieces: string[] = []
      if (partnerDetails?.additional_notes || partnerDetails?.additionalNotes) {
        additionalNotesPieces.push(
          partnerDetails?.additional_notes ||
            partnerDetails?.additionalNotes ||
            ''
        )
      }
      if (partnerDetails?.briefDescription) {
        additionalNotesPieces.push(partnerDetails.briefDescription)
      }
      if (partnerDetails?.remarks) {
        additionalNotesPieces.push(partnerDetails.remarks)
      }
      if (
        Array.isArray(partnerDetails?.tags) &&
        partnerDetails.tags.length > 0
      ) {
        additionalNotesPieces.push(`Tags: ${partnerDetails.tags.join(', ')}`)
      }
      if (formData.customPrompt) {
        additionalNotesPieces.push(
          `Additional instruction: ${formData.customPrompt}`
        )
      }
      if (selectedTags.length > 0) {
        additionalNotesPieces.push(`Emphasis: ${selectedTags.join(', ')}`)
      }

      const additionalNotes =
        additionalNotesPieces.filter(Boolean).join(' | ') ||
        'Partner actively engaged with Sharkdom platform.'

      return {
        partner: {
          partner_name: partnerName,
          company: companyName,
          lifecycle_stage: lifecycleStage,
          engagement_level: engagementLevel,
          focus_area: focusAreaCandidates.filter(Boolean).join(', '),
          recent_activity: recentActivity,
          manager: {
            name: managerName,
            email: managerEmail,
            tone_style: toneStyle
          },
          additional_notes: additionalNotes
        },
        trigger_type: resolvedTriggerType,
        max_drafts: resolvedMaxDrafts
      }
    }, [
      partnerDetails,
      recipientName,
      resolvedRecipient,
      currentOrganization,
      toneStyle,
      formData.customPrompt,
      selectedTags,
      resolvedTriggerType,
      resolvedMaxDrafts
    ])

  const generateDrafts = useCallback(async () => {
    const payload = buildEmailAgentPayload()

    if (!payload) {
      showCustomToast(
        'Error',
        'Missing partner details to generate drafts.',
        'error',
        5000
      )
      return
    }

    setIsGeneratingDrafts(true)
    setGenerationError(null)
    setDraftOptions([])

    try {
      const response = await fetch('/api/email/agent/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}))
        const message =
          errorBody?.error ||
          errorBody?.message ||
          `Failed to generate drafts (${response.status})`
        throw new Error(message)
      }

      const data = (await response.json()) as EmailAgentGenerateResponse
      const drafts = data?.drafts ?? []

      if (!drafts.length) {
        setDraftOptions([])
        setGenerationError(
          'No drafts generated. Please adjust inputs and try again.'
        )
        return
      }

      const now = Date.now()
      const normaliseDraftBody = (text: string | undefined): string => {
        if (!text) return ''
        const trimmed = text.trim()
        if (/<[a-z][\s\S]*>/i.test(trimmed)) {
          return trimmed
        }

        const paragraphs = trimmed.split(/\n\s*\n/)
        const html = paragraphs
          .map((paragraph) => {
            const safeParagraph = paragraph.replace(/\n/g, '<br />').trim()
            return safeParagraph.length ? `<p>${safeParagraph}</p>` : '<p></p>'
          })
          .join('')

        return html || `<p>${trimmed}</p>`
      }

      const mappedDrafts: EmailTemplate[] = drafts.map((draft, index) => ({
        id: `draft-${now}-${index}`,
        subject: draft.subject,
        body: normaliseDraftBody(draft.body),
        tone: draft.tone,
        cta: draft.cta,
        estimated_reply_probability: draft.estimated_reply_probability,
        rationale: draft.rationale
      }))

      setDraftOptions(mappedDrafts)
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unable to generate drafts.'
      setGenerationError(message)
      showCustomToast('Error', message, 'error', 5000)
    } finally {
      setIsGeneratingDrafts(false)
    }
  }, [buildEmailAgentPayload])

  const handleShowTemplateSelection = useCallback(async () => {
    goToTemplateSelection()
    await generateDrafts()
  }, [goToTemplateSelection, generateDrafts])

  const handleRegenerate = useCallback(async () => {
    await handleShowTemplateSelection()
  }, [handleShowTemplateSelection])

  const handleToneChange = useCallback((value: EmailToneStyle) => {
    setToneStyle(value)
  }, [])

  const handleTemplateSelect = useCallback(
    (template: EmailTemplate) => {
      applyTemplate(template)

      if (template.tone) {
        const normalizedTone = template.tone.trim().toUpperCase()
        if (EMAIL_TONE_STYLES.includes(normalizedTone as EmailToneStyle)) {
          setToneStyle(normalizedTone as EmailToneStyle)
        }
      }
    },
    [applyTemplate]
  )

  const handlePreview = () => {
    if (!formData.subject || !formData.body) {
      showCustomToast(
        'Warning',
        'Select a draft or compose content before previewing.',
        'error',
        5000
      )
      return
    }
    goToPreview()
  }

  const handleSend = async () => {
    if (inDummyFlow) {
      showCustomToast(
        'Info',
        'No edit access for this dummy account',
        'info',
        5000
      )
      return
    }

    setIsSending(true)
    try {
      // Use the external partner endpoint
      const endpoint = '/api/email/outreach/message/send/external/partner'

      // Construct payload matching the API's expected format
      const payload = {
        to: recipientEmail || formData.to,
        from: 'office@mg.sharkdom.com',
        subject: formData.subject,
        body: formData.body,
        externalPartnerCode: Number(externalPartnerCode)
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to send email')
      }

      const result = await response.json()
      console.log('Email sent successfully:', result)

      setEmailSent(true)
      showCustomToast('Success', 'Email sent successfully!', 'success', 5000)

      // Auto close after showing success for 2 seconds
      setTimeout(() => {
        onClose()
        setEmailSent(false)
        setIsSending(false)
      }, 2000)
    } catch (error) {
      console.error('Error sending email:', error)
      showCustomToast(
        'Error',
        error instanceof Error ? error.message : 'Failed to send email',
        'error',
        5000
      )
      setIsSending(false)
    }
  }

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline'],
      [{ color: [] }, { background: [] }],
      [{ align: [] }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link'],
      ['clean']
    ]
  }

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className='max-w-4xl p-0' hideCloseBtn>
        {/* Loading Overlay */}
        {isSending && (
          <div className='absolute inset-0 z-50 flex items-center justify-center bg-white'>
            <div className='flex flex-col items-center space-y-4'>
              {emailSent ? (
                <>
                  <IconCircleCheckFilled
                    size={100}
                    className='text-[#2BA84A]'
                  />
                  <p className='text-base font-medium text-text-60'>
                    Email Sent
                  </p>
                </>
              ) : (
                <Loader2 className='h-12 w-12 animate-spin text-primary-blue' />
              )}
            </div>
          </div>
        )}
        {/* Header */}
        <DialogHeader
          className={`flex flex-row items-center justify-between px-6 py-2 ${isSending ? 'opacity-0' : 'opacity-100'}`}
        >
          {currentStep === 'preview' ? (
            <>
              <Button
                variant='ghost'
                size='sm'
                onClick={goBackFromPreview}
                className='flex items-center gap-2'
              >
                <ArrowLeft className='h-4 w-4' />
                Back
              </Button>
              <Button
                variant='ghost'
                size='sm'
                onClick={onClose}
                className='h-auto p-1'
              >
                <X className='h-5 w-5' />
              </Button>
            </>
          ) : (
            <>
              <DialogTitle className='text-lg font-bold text-text-100'>
                Compose Email using AI
              </DialogTitle>
              <Button
                variant='ghost'
                size='sm'
                onClick={onClose}
                className='h-auto p-1'
              >
                <X className='h-5 w-5' />
              </Button>
            </>
          )}
        </DialogHeader>

        {/* Content */}
        <div
          className={`no-scrollbar max-h-[calc(100vh-200px)] overflow-y-auto px-6 pb-6 ${isSending ? 'opacity-0' : 'opacity-100'}`}
        >
          {currentStep === 'select-template' ? (
            <EmailTemplateSelector
              onBack={goBackToCompose}
              onNext={handleTemplateSelect}
              templates={draftOptions}
              isLoading={isGeneratingDrafts}
              error={generationError}
              onRetry={generateDrafts}
            />
          ) : currentStep === 'preview' ? (
            <>
              <EmailPreview
                formData={formData}
                recipientEmail={recipientEmail}
                recipientName={recipientName}
              />
              {/* Send Button for Preview */}
              <div className='mt-6 flex justify-end'>
                <Button
                  onClick={handleSend}
                  disabled={isSending}
                  className='hover:bg-primary-blue/90 flex items-center gap-2 bg-primary-blue text-white'
                >
                  {isSending ? 'Sending...' : 'Send'}
                  <ArrowRight className='h-4 w-4' />
                </Button>
              </div>
            </>
          ) : (
            <>
              {/* Bordered Section */}
              <div className='rounded-2xl border border-gray-200'>
                {/* To and Subject Section */}
                <div className='space-y-4 border-b border-gray-200 p-6'>
                  <div className='flex items-center gap-4'>
                    <label className='w-16 text-sm font-medium text-gray-700'>
                      To:
                    </label>
                    <span className='text-base font-medium text-text-100'>
                      {recipientEmail || recipientName}
                    </span>
                  </div>
                  <div className='flex items-center gap-4'>
                    <label className='text-sm font-medium text-gray-700'>
                      Subject:
                    </label>
                    <Input
                      value={formData.subject}
                      onChange={(e) =>
                        handleInputChange('subject', e.target.value)
                      }
                      placeholder='Enter subject line...'
                      className='h-9 w-full flex-1 border border-text-50 bg-white pl-3 text-sm'
                    />
                  </div>
                </div>

                {/* Rich Text Editor Section */}
                <div className='border-b border-gray-200'>
                  <div className={styles.quillWrapper}>
                    <ReactQuill
                      theme='snow'
                      value={formData.body}
                      onChange={(value) => handleInputChange('body', value)}
                      modules={quillModules}
                      placeholder='Compose your email...'
                    />
                  </div>
                </div>

                {/* Quick Actions Section */}
                <div className='p-6'>
                  <h3 className='mb-4 text-base font-medium text-gray-900'>
                    Quick Actions
                  </h3>

                  <div className='mb-4 flex flex-col gap-2'>
                    <span className='text-sm font-medium text-gray-700'>
                      Tone Style
                    </span>
                    <Select
                      value={toneStyle}
                      onValueChange={(value) =>
                        handleToneChange(value as EmailToneStyle)
                      }
                    >
                      <SelectTrigger className='h-9 w-full max-w-xs border border-text-50 bg-white text-sm'>
                        <SelectValue placeholder='Choose tone style' />
                      </SelectTrigger>
                      <SelectContent>
                        {EMAIL_TONE_STYLES.map((tone) => (
                          <SelectItem key={tone} value={tone}>
                            {tone.charAt(0) + tone.slice(1).toLowerCase()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Tags */}
                  <div className='mb-4 flex flex-wrap gap-2'>
                    {EMAIL_QUICK_ACTIONS.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => handleTagSelect(tag)}
                        className={`rounded-full border px-3 py-1 text-sm transition-colors ${
                          selectedTags.includes(tag)
                            ? 'border-primary-blue bg-primary-blue text-white'
                            : 'border-gray-300 bg-white text-gray-700 hover:border-primary-blue'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>

                  {/* Custom Prompt */}
                  <div className='space-y-2'>
                    <h4 className='text-base font-medium text-gray-500'>
                      Custom Prompt
                    </h4>
                    <div className='flex items-center gap-2'>
                      <Input
                        value={formData.customPrompt}
                        onChange={(e) =>
                          handleInputChange('customPrompt', e.target.value)
                        }
                        placeholder='Text goes here'
                        className='h-9 w-full flex-1 border border-text-50 bg-white pl-3 text-sm'
                      />
                      <Button
                        variant='primary'
                        size='sm'
                        className='h-8 w-8 p-1'
                      >
                        <IconArrowBackUp className='h-4 w-4' />
                      </Button>
                      <Button
                        onClick={handleRegenerate}
                        disabled={isSending || isGeneratingDrafts}
                        className='hover:bg-primary-blue/90 bg-primary-blue text-white'
                      >
                        <Star className='mr-2 h-4 w-4' />
                        {isGeneratingDrafts ? 'Regenerating...' : 'Regenerate'}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Buttons */}
              <div className='mt-6 flex justify-end gap-3'>
                <Button
                  variant='primary'
                  onClick={handlePreview}
                  className='flex items-center gap-2'
                >
                  <Eye className='h-4 w-4' />
                  Preview
                </Button>
                <Button
                  onClick={handleSend}
                  disabled={
                    isSending ||
                    !formData.subject ||
                    !formData.body ||
                    !formData.to
                  }
                  className='hover:bg-primary-blue/90 flex items-center gap-2 bg-primary-blue text-white'
                >
                  Send
                  <ArrowRight className='h-4 w-4' />
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Wrapper component with proper Suspense boundary
const ComposeEmailModal: React.FC<ComposeEmailModalProps> = (props) => {
  return (
    <Suspense
      fallback={
        <Dialog open={props.open} onOpenChange={props.onClose}>
          <DialogContent className='flex items-center justify-center'>
            <div className='h-8 w-8 animate-spin rounded-full border-4 border-primary-blue border-t-transparent' />
          </DialogContent>
        </Dialog>
      }
    >
      <ComposeEmailModalInner {...props} />
    </Suspense>
  )
}

export default ComposeEmailModal
