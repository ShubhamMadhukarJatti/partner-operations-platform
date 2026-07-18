'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { useGetTeamSection } from '@/http-hooks/orgUserMapping'
import { getCurrentOrganization } from '@/services/organizations'
import { OrganizationMappingsByUserId, UserType } from '@/types'
import { IconMessage, IconPlus, IconX } from '@tabler/icons-react'
import { useQuery } from '@tanstack/react-query'
import { Pencil } from 'lucide-react'

import { isDummyFlow } from '@/lib/dummy-flow'
import { User as FirebaseUser } from '@/lib/firebase/auth/context'
import { getServerUser } from '@/lib/server'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { showCustomToast } from '@/components/custom-toast'
import { useOrganization } from '@/components/providers/OrganizationProvider'

import { Activity, ActivitySidebar, Comment } from './task-activity'
import { MOCK_ACTIVITIES, MOCK_COMMENTS } from './task-activity/mockData'

const STATUS_OPTIONS = [
  'Not Started',
  'In Progress',
  'On Track',
  'At Risk',
  'Delayed',
  'Paused',
  'Blocked',
  'Completed',
  'Cancelled'
]

const STAGE_OPTIONS = [
  'Ideation',
  'Partner Engaged',
  'Proposal Sent',
  'In Execution',
  'In Review',
  'Closed / Launched'
]

const TARGET_OPTIONS = [
  'Revenue ($)',
  'Pipeline ($)',
  'Leads Generated',
  'Opportunities Registered',
  'Customers Onboarded',
  'Active Integrations',
  'Campaigns Launched',
  'Partner Engagements',
  'MQLs',
  'SQLs'
]

interface CreateTaskModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void

  // existing props
  externalPartnerId?: number
  externalPartnerCode?: string
  inDummyFlow?: boolean

  // new props
  myPartnerId?: number
  isMyPartnerFlow?: boolean
}

interface AuthData {
  user: FirebaseUser | null
  organizationMappings: OrganizationMappingsByUserId[] | null
  userProfile: UserType | null
}

