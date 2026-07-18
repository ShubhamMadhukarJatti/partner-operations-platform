'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { Search, UploadCloud } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'

const JOB_TITLE_VALUES: Record<string, string> = {
  head: 'Head of Partnerships',
  pam: 'Partnership Account Manager (PAM)',
  marketing: 'Partner Marketing Manager',
  success: 'Partner Success Manager',
  consultant: 'Partnership Consultant (Advisor)',
  sr: 'Sr. Alliance Manager',
  manager: 'Partner Manager',
  other: 'Others'
}

const LOCATION_VALUES: Record<string, string> = {
  remote: 'Remote',
  onsite: 'Onsite',
  hybrid: 'Hybrid',
  'no-pref': 'No preference'
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const LINKEDIN_URL_REGEX = /^https?:\/\/(www\.)?linkedin\.com\/.+/i
const MAX_PDF_SIZE_MB = 10

type FormErrors = Record<string, string>

function validateForm(values: {
  applicantName: string
  contactEmail: string
  linkedinUrl: string
  jobTitle: string
  preferredLocation: string
  additionalInformation: string
  file: File | null
}): FormErrors {
  const errors: FormErrors = {}

  const name = values.applicantName.trim()
  if (!name) errors.applicantName = 'Applicant name is required'
  else if (name.length < 2) errors.applicantName = 'Enter a valid name'

  const email = values.contactEmail.trim()
  if (!email) errors.contactEmail = 'Contact email is required'
  else if (!EMAIL_REGEX.test(email))
    errors.contactEmail = 'Enter a valid email address'

  const linkedin = values.linkedinUrl.trim()
  if (!linkedin) errors.linkedinUrl = 'LinkedIn URL is required'
  else if (!LINKEDIN_URL_REGEX.test(linkedin))
    errors.linkedinUrl = 'Enter a valid LinkedIn profile URL'

  if (!values.jobTitle) errors.jobTitle = 'Please select a job title'
  if (!values.preferredLocation)
    errors.preferredLocation = 'Please select a preferred location'

  const info = values.additionalInformation.trim()
  if (!info) errors.additionalInformation = 'Additional information is required'
  else if (info.length < 20)
    errors.additionalInformation = 'Please enter at least 20 characters'

  if (!values.file) errors.licensePdf = 'Please upload a license PDF'
  else if (values.file.size > MAX_PDF_SIZE_MB * 1024 * 1024)
    errors.licensePdf = `File size must be under ${MAX_PDF_SIZE_MB}MB`

  return errors
}

export default function PartnershipFormReview() {
  const [applicantName, setApplicantName] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [linkedinUrl, setLinkedinUrl] = useState('')
  const [jobTitle, setJobTitle] = useState('')
  const [preferredLocation, setPreferredLocation] = useState('')
  const [additionalInformation, setAdditionalInformation] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [showCommunityMemberModal, setShowCommunityMemberModal] =
    useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault()
    const dropped = e.dataTransfer.files?.[0]
    if (dropped?.type === 'application/pdf') {
      setFile(dropped)
      if (errors.licensePdf) setErrors((prev) => ({ ...prev, licensePdf: '' }))
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (selected?.type === 'application/pdf') {
      setFile(selected)
      if (errors.licensePdf) setErrors((prev) => ({ ...prev, licensePdf: '' }))
    }
    e.target.value = ''
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError(null)
    setSubmitSuccess(false)

    const validationErrors = validateForm({
      applicantName,
      contactEmail,
      linkedinUrl,
      jobTitle,
      preferredLocation,
      additionalInformation,
      file
    })

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setErrors({})
    setIsSubmitting(true)

    try {
      let fileUrl = ''

      if (file) {
        const formData = new FormData()
        formData.append('file', file)
        const uploadRes = await fetch('/api/talent/network/upload/pdf', {
          method: 'POST',
          body: formData,
          credentials: 'omit'
        })
        const uploadData = await uploadRes.json().catch(() => ({}))
        if (!uploadRes.ok || !uploadData?.data?.fileUrl) {
          throw new Error(uploadData?.message ?? 'PDF upload failed')
        }
        fileUrl = uploadData.data.fileUrl
      }

      const payload = {
        applicantName: applicantName.trim(),
        contactEmail: contactEmail.trim(),
        linkedinUrl: linkedinUrl.trim(),
        jobTitle: jobTitle ? (JOB_TITLE_VALUES[jobTitle] ?? jobTitle) : '',
        preferredLocation: preferredLocation
          ? (LOCATION_VALUES[preferredLocation] ?? preferredLocation)
          : '',
        additionalInformation: additionalInformation.trim(),
        licensePdfUrl: fileUrl
      }

      const response = await fetch(
        '/api/talent/network/save/community/opt-in',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          credentials: 'omit'
        }
      )

      const data = await response.json().catch(() => ({}))
      if (!response.ok) {
        throw new Error(
          (data as { message?: string }).message ??
            `Request failed (${response.status})`
        )
      }

      setSubmitSuccess(true)
      setShowCommunityMemberModal(true)
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : 'Something went wrong. Please try again.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const linkedInAddExperienceUrl =
    'https://www.linkedin.com/me/profile/experience/add/'

  return (
    <section className='flex justify-center bg-[linear-gradient(to_bottom,#e7e7ff_0%,#e7e7ff_50%,#ffffff_100%)] px-4 py-12'>
      <Dialog
        open={showCommunityMemberModal}
        onOpenChange={setShowCommunityMemberModal}
      >
        <DialogContent
          hideCloseBtn={false}
          className='max-w-md border-0 bg-transparent p-[3px] shadow-xl'
        >
          <div className='rounded-2xl bg-gradient-to-b from-[#e0f2f1] to-[#e8e0f0] p-[3px]'>
            <div className='rounded-[14px] bg-white p-6'>
              <DialogHeader>
                <DialogTitle className='text-center text-xl font-semibold text-[#6863FB]'>
                  Add &apos;Community Member&apos; Role
                </DialogTitle>
              </DialogHeader>
              <div className='mt-4 space-y-3'>
                <p className='flex items-center gap-2 text-sm text-gray-800'>
                  <span className='text-green-600' aria-hidden>
                    ✓
                  </span>
                  <span>
                    <strong>&apos;Community Member&apos;</strong> at{' '}
                    <strong>Sharkdom</strong>
                  </span>
                </p>
                <p className='text-sm text-gray-500'>
                  • Add the role under your linkedin profile for our team to
                  verify your authenticity.
                </p>
              </div>
              <a
                href={'https://www.linkedin.com/feed'}
                target='_blank'
                rel='noopener noreferrer'
                className='mt-6 block w-full'
              >
                <Button
                  type='button'
                  className='h-12 w-full rounded-xl bg-[#6863FB] font-medium text-white hover:bg-[#5a56e8]'
                >
                  Add on Linkedin
                </Button>
              </a>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Card className='w-full max-w-4xl rounded-2xl border border-gray-200 shadow-sm'>
        <CardContent className='space-y-8 md:p-8'>
          <form onSubmit={handleSubmit}>
            {/* Header */}
            <div className='items-start gap-5 md:flex'>
              <Image
                src='/assets/partnership-job-form.svg'
                width={120}
                height={120}
                alt='partnership-form'
                className='mb-4 md:mb-0'
              />

              <div className='w-[90%] space-y-2'>
                <h2 className='text-[26px] font-semibold text-gray-900'>
                  Opt-in to community, newsletter, job alerts
                </h2>

                <p className='text-[15px] leading-relaxed text-gray-600'>
                  Access Sharkdom's vetted community of partnership and
                  alliances experts. Submit your role details below to start
                  receiving qualified candidate matches.
                </p>

                <div className='flex gap-6 pt-2 text-sm text-gray-500'>
                  <span>
                    Created on: <b className='text-gray-700'>FEB 20, 2026</b>
                  </span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Fields */}
            <div className='space-y-6'>
              {submitSuccess && (
                <div className='rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800'>
                  You have been subscribed for job notifications successfully.
                </div>
              )}
              {submitError && (
                <div className='rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800'>
                  {submitError}
                </div>
              )}

              <div className='space-y-2'>
                <Label>
                  Name of the person applying{' '}
                  <span className='text-red-500'>*</span>
                </Label>
                <Input
                  placeholder='Eg: Aaron V.'
                  value={applicantName}
                  onChange={(e) => {
                    setApplicantName(e.target.value)
                    if (errors.applicantName)
                      setErrors((prev) => ({ ...prev, applicantName: '' }))
                  }}
                  className={errors.applicantName ? 'border-red-500' : ''}
                />
                {errors.applicantName && (
                  <p className='text-sm text-red-600'>{errors.applicantName}</p>
                )}
              </div>

              <div className='space-y-2'>
                <Label>
                  Contact email <span className='text-red-500'>*</span>
                  <span className='ml-1 text-xs text-gray-400'>
                    (shortlisted interested candidates would be shared here)
                  </span>
                </Label>
                <Input
                  placeholder='Enter work email'
                  type='email'
                  value={contactEmail}
                  onChange={(e) => {
                    setContactEmail(e.target.value)
                    if (errors.contactEmail)
                      setErrors((prev) => ({ ...prev, contactEmail: '' }))
                  }}
                  className={errors.contactEmail ? 'border-red-500' : ''}
                />
                {errors.contactEmail && (
                  <p className='text-sm text-red-600'>{errors.contactEmail}</p>
                )}
              </div>

              <div className='space-y-2'>
                <Label>
                  Your linkedin ID <span className='text-red-500'>*</span>
                </Label>
                <Input
                  placeholder='Eg: https://linkedin.com/SHARKDOM_PARTNERSHIP_Job'
                  value={linkedinUrl}
                  onChange={(e) => {
                    setLinkedinUrl(e.target.value)
                    if (errors.linkedinUrl)
                      setErrors((prev) => ({ ...prev, linkedinUrl: '' }))
                  }}
                  className={errors.linkedinUrl ? 'border-red-500' : ''}
                />
                {errors.linkedinUrl && (
                  <p className='text-sm text-red-600'>{errors.linkedinUrl}</p>
                )}
              </div>

              <div className='space-y-2'>
                <Label>
                  Your preferred Job title{' '}
                  <span className='text-red-500'>*</span>
                </Label>

                <Select
                  value={jobTitle}
                  onValueChange={(v) => {
                    setJobTitle(v)
                    if (errors.jobTitle)
                      setErrors((prev) => ({ ...prev, jobTitle: '' }))
                  }}
                >
                  <SelectTrigger
                    className={errors.jobTitle ? 'border-red-500' : ''}
                  >
                    <SelectValue placeholder='Partner Manager' />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value='head'>Head of Partnerships</SelectItem>
                    <SelectItem value='pam'>
                      Partnership Account Manager (PAM)
                    </SelectItem>
                    <SelectItem value='marketing'>
                      Partner Marketing Manager
                    </SelectItem>
                    <SelectItem value='success'>
                      Partner Success Manager
                    </SelectItem>
                    <SelectItem value='consultant'>
                      Partnership Consultant (Advisor)
                    </SelectItem>
                    <SelectItem value='sr'>Sr. Alliance Manager</SelectItem>
                    <SelectItem value='manager'>Partner Manager</SelectItem>
                    <SelectItem value='other'>Others</SelectItem>
                  </SelectContent>
                </Select>
                {errors.jobTitle && (
                  <p className='text-sm text-red-600'>{errors.jobTitle}</p>
                )}
              </div>

              <div className='space-y-2'>
                <Label>
                  Preferred Location <span className='text-red-500'>*</span>
                </Label>

                <Select
                  value={preferredLocation}
                  onValueChange={(v) => {
                    setPreferredLocation(v)
                    if (errors.preferredLocation)
                      setErrors((prev) => ({ ...prev, preferredLocation: '' }))
                  }}
                >
                  <SelectTrigger
                    className={errors.preferredLocation ? 'border-red-500' : ''}
                  >
                    <SelectValue placeholder='Remote' />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value='remote'>Remote</SelectItem>
                    <SelectItem value='onsite'>Onsite</SelectItem>
                    <SelectItem value='hybrid'>Hybrid</SelectItem>
                    <SelectItem value='no-pref'>No preference</SelectItem>
                  </SelectContent>
                </Select>
                {errors.preferredLocation && (
                  <p className='text-sm text-red-600'>
                    {errors.preferredLocation}
                  </p>
                )}
              </div>

              <div className='space-y-2'>
                <Label>
                  Any Role specific addition infomation you want to share (max
                  1500 chars) <span className='text-red-500'>*</span>
                </Label>
                <Textarea
                  placeholder='Looking for role to scale our partnership pipeline...'
                  value={additionalInformation}
                  onChange={(e) => {
                    setAdditionalInformation(e.target.value)
                    if (errors.additionalInformation)
                      setErrors((prev) => ({
                        ...prev,
                        additionalInformation: ''
                      }))
                  }}
                  maxLength={1500}
                  className={
                    errors.additionalInformation ? 'border-red-500' : ''
                  }
                />
                {errors.additionalInformation && (
                  <p className='text-sm text-red-600'>
                    {errors.additionalInformation}
                  </p>
                )}
              </div>

              <div className='space-y-2'>
                <Label>
                  Upload License PDF <span className='text-red-500'>*</span>
                </Label>
                <label
                  htmlFor='fileUpload'
                  className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border border-dashed px-6 py-10 text-center shadow-inner transition hover:bg-gray-100 ${errors.licensePdf ? 'border-red-500 bg-red-50/50' : 'border-gray-300 bg-gray-50'}`}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                >
                  <UploadCloud className='h-7 w-7 text-gray-500' />

                  <p className='text-sm text-gray-600'>
                    Click to upload or drag and drop
                  </p>

                  <p className='text-xs text-gray-400'>
                    Max. File Size: {MAX_PDF_SIZE_MB}MB
                  </p>

                  <Button
                    type='button'
                    variant='outline'
                    className='mt-2 rounded-full px-5'
                    onClick={(e) => {
                      e.preventDefault()
                      fileInputRef.current?.click()
                    }}
                  >
                    <Search className='mr-2 h-4 w-4' />
                    Browse file
                  </Button>

                  <input
                    ref={fileInputRef}
                    id='fileUpload'
                    type='file'
                    accept='application/pdf'
                    className='hidden'
                    onChange={handleFileChange}
                  />

                  {file && (
                    <p className='mt-2 text-xs text-green-600'>
                      Uploaded: {file.name}
                    </p>
                  )}
                </label>
                {errors.licensePdf && (
                  <p className='text-sm text-red-600'>{errors.licensePdf}</p>
                )}
              </div>

              <div className='w-full pt-8 text-center'>
                <Button
                  type='submit'
                  className='rounded-lg bg-[#6863FB] px-6 hover:bg-indigo-600'
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? 'Submitting...'
                    : 'Subscribe for Jobs Notification'}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </section>
  )
}
