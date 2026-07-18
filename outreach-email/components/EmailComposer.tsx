'use client'

import React, { Suspense, useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { ArrowLeft, Mail, Send } from 'lucide-react'

import 'react-quill/dist/quill.snow.css'

import { useSearchParams } from 'next/navigation'

import { getCurrentOrganization } from '@/lib/db/organization'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
  loading: () => (
    <div className='h-64 w-full animate-pulse rounded-lg bg-gray-100' />
  )
})

interface EmailComposerProps {
  onClose: () => void
  onSend: (emailData: EmailData) => Promise<void>
  isModal?: boolean
  selectedOrgId?: number
  selectedOrgName?: string
}

export interface EmailData {
  from: string
  subject: string
  body: string
  partnerId?: number
  externalPartnerCode?: string
}

interface Partner {
  orgId: number
  name: string
}

// Inner component that uses useSearchParams
const EmailComposerInner: React.FC<EmailComposerProps> = ({
  onClose,
  onSend,
  isModal = false,
  selectedOrgId,
  selectedOrgName
}) => {
  const param = useSearchParams()
  const code = param.get('code')

  const [formData, setFormData] = useState<EmailData>({
    from: 'office@mg.sharkdom.com',
    subject: '',
    body: '',
    ...(selectedOrgId
      ? { externalPartnerCode: code?.toString() }
      : { partnerId: 0 })
  })
  const [isLoading, setIsLoading] = useState(false)
  const [partners, setPartners] = useState<Partner[]>([])
  const [partnersLoading, setPartnersLoading] = useState(false)

  // Fetch partners from API
  useEffect(() => {
    const fetchPartners = async () => {
      try {
        setPartnersLoading(true)
        const response = await fetch('/api/active-partners')
        if (!response.ok) {
          throw new Error('Failed to fetch active partners')
        }
        const data: Partner[] = await response.json()

        // If selectedOrgId is provided and not in the list, add it
        if (selectedOrgId && selectedOrgName) {
          const existsInList = data.some((p) => p.orgId === selectedOrgId)
          if (!existsInList) {
            data.unshift({ orgId: selectedOrgId, name: selectedOrgName })
          }
        }

        setPartners(data)
        console.log('sasasasa', data)
        const org = await getCurrentOrganization()
        setFormData((prev) => ({
          ...prev,
          from: 'office@mg.sharkdom.com',
          ...(selectedOrgId
            ? { externalPartnerCode: code?.toString() }
            : { partnerId: org.id })
        }))
      } catch (error) {
        console.error('Error fetching partners:', error)
        setPartners([])
      } finally {
        setPartnersLoading(false)
      }
    }

    fetchPartners()
  }, [selectedOrgId, selectedOrgName])

  const handleInputChange = (
    field: keyof EmailData,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }))
  }

  const handlePartnerSelect = (partnerId: string) => {
    const partner = partners.find((p) => p.orgId.toString() === partnerId)
    console.log('partner', partner)
    if (partner) {
      setFormData((prev) => ({
        ...prev,
        partnerId: partner.orgId,
        externalPartnerCode: undefined // Clear external partner code when selecting regular partner
      }))
    }
  }

  const handleSend = async () => {
    if (
      !formData.subject ||
      !formData.body ||
      (!formData.partnerId && !formData.externalPartnerCode)
    ) {
      alert('Please fill in all required fields')
      return
    }

    setIsLoading(true)
    try {
      await onSend(formData)
      onClose()
    } catch (error) {
      console.error('Error sending email:', error)
      alert('Failed to send email. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline'],
      [{ color: [] }, { background: [] }],
      [{ align: [] }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ indent: '-1' }, { indent: '+1' }],
      ['link'],
      ['clean']
    ]
  }

  // Modal View (Popup)
  if (isModal) {
    return (
      <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
        <div className='w-full max-w-4xl rounded-lg bg-white shadow-xl'>
          {/* Header */}
          <div className='flex items-center justify-between border-b p-4'>
            <div className='flex items-center gap-3'>
              <Button
                variant='ghost'
                size='sm'
                onClick={onClose}
                className='p-1'
              >
                <ArrowLeft className='h-5 w-5' />
              </Button>
              <h2 className='text-lg font-semibold'>New Email</h2>
            </div>
            <Button
              variant={
                isLoading ||
                !formData.subject ||
                !formData.body ||
                (!formData.partnerId && !formData.externalPartnerCode)
                  ? 'disable'
                  : 'primary'
              }
              onClick={handleSend}
              disabled={
                isLoading ||
                !formData.subject ||
                !formData.body ||
                (!formData.partnerId && !formData.externalPartnerCode)
              }
              className='disabled:cursor-not-allowed'
            >
              {isLoading ? 'Sending...' : 'Send'}
              <Send className='ml-2 h-4 w-4' />
            </Button>
          </div>

          {/* Email Form */}
          <div className='max-h-[calc(100vh-200px)] space-y-6 overflow-y-auto p-6'>
            {/* To Field */}
            <div className='flex items-center gap-4'>
              <label className='w-20 text-sm font-medium text-gray-700'>
                To:
              </label>
              <Select
                onValueChange={handlePartnerSelect}
                disabled={
                  partnersLoading || !!selectedOrgId || !!selectedOrgName
                }
                value={
                  formData.partnerId ? formData.partnerId.toString() : undefined
                }
              >
                <SelectTrigger className='flex-1'>
                  <SelectValue
                    placeholder={
                      partnersLoading
                        ? 'Loading partners...'
                        : selectedOrgName
                          ? selectedOrgName
                          : 'Select Partner'
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {partners.length > 0 ? (
                    partners.map((partner) => (
                      <SelectItem
                        key={partner.orgId}
                        value={partner.orgId.toString()}
                      >
                        {partner.name}
                      </SelectItem>
                    ))
                  ) : (
                    <div className='p-2 text-sm text-gray-500'>
                      {partnersLoading
                        ? 'Loading partners...'
                        : 'No active partners found'}
                    </div>
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Subject Field */}
            <div className='flex items-center gap-4'>
              <label className='w-20 text-sm font-medium text-gray-700'>
                Subject:
              </label>
              <Input
                value={formData.subject}
                onChange={(e) => handleInputChange('subject', e.target.value)}
                placeholder='Enter email subject'
                className='flex-1'
              />
            </div>

            {/* Rich Text Editor */}
            <div className='space-y-2'>
              <label className='text-sm font-medium text-gray-700'>Body</label>
              <div className='rounded-lg border'>
                <ReactQuill
                  theme='snow'
                  value={formData.body}
                  onChange={(value) => handleInputChange('body', value)}
                  modules={quillModules}
                  placeholder='Compose your email...'
                  style={{ height: '300px' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Full Page View
  return (
    <div className='flex min-h-screen flex-col bg-white'>
      {/* Header */}
      <div className='flex items-center justify-between border-b bg-white p-4'>
        <div className='flex items-center gap-3'>
          <Button variant='ghost' size='sm' onClick={onClose} className='p-1'>
            <ArrowLeft className='h-5 w-5' />
          </Button>
          <h2 className='text-lg font-semibold'>New Email</h2>
        </div>
        <Button
          variant={
            isLoading ||
            !formData.subject ||
            !formData.body ||
            (!formData.partnerId && !formData.externalPartnerCode)
              ? 'disable'
              : 'primary'
          }
          onClick={handleSend}
          disabled={
            isLoading ||
            !formData.subject ||
            !formData.body ||
            (!formData.partnerId && !formData.externalPartnerCode)
          }
          className='disabled:cursor-not-allowed'
        >
          {isLoading ? 'Sending...' : 'Send'}
          <Send className='ml-2 h-4 w-4' />
        </Button>
      </div>

      {/* Email Form */}
      <div className='mx-auto w-full max-w-5xl flex-1 space-y-6 p-6'>
        {/* To Field */}
        <div className='flex items-center gap-4'>
          <label className='w-20 text-sm font-medium text-gray-700'>To:</label>
          <Select
            onValueChange={handlePartnerSelect}
            disabled={partnersLoading || !!selectedOrgId || !!selectedOrgName}
            value={
              formData.partnerId ? formData.partnerId.toString() : undefined
            }
          >
            <SelectTrigger className='flex-1'>
              <SelectValue
                placeholder={
                  partnersLoading
                    ? 'Loading partners...'
                    : selectedOrgName
                      ? selectedOrgName
                      : 'Select Partner'
                }
              />
            </SelectTrigger>
            <SelectContent>
              {partners.length > 0 ? (
                partners.map((partner) => (
                  <SelectItem
                    key={partner.orgId}
                    value={partner.orgId.toString()}
                  >
                    {partner.name}
                  </SelectItem>
                ))
              ) : (
                <div className='p-2 text-sm text-gray-500'>
                  {partnersLoading
                    ? 'Loading partners...'
                    : 'No active partners found'}
                </div>
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Subject Field */}
        <div className='flex items-center gap-4'>
          <label className='w-20 text-sm font-medium text-gray-700'>
            Subject:
          </label>
          <Input
            value={formData.subject}
            onChange={(e) => handleInputChange('subject', e.target.value)}
            placeholder='Enter email subject'
            className='flex-1'
          />
        </div>

        {/* Rich Text Editor */}
        <div className='space-y-2'>
          <label className='text-sm font-medium text-gray-700'>Body</label>
          <div className='rounded-lg border'>
            <ReactQuill
              theme='snow'
              value={formData.body}
              onChange={(value) => handleInputChange('body', value)}
              modules={quillModules}
              placeholder='Compose your email...'
              style={{ height: '400px' }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

// Wrapper component with Suspense boundary
const EmailComposer: React.FC<EmailComposerProps> = (props) => {
  return (
    <Suspense
      fallback={
        <div className='flex h-64 items-center justify-center'>
          <div className='h-8 w-8 animate-spin rounded-full border-4 border-primary-blue border-t-transparent' />
        </div>
      }
    >
      <EmailComposerInner {...props} />
    </Suspense>
  )
}

export default EmailComposer