const CreateTaskModal: React.FC<CreateTaskModalProps> = ({
  open,
  onOpenChange,
  externalPartnerId,
  externalPartnerCode = '',
  inDummyFlow = false,
  myPartnerId,
  isMyPartnerFlow = false
}) => {
  const params = useParams()
  const { data: authData } = useQuery<AuthData>({
    queryKey: ['auth-data'],
    staleTime: Infinity
  })

  console.log('authData:', authData)

  const [taskTitle, setTaskTitle] = useState('Task title')
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [progress, setProgress] = useState('')
  const [stage, setStage] = useState('')
  const [target, setTarget] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [owner, setOwner] = useState('')
  const [showNoteInput, setShowNoteInput] = useState(false)
  const [note, setNote] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activities] = useState<Activity[]>(MOCK_ACTIVITIES)
  const [comments, setComments] = useState<Comment[]>(MOCK_COMMENTS)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { organization } = useOrganization()
  const { data: teamMembers, isLoading: isLoadingMembers } = useGetTeamSection(
    organization?.id
  )

  console.log('organization?.id', teamMembers)

  // Get partner ID from prop or URL params
  const partnerId =
    externalPartnerId ||
    (Array.isArray(params?.id) ? params?.id[0] : params?.id) ||
    (Array.isArray(params?.partnerId)
      ? params?.partnerId[0]
      : params?.partnerId)

  // Close modal function
  const onClose = () => onOpenChange(false)

  // Filter to only show active team members
  const activeTeamMembers =
    teamMembers && Array.isArray(teamMembers)
      ? teamMembers.filter(
          (member: any) => member?.inviteTeamMemberStatus === 'ACTIVE'
        )
      : []

  console.log('activeTeamMembers:', activeTeamMembers)

  const fallbackOwnerId =
    activeTeamMembers.length === 0 && authData?.userProfile?.userId
      ? authData.userProfile.userId
      : undefined

  console.log('fallbackOwnerId:', fallbackOwnerId)

  const selectedOwnerId = owner || fallbackOwnerId

  console.log('owner:', owner)
  console.log('fallbackOwnerId:', fallbackOwnerId)
  console.log('selectedOwnerId:', selectedOwnerId)
  console.log('authData.userProfile:', {
    id: authData?.userProfile?.id,
    uid: authData?.userProfile?.uid,
    userId: authData?.userProfile?.userId,
    uuid: authData?.userProfile?.uuid
  })

  const handleTitleClick = () => {
    setIsEditingTitle(true)
  }

  const handleTitleBlur = () => {
    setIsEditingTitle(false)
  }

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setIsEditingTitle(false)
    }
  }

  // Check if we're in dummy flow (use prop or fallback to legacy check)
  const isInDummyFlow = inDummyFlow || isDummyFlow(externalPartnerId)

  const handleCreateTask = async () => {
    console.log('STEP 1 - handleCreateTask called')

    if (isSubmitting) return

    if (!taskTitle || taskTitle.trim() === '' || taskTitle === 'Task title') {
      showCustomToast('Required', 'Please enter a task title', 'error', 5000)
      return
    }
    if (!selectedOwnerId) {
      showCustomToast('Required', 'Please select an owner', 'error', 5000)
      return
    }

    if (isInDummyFlow) {
      showCustomToast(
        'Info',
        'No edit access for this dummy account',
        'info',
        5000
      )
      setIsSubmitting(false)
      return
    }

    try {
      setIsSubmitting(true)

      const toIsoOrNull = (d: string) => (d ? new Date(d).toISOString() : null)

      if (isMyPartnerFlow) {
        if (!myPartnerId || isNaN(Number(myPartnerId))) {
          showCustomToast(
            'Error',
            'My partner id is missing. Please try again.',
            'error',
            5000
          )
          setIsSubmitting(false)
          return
        }

        const payload = {
          title: taskTitle,
          status: progress || 'Not Started',
          stage: stage || 'Ideation',
          targetType: target || 'Revenue ($)',
          startDate: toIsoOrNull(startDate),
          endDate: toIsoOrNull(endDate),
          ownerId: selectedOwnerId,
          note: note || '',
          myPartnerId: Number(myPartnerId)
        }

        const response = await fetch('/api/my-partner/tasks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify(payload)
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(
            errorData.message || 'Failed to create my-partner task'
          )
        }

        const data = await response.json()
        showCustomToast(
          'Success',
          data?.message || 'Task created successfully!',
          'success',
          3000
        )
      } else {
        const { token } = await getServerUser()

        if (!token) {
          showCustomToast(
            'Error',
            'Authentication token not found',
            'error',
            5000
          )
          setIsSubmitting(false)
          return
        }

        const currentOrg = await getCurrentOrganization()
        if (!currentOrg?.id) {
          showCustomToast(
            'Error',
            'Failed to get organization information',
            'error',
            5000
          )
          setIsSubmitting(false)
          return
        }

        const numericPartnerId = externalPartnerId
          ? Number(externalPartnerId)
          : null

        if (!numericPartnerId || isNaN(numericPartnerId)) {
          showCustomToast(
            'Error',
            'Partner information is still loading. Please try again.',
            'error',
            5000
          )
          setIsSubmitting(false)
          return
        }

        const payload: Record<string, any> = {
          task_title: taskTitle,
          status: progress || 'Not Started',
          stage: stage || 'Ideation',
          target_type: target || 'Revenue ($)',
          start_date: toIsoOrNull(startDate),
          end_date: toIsoOrNull(endDate),
          owner_id: selectedOwnerId || null,
          note: note || '',
          organization_id: currentOrg.id,
          external_partner_id: numericPartnerId,
          external_partner_code: externalPartnerCode
        }

        const response = await fetch('/api/tasks/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.message || 'Failed to create task')
        }

        const data = await response.json()
        showCustomToast(
          'Success',
          data?.message || 'Task created successfully!',
          'success',
          3000
        )
      }

      setTaskTitle('Task title')
      setProgress('')
      setStage('')
      setTarget('')
      setStartDate('')
      setEndDate('')
      setOwner('')
      setNote('')
      setShowNoteInput(false)
      setIsSubmitting(false)
      onClose()
    } catch (error) {
      console.error('Error creating task:', error)
      showCustomToast(
        'Error',
        error instanceof Error ? error.message : 'Failed to create task',
        'error',
        5000
      )
      setIsSubmitting(false)
    }
  }

  const handleAddComment = (newComment: Comment) => {
    setComments([...comments, newComment])
  }

  const handleLikeComment = (commentId: string) => {
    setComments(
      comments.map((comment) =>
        comment.id === commentId
          ? {
              ...comment,
              isLiked: !comment.isLiked,
              likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1
            }
          : comment
      )
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={`${sidebarOpen ? 'max-w-6xl' : 'max-w-4xl'} p-0 transition-all duration-300`}
        hideCloseBtn
      >
        {/* Header */}
        <DialogHeader className='flex flex-row items-center justify-between border-b border-gray-200 px-6 py-4'>
          <div className='flex items-center gap-2'>
            <div className='h-6 w-1 rounded-full bg-blue-500' />
            <span className='text-lg font-semibold'>Task ticket number</span>
          </div>
          <div className='flex items-center gap-2'>
            <Button
              variant='ghost'
              size='icon'
              className='h-8 w-8'
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <IconMessage size={18} />
            </Button>
            <Button
              variant='ghost'
              size='icon'
              className='h-8 w-8'
              onClick={() => onOpenChange(false)}
            >
              <IconX size={18} />
            </Button>
          </div>
        </DialogHeader>

        {/* Body */}
        <div className='flex'>
          {/* Main Content */}
          <div
            className={`space-y-6 px-6 py-4 transition-all duration-300 ${sidebarOpen ? 'w-2/3' : 'w-full'}`}
          >
            {/* Task Title */}
            <div>
              {isEditingTitle ? (
                <Input
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  onBlur={handleTitleBlur}
                  onKeyDown={handleTitleKeyDown}
                  className='border-none bg-transparent px-0 text-base font-semibold text-text-100 focus:border-none focus:ring-0'
                  autoFocus
                />
              ) : (
                <div
                  onClick={handleTitleClick}
                  className='group flex w-fit cursor-pointer items-center gap-2 rounded py-1 hover:bg-gray-50'
                >
                  <h2 className='text-base font-semibold text-text-100'>
                    {taskTitle}
                  </h2>
                  <Pencil size={16} className='text-gray-400' />
                </div>
              )}
            </div>

            {/* Grid Layout */}
            <div className='grid grid-cols-2 gap-4'>
              {/* Left Column */}
              <div className='space-y-4'>
                {/* Progress */}
                <div className='flex items-center gap-3'>
                  <label className='w-20 shrink-0 text-sm font-medium text-gray-700'>
                    Progress
                  </label>
                  <Select value={progress} onValueChange={setProgress}>
                    <SelectTrigger className='w-48'>
                      <SelectValue placeholder='Select progress' />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Stage */}
                <div className='flex items-center gap-3'>
                  <label className='w-20 shrink-0 text-sm font-medium text-gray-700'>
                    Stage
                  </label>
                  <Select value={stage} onValueChange={setStage}>
                    <SelectTrigger className='w-48'>
                      <SelectValue placeholder='Select stage' />
                    </SelectTrigger>
                    <SelectContent>
                      {STAGE_OPTIONS.map((stageOption) => (
                        <SelectItem key={stageOption} value={stageOption}>
                          {stageOption}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Target */}
                <div className='flex items-center gap-3'>
                  <label className='w-20 shrink-0 text-sm font-medium text-gray-700'>
                    Target
                  </label>
                  <Select value={target} onValueChange={setTarget}>
                    <SelectTrigger className='w-48'>
                      <SelectValue placeholder='Select target' />
                    </SelectTrigger>
                    <SelectContent>
                      {TARGET_OPTIONS.map((targetOption) => (
                        <SelectItem key={targetOption} value={targetOption}>
                          {targetOption}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Right Column */}
              <div className='space-y-4'>
                {/* Start Date */}
                <div className='flex items-center gap-3'>
                  <label className='w-20 shrink-0 text-sm font-medium text-gray-700'>
                    Start Date
                  </label>
                  <Input
                    type='date'
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className={`w-48 ${
                      startDate
                        ? 'text-black [&::-webkit-datetime-edit]:text-black'
                        : 'text-gray-400 [&::-webkit-datetime-edit]:text-gray-400'
                    }`}
                  />
                </div>

                {/* End Date */}
                <div className='flex items-center gap-3'>
                  <label className='w-20 shrink-0 text-sm font-medium text-gray-700'>
                    End Date
                  </label>
                  <Input
                    type='date'
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className={`w-48 ${
                      endDate
                        ? 'text-black [&::-webkit-datetime-edit]:text-black'
                        : 'text-gray-400 [&::-webkit-datetime-edit]:text-gray-400'
                    }`}
                  />
                </div>

                {/* Owner */}
                <div className='flex items-center gap-3'>
                  <label className='w-20 shrink-0 text-sm font-medium text-gray-700'>
                    Owner<span className='text-red-500'>*</span>
                  </label>
                  <Select
                    value={owner}
                    onValueChange={setOwner}
                    disabled={
                      isLoadingMembers || activeTeamMembers.length === 0
                    }
                  >
                    <SelectTrigger className='w-48'>
                      <SelectValue
                        placeholder={
                          isLoadingMembers
                            ? 'Loading...'
                            : activeTeamMembers.length === 0
                              ? 'No active members available'
                              : 'Select owner'
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {activeTeamMembers.length > 0 &&
                        activeTeamMembers.map((member: any) => {
                          // Prefer numeric id, fallback to userId if id is not numeric
                          const memberId = member?.userId
                          return (
                            <SelectItem key={memberId} value={String(memberId)}>
                              {member.name ||
                                member.email ||
                                member?.user?.name ||
                                member?.user?.email ||
                                'Unknown'}
                            </SelectItem>
                          )
                        })}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Add Note Section */}
            <div className='border-t pt-4'>
              {!showNoteInput ? (
                <Button
                  variant='ghost'
                  onClick={() => setShowNoteInput(true)}
                  className='w-full justify-start gap-2 text-gray-600 hover:text-gray-800'
                >
                  <div className='flex h-6 w-6 items-center justify-center rounded-full bg-gray-200'>
                    <IconPlus size={14} />
                  </div>
                  Add note
                </Button>
              ) : (
                <div className='space-y-2'>
                  <label className='text-sm font-medium text-gray-700'>
                    Note
                  </label>
                  <Textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder='Enter your note here...'
                    className='min-h-[100px]'
                  />
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          {sidebarOpen && (
            <ActivitySidebar
              activities={activities}
              comments={comments}
              onClose={() => setSidebarOpen(false)}
              onLikeComment={handleLikeComment}
              onAddComment={handleAddComment}
            />
          )}
        </div>

        {/* Footer */}
        <DialogFooter className='border-t border-gray-200 px-6 py-4'>
          <Button
            variant='primary'
            onClick={handleCreateTask}
            disabled={isSubmitting || inDummyFlow || !selectedOwnerId}
            className={cn(
              'flex items-center gap-2',
              (isSubmitting || inDummyFlow || !selectedOwnerId) &&
                'cursor-not-allowed'
            )}
          >
            <IconPlus size={16} />
            {isSubmitting ? 'Creating…' : 'Create Task'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default CreateTaskModal
