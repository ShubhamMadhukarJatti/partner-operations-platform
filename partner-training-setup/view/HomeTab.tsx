'use client'

import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Download,
  ExternalLink,
  FileText,
  Info,
  Play,
  Plus,
  Search,
  Upload,
  X
} from 'lucide-react'

import { cn } from '@/lib/utils'
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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { showCustomToast } from '@/components/custom-toast'
import WelcomeMessage from '@/components/welcome-message/WelcomeMessage'

import DataTable, { TableColumn } from './_components/DataTable'
import PartnersList, { Partner } from './_components/PartnersList'
import VendorStatCard from './VendorStatCard'

interface DashboardOverview {
  totalCourses: number
  totalPartners: number
  activePartners: number
  avgReadinessPercentage: number
  partnerReadiness: Array<{
    partnerName: string
    noOfUsers: number
    coursesEnrolled: number
    readinessScore: number
  }>
  coursePerformance: Array<{
    courseTitle: string
    enrolled: number
    completed: number
    avgCompletion: number
  }>
}

interface Certificate {
  courseId: number
  courseName: string
  certificateUrl: string
}

interface Course {
  id: number
  title: string
  description?: string
}

const HomeTab = () => {
  const [partners, setPartners] = useState<Partner[]>([])
  const [loadingPartners, setLoadingPartners] = useState(true)
  const [dashboardData, setDashboardData] = useState<DashboardOverview | null>(
    null
  )
  const [loadingDashboard, setLoadingDashboard] = useState(true)
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [loadingCertificates, setLoadingCertificates] = useState(true)
  const [isAddCertModalOpen, setIsAddCertModalOpen] = useState(false)
  const [selectedCertificate, setSelectedCertificate] =
    useState<Certificate | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [showAllCertificates, setShowAllCertificates] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [originalUrl, setOriginalUrl] = useState<string | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        setLoadingPartners(true)
        const response = await fetch(
          '/api/partner/training/dashboard/associated/partners',
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          }
        )

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          console.error('Failed to fetch partners:', errorData)
          setPartners([])
          return
        }

        const data = await response.json()

        if (data.success && data.data) {
          // Map API response to Partner format
          // API returns array of strings (partner organization names)
          const mappedPartners: Partner[] = Array.isArray(data.data)
            ? data.data.map((partnerName: string, index: number) => ({
                id: index,
                name: partnerName
              }))
            : []
          setPartners(mappedPartners)
        } else {
          setPartners([])
        }
      } catch (error) {
        console.error('Error fetching partners:', error)
        setPartners([])
      } finally {
        setLoadingPartners(false)
      }
    }

    fetchPartners()
  }, [])

  useEffect(() => {
    const fetchDashboardOverview = async () => {
      try {
        setLoadingDashboard(true)
        const response = await fetch(
          '/api/partner/training/dashboard/overview',
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          }
        )

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          console.error('Failed to fetch dashboard overview:', errorData)
          return
        }

        const data = await response.json()

        if (data.success && data.data) {
          setDashboardData(data.data)
        }
      } catch (error) {
        console.error('Error fetching dashboard overview:', error)
      } finally {
        setLoadingDashboard(false)
      }
    }

    fetchDashboardOverview()
  }, [])

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        setLoadingCertificates(true)
        const response = await fetch(
          '/api/partner/training/created/by/org/certificates',
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          }
        )

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          console.error('Failed to fetch certificates:', errorData)
          setCertificates([])
          return
        }

        const data = await response.json()

        if (data.success && data.data) {
          setCertificates(Array.isArray(data.data) ? data.data : [])
        } else {
          setCertificates([])
        }
      } catch (error) {
        console.error('Error fetching certificates:', error)
        setCertificates([])
      } finally {
        setLoadingCertificates(false)
      }
    }

    fetchCertificates()
  }, [])

  // File upload handlers
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]
    if (!file) return

    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      setUploadError('File size exceeds 5MB. Please upload a smaller file.')
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      return
    }

    setUploadError(null)
    setSelectedFile(file)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const file = e.dataTransfer.files[0]
    if (file) {
      const maxSize = 5 * 1024 * 1024 // 5MB
      if (file.size > maxSize) {
        setUploadError('File size exceeds 5MB. Please upload a smaller file.')
        return
      }
      setUploadError(null)
      setSelectedFile(file)
    }
  }

  const handleFileClick = () => {
    fileInputRef.current?.click()
  }

  const handleRemoveFile = () => {
    setSelectedFile(null)
    setUploadError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleCertificateClick = (certificate: Certificate) => {
    setSelectedCertificate(certificate)
    setSelectedFile(null)
    setUploadError(null)
    setIsAddCertModalOpen(true)
  }

  // Get preview URL for S3 links
  const getPreviewUrl = (url: string): string => {
    if (!url) return url

    // If it's an S3 URL, use Google Docs viewer for PDFs or direct link for images
    if (url.includes('s3.') || url.includes('amazonaws.com')) {
      // Check if it's a PDF
      if (url.toLowerCase().endsWith('.pdf')) {
        return `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`
      }
      // For images, return direct URL
      if (url.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
        return url
      }
      // For other files, try Google Docs viewer
      return `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`
    }

    // For non-S3 URLs, return as is
    return url
  }

  const handleViewCertificate = (url: string) => {
    const previewUrl = getPreviewUrl(url)
    setPreviewUrl(previewUrl)
    setOriginalUrl(url) // Store original URL for download
    setIsPreviewOpen(true)
  }

  const handleDownloadCertificate = (url: string) => {
    // Create a temporary anchor element to trigger download
    const link = document.createElement('a')
    link.href = url
    link.download = '' // Let browser determine filename
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleModalClose = () => {
    setIsAddCertModalOpen(false)
    setSelectedCertificate(null)
    setSelectedFile(null)
    setIsDragging(false)
    setUploadError(null)
  }

  const handleConfirm = async () => {
    if (!selectedCertificate) {
      return
    }

    if (!selectedFile) {
      setUploadError('Please upload a certificate file')
      return
    }

    setIsUploading(true)
    setUploadError(null)

    try {
      // Upload file
      const formData = new FormData()
      formData.append('file', selectedFile)

      const uploadResponse = await fetch('/api/partner/training/upload', {
        method: 'POST',
        body: formData
      })

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json().catch(() => ({}))
        throw new Error(errorData.message || 'Upload failed')
      }

      const uploadResult = await uploadResponse.json()
      const fileUrl =
        uploadResult.data?.fileUrl ||
        uploadResult.data?.url ||
        uploadResult.fileUrl ||
        uploadResult.url ||
        uploadResult.data

      if (!fileUrl || typeof fileUrl !== 'string') {
        throw new Error(
          'Invalid response from server. Expected fileUrl in response.'
        )
      }

      // Update certificate URL
      const updateResponse = await fetch(
        `/api/partner/training/courses/${selectedCertificate.courseId}/certificate`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            certificateUrl: fileUrl
          })
        }
      )

      if (!updateResponse.ok) {
        const errorData = await updateResponse.json().catch(() => ({}))
        throw new Error(errorData.message || 'Failed to update certificate')
      }

      // Refresh certificates list
      const fetchCertificates = async () => {
        try {
          const response = await fetch(
            '/api/partner/training/created/by/org/certificates',
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json'
              }
            }
          )

          if (response.ok) {
            const data = await response.json()
            if (data.success && data.data) {
              setCertificates(Array.isArray(data.data) ? data.data : [])
            }
          }
        } catch (error) {
          console.error('Error refreshing certificates:', error)
        }
      }

      await fetchCertificates()

      showCustomToast(
        'Success',
        'Certificate uploaded successfully!',
        'success',
        3000
      )

      // Close modal and reset form
      handleModalClose()
    } catch (error) {
      console.error('Error uploading certificate:', error)
      setUploadError(
        error instanceof Error ? error.message : 'Failed to upload certificate'
      )
    } finally {
      setIsUploading(false)
    }
  }

  // Helper function to get readiness score color
  const getReadinessColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-700'
    if (score >= 50) return 'bg-orange-100 text-orange-700'
    return 'bg-red-100 text-red-700'
  }

  // Helper function to get completion color
  const getCompletionColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-700'
    if (score >= 50) return 'bg-orange-100 text-orange-700'
    return 'bg-red-100 text-red-700'
  }

  // Partner Readiness columns
  const partnerReadinessColumns: TableColumn[] = [
    {
      key: 'partnerName',
      label: 'Partner',
      render: (value) => (
        <span className='font-medium text-gray-900 dark:text-white'>
          {value}
        </span>
      )
    },
    {
      key: 'noOfUsers',
      label: 'No Of Users',
      render: (value) => (
        <span className='text-gray-600 dark:text-white'>{value}</span>
      )
    },
    {
      key: 'coursesEnrolled',
      label: 'Courses Enrolled',
      render: (value) => (
        <span className='text-gray-600 dark:text-white'>{value}</span>
      )
    },
    {
      key: 'readinessScore',
      label: 'Readiness Score',
      render: (value, row) => (
        <span
          className={cn(
            'rounded px-2 py-1 text-xs font-medium',
            getReadinessColor(value)
          )}
        >
          {value}%
        </span>
      )
    }
  ]

  // Course Performance columns
  const coursePerformanceColumns: TableColumn[] = [
    {
      key: 'courseTitle',
      label: 'Course Name',
      render: (value) => (
        <span className='font-medium text-gray-900 dark:text-white'>
          {value}
        </span>
      )
    },
    {
      key: 'enrolled',
      label: 'Enrolled',
      render: (value) => (
        <span className='text-gray-600 dark:text-white'>{value}</span>
      )
    },
    {
      key: 'completed',
      label: 'Completed',
      render: (value) => (
        <span className='text-gray-600 dark:text-white'>{value}</span>
      )
    },
    {
      key: 'avgCompletion',
      label: 'Avg Completion',
      render: (value) => (
        <span
          className={cn(
            'rounded px-2 py-1 text-xs font-medium',
            getCompletionColor(value)
          )}
        >
          {value}%
        </span>
      )
    }
  ]

  return (
    <div className='flex flex-col gap-8 pb-20'>
      {/* Top Actions */}
      <div className='flex w-full justify-end'>
        <Button
          asChild
          variant='primary'
          className='inline-flex items-center gap-2'
        >
          <Link href='/partner-training-setup/add'>
            <Plus size={18} />
            Add a course
          </Link>
        </Button>
      </div>

      {/* Hero Section */}
      <div className='relative w-full overflow-hidden rounded-[24px] border border-transparent bg-gradient-to-t from-white to-[#FFE7E7] px-10 py-12 dark:border-border dark:from-muted/40 dark:to-muted/20'>
        {/* Background Pattern */}
        <div className='absolute right-0 top-0 h-full w-1/2'>
          <Image
            src='/assets/partner-training/home-hero-pattern.png'
            alt='Pattern'
            fill
            className='object-contain object-right-top opacity-80 mix-blend-multiply dark:opacity-20 dark:mix-blend-screen'
          />
        </div>

        <WelcomeMessage variant='medium' subtitle='Welcome Back' />

        {/* Stats Card Overlay */}
        <div className='relative z-10 mt-8 grid w-fit min-w-[600px] grid-cols-4 divide-x divide-gray-100 rounded-2xl bg-white p-6 shadow-sm dark:bg-card'>
          <VendorStatCard
            label='Total Courses'
            value={
              loadingDashboard
                ? '...'
                : dashboardData?.totalCourses?.toString() || '0'
            }
          />
          <VendorStatCard
            label='Total Partners'
            value={
              loadingDashboard
                ? '...'
                : dashboardData?.totalPartners?.toString() || '0'
            }
          />
          <VendorStatCard
            label='Active Partners'
            value={
              loadingDashboard
                ? '...'
                : dashboardData?.activePartners?.toString() || '0'
            }
          />
          <div className='flex flex-col items-center justify-center text-center'>
            <div className='text-2xl font-bold text-gray-900 dark:text-white'>
              {loadingDashboard
                ? '...'
                : `${dashboardData?.avgReadinessPercentage || 0}%`}
            </div>
            <div className='text-sm text-gray-500 dark:text-white'>
              Avg Readiness
            </div>
          </div>
        </div>
      </div>

      <div className='grid grid-cols-1 gap-8 lg:grid-cols-3'>
        {/* Left Column - Partner Readiness */}
        <div className='col-span-1 space-y-4 lg:col-span-2'>
          <div className='flex items-center gap-2 font-semibold text-gray-900 dark:text-white'>
            <div className='flex h-6 w-6 items-center justify-center rounded bg-gray-100 text-gray-500 dark:bg-white/10 dark:text-white'>
              <Play size={10} fill='currentColor' />
            </div>
            <h3>Partner Readiness Score</h3>
            <Info size={16} className='text-gray-400 dark:text-white' />
          </div>

          <DataTable
            columns={partnerReadinessColumns}
            data={dashboardData?.partnerReadiness || []}
            loading={loadingDashboard}
            emptyMessage='No partner readiness data available'
          />
        </div>

        {/* Right Column - Partners List */}
        <div className='col-span-1 space-y-4'>
          <div className='flex items-center gap-2 font-semibold text-gray-900 dark:text-white'>
            <div className='flex h-6 w-6 items-center justify-center rounded bg-gray-100 text-gray-500 dark:bg-white/10 dark:text-white'>
              <Play size={10} fill='currentColor' />
            </div>
            <h3>Partners</h3>
            <Info size={16} className='text-gray-400 dark:text-white' />
          </div>

          <PartnersList
            partners={partners}
            loading={loadingPartners}
            emptyMessage='No partners associated'
          />

          <div className='flex items-center gap-2 font-semibold text-gray-900 dark:text-white'>
            <div className='flex h-6 w-6 items-center justify-center rounded bg-gray-100 text-gray-500 dark:bg-white/10 dark:text-white'>
              <Play size={10} fill='currentColor' />
            </div>
            <h3>Certifications</h3>
            <Info size={16} className='text-gray-400 dark:text-white' />
          </div>

          {/* Certificates List */}
          {loadingCertificates ? (
            <div className='flex items-center justify-center py-8'>
              <div className='text-sm text-gray-500 dark:text-white'>
                Loading certificates...
              </div>
            </div>
          ) : certificates.length === 0 ? (
            <div className='flex min-h-[200px] flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-8 dark:border-border dark:bg-white/5'>
              <div className='flex h-16 w-16 items-center justify-center rounded-full bg-gray-200 dark:bg-white/20'>
                <Plus size={32} className='text-gray-500 dark:text-white' />
              </div>
              <p className='text-base font-medium text-gray-700 dark:text-white'>
                Add Certification
              </p>
            </div>
          ) : (
            <div className='space-y-3'>
              {(showAllCertificates
                ? certificates
                : certificates.slice(0, 3)
              ).map((certificate, index) => (
                <div
                  key={certificate.courseId || index}
                  onClick={() => handleCertificateClick(certificate)}
                  className='flex cursor-pointer items-center justify-between rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:border-border dark:bg-card'
                >
                  <div className='min-w-0 flex-1'>
                    <h4 className='truncate font-medium text-gray-900 dark:text-white'>
                      {certificate.courseName || 'Untitled Course'}
                    </h4>
                  </div>
                  {certificate.certificateUrl ? (
                    <div className='ml-4 flex flex-shrink-0 items-center gap-2'>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={(e) => {
                          e.stopPropagation()
                          handleCertificateClick(certificate)
                        }}
                        className='flex items-center gap-2'
                      >
                        <Upload size={14} />
                        Update
                      </Button>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={(e) => {
                          e.stopPropagation()
                          handleViewCertificate(certificate.certificateUrl)
                        }}
                        className='flex items-center gap-2'
                      >
                        <ExternalLink size={14} />
                        View
                      </Button>
                    </div>
                  ) : (
                    <div className='ml-4 flex-shrink-0'>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={(e) => {
                          e.stopPropagation()
                          handleCertificateClick(certificate)
                        }}
                        className='flex items-center gap-2'
                      >
                        <Plus size={14} />
                        Add
                      </Button>
                    </div>
                  )}
                </div>
              ))}
              {certificates.length > 3 && !showAllCertificates && (
                <div className='pt-2'>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => setShowAllCertificates(true)}
                    className='w-full text-sm text-gray-600 hover:text-gray-900 dark:text-white dark:text-white'
                  >
                    Show All ({certificates.length})
                  </Button>
                </div>
              )}
              {showAllCertificates && certificates.length > 3 && (
                <div className='pt-2'>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => setShowAllCertificates(false)}
                    className='w-full text-sm text-gray-600 hover:text-gray-900 dark:text-white dark:text-white'
                  >
                    Show Less
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bottom Row - Course Performance */}
        <div className='col-span-1 space-y-4 lg:col-span-3'>
          <div className='flex items-center gap-2 font-semibold text-gray-900 dark:text-white'>
            <div className='flex h-6 w-6 items-center justify-center rounded bg-gray-100 text-gray-500 dark:bg-white/10 dark:text-white'>
              <Play size={10} fill='currentColor' />
            </div>
            <h3>Course Performance</h3>
            <Info size={16} className='text-gray-400 dark:text-white' />
          </div>

          <DataTable
            columns={coursePerformanceColumns}
            data={dashboardData?.coursePerformance || []}
            loading={loadingDashboard}
            emptyMessage='No course performance data available'
          />
        </div>
      </div>

      {/* Upload Certificate Modal */}
      <Dialog open={isAddCertModalOpen} onOpenChange={setIsAddCertModalOpen}>
        <DialogContent className='max-w-2xl bg-white p-6 dark:bg-card'>
          <DialogHeader className='space-y-4'>
            <DialogTitle className='text-xl font-semibold'>
              {selectedCertificate?.certificateUrl
                ? 'Update Certificate'
                : 'Upload Certificate'}
            </DialogTitle>
            <DialogDescription className='text-sm text-gray-600 dark:text-white'>
              {selectedCertificate && (
                <div className='mt-2'>
                  <p className='font-medium text-gray-900 dark:text-white'>
                    Course:{' '}
                    {selectedCertificate.courseName || 'Untitled Course'}
                  </p>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className='mt-6 space-y-6'>
            {/* Show existing certificate if available */}
            {selectedCertificate?.certificateUrl && !selectedFile && (
              <div className='space-y-2'>
                <Label className='text-sm font-medium text-gray-900 dark:text-white'>
                  Current Certificate
                </Label>
                <div className='rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-border dark:bg-white/5'>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-3'>
                      <div className='flex h-10 w-10 items-center justify-center rounded bg-green-100'>
                        <FileText size={20} className='text-green-600' />
                      </div>
                      <div>
                        <p className='text-sm font-medium text-gray-900 dark:text-white'>
                          Certificate uploaded
                        </p>
                        <p className='text-xs text-gray-500 dark:text-white'>
                          Click below to view or update
                        </p>
                      </div>
                    </div>
                    <div className='flex gap-2'>
                      <a
                        href={selectedCertificate.certificateUrl}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-border dark:bg-card dark:bg-white/5 dark:text-white'
                      >
                        <ExternalLink size={14} />
                        View
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* File Upload */}
            <div className='space-y-2'>
              <Label className='text-sm font-medium text-gray-900 dark:text-white'>
                {selectedCertificate?.certificateUrl
                  ? 'Upload New Certificate'
                  : 'Certificate File'}
              </Label>
              {uploadError && (
                <div className='rounded-md bg-red-50 p-3'>
                  <p className='text-sm text-red-600'>{uploadError}</p>
                </div>
              )}
              {!selectedFile ? (
                <div
                  onClick={handleFileClick}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={cn(
                    'flex min-h-[180px] cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed transition-colors',
                    isDragging
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 bg-gray-50 dark:border-border dark:bg-white/5'
                  )}
                >
                  <Input
                    ref={fileInputRef}
                    type='file'
                    accept='.pdf,.doc,.docx,.jpg,.jpeg,.png'
                    className='hidden'
                    onChange={handleFileChange}
                  />
                  <Upload size={48} className='text-gray-400 dark:text-white' />
                  <div className='text-center'>
                    <p className='text-sm font-medium text-gray-900 dark:text-white'>
                      Click to upload or drag and drop
                    </p>
                    <p className='mt-1 text-xs text-gray-500 dark:text-white'>
                      Max. File Size: 5MB
                    </p>
                  </div>
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    className='mt-2'
                    onClick={(e) => {
                      e.stopPropagation()
                      handleFileClick()
                    }}
                  >
                    <Search size={16} className='mr-2' />
                    Browse file
                  </Button>
                </div>
              ) : (
                <div className='rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-border dark:bg-white/5'>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-3'>
                      <div className='flex h-10 w-10 items-center justify-center rounded bg-blue-100'>
                        <FileText size={20} className='text-blue-600' />
                      </div>
                      <div>
                        <p className='text-sm font-medium text-gray-900 dark:text-white'>
                          {selectedFile.name}
                        </p>
                        <p className='text-xs text-gray-500 dark:text-white'>
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleRemoveFile}
                      className='rounded-md p-1 text-gray-400 hover:text-gray-600 dark:text-white dark:text-white'
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <DialogFooter className='mt-6'>
            <Button
              variant='outline'
              onClick={handleModalClose}
              className='border-gray-300 dark:border-border'
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              className='bg-gray-700 text-white hover:bg-gray-800'
              disabled={isUploading || !selectedFile}
            >
              {isUploading ? 'Uploading...' : 'Confirm'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Certificate Preview Modal */}
      <Dialog
        open={isPreviewOpen}
        onOpenChange={(open) => {
          setIsPreviewOpen(open)
          if (!open) {
            setPreviewUrl(null)
            setOriginalUrl(null)
          }
        }}
      >
        <DialogContent className='max-w-4xl bg-white p-6 dark:bg-card'>
          <DialogHeader>
            <DialogTitle>Certificate Preview</DialogTitle>
          </DialogHeader>
          <div className='mt-4'>
            {previewUrl && (
              <div className='relative h-[600px] w-full overflow-hidden rounded-lg border border-gray-200 bg-gray-100 dark:border-border dark:bg-white/10'>
                {previewUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                  <img
                    src={previewUrl}
                    alt='Certificate preview'
                    className='h-full w-full object-contain'
                  />
                ) : (
                  <iframe
                    src={previewUrl}
                    className='h-full w-full'
                    title='Certificate preview'
                    sandbox='allow-same-origin allow-scripts allow-popups allow-forms'
                  />
                )}
              </div>
            )}
          </div>
          <DialogFooter className='mt-4'>
            <Button variant='outline' onClick={() => setIsPreviewOpen(false)}>
              Close
            </Button>
            {originalUrl && (
              <Button
                onClick={() => {
                  handleDownloadCertificate(originalUrl)
                }}
                className='flex items-center gap-2 bg-gray-700 text-white hover:bg-gray-800'
              >
                <Download size={16} />
                Download
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default HomeTab
