'use client'

import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { getCurrentOrganization } from '@/services/organizations'
import { AnimatePresence, motion } from 'framer-motion'

import { getServerUser } from '@/lib/server'
import { Input } from '@/components/ui/input'
import { showCustomToast } from '@/components/custom-toast'

// Simple SVG Icons
const CheckCircleIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill='currentColor'
    viewBox='0 0 20 20'
    xmlns='http://www.w3.org/2000/svg'
  >
    <path
      fillRule='evenodd'
      d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
      clipRule='evenodd'
    ></path>
  </svg>
)

const SparklesIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill='currentColor'
    viewBox='0 0 20 20'
    xmlns='http://www.w3.org/2000/svg'
  >
    <path
      fillRule='evenodd'
      d='M5 2a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0V6H3a1 1 0 110-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 1a1 1 0 01.967.744L14.146 7.2 18.6 8.379a1 1 0 010 1.242L14.146 10.8l-1.179 5.456a1 1 0 01-1.934 0L9.854 10.8 5.4 9.621a1 1 0 010-1.242L9.854 7.2l1.179-5.456A1 1 0 0112 1z'
      clipRule='evenodd'
    ></path>
  </svg>
)

// Motion components
const MotionDiv = motion.div
const MotionButton = motion.button

// Types
interface QuestionOption {
  optionId: number
  value: string
}

interface Question {
  id?: number
  questionText: string
  responseTypePpi: string
  status: string
  options: QuestionOption[]
  isRequired?: boolean
}

interface FormResponse {
  [questionId: string]: string | string[]
}

// API functions
const fetchQuestionsByFormId = async (
  formId: string
): Promise<{ questions: Question[]; formId: number }> => {
  try {
    console.log('fetchQuestionsByFormId')
    const response = await fetch(
      `/api/ppi/fetchQuestionByFormId?formId=${formId}&formType=INTERNAL_FORM`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )

    if (!response.ok) {
      throw new Error('Failed to fetch questions')
    }

    const apiResponse = await response.json()

    console.log('fetchQuestionsByFormId', apiResponse)

    // Map API response to our Question interface
    const mappedQuestions: Question[] = apiResponse.map((item: any) => ({
      id: item.id,
      questionText: item.questionText,
      responseTypePpi: item.responseTypePpi,
      status: item.status,
      options:
        item.options?.map((option: any) => ({
          optionId: option.optionId || option.id,
          value: option.value
        })) || [],
      isRequired: item.isRequired
    }))

    return { questions: mappedQuestions, formId: parseInt(formId) }
  } catch (error) {
    console.error('Error fetching questions:', error)
    throw error
  }
}

const enableFormApi = async (formId: number | null, orgId: string) => {
  try {
    const response = await fetch('/api/ppi/counter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        isClick: false,
        isSubmit: true,
        formId: formId,
        formType: 'internal',
        orgId: orgId
      })
    })
    if (!response.ok) {
      throw new Error('Failed to enable form')
    }
  } catch (error) {
    console.error('Error enabling form:', error)
    throw error
  }
}

