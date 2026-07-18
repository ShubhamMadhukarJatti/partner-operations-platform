'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  Check,
  ChevronDown,
  Clock,
  Copy,
  Edit,
  FileText,
  Mail,
  Play,
  Share2,
  Tag,
  TrendingUp,
  Users,
  Video,
  X,
  Zap
} from 'lucide-react'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { showCustomToast } from '@/components/custom-toast'

import PartnersList, { Partner } from '../../view/_components/PartnersList'

interface StageImage {
  id: number
  imageUrl: string
  order: number
}

interface StageContent {
  stageId: number
  content: string
  contentType?: 'VIDEO' | 'DOCUMENT' | 'TEXT'
  thumbnailUrl?: string
  driveLink?: string
  documentLink?: string
  chapterTitle?: string
  images: StageImage[]
}

interface QuizQuestion {
  id: number
  question: string
  options: string[]
  order: number
}

interface Quiz {
  quizId: number
  title: string
  questions: QuizQuestion[]
}

interface Stage {
  stageId: number
  title: string
  type: 'CONTENT' | 'QUIZ'
  order: number
  content: StageContent | null
  quiz: Quiz | null
}

interface CourseDetails {
  courseId: number
  title: string
  description: string
  coverImageUrl: string | null
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
  durationMinutes: number
  published: boolean
  stageCount: number
  stages: Stage[]
  labelNames?: string[]
  labels?: string[] | { id: number; name: string }[]
}

interface ApiResponse {
  success: boolean
  message: string
  data: CourseDetails
}

interface AssignmentRules {
  courseId: number
  tiers: string[]
  geographies: string[]
  programTypes: string[]
}

interface Tier {
  id: string | number
  name: string
  active?: boolean
}

// Partner Assign Dropdown Component
interface PartnerAssignDropdownProps {
  partners: { orgId: number; name: string }[]
  selectedPartnerId: number | null
  onSelect: (partnerId: number | null) => void
  loading?: boolean
  placeholder?: string
}

