'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import { getAzurePdf } from '@/lib/azurePdf'
import { getMouPdf } from '@/lib/db/mou'
import { getCurrentOrganization } from '@/lib/db/organization'
import { showCustomToast } from '@/components/custom-toast'
import { Logo } from '@/components/icons/logo'

import PdfRenderer from './_components/PdfViewer'

type Props = {
  params: { id: number }
}

const DocumentSign = ({ params }: Props) => {
  const [pdfDetails, setPdfDetails] = useState<any>(null)
  const [pdfUrl, setPdfUrl] = useState<any | null>(null)
  const [organization, setOrganization] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  const router = useRouter()

  useEffect(() => {
    const fetchPdfData = async () => {
      setIsLoading(true)
      try {
        // Fetch current organization and PDF details
        const currentOrg = await getCurrentOrganization()
        setOrganization(currentOrg) // Save the organization
        const details = await getMouPdf(params.id, currentOrg.id)
        setPdfDetails(details)

        console.log(details, `herer are the detaisl`)

        if (details === null) {
          router.push('/dashboard')
        }

        if (details.signed) {
          showCustomToast('Already Signed', 'MOU already signed', 'info', 5000)
          router.push('/dashboard')
        }

        const pdfData = await getAzurePdf(details.pdfUrl)

        const pdfUrl = URL.createObjectURL(pdfData) // Create an object URL from the blob
        setPdfUrl(pdfUrl)
      } catch (error) {
        console.error('Failed to fetch PDF:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPdfData()

    // Cleanup the object URL on unmount
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl)
      }
    }
  }, [params.id])

  return (
    <>
      <div>
        {isLoading ? (
          <div className='flex h-screen items-center justify-center'>
            <Logo className='h-10 w-auto animate-pulse' />
          </div>
        ) : pdfUrl && pdfDetails && organization ? (
          <PdfRenderer
            pdfDetails={pdfDetails}
            url={pdfUrl}
            organization={organization}
          />
        ) : (
          <p>Failed to load PDF.</p>
        )}
      </div>
    </>
  )
}

export default DocumentSign