const submitFormResponse = async (
  formData: FormResponse,
  formId: number | null,
  questions: Question[]
): Promise<any> => {
  try {
    // Transform the form data to match the required format
    const responses = Object.entries(formData).map(([questionId, response]) => {
      const question = questions.find((q) => q.id?.toString() === questionId)
      const questionIdNum = parseInt(questionId)

      if (!question) {
        throw new Error(`Question not found for ID: ${questionId}`)
      }

      // For text-based responses (SINGLETEXT, MULTITEXT, TEXT)
      if (
        ['SINGLETEXT', 'MULTITEXT', 'TEXT'].includes(question.responseTypePpi)
      ) {
        return {
          questionId: questionIdNum,
          responseTypePpi: question.responseTypePpi,
          responseText: [response as string]
        }
      }

      // For single choice responses (MCQSINGLEOPTION)
      if (question.responseTypePpi === 'MCQSINGLEOPTION') {
        const selectedOption = question.options.find(
          (opt) => opt.value === response
        )
        return {
          questionId: questionIdNum,
          responseTypePpi: question.responseTypePpi,
          options: selectedOption
            ? [
                {
                  optionId: selectedOption.optionId,
                  value: selectedOption.value
                }
              ]
            : []
        }
      }

      // For multiple choice responses (MCQMULTIOPTION)
      if (question.responseTypePpi === 'MCQMULTIOPTION') {
        const selectedValues = response as string[]
        const selectedOptions = question.options.filter((opt) =>
          selectedValues.includes(opt.value)
        )
        return {
          questionId: questionIdNum,
          responseTypePpi: question.responseTypePpi,
          options: selectedOptions.map((opt) => ({
            optionId: opt.optionId,
            value: opt.value
          }))
        }
      }

      throw new Error(`Unsupported response type: ${question.responseTypePpi}`)
    })

    const payload = {
      formId: formId,
      responses: responses
    }

    console.log('Form submission payload:', payload)

    const response = await fetch('/api/ppi/response/internalForm/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      throw new Error('Failed to submit form')
    }

    return await response.json()
  } catch (error) {
    console.error('Error submitting form:', error)
    throw error
  }
}