function PartnerAssignDropdown({
  partners = [],
  selectedPartnerId = null,
  onSelect,
  loading = false,
  placeholder = 'Select Partner'
}: PartnerAssignDropdownProps) {
  const [label, setLabel] = useState<string>(placeholder)

  useEffect(() => {
    if (selectedPartnerId) {
      const found = partners.find((p) => p.orgId === selectedPartnerId)
      if (found?.name) setLabel(found.name)
      else setLabel(placeholder)
    } else {
      setLabel(placeholder)
    }
  }, [selectedPartnerId, partners, placeholder])

  const selectedBtnClasses =
    'rounded-2xl border border-[var(--color-blue-61,#3E50F7)] bg-[var(--Color-Hover,#F1F2FE)]'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          disabled={loading}
          className={`focus:ring-none grid h-9 w-full grid-cols-[1fr_auto] items-center gap-2 rounded-2xl border border-[#E4E7EE] p-0 px-4 text-sm text-[#2A3241] hover:bg-transparent${
            selectedPartnerId
              ? ` ${selectedBtnClasses}`
              : ' rounded-2xl border border-[#E4E7EE]'
          }`}
          aria-label='Assign partner'
        >
          <span className='truncate text-left font-normal'>
            {loading ? 'Loading...' : label}
          </span>
          <ChevronDown className='size-4' />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent side='bottom' align='start' className='w-full p-1'>
        {/* Clear selection option */}
        {selectedPartnerId && (
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation()
              onSelect(null) // deselect
            }}
            className='flex items-center gap-2 rounded-[8px] px-3 py-2 text-sm text-text-70 hover:bg-[var(--Color-Hover,#F1F2FE)]'
          >
            <X size={16} />
            <span>Clear selection</span>
          </DropdownMenuItem>
        )}

        {partners && partners.length > 0 ? (
          partners.map((partner) => {
            const isSelected = partner.orgId === selectedPartnerId
            return (
              <DropdownMenuItem
                key={partner.orgId}
                onClick={(e) => {
                  e.stopPropagation()
                  // toggle selection: deselect if already selected
                  if (isSelected) onSelect(null)
                  else onSelect(partner.orgId)
                }}
                className={`flex items-center gap-2 px-3 py-2 ${
                  isSelected
                    ? 'rounded-[8px] bg-[var(--Color-Hover,#F1F2FE)]'
                    : ''
                }`}
              >
                <span className='text-sm'>{partner.name}</span>
                {isSelected ? <Check className='ml-auto' size={16} /> : null}
              </DropdownMenuItem>
            )
          })
        ) : (
          <DropdownMenuItem disabled className='px-3 py-2'>
            {loading ? 'Loading partners...' : 'No partners available'}
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

const CourseDetailPage = () => {
  const params = useParams()
  const router = useRouter()
  const courseId = params.id as string

  const [courseData, setCourseData] = useState<CourseDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [assignmentRules, setAssignmentRules] =
    useState<AssignmentRules | null>(null)
  const [tiers, setTiers] = useState<Tier[]>([])
  const [loadingRules, setLoadingRules] = useState(true)
  const [playingVideoId, setPlayingVideoId] = useState<number | null>(null)
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [accessLevel, setAccessLevel] = useState('VIEW_ONLY')
  const [isTrackable, setIsTrackable] = useState(true)
  const [expiryDays, setExpiryDays] = useState(7)
  const [shareableLink, setShareableLink] = useState('')
  const [isSendingInvite, setIsSendingInvite] = useState(false)
  const [inviteError, setInviteError] = useState<string | null>(null)
  const [coursePartners, setCoursePartners] = useState<Partner[]>([])
  const [loadingCoursePartners, setLoadingCoursePartners] = useState(true)
  const [courseInsights, setCourseInsights] = useState<{
    totalPartner: number
    adoption: number
    completion: number
    avgReadiness: number
  } | null>(null)
  const [loadingInsights, setLoadingInsights] = useState(true)
  const [activePartners, setActivePartners] = useState<
    { orgId: number; name: string }[]
  >([])
  const [loadingActivePartners, setLoadingActivePartners] = useState(false)
  const [selectedPartnerId, setSelectedPartnerId] = useState<number | null>(
    null
  )
  const [isAssigning, setIsAssigning] = useState(false)
  const [assignError, setAssignError] = useState<string | null>(null)
  const [isPublishing, setIsPublishing] = useState(false)

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(
          `/api/partner/training/courses/${courseId}/details`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          }
        )

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.message || 'Failed to fetch course details')
        }

        const data: ApiResponse = await response.json()

        if (data.success && data.data) {
          setCourseData(data.data)
        } else {
          throw new Error(data.message || 'Failed to fetch course details')
        }
      } catch (err) {
        console.error('Error fetching course details:', err)
        setError(
          err instanceof Error ? err.message : 'Failed to fetch course details'
        )
      } finally {
        setLoading(false)
      }
    }

    if (courseId) {
      fetchCourseDetails()
    }
  }, [courseId])

  // Fetch assignment rules and tiers
  useEffect(() => {
    const fetchAssignmentRules = async () => {
      try {
        setLoadingRules(true)
        const [rulesResponse, tiersResponse] = await Promise.all([
          fetch(`/api/partner/training/courses/${courseId}/assignment/rules`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            },
            credentials: 'include'
          }),
          fetch('/api/catalogues/partner/tiers', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            },
            credentials: 'include'
          })
        ])

        if (rulesResponse.ok) {
          const rulesResult = await rulesResponse.json()
          if (rulesResult.success && rulesResult.data) {
            setAssignmentRules(rulesResult.data)
            // console.log('Assignment rules loaded:', rulesResult.data)
          } else {
            console.warn('Assignment rules response structure:', rulesResult)
          }
        } else {
          const errorText = await rulesResponse
            .text()
            .catch(() => rulesResponse.statusText)
          console.error(
            'Failed to fetch assignment rules:',
            rulesResponse.status,
            errorText
          )
        }

        if (tiersResponse.ok) {
          const tiersResult = await tiersResponse.json()

          // Handle the nested structure: result.data.tiers.content
          let tiersArray: any[] = []

          if (tiersResult.success && tiersResult.data) {
            // Check for nested structure: data.tiers.content (from the API response)
            if (
              tiersResult.data.tiers &&
              tiersResult.data.tiers.content &&
              Array.isArray(tiersResult.data.tiers.content)
            ) {
              tiersArray = tiersResult.data.tiers.content
            }
            // Check for direct array in data
            else if (Array.isArray(tiersResult.data)) {
              tiersArray = tiersResult.data
            }
            // Check for data.tiers as array
            else if (
              tiersResult.data.tiers &&
              Array.isArray(tiersResult.data.tiers)
            ) {
              tiersArray = tiersResult.data.tiers
            }
          }
          // Handle case where API returns array directly
          else if (Array.isArray(tiersResult)) {
            tiersArray = tiersResult
          }

          if (tiersArray.length > 0) {
            // Map tiers from API response
            const mappedTiers: Tier[] = tiersArray.map((tier: any) => ({
              id: tier.id || tier.tierId,
              name: tier.tierName || tier.name,
              active: tier.active !== undefined ? tier.active : true
            }))
            setTiers(mappedTiers)
            console.log(
              'Tiers loaded successfully:',
              mappedTiers.length,
              'tiers'
            )
          } else {
            console.warn(
              'No tiers found in response. Response structure:',
              tiersResult
            )
            setTiers([])
          }
        }
      } catch (error) {
        console.error('Error fetching assignment rules:', error)
      } finally {
        setLoadingRules(false)
      }
    }

    if (courseId) {
      fetchAssignmentRules()
    }
  }, [courseId])

  // Fetch course associated partners
  useEffect(() => {
    const fetchCoursePartners = async () => {
      try {
        setLoadingCoursePartners(true)
        const response = await fetch(
          `/api/partner/training/dashboard/associated/partners/course/${courseId}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          }
        )

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          console.error('Failed to fetch course partners:', errorData)
          setCoursePartners([])
          return
        }

        const data = await response.json()

        if (data.success && data.data) {
          // Map API response to Partner format
          const mappedPartners: Partner[] = Array.isArray(data.data)
            ? data.data.map((partner: any, index: number) => ({
                id: partner.id || partner.organizationId || index,
                name:
                  partner.name || partner.organizationName || 'Unknown Partner'
              }))
            : []
          setCoursePartners(mappedPartners)
        } else {
          setCoursePartners([])
        }
      } catch (error) {
        console.error('Error fetching course partners:', error)
        setCoursePartners([])
      } finally {
        setLoadingCoursePartners(false)
      }
    }

    if (courseId) {
      fetchCoursePartners()
    }
  }, [courseId])

  // Fetch course insights
  useEffect(() => {
    const fetchCourseInsights = async () => {
      try {
        setLoadingInsights(true)
        const response = await fetch(
          `/api/partner/training/dashboard/course/${courseId}/insights`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          }
        )

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          console.error('Failed to fetch course insights:', errorData)
          return
        }

        const data = await response.json()

        if (data.success && data.data) {
          setCourseInsights(data.data)
        }
      } catch (error) {
        console.error('Error fetching course insights:', error)
      } finally {
        setLoadingInsights(false)
      }
    }

    if (courseId) {
      fetchCourseInsights()
    }
  }, [courseId])

  // Generate shareable link when modal opens
  useEffect(() => {
    if (isInviteModalOpen && courseId) {
      // Generate a shareable link (you may want to generate this from an API)
      const baseUrl = window.location.origin
      setShareableLink(`${baseUrl}/partner-course/login`)
    }
  }, [isInviteModalOpen, courseId])

  // Fetch active partners
  useEffect(() => {
    const fetchActivePartners = async () => {
      try {
        setLoadingActivePartners(true)
        const response = await fetch('/api/active-partners', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        })

        if (!response.ok) {
          throw new Error('Failed to fetch active partners')
        }

        const data = await response.json()
        setActivePartners(data || [])
      } catch (error) {
        console.error('Error fetching active partners:', error)
        setActivePartners([])
      } finally {
        setLoadingActivePartners(false)
      }
    }

    fetchActivePartners()
  }, [])

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareableLink)
    // You could add a toast notification here
  }

  const handlePublishToggle = async (published: boolean) => {
    if (!courseId || !courseData) return

    setIsPublishing(true)
    try {
      const response = await fetch(
        `/api/partner/training/courses/${courseId}/publish?published=${published}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(
          errorData.message || 'Failed to update course publish status'
        )
      }

      const data = await response.json()

      if (data.success) {
        // Update local state
        setCourseData({ ...courseData, published })
        showCustomToast(
          'Success',
          published
            ? 'Course published successfully'
            : 'Course unpublished successfully',
          'success',
          3000
        )
      } else {
        throw new Error(
          data.message || 'Failed to update course publish status'
        )
      }
    } catch (err) {
      console.error('Error updating publish status:', err)
      showCustomToast(
        'Error',
        err instanceof Error
          ? err.message
          : 'Failed to update course publish status',
        'error',
        5000
      )
      // Revert the toggle on error
      setCourseData({ ...courseData, published: !published })
    } finally {
      setIsPublishing(false)
    }
  }

  const handlePartnerSelect = async (partnerId: number | null) => {
    // If partner is being cleared, don't make API call
    if (!partnerId) {
      setSelectedPartnerId(null)
      setAssignError(null)
      return
    }

    if (!courseId) return

    setIsAssigning(true)
    setAssignError(null)

    try {
      const response = await fetch(
        '/api/partner/training/my/partner/courses/assign',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify({
            courseId: parseInt(courseId),
            assignedOrgId: partnerId
          })
        }
      )

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(
          errorData.message || 'Failed to assign course to partner'
        )
      }

      const result = await response.json()
      if (result.success !== false) {
        setSelectedPartnerId(partnerId)
        // Clear email input when partner is selected
        setInviteEmail('')
        setInviteError(null)
        // Show success toast
        const selectedPartner = activePartners.find(
          (p) => p.orgId === partnerId
        )
        showCustomToast(
          'Success',
          `Course successfully assigned to ${selectedPartner?.name || 'partner'}`,
          'success',
          3000
        )
        // Optionally refresh course partners list
        // You could refetch coursePartners here if needed
      } else {
        throw new Error(result.message || 'Failed to assign course to partner')
      }
    } catch (error) {
      console.error('Error assigning course to partner:', error)
      setAssignError(
        error instanceof Error
          ? error.message
          : 'Failed to assign course to partner'
      )
      setSelectedPartnerId(null)
    } finally {
      setIsAssigning(false)
    }
  }

  const handleSendInvite = async () => {
    // If partner is selected, skip email validation
    if (selectedPartnerId) {
      // Partner assignment is already handled in handlePartnerSelect
      // The success toast is shown in handlePartnerSelect
      // Just close the modal
      setIsInviteModalOpen(false)
      setInviteEmail('')
      setSelectedPartnerId(null)
      setInviteError(null)
      return
    }

    // If no partner selected, require email
    if (!inviteEmail.trim()) {
      setInviteError('Please enter an email address or select a partner')
      return
    }

    const trimmedEmail = inviteEmail.trim()

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(trimmedEmail)) {
      setInviteError('Please enter a valid email address')
      return
    }

    // Disallow personal Gmail addresses
    const normalizedEmail = trimmedEmail.toLowerCase()
    if (normalizedEmail.endsWith('@gmail.com')) {
      setInviteError(
        'Personal Gmail addresses are not allowed. Please use your work email.'
      )
      return
    }

    setIsSendingInvite(true)
    setInviteError(null)

    try {
      const response = await fetch('/api/partner/training/courses/invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          courseId: parseInt(courseId),
          receiverUserEmail: trimmedEmail
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || 'Failed to send invite')
      }

      const result = await response.json()
      if (result.success) {
        // Show success toast
        showCustomToast(
          'Success',
          `Access successfully granted to ${inviteEmail.trim()}`,
          'success',
          3000
        )
        // Close modal and reset form
        setIsInviteModalOpen(false)
        setInviteEmail('')
        setAccessLevel('VIEW_ONLY')
        setIsTrackable(true)
        setExpiryDays(7)
      } else {
        throw new Error(result.message || 'Failed to send invite')
      }
    } catch (error) {
      console.error('Error sending invite:', error)
      setInviteError(
        error instanceof Error ? error.message : 'Failed to send invite'
      )
    } finally {
      setIsSendingInvite(false)
    }
  }

  const handleInviteModalOpenChange = (open: boolean) => {
    // Defer state updates to avoid updates during a render phase.
    queueMicrotask(() => {
      setIsInviteModalOpen(open)
      if (!open) {
        setInviteEmail('')
        setSelectedPartnerId(null)
        setInviteError(null)
        setAssignError(null)
      }
    })
  }

  // Calculate expiry date
  const calculateExpiryDate = () => {
    const date = new Date()
    date.setDate(date.getDate() + expiryDays)
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  // Validate if URL is likely a PDF or document
  const isValidDocumentUrl = (url: string): boolean => {
    if (!url || !url.trim()) return false
    try {
      const urlObj = new URL(url)
      const pathname = urlObj.pathname.toLowerCase()
      // Check for common document extensions
      const documentExtensions = [
        '.pdf',
        '.doc',
        '.docx',
        '.xls',
        '.xlsx',
        '.ppt',
        '.pptx'
      ]
      const hasDocumentExtension = documentExtensions.some((ext) =>
        pathname.endsWith(ext)
      )
      // Also check if it's a Google Drive or similar document link
      const isDocumentHost =
        urlObj.hostname.includes('drive.google.com') ||
        urlObj.hostname.includes('docs.google.com') ||
        urlObj.hostname.includes('dropbox.com') ||
        urlObj.hostname.includes('onedrive.com')

      return hasDocumentExtension || isDocumentHost
    } catch {
      return false
    }
  }

  // Extract file ID from Google Drive URL
  const extractDriveFileId = (driveLink: string): string | null => {
    if (!driveLink) return null

    let match = driveLink.match(/\/file\/d\/([a-zA-Z0-9_-]+)/)
    if (match && match[1]) {
      return match[1]
    }

    match = driveLink.match(/[?&]id=([a-zA-Z0-9_-]+)/)
    if (match && match[1]) {
      return match[1]
    }

    match = driveLink.match(/\/uc\?id=([a-zA-Z0-9_-]+)/)
    if (match && match[1]) {
      return match[1]
    }

    return null
  }

  // Check if URL is a Google Drive link
  const isGoogleDriveLink = (url: string): boolean => {
    return url.includes('drive.google.com')
  }

  // Convert Google Drive URL to previewable format for iframe
  const getGoogleDrivePreviewUrl = (url: string): string => {
    if (!url || !url.trim()) return url

    try {
      // Check if it's a Google Drive URL
      if (url.includes('drive.google.com')) {
        const fileId = extractDriveFileId(url)
        if (fileId) {
          // Convert to preview format for embedding
          // This requires the file to be shared with "Anyone with the link" permission
          return `https://drive.google.com/file/d/${fileId}/preview`
        }
      }

      return url
    } catch {
      return url
    }
  }

  // Get thumbnail URL, handling Google Drive links
  const getThumbnailUrl = (thumbnailUrl?: string): string => {
    if (!thumbnailUrl) return ''
    if (thumbnailUrl.includes('drive.google.com')) {
      const fileId = extractDriveFileId(thumbnailUrl)
      if (fileId) {
        return `https://drive.google.com/uc?export=view&id=${fileId}`
      }
    }
    return thumbnailUrl
  }

  if (loading) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <p className='text-gray-500 dark:text-white'>
          Loading course details...
        </p>
      </div>
    )
  }

  if (error || !courseData) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <p className='text-red-500'>Error: {error || 'Course not found'}</p>
      </div>
    )
  }

  // Convert level from API format to display format
  const levelMap: Record<string, string> = {
    BEGINNER: 'Beginner',
    INTERMEDIATE: 'Intermediate',
    ADVANCED: 'Advanced'
  }

  const displayLevel = levelMap[courseData.level] || courseData.level

  // Format duration
  const duration =
    courseData.durationMinutes === 1
      ? '1 Min'
      : `${courseData.durationMinutes} Mins`

  return (
    <div className='min-h-screen w-full bg-white px-4 py-6 dark:bg-card md:px-8 lg:px-20'>
      <div className='mx-auto max-w-7xl'>
        {/* Header */}
        <h1 className='mb-8 text-2xl font-bold text-gray-900 dark:text-white'>
          Course Detail
        </h1>

        <div className='grid grid-cols-1 gap-8 lg:grid-cols-3'>
          {/* Left Column - Course Detail and Content */}
          <div className='space-y-6 lg:col-span-2'>
            {/* Course Thumbnail */}
            <div className='relative w-full overflow-hidden rounded-xl bg-gray-200 dark:bg-white/20'>
              {courseData.coverImageUrl ? (
                <img
                  src={courseData.coverImageUrl}
                  alt={courseData.title}
                  className='h-[300px] w-full object-cover'
                />
              ) : (
                <div className='h-[300px] w-full bg-gray-200 dark:bg-white/20' />
              )}
              {/* Subtle gradient overlay only at bottom for button visibility */}
              <div className='absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/60 via-black/40 to-transparent' />
              {/* Start Course Button */}
              {/* <div className='absolute bottom-6 left-1/2 -translate-x-1/2'>
                <Button
                  size='lg'
                  className='rounded-xl bg-gray-900 px-10 py-7 text-base font-semibold text-white shadow-lg transition-all hover:bg-gray-800 hover:shadow-xl'
                  onClick={() => {
                    router.push(`/partner-course/dashboard/${courseId}/learn`)
                  }}
                >
                  Start the Course →
                </Button>
              </div> */}
            </div>

            {/* Course Title */}
            <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>
              {courseData.title}
            </h2>

            {/* Course Metadata */}
            <div className='flex flex-wrap items-center gap-6'>
              <div className='flex items-center gap-2'>
                <Clock size={16} className='text-gray-500 dark:text-white' />
                <span className='text-sm font-medium text-gray-700 dark:text-white'>
                  {duration}
                </span>
              </div>
              <div className='flex items-center gap-2'>
                <TrendingUp
                  size={16}
                  className='text-gray-500 dark:text-white'
                />
                <span className='text-sm font-medium text-gray-700 dark:text-white'>
                  {displayLevel}
                </span>
              </div>
              {((courseData.labelNames && courseData.labelNames.length > 0) ||
                (courseData.labels && courseData.labels.length > 0)) && (
                <div className='flex items-center gap-2'>
                  <Tag size={16} className='text-gray-500 dark:text-white' />
                  <div className='flex gap-2'>
                    {/* Prioritize labelNames over labels for backward compatibility */}
                    {(courseData.labelNames && courseData.labelNames.length > 0
                      ? courseData.labelNames
                      : courseData.labels || []
                    ).map((label, index) => {
                      const labelName =
                        typeof label === 'string' ? label : label.name
                      return (
                        <span
                          key={index}
                          className='rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 dark:bg-white/10 dark:text-white'
                        >
                          {labelName}
                        </span>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Course Description */}
            <div className='space-y-2'>
              <p className='leading-relaxed text-gray-600 dark:text-white'>
                {courseData.description}
              </p>
            </div>

            {/* Course Content Section */}
            <div className='space-y-4'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                  <h3 className='text-lg font-bold text-gray-900 dark:text-white'>
                    Course Content
                  </h3>
                  <span className='text-sm text-gray-500 dark:text-white'>
                    {courseData.stageCount} Stages
                  </span>
                </div>
              </div>

              {/* Stages Accordion */}
              <Accordion type='single' collapsible className='w-full space-y-2'>
                {(courseData.stages ?? [])
                  .slice()
                  .sort((a, b) => a.order - b.order)
                  .map((stage) => (
                    <AccordionItem
                      key={stage.stageId}
                      value={`stage-${stage.stageId}`}
                      className='rounded-lg border border-gray-200 bg-white px-4 dark:border-border dark:bg-card'
                    >
                      <AccordionTrigger className='hover:no-underline'>
                        <div className='flex items-center gap-3'>
                          <ChevronDown
                            size={16}
                            className='text-gray-500 transition-transform duration-200 dark:text-white'
                          />
                          <span className='text-base font-medium text-gray-900 dark:text-white'>
                            Chapter {stage.order}: {stage.title}
                          </span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className='pb-4 pt-2'>
                        {/* Quiz Stage */}
                        {stage.quiz && (
                          <div className='space-y-4'>
                            <div className='rounded-lg border border-blue-200 bg-blue-50 p-3'>
                              <div className='flex items-center gap-2'>
                                <FileText size={16} className='text-blue-600' />
                                <span className='text-sm font-semibold text-blue-900'>
                                  Quiz: {stage.quiz.title}
                                </span>
                              </div>
                            </div>
                            {(stage.quiz.questions ?? [])
                              .slice()
                              .sort((a, b) => a.order - b.order)
                              .map((question, qIndex) => (
                                <div
                                  key={question.id}
                                  className='rounded-lg border border-gray-200 bg-white p-4 dark:border-border dark:bg-card'
                                >
                                  <div className='mb-3'>
                                    <span className='text-xs font-medium text-gray-500 dark:text-white'>
                                      Question {qIndex + 1}
                                    </span>
                                    <p className='mt-1 text-sm font-medium text-gray-900 dark:text-white'>
                                      {question.question}
                                    </p>
                                  </div>
                                  <div className='space-y-2'>
                                    {question.options.map((option, oIndex) => (
                                      <div
                                        key={oIndex}
                                        className='flex items-center gap-2 rounded-md border border-gray-200 bg-gray-50 p-2 dark:border-border dark:bg-white/5'
                                      >
                                        <div className='flex h-5 w-5 items-center justify-center rounded-full border-2 border-gray-300 bg-white text-xs font-medium text-gray-600 dark:border-border dark:bg-card dark:text-white'>
                                          {String.fromCharCode(65 + oIndex)}
                                        </div>
                                        <span className='text-sm text-gray-700 dark:text-white'>
                                          {option}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ))}
                          </div>
                        )}

                        {/* Content Stage */}
                        {stage.content && (
                          <div className='space-y-4'>
                            {/* Chapter Title */}
                            {stage.content.chapterTitle && (
                              <div className='rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-border dark:bg-white/5'>
                                <h4 className='text-base font-semibold text-gray-900 dark:text-white'>
                                  {stage.content.chapterTitle}
                                </h4>
                              </div>
                            )}

                            {/* Content Type Badge */}
                            {stage.content.contentType && (
                              <div className='flex items-center gap-2'>
                                {stage.content.contentType === 'VIDEO' && (
                                  <div className='flex items-center gap-2 rounded-full bg-red-100 px-3 py-1'>
                                    <Video size={14} className='text-red-600' />
                                    <span className='text-xs font-medium text-red-700'>
                                      Video Content
                                    </span>
                                  </div>
                                )}
                                {stage.content.contentType === 'DOCUMENT' && (
                                  <div className='flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1'>
                                    <FileText
                                      size={14}
                                      className='text-blue-600'
                                    />
                                    <span className='text-xs font-medium text-blue-700'>
                                      Document Content
                                    </span>
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Video Player */}
                            {stage.content.contentType === 'VIDEO' &&
                              stage.content.driveLink && (
                                <div className='space-y-2'>
                                  <Label className='text-sm font-medium text-gray-700 dark:text-white'>
                                    Video
                                  </Label>
                                  <div className='relative aspect-video w-full overflow-hidden rounded-lg border border-gray-200 bg-gray-100 dark:border-border dark:bg-white/10'>
                                    {playingVideoId === stage.stageId ? (
                                      // Show video player when playing
                                      <>
                                        {isGoogleDriveLink(
                                          stage.content.driveLink
                                        ) ? (
                                          <iframe
                                            src={getGoogleDrivePreviewUrl(
                                              stage.content.driveLink
                                            )}
                                            className='h-full w-full'
                                            allow='autoplay; fullscreen'
                                            allowFullScreen
                                            title='Video player'
                                            sandbox='allow-same-origin allow-scripts allow-popups allow-presentation'
                                          />
                                        ) : (
                                          <video
                                            src={stage.content.driveLink}
                                            controls
                                            className='h-full w-full'
                                            autoPlay
                                          />
                                        )}
                                        <button
                                          onClick={() =>
                                            setPlayingVideoId(null)
                                          }
                                          className='absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/70 text-white transition-colors hover:bg-black/90'
                                          aria-label='Close video'
                                        >
                                          <X size={16} />
                                        </button>
                                      </>
                                    ) : (
                                      // Show thumbnail or preview with play button
                                      <>
                                        {stage.content.thumbnailUrl ? (
                                          // Show thumbnail with play button
                                          <div className='group relative h-full w-full cursor-pointer'>
                                            <img
                                              src={getThumbnailUrl(
                                                stage.content.thumbnailUrl
                                              )}
                                              alt='Video thumbnail'
                                              className='h-full w-full object-cover'
                                              onError={(e) => {
                                                ;(
                                                  e.target as HTMLImageElement
                                                ).src =
                                                  stage.content?.thumbnailUrl ||
                                                  ''
                                              }}
                                            />
                                            <div
                                              className='absolute inset-0 flex items-center justify-center bg-black/30 transition-opacity group-hover:bg-black/40'
                                              onClick={() =>
                                                setPlayingVideoId(stage.stageId)
                                              }
                                            >
                                              <div className='flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-lg transition-transform group-hover:scale-110 dark:bg-card/90'>
                                                <Play
                                                  size={24}
                                                  className='ml-1 text-gray-900 dark:text-white'
                                                  fill='currentColor'
                                                />
                                              </div>
                                            </div>
                                          </div>
                                        ) : isGoogleDriveLink(
                                            stage.content.driveLink
                                          ) ? (
                                          // Show video preview if no thumbnail (for Google Drive)
                                          <div className='group relative h-full w-full cursor-pointer'>
                                            <iframe
                                              src={getGoogleDrivePreviewUrl(
                                                stage.content.driveLink
                                              )}
                                              className='h-full w-full opacity-70'
                                              allow='autoplay; fullscreen'
                                              allowFullScreen
                                              title='Video preview'
                                              sandbox='allow-same-origin allow-scripts allow-popups allow-presentation'
                                            />
                                            <div
                                              className='absolute inset-0 flex items-center justify-center bg-black/20 transition-opacity group-hover:bg-black/30'
                                              onClick={() =>
                                                setPlayingVideoId(stage.stageId)
                                              }
                                            >
                                              <div className='flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-lg transition-transform group-hover:scale-110 dark:bg-card/90'>
                                                <Play
                                                  size={24}
                                                  className='ml-1 text-gray-900 dark:text-white'
                                                  fill='currentColor'
                                                />
                                              </div>
                                            </div>
                                          </div>
                                        ) : (
                                          // Fallback: show play button on gray background
                                          <div
                                            className='flex h-full w-full cursor-pointer items-center justify-center bg-gray-200 transition-colors hover:bg-gray-300 dark:bg-white/20 dark:bg-white/30'
                                            onClick={() =>
                                              setPlayingVideoId(stage.stageId)
                                            }
                                          >
                                            <div className='flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-lg dark:bg-card'>
                                              <Play
                                                size={24}
                                                className='ml-1 text-gray-900 dark:text-white'
                                                fill='currentColor'
                                              />
                                            </div>
                                          </div>
                                        )}
                                      </>
                                    )}
                                  </div>
                                </div>
                              )}

                            {/* Document Preview */}
                            {stage.content.contentType === 'DOCUMENT' &&
                              stage.content.documentLink && (
                                <div className='space-y-2'>
                                  {!isValidDocumentUrl(
                                    stage.content.documentLink
                                  ) && (
                                    <div className='mb-2 rounded-md bg-yellow-50 p-2 text-xs text-yellow-800'>
                                      Warning: The URL may not be a valid
                                      document link. Please verify the link
                                      format.
                                    </div>
                                  )}
                                  {stage.content.documentLink.includes(
                                    'drive.google.com'
                                  ) && (
                                    <div className='mb-2 rounded-md bg-blue-50 p-2 text-xs text-blue-800'>
                                      <strong>Important:</strong> For Google
                                      Drive files to preview correctly, the file
                                      must be shared with &quot;Anyone with the
                                      link&quot; permission. If you see an
                                      access denied message, please update the
                                      file sharing settings in Google Drive.
                                    </div>
                                  )}
                                  <div className='relative h-[400px] w-full overflow-hidden rounded-lg border border-gray-300 bg-white dark:border-border dark:bg-card'>
                                    <iframe
                                      src={getGoogleDrivePreviewUrl(
                                        stage.content.documentLink
                                      )}
                                      className='h-full w-full'
                                      title='Document Preview'
                                      sandbox='allow-same-origin allow-scripts allow-popups allow-forms allow-downloads'
                                      allow='fullscreen'
                                    />
                                  </div>
                                </div>
                              )}

                            {/* Content Text */}
                            {stage.content.content && (
                              <div className='rounded-lg bg-gray-50 p-4 dark:bg-white/5'>
                                <Label className='mb-2 text-sm font-medium text-gray-700 dark:text-white'>
                                  Content
                                </Label>
                                <p className='text-sm leading-relaxed text-gray-700 dark:text-white'>
                                  {stage.content.content}
                                </p>
                              </div>
                            )}

                            {/* Content Images */}
                            {stage.content.images &&
                              stage.content.images.length > 0 && (
                                <div className='space-y-2'>
                                  <Label className='text-sm font-medium text-gray-700 dark:text-white'>
                                    Images
                                  </Label>
                                  <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                                    {(stage.content.images ?? [])
                                      .slice()
                                      .sort((a, b) => a.order - b.order)
                                      .map((image) => (
                                        <div
                                          key={image.id}
                                          className='relative h-48 w-full overflow-hidden rounded-lg bg-gray-200 dark:bg-white/20'
                                        >
                                          <img
                                            src={image.imageUrl}
                                            alt={`Stage ${stage.order} image ${image.order}`}
                                            className='h-full w-full object-cover'
                                          />
                                        </div>
                                      ))}
                                  </div>
                                </div>
                              )}
                          </div>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
              </Accordion>
            </div>
          </div>

          {/* Right Column - Course Insights and Partners */}
          <div className='space-y-6 lg:col-span-1'>
            {/* toggle to publish/unpublish course */}
            <div className='flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 dark:border-border dark:bg-card'>
              <div className='flex flex-col gap-1'>
                <Label
                  htmlFor='publish-toggle'
                  className='text-sm font-medium text-gray-900 dark:text-white'
                >
                  Publish Course
                </Label>
                <p className='text-xs text-gray-500 dark:text-white'>
                  {isPublishing
                    ? 'Updating...'
                    : courseData?.published
                      ? 'Course is published and visible to partners'
                      : 'Course is unpublished and hidden from partners'}
                </p>
              </div>
              <Switch
                id='publish-toggle'
                checked={courseData?.published || false}
                onCheckedChange={(checked) => {
                  if (!isPublishing && courseData) {
                    handlePublishToggle(checked)
                  }
                }}
                disabled={isPublishing}
              />
            </div>
            {/* Generate Deal Snapshot Link Button */}
            <Button
              onClick={() => setIsInviteModalOpen(true)}
              className='w-full gap-2 bg-[#3E50F7] text-white hover:bg-blue-700'
            >
              <Share2 size={16} />
              Share Course Link
            </Button>

            {/* Course Insights */}
            <div className='rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-border dark:bg-card'>
              <h3 className='mb-4 text-lg font-bold text-gray-900 dark:text-white'>
                Course Insights
              </h3>
              {loadingInsights ? (
                <div className='space-y-4'>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                      <Users
                        size={16}
                        className='text-gray-500 dark:text-white'
                      />
                      <span className='text-sm text-gray-600 dark:text-white'>
                        Total Partners
                      </span>
                    </div>
                    <span className='text-sm font-semibold text-gray-900 dark:text-white'>
                      ...
                    </span>
                  </div>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                      <TrendingUp
                        size={16}
                        className='text-gray-500 dark:text-white'
                      />
                      <span className='text-sm text-gray-600 dark:text-white'>
                        Adoption
                      </span>
                    </div>
                    <span className='text-sm font-semibold text-gray-900 dark:text-white'>
                      ...
                    </span>
                  </div>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                      <FileText
                        size={16}
                        className='text-gray-500 dark:text-white'
                      />
                      <span className='text-sm text-gray-600 dark:text-white'>
                        Completion
                      </span>
                    </div>
                    <span className='text-sm font-semibold text-gray-900 dark:text-white'>
                      ...
                    </span>
                  </div>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                      <TrendingUp
                        size={16}
                        className='text-gray-500 dark:text-white'
                      />
                      <span className='text-sm text-gray-600 dark:text-white'>
                        Avg Readiness
                      </span>
                    </div>
                    <span className='text-sm font-semibold text-gray-900 dark:text-white'>
                      ...
                    </span>
                  </div>
                </div>
              ) : (
                <div className='space-y-4'>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                      <Users
                        size={16}
                        className='text-gray-500 dark:text-white'
                      />
                      <span className='text-sm text-gray-600 dark:text-white'>
                        Total Partners
                      </span>
                    </div>
                    <span className='text-sm font-semibold text-gray-900 dark:text-white'>
                      {courseInsights?.totalPartner || 0}
                    </span>
                  </div>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                      <TrendingUp
                        size={16}
                        className='text-gray-500 dark:text-white'
                      />
                      <span className='text-sm text-gray-600 dark:text-white'>
                        Adoption
                      </span>
                    </div>
                    <span className='text-sm font-semibold text-gray-900 dark:text-white'>
                      {courseInsights?.adoption
                        ? `${courseInsights.adoption.toFixed(1)}%`
                        : '0%'}
                    </span>
                  </div>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                      <FileText
                        size={16}
                        className='text-gray-500 dark:text-white'
                      />
                      <span className='text-sm text-gray-600 dark:text-white'>
                        Completion
                      </span>
                    </div>
                    <span className='text-sm font-semibold text-gray-900 dark:text-white'>
                      {courseInsights?.completion
                        ? `${courseInsights.completion.toFixed(1)}%`
                        : '0%'}
                    </span>
                  </div>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                      <TrendingUp
                        size={16}
                        className='text-gray-500 dark:text-white'
                      />
                      <span className='text-sm text-gray-600 dark:text-white'>
                        Avg Readiness
                      </span>
                    </div>
                    <span className='text-sm font-semibold text-gray-900 dark:text-white'>
                      {courseInsights?.avgReadiness
                        ? `${courseInsights.avgReadiness.toFixed(1)}%`
                        : '0%'}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Partners Associated */}
            <div className='space-y-4'>
              <h3 className='text-lg font-bold text-gray-900 dark:text-white'>
                Partners Associated
              </h3>
              <PartnersList
                partners={coursePartners}
                loading={loadingCoursePartners}
                emptyMessage='No partners associated with this course'
              />
            </div>

            {/* Tiers Accessible */}
            <div className='rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-border dark:bg-card'>
              <h3 className='mb-4 text-lg font-bold text-gray-900 dark:text-white'>
                Tiers Accessible
              </h3>
              {loadingRules ? (
                <div className='text-sm text-gray-500 dark:text-white'>
                  Loading tiers...
                </div>
              ) : !assignmentRules?.tiers ||
                assignmentRules.tiers.length === 0 ? (
                <div className='text-sm text-gray-500 dark:text-white'>
                  No tiers assigned
                </div>
              ) : (
                <div className='space-y-2'>
                  {assignmentRules.tiers.map((tier, index) => (
                    <div
                      key={index}
                      className='text-sm font-medium text-gray-700 dark:text-white'
                    >
                      {tier}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Programme Types */}
            <div className='rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-border dark:bg-card'>
              <h3 className='mb-4 text-lg font-bold text-gray-900 dark:text-white'>
                Programme Types
              </h3>
              {loadingRules ? (
                <div className='text-sm text-gray-500 dark:text-white'>
                  Loading...
                </div>
              ) : !assignmentRules?.programTypes ||
                assignmentRules.programTypes.length === 0 ? (
                <div className='text-sm text-gray-500 dark:text-white'>
                  No program types assigned
                </div>
              ) : (
                <div className='space-y-2'>
                  {assignmentRules.programTypes.map((programType, index) => {
                    // Format the program type for display
                    const formattedLabel =
                      programType.toLowerCase() === 'coseller'
                        ? 'Coselling'
                        : programType.toLowerCase() === 'reseller'
                          ? 'Reselling'
                          : programType
                    return (
                      <div
                        key={index}
                        className='text-sm font-medium text-gray-700 dark:text-white'
                      >
                        {formattedLabel}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Invite Modal */}
      <Dialog
        open={isInviteModalOpen}
        onOpenChange={handleInviteModalOpenChange}
      >
        <DialogContent className='max-w-[500px] bg-white p-6 dark:bg-card'>
          <DialogHeader className='space-y-4'>
            {/* Purple Envelope Icon */}
            <div className='flex justify-center'>
              <div className='flex h-12 w-12 items-center justify-center rounded-full bg-purple-100'>
                <Mail className='h-6 w-6 text-purple-600' />
              </div>
            </div>
            <DialogTitle className='text-center text-xl font-semibold'>
              Link Generated
            </DialogTitle>
            <DialogDescription className='text-center text-sm text-gray-600 dark:text-white'>
              You&apos;ve created a new shareable link to view the status of the
              chart
            </DialogDescription>
          </DialogHeader>

          <div className='mt-6 space-y-6'>
            {/* Shareable Link Section */}
            <div className='space-y-2'>
              <Label className='text-sm font-medium text-gray-700 dark:text-white'>
                Shareable Link
              </Label>
              <div className='flex items-center gap-2'>
                <Input
                  value={shareableLink}
                  readOnly
                  className='bg-gray-50 text-sm dark:bg-white/5'
                />
                <Button
                  type='button'
                  variant='outline'
                  size='icon'
                  onClick={handleCopyLink}
                  className='shrink-0'
                >
                  <Copy size={16} />
                </Button>
              </div>
            </div>

            {/* Grant Access Section */}
            <div className='space-y-2'>
              <Label className='text-sm font-medium text-gray-700 dark:text-white'>
                Grant Access
              </Label>
              <div className='flex items-center gap-2'>
                <Input
                  value={inviteEmail}
                  onChange={(e) => {
                    setInviteEmail(e.target.value)
                    setInviteError(null)
                  }}
                  placeholder='Add comma separated emails'
                  className='flex-1'
                  disabled={!!selectedPartnerId}
                />
                {/* <Select value={accessLevel} onValueChange={setAccessLevel}>
                  <SelectTrigger className='w-[140px]'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='VIEW_ONLY'>View Only</SelectItem>
                    <SelectItem value='EDIT'>Edit</SelectItem>
                    <SelectItem value='FULL_ACCESS'>Full Access</SelectItem>
                  </SelectContent>
                </Select> */}
              </div>
              {selectedPartnerId && (
                <p className='text-xs text-gray-500 dark:text-white'>
                  Email input is disabled when a partner is selected
                </p>
              )}
              {inviteError && (
                <p className='text-sm text-red-600'>{inviteError}</p>
              )}
            </div>

            {/* Assign Partner Section */}
            <div className='space-y-2'>
              <Label className='text-sm font-medium text-gray-700 dark:text-white'>
                Assign Partner
              </Label>
              <PartnerAssignDropdown
                partners={activePartners}
                selectedPartnerId={selectedPartnerId}
                onSelect={handlePartnerSelect}
                loading={loadingActivePartners || isAssigning}
                placeholder='Select Partner'
              />
              {assignError && (
                <p className='text-sm text-red-600'>{assignError}</p>
              )}
            </div>
          </div>

          <DialogFooter className='mt-6'>
            <Button
              variant='outline'
              onClick={() => handleInviteModalOpenChange(false)}
              disabled={isSendingInvite}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSendInvite}
              disabled={isSendingInvite}
              className='bg-[#3E50F7] text-white hover:bg-blue-700'
            >
              {isSendingInvite ? 'Sending...' : 'Send'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default CourseDetailPage
