'use client'

import { useState } from 'react'
import Image from 'next/image'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
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

function parseMinimumYears(value: string): number {
  const num = value.replace(/\D/g, '')
  return num ? parseInt(num, 10) : 0
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const URL_REGEX = /^https?:\/\/.+\..+/
const LINKEDIN_URL_REGEX = /^https?:\/\/(www\.)?linkedin\.com\/.+/i
const PHONE_REGEX = /^[\d\s+\-()]{10,20}$/

type FormErrors = Record<string, string>

function validateForm(values: {
  companyName: string
  websiteUrl: string
  contactEmail: string
  contactPhoneNumber: string
  jobTitle: string
  preferredLocation: string
  roleSummary: string
  linkedinUrl: string
  minimumYearsInput: string
}): FormErrors {
  const errors: FormErrors = {}

  const company = values.companyName.trim()
  if (!company) errors.companyName = 'Company name is required'
  else if (company.length < 2) errors.companyName = 'Enter a valid company name'

  const website = values.websiteUrl.trim()
  if (!website) errors.websiteUrl = 'Website URL is required'
  else if (!URL_REGEX.test(website))
    errors.websiteUrl = 'Enter a valid URL (e.g. https://example.com)'

  const email = values.contactEmail.trim()
  if (!email) errors.contactEmail = 'Contact email is required'
  else if (!EMAIL_REGEX.test(email))
    errors.contactEmail = 'Enter a valid email address'

  const phone = values.contactPhoneNumber.trim()
  if (!phone) errors.contactPhoneNumber = 'Phone number is required'
  else if (!PHONE_REGEX.test(phone))
    errors.contactPhoneNumber = 'Enter a valid phone number (10–20 digits)'

  if (!values.jobTitle) errors.jobTitle = 'Please select a job title'
  if (!values.preferredLocation)
    errors.preferredLocation = 'Please select a preferred location'

  const summary = values.roleSummary.trim()
  if (!summary) errors.roleSummary = 'Role summary is required'
  else if (summary.length < 20)
    errors.roleSummary = 'Role summary must be at least 20 characters'

  const linkedin = values.linkedinUrl.trim()
  if (!linkedin) errors.linkedinUrl = 'LinkedIn URL is required'
  else if (!LINKEDIN_URL_REGEX.test(linkedin))
    errors.linkedinUrl = 'Enter a valid LinkedIn profile URL'

  const years = parseMinimumYears(values.minimumYearsInput)
  if (!values.minimumYearsInput.trim())
    errors.minimumYearsInput = 'Minimum years of experience is required'
  else if (years < 0 || years > 50)
    errors.minimumYearsInput = 'Enter a value between 0 and 50'

  return errors
}

export default function PartnershipForm() {
  const [companyName, setCompanyName] = useState('')
  const [websiteUrl, setWebsiteUrl] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [contactPhoneNumber, setContactPhoneNumber] = useState('')
  const [jobTitle, setJobTitle] = useState('')
  const [preferredLocation, setPreferredLocation] = useState('')
  const [roleSummary, setRoleSummary] = useState('')
  const [linkedinUrl, setLinkedinUrl] = useState('')
  const [minimumYearsInput, setMinimumYearsInput] = useState('')
  const [useScreeningBot, setUseScreeningBot] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError(null)
    setSubmitSuccess(false)

    const validationErrors = validateForm({
      companyName,
      websiteUrl,
      contactEmail,
      contactPhoneNumber,
      jobTitle,
      preferredLocation,
      roleSummary,
      linkedinUrl,
      minimumYearsInput
    })

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setErrors({})
    setIsSubmitting(true)

    try {
      const payload = {
        companyName: companyName.trim(),
        websiteUrl: websiteUrl.trim(),
        contactEmail: contactEmail.trim(),
        contactPhoneNumber: contactPhoneNumber.trim(),
        jobTitle: jobTitle ? (JOB_TITLE_VALUES[jobTitle] ?? jobTitle) : '',
        preferredLocation: preferredLocation
          ? (LOCATION_VALUES[preferredLocation] ?? preferredLocation)
          : '',
        roleSummary: roleSummary.trim(),
        linkedinUrl: linkedinUrl.trim(),
        minimumYearsOfExperience: parseMinimumYears(minimumYearsInput),
        useScreeningBot,
        responseTime: '48 hours'
      }

      const response = await fetch('/api/talent/network/requirement/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'omit'
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(
          (data as { message?: string }).message ??
            `Request failed (${response.status})`
        )
      }

      setSubmitSuccess(true)
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

  return (
    <section className='flex justify-center bg-[linear-gradient(to_bottom,#e7e7ff_0%,#e7e7ff_50%,#ffffff_100%)] px-4 py-12'>
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
                  The Talent Network for Partnership Roles
                </h2>

                <p className='text-[15px] leading-relaxed text-gray-600'>
                  Access Sharkdom’s vetted community of partnership and
                  alliances experts. Submit your role details below to start
                  receiving qualified candidate matches.
                </p>

                <div className='flex flex-col gap-4 pt-2 text-sm text-gray-500'>
                  <span>
                    Created on: <b className='text-gray-700'>FEB 20, 2026</b>
                  </span>
                  <span>
                    <span className='pr-2 text-[#E4E7EE]'>|</span>Response Time:{' '}
                    <b className='text-gray-700'>~48 hours</b>
                  </span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Fields */}
            <div className='space-y-6'>
              {submitSuccess && (
                <div className='rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800'>
                  Your requirement was submitted successfully.
                </div>
              )}
              {submitError && (
                <div className='rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800'>
                  {submitError}
                </div>
              )}

              <div className='space-y-2'>
                <Label>
                  Name of your Company <span className='text-red-500'>*</span>
                </Label>
                <Input
                  placeholder='Eg: Pendo'
                  value={companyName}
                  onChange={(e) => {
                    setCompanyName(e.target.value)
                    if (errors.companyName)
                      setErrors((prev) => ({ ...prev, companyName: '' }))
                  }}
                  className={errors.companyName ? 'border-red-500' : ''}
                />
                {errors.companyName && (
                  <p className='text-sm text-red-600'>{errors.companyName}</p>
                )}
              </div>

              <div className='space-y-2'>
                <Label>
                  Add your Website <span className='text-red-500'>*</span>
                </Label>
                <Input
                  placeholder='Paste the URL'
                  value={websiteUrl}
                  onChange={(e) => {
                    setWebsiteUrl(e.target.value)
                    if (errors.websiteUrl)
                      setErrors((prev) => ({ ...prev, websiteUrl: '' }))
                  }}
                  className={errors.websiteUrl ? 'border-red-500' : ''}
                />
                {errors.websiteUrl && (
                  <p className='text-sm text-red-600'>{errors.websiteUrl}</p>
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
                  Phone Number <span className='text-red-500'>*</span>
                  <span className='ml-1 text-xs text-gray-400'>
                    (would not be shared to the candidate)
                  </span>
                </Label>
                <Input
                  placeholder='Eg: +1 809-237-439'
                  value={contactPhoneNumber}
                  onChange={(e) => {
                    setContactPhoneNumber(e.target.value)
                    if (errors.contactPhoneNumber)
                      setErrors((prev) => ({ ...prev, contactPhoneNumber: '' }))
                  }}
                  className={errors.contactPhoneNumber ? 'border-red-500' : ''}
                />
                {errors.contactPhoneNumber && (
                  <p className='text-sm text-red-600'>
                    {errors.contactPhoneNumber}
                  </p>
                )}
              </div>

              <div className='space-y-2'>
                <Label>
                  Job title you are hiring for{' '}
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
                  Role Summary (max 1500 chars){' '}
                  <span className='text-red-500'>*</span>
                </Label>
                <Textarea
                  placeholder='Looking for role to scale our partnership pipeline...'
                  value={roleSummary}
                  onChange={(e) => {
                    setRoleSummary(e.target.value)
                    if (errors.roleSummary)
                      setErrors((prev) => ({ ...prev, roleSummary: '' }))
                  }}
                  maxLength={1500}
                  className={errors.roleSummary ? 'border-red-500' : ''}
                />
                {errors.roleSummary && (
                  <p className='text-sm text-red-600'>{errors.roleSummary}</p>
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
                  Minimum Years of Experience{' '}
                  <span className='text-red-500'>*</span>
                </Label>
                <Input
                  placeholder='Eg: 4 Years'
                  value={minimumYearsInput}
                  onChange={(e) => {
                    setMinimumYearsInput(e.target.value)
                    if (errors.minimumYearsInput)
                      setErrors((prev) => ({ ...prev, minimumYearsInput: '' }))
                  }}
                  className={errors.minimumYearsInput ? 'border-red-500' : ''}
                />
                {errors.minimumYearsInput && (
                  <p className='text-sm text-red-600'>
                    {errors.minimumYearsInput}
                  </p>
                )}
              </div>

              {/* Checkbox Section */}
              <div className='space-y-2'>
                <Label>
                  Use Sharkdom Dweep Bot to screen results before sharing{' '}
                  <span className='text-red-500'>*</span>
                </Label>

                <div className='flex flex-col gap-2'>
                  <label className='flex cursor-pointer items-center gap-2 text-sm'>
                    <Checkbox
                      checked={useScreeningBot === true}
                      onCheckedChange={() => setUseScreeningBot(true)}
                    />
                    Yes
                  </label>

                  <label className='flex cursor-pointer items-center gap-2 text-sm'>
                    <Checkbox
                      checked={useScreeningBot === false}
                      onCheckedChange={() => setUseScreeningBot(false)}
                    />
                    No
                  </label>
                </div>

                <p className='pt-8 text-xs text-gray-500'>
                  <strong>Note:</strong> Disabling Dweep AI bot might increase
                  response rate up to 72 hours
                </p>
              </div>

              <div className='w-full pt-8 text-center'>
                <Button
                  type='submit'
                  className='rounded-lg bg-[#6863FB] px-6 hover:bg-indigo-600'
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Post your Role'}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </section>
  )
}