export default function FormViewer() {
  // Get formId from search parameters
  const searchParams = useSearchParams()
  const formIdParam = searchParams.get('formId')

  // State management
  const [questions, setQuestions] = useState<Question[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [token, setToken] = useState('')
  const [user, setUser] = useState<any>({})
  const [org, setOrg] = useState<any>({})
  const [formId, setFormId] = useState<number | null>(null)
  const [formResponses, setFormResponses] = useState<FormResponse>({})
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false)
  const [formLoaded, setFormLoaded] = useState(false)
  const [logoInfo, setLogoInfo] = useState<{
    isValid: boolean
    fileName: string
    fileSize: string
    url: string | null
    isLoading: boolean
  }>({
    isValid: false,
    fileName: 'No logo',
    fileSize: '0KB',
    url: null,
    isLoading: false
  })
  const [formData, setFormData] = useState({
    title: 'the Partner - Partner Program',
    description:
      'We own esports teams, produce esports events (online & offline) and manage influencers from gaming category.'
  })

  // Utility function to check logo and extract info
  const checkLogoUrl = async (url: string) => {
    if (!url) return null

    try {
      // Extract filename from URL
      const urlParts = url.split('/')
      const fileName = urlParts[urlParts.length - 1] || 'logo'

      // Check if image exists by creating an Image object
      const img = new Image()
      const imageExists = await new Promise<boolean>((resolve) => {
        img.onload = () => resolve(true)
        img.onerror = () => resolve(false)
        img.src = url
      })

      if (imageExists) {
        // Try to estimate file size by fetching headers
        try {
          const response = await fetch(url, { method: 'HEAD' })
          const contentLength = response.headers.get('content-length')
          const sizeInBytes = contentLength ? parseInt(contentLength) : 0
          const sizeInKB = Math.round(sizeInBytes / 1024)
          const fileSize = sizeInKB > 0 ? `${sizeInKB}KB` : 'Unknown'

          return {
            isValid: true,
            fileName: fileName,
            fileSize: fileSize,
            url: url,
            isLoading: false
          }
        } catch (sizeError) {
          // If we can't get size, still return valid info
          return {
            isValid: true,
            fileName: fileName,
            fileSize: 'Unknown',
            url: url,
            isLoading: false
          }
        }
      }

      return null
    } catch (error) {
      console.error('Error checking logo URL:', error)
      return null
    }
  }

  // Load questions on component mount
  useEffect(() => {
    ;(async () => {
      if (!formIdParam) {
        showCustomToast('Error', 'Form ID is required', 'error', 5000)
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      try {
        // Try to get user and org info, but don't fail if not available (public route)
        let orgState = null
        try {
          const { token, user } = await getServerUser()
          setToken(token || '')
          setUser(user || {})
          orgState = await getCurrentOrganization()
        } catch (authError) {
          // If auth fails, continue without user/org info (public route)
          console.log('Auth not available, continuing as public route')
        }

        if (orgState) {
          setOrg(orgState)

          // Check organization logo
          if (orgState.logoUrl) {
            setLogoInfo((prev) => ({ ...prev, isLoading: true }))
            const logoData = await checkLogoUrl(orgState.logoUrl)
            if (logoData) {
              setLogoInfo({ ...logoData, isLoading: false })
            } else {
              // Logo URL exists but is invalid
              setLogoInfo({
                isValid: false,
                fileName: 'Invalid logo',
                fileSize: '0KB',
                url: null,
                isLoading: false
              })
            }
          }

          // Update form data with organization info
          setFormData((prev) => ({
            title: orgState.name + ' - ' + 'Partner Program' || prev.title,
            description: orgState.about || prev.description
          }))
        }

        // Fetch questions without requiring token (public route)
        const { questions, formId } = await fetchQuestionsByFormId(formIdParam)
        setQuestions(questions.filter((q: Question) => q.status === 'ACTIVE'))
        setFormId(formId)

        // Trigger form loaded animation after a brief delay
        setTimeout(() => {
          setFormLoaded(true)
        }, 300)
      } catch (error) {
        console.error('Failed to load questions:', error)
        showCustomToast(
          'Error',
          'Failed to load form. Please try again.',
          'error',
          5000
        )
      } finally {
        setIsLoading(false)
      }
    })()
  }, [formIdParam])

  // Handle form response change
  const handleResponseChange = (
    questionId: string,
    value: string | string[]
  ) => {
    setFormResponses((prev) => ({
      ...prev,
      [questionId]: value
    }))

    // Clear error for this field
    if (errors[questionId]) {
      setErrors((prev) => ({
        ...prev,
        [questionId]: ''
      }))
    }
  }

  // Handle radio button change
  const handleRadioChange = (questionId: string, value: string) => {
    handleResponseChange(questionId, value)
  }

  // Handle checkbox change
  const handleCheckboxChange = (
    questionId: string,
    optionValue: string,
    checked: boolean
  ) => {
    const currentValues = (formResponses[questionId] as string[]) || []
    let newValues: string[]

    if (checked) {
      newValues = [...currentValues, optionValue]
    } else {
      newValues = currentValues.filter((v) => v !== optionValue)
    }

    handleResponseChange(questionId, newValues)
  }

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {}

    questions.forEach((question) => {
      if (question.isRequired && question.id) {
        const response = formResponses[question.id.toString()]

        if (
          !response ||
          (typeof response === 'string' && response.trim() === '') ||
          (Array.isArray(response) && response.length === 0)
        ) {
          newErrors[question.id.toString()] = 'This field is required'
        }
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) {
      showCustomToast(
        'Error',
        'Please fill in all required fields',
        'error',
        5000
      )
      return
    }

    setIsSubmitting(true)

    try {
      await submitFormResponse(formResponses, formId, questions)

      // Trigger success animation
      setShowSuccessAnimation(true)
      setIsSubmitted(true)
      // Only call enableFormApi if we have org info (optional for public route)
      if (org?.id) {
        await enableFormApi(formId, org.id)
      }

      showCustomToast(
        'Success',
        '🎉 Your form has been submitted successfully!',
        'success',
        5000
      )

      // Hide animation after 3 seconds
      setTimeout(() => {
        setShowSuccessAnimation(false)
      }, 3000)
    } catch (error) {
      console.error('Form submission error:', error)
      showCustomToast(
        'Error',
        'Failed to submit form. Please try again.',
        'error',
        5000
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  // Render question based on type
  const renderQuestion = (question: Question, index: number) => {
    const questionId = question.id?.toString() || index.toString()
    const hasError = !!errors[questionId]

    const cardVariants = {
      hidden: { opacity: 0, y: 30, scale: 0.95 },
      visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
          duration: 0.6,
          delay: index * 0.08,
          ease: [0.25, 0.25, 0, 1]
        }
      }
    }

    return (
      <MotionDiv
        key={question.id || index}
        variants={cardVariants}
        initial='hidden'
        animate={formLoaded ? 'visible' : 'hidden'}
        whileHover={{
          y: -3,
          transition: { duration: 0.2, ease: 'easeOut' }
        }}
        className={`overflow-hidden rounded-2xl bg-white shadow-sm ${
          hasError
            ? 'border-red-300 bg-red-50/30'
            : isSubmitted
              ? 'border-gray-200 opacity-75'
              : ''
        }`}
      >
        <div className='p-6'>
          <div className='mb-4'>
            <div className='mb-6'>
              <label className='mb-2 block text-xl font-bold leading-relaxed text-gray-900'>
                {question.questionText}
              </label>
              {question.isRequired && (
                <span className='inline-block rounded-full bg-red-100 px-4 py-2 text-sm font-medium text-red-700'>
                  Required Field
                </span>
              )}
            </div>

            {question.responseTypePpi === 'TEXT' && (
              <textarea
                placeholder='Share your thoughts here...'
                rows={4}
                className={`w-full resize-none rounded-xl border px-4 py-4 transition-all duration-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                  hasError
                    ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500/20'
                    : 'border-gray-200 bg-gray-50/50 hover:border-gray-300'
                }`}
                value={(formResponses[questionId] as string) || ''}
                onChange={(e) =>
                  handleResponseChange(questionId, e.target.value)
                }
              />
            )}

            {question.responseTypePpi === 'SINGLETEXT' && (
              <Input
                type='text'
                placeholder='Enter your response... (max 100 characters)'
                maxLength={100}
                className={`w-full rounded-xl border px-4 py-4 transition-all duration-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                  hasError
                    ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500/20'
                    : 'border-gray-200 bg-gray-50/50 hover:border-gray-300'
                }`}
                value={(formResponses[questionId] as string) || ''}
                onChange={(e) =>
                  handleResponseChange(questionId, e.target.value)
                }
              />
            )}

            {question.responseTypePpi === 'MULTITEXT' && (
              <Input
                type='text'
                placeholder='Enter your response... (max 280 characters)'
                maxLength={280}
                className={`w-full rounded-xl border px-4 py-4 transition-all duration-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                  hasError
                    ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500/20'
                    : 'border-gray-200 bg-gray-50/50 hover:border-gray-300'
                }`}
                value={(formResponses[questionId] as string) || ''}
                onChange={(e) =>
                  handleResponseChange(questionId, e.target.value)
                }
              />
            )}

            {question.responseTypePpi === 'MCQSINGLEOPTION' && (
              <div className='space-y-3'>
                {question.options.map((option, optIndex) => (
                  <MotionDiv
                    key={option.optionId}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.08 + optIndex * 0.05 }}
                  >
                    <label className='group flex cursor-pointer items-center gap-4 rounded-xl border border-gray-100 p-4 transition-all duration-200 hover:border-blue-200 hover:bg-blue-50/30'>
                      <Input
                        type='radio'
                        name={`question-${questionId}`}
                        value={option.value}
                        checked={formResponses[questionId] === option.value}
                        onChange={(e) =>
                          handleRadioChange(questionId, e.target.value)
                        }
                        className='h-5 w-5 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0'
                      />
                      <span className='font-medium text-gray-700 transition-colors duration-200 group-hover:text-blue-700'>
                        {option.value}
                      </span>
                    </label>
                  </MotionDiv>
                ))}
              </div>
            )}

            {question.responseTypePpi === 'MCQMULTIOPTION' && (
              <div className='space-y-3'>
                {question.options.map((option, optIndex) => (
                  <MotionDiv
                    key={option.optionId}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.08 + optIndex * 0.05 }}
                  >
                    <label className='group flex cursor-pointer items-center gap-4 rounded-xl border border-gray-100 p-4 transition-all duration-200 hover:border-blue-200 hover:bg-blue-50/30'>
                      <Input
                        type='checkbox'
                        value={option.value}
                        checked={(
                          (formResponses[questionId] as string[]) || []
                        ).includes(option.value)}
                        onChange={(e) =>
                          handleCheckboxChange(
                            questionId,
                            option.value,
                            e.target.checked
                          )
                        }
                        className='h-5 w-5 rounded text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0'
                      />
                      <span className='font-medium text-gray-700 transition-colors duration-200 group-hover:text-blue-700'>
                        {option.value}
                      </span>
                    </label>
                  </MotionDiv>
                ))}
              </div>
            )}

            {hasError && (
              <MotionDiv
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className='mt-4 rounded-lg border border-red-200 bg-red-50 p-3'
              >
                <p className='text-sm font-medium text-red-600'>
                  {errors[questionId]}
                </p>
              </MotionDiv>
            )}
          </div>
        </div>
      </MotionDiv>
    )
  }

  if (isLoading) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gray-50'>
        <MotionDiv
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className='space-y-6 text-center'
        >
          <div className='relative'>
            <div className='mx-auto h-16 w-16 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600'></div>
            <div
              className='absolute inset-0 mx-auto h-16 w-16 animate-spin rounded-full border-4 border-purple-200 border-t-purple-600'
              style={{
                animationDirection: 'reverse',
                animationDuration: '1.5s'
              }}
            ></div>
          </div>
          <div>
            <h3 className='mb-2 text-xl font-semibold text-gray-800'>
              Loading your form
            </h3>
            <p className='text-gray-600'>
              Please wait while we prepare everything for you...
            </p>
          </div>
        </MotionDiv>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30'>
      {/* Success Animation Overlay */}
      <AnimatePresence>
        {showSuccessAnimation && (
          <MotionDiv
            className='fixed inset-0 z-50 flex items-center justify-center bg-white/95 backdrop-blur-sm'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <MotionDiv
              initial={{ scale: 0, rotate: -180 }}
              animate={{
                scale: [0, 1.2, 1],
                rotate: [0, 360, 360]
              }}
              transition={{
                duration: 1.2,
                ease: [0.25, 0.25, 0, 1]
              }}
              className='text-center'
            >
              <div className='space-y-8'>
                <div className='relative mx-auto h-24 w-24'>
                  <CheckCircleIcon className='h-24 w-24 text-green-500' />
                  <MotionDiv
                    className='absolute -inset-4 rounded-full border-4 border-green-400'
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{
                      scale: [1, 1.3, 1.1],
                      opacity: [0, 0.8, 0]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeOut'
                    }}
                  />
                </div>
                <div className='space-y-3'>
                  <h2 className='text-4xl font-bold text-gray-900'>Success!</h2>
                  <p className='max-w-md text-xl text-gray-600'>
                    Your application has been submitted successfully
                  </p>
                </div>
              </div>
            </MotionDiv>
          </MotionDiv>
        )}
      </AnimatePresence>

      <div className='container mx-auto max-w-4xl px-6 py-12'>
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.25, 0, 1] }}
        >
          {/* Header */}
          <MotionDiv
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className='mb-12 overflow-hidden rounded-3xl bg-white'
          >
            <div className='p-4'>
              {/* <div className='flex space-x-8'>
                <div className='relative'>
                  <div className='flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600'>
                    {logoInfo.isLoading ? (
                      <div className='h-8 w-8 animate-spin rounded-full border-4 border-white border-t-transparent'></div>
                    ) : logoInfo.isValid && logoInfo.url ? (
                      <img
                        src={logoInfo.url}
                        alt='Organization Logo'
                        className='h-full w-full object-cover'
                        onError={() => {
                          // If image fails to load, fallback to default
                          setLogoInfo((prev) => ({
                            ...prev,
                            isValid: false,
                            isLoading: false
                          }))
                        }}
                      />
                    ) : (
                      <span className='text-3xl'>📋</span>
                    )}
                  </div>
                  <div className='absolute -inset-1 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 opacity-20 blur'></div>
                </div>
                <div className='space-y-3'>
                  <h1 className='text-base font-bold leading-tight text-gray-900'>
                    {formData.title}
                  </h1>
                  <p className='text-sm leading-relaxed text-gray-600'>
                    {formData.description}
                  </p>
                </div>
              </div> */}
              <div className='overflow-hidden rounded-2xl shadow-sm'>
                {/* Gradient top area */}
                <div className='h-24 w-full bg-gradient-to-tr from-[#e4f8ff]/60 via-white/50 to-[#e1e1f8]/60'></div>

                {/* Content area */}
                <div className='flex gap-2 bg-white px-4 pb-8'>
                  <div className='flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-[#eaf1ff]'>
                    {logoInfo.isLoading ? (
                      <div className='h-8 w-8 animate-spin rounded-full border-4 border-white border-t-transparent'></div>
                    ) : logoInfo.isValid && logoInfo.url ? (
                      <img
                        src={logoInfo.url}
                        alt='Organization Logo'
                        className='h-full w-full object-cover'
                        onError={() => {
                          // If image fails to load, fallback to default
                          setLogoInfo((prev) => ({
                            ...prev,
                            isValid: false,
                            isLoading: false
                          }))
                        }}
                      />
                    ) : (
                      <span className='text-3xl'>📋</span>
                    )}
                  </div>
                  <div className='flex flex-col'>
                    <h3 className='text-2xl font-bold text-gray-800'>
                      {formData.title}
                    </h3>
                    <span className='text-base leading-relaxed text-gray-600'>
                      {formData.description}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </MotionDiv>

          {/* Form Questions */}
          {questions.length > 0 ? (
            <div className='mb-12 space-y-8'>
              {questions.map((question, index) =>
                renderQuestion(question, index)
              )}
            </div>
          ) : (
            <MotionDiv
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className='rounded-3xl bg-white p-16 text-center'
            >
              <div className='space-y-6'>
                <div className='text-8xl'>📝</div>
                <h3 className='text-2xl font-bold text-gray-800'>
                  No questions available
                </h3>
                <p className='mx-auto max-w-md text-lg text-gray-600'>
                  There are currently no active questions in this form. Please
                  check back later.
                </p>
              </div>
            </MotionDiv>
          )}

          {/* Submit Button */}
          {questions.length > 0 && !isSubmitted && (
            <MotionDiv
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + questions.length * 0.08 }}
            >
              <div className='rounded-3xl bg-white px-10 text-center'>
                <MotionButton
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  whileHover={{
                    scale: 1.02,
                    transition: { duration: 0.2 }
                  }}
                  whileTap={{ scale: 0.98 }}
                  className='group relative mx-auto flex items-center space-x-4 rounded-xl bg-blue-600 px-12 py-3 text-xl font-bold text-white disabled:cursor-not-allowed disabled:opacity-70'
                >
                  <div className='absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100'></div>
                  <div className='relative flex items-center space-x-4'>
                    {isSubmitting ? (
                      <>
                        <div className='h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent'></div>
                        <span className='font-medium'>
                          Submitting Application...
                        </span>
                      </>
                    ) : (
                      <>
                        {/* <SparklesIcon className='h-6 w-6' /> */}
                        <span className='font-medium'>Submit Application</span>
                      </>
                    )}
                  </div>
                </MotionButton>
              </div>
            </MotionDiv>
          )}

          {/* Success Message */}
          {isSubmitted && !showSuccessAnimation && (
            <MotionDiv
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className='rounded-3xl border border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 p-12 text-center'>
                <div className='space-y-6'>
                  <div className='mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-500'>
                    <CheckCircleIcon className='h-10 w-10 text-white' />
                  </div>
                  <div className='space-y-3'>
                    <h3 className='text-3xl font-bold text-green-800'>
                      Application Submitted!
                    </h3>
                    <p className='mx-auto max-w-lg text-lg leading-relaxed text-green-700'>
                      Thank you for your submission. Our team will review your
                      application and get back to you within 2-3 business days.
                    </p>
                  </div>
                </div>
              </div>
            </MotionDiv>
          )}
        </MotionDiv>
      </div>
    </div>
  )
}
