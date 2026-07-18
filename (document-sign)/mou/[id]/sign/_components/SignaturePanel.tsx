'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { PenTool } from 'lucide-react'

import { signMouPdf } from '@/lib/actions/mou'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { showCustomToast } from '@/components/custom-toast'

import { Draggable } from './Draggable'
import { DocumentType } from './PdfViewer'
import UploadFile from './UploadFIle'

type Props = {
  modifyPdf: () => void
  pdfDetails: DocumentType
  pdfUrl: any
  signature: boolean
  organization: any
}

const SignaturePanel = ({
  modifyPdf,
  pdfDetails,
  pdfUrl,
  signature,
  organization
}: Props) => {
  const [loading, setLoading] = useState(false)

  const router = useRouter()

  const handlePdfSignatureUpload = async () => {
    setLoading(true)
    try {
      const pdfBlob = await fetch(pdfUrl).then((res) => res.blob())
      const pdfFile = new File([pdfBlob], 'mou.pdf', {
        type: 'application/pdf'
      })

      const formData = new FormData()
      formData.append('mou', pdfFile)

      const response = await signMouPdf({
        mou: formData,
        organizationCollaborationId: pdfDetails.organizationCollaborationId,
        organizationId: pdfDetails.organizationId,
        envelopeId: pdfDetails.envelopeId
      })

      showCustomToast('Success', response.message, 'success', 5000)

      router.push('/dashboard')
      setLoading(false)
    } catch (error) {
      console.error('Error signing PDF:', error)
      setLoading(false)
    }
  }

  return (
    <aside className='flex max-h-screen w-full max-w-lg flex-col border-l border-text-20 bg-white'>
      <div className='  p-4'>
        <Tabs defaultValue='signature' className=''>
          <TabsList className=' mb-8 grid  h-full w-full grid-cols-1 bg-transparent p-0'>
            <TabsTrigger
              value='signature'
              className='flex items-center justify-start gap-2 rounded-l-lg rounded-r-none border  border-text-20    p-4 text-shark-base font-medium data-[state=active]:border-primary-light-blue data-[state=active]:bg-background-ghost-white data-[state=active]:text-primary-light-blue'
            >
              <PenTool className='size-5' /> Signature
            </TabsTrigger>
            {/* <TabsTrigger
              value='stamp'
              className='flex items-center justify-start gap-2 rounded-l-none rounded-r-lg border  border-text-20    p-4 text-shark-base font-medium data-[state=active]:border-primary-light-blue data-[state=active]:bg-background-ghost-white data-[state=active]:text-primary-light-blue'
            >
              <Stamp className='size-5' /> Stamp
            </TabsTrigger> */}
          </TabsList>
          <TabsContent value='signature'>
            <Draggable>
              <div className='border-20 flex w-64  items-center rounded-lg border-2 p-4'>
                <div className='relative  w-full'>
                  <Image
                    src={'/signer.png'}
                    alt='Side curve'
                    width={120}
                    height={80}
                  />

                  <p className='absolute -bottom-2 left-0 w-[12rem]  text-sm text-gray-700'>
                    {pdfDetails.envelopeId.substring(0, 10) + '...'}
                  </p>
                  <p className='absolute left-[25%] top-[60%] -translate-y-1/2 font-bold  text-gray-900'>
                    {organization.name}
                  </p>
                </div>
              </div>
            </Draggable>
            {/* {signature === null ? (
              <>
                <DrawSignature />
                <div className='my-4 flex  items-center gap-2 '>
                  <hr className='w-full max-w-[217px] bg-text-20' />{' '}
                  <span className='text-shark-sm font-bold text-text-60'>
                    OR
                  </span>{' '}
                  <hr className='w-full max-w-[217px] bg-text-20' />{' '}
                </div>
                <UploadFile
                  heading={'Upload Signature'}
                  subheading='Add your signature here'
                />{' '}
              </>
            ) : (
              <div className='w-full  '>
                <div className='mb-2 flex items-center justify-between'>
                  <h4 className='text-shark-base font-bold text-text-100'>
                    Signature
                  </h4>
                </div>
                <div className='mt-4 rounded-lg  border border-text-20 p-4'>
                  <div className='relative flex h-32 items-center justify-center rounded-md border-2 border-dashed border-text-20'>
                    <span className='text-sm text-gray-400'>Sign here</span>
                  </div>
                  <div className='mt-4 flex items-center'>
                    <Button className='hover:bg-transaprent flex-1 rounded-lg border  bg-transparent  text-shark-base font-bold text-primary-light-blue hover:text-primary-light-blue'>
                      Add to Document
                    </Button>
                    <Button className='hover:bg-transaprent ml-2  rounded-lg border  bg-transparent  text-shark-base font-bold text-primary-light-blue hover:text-primary-light-blue'>
                      <EllipsisVertical className='h-5 w-5' />
                    </Button>
                  </div>
                </div>
              </div>
            )} */}
          </TabsContent>
          <TabsContent value='stamp'>
            <UploadFile
              heading={'Upload Stamp'}
              subheading='Add your company stamp here'
            />{' '}
          </TabsContent>
        </Tabs>
      </div>

      <div className='mt-auto w-full border-t border-text-20 p-4'>
        {signature ? (
          <Button
            className='w-full rounded-lg text-shark-base font-bold text-white  disabled:bg-text-20 disabled:text-text-60  '
            onClick={handlePdfSignatureUpload}
            loading={loading}
            loadingText='Signing...'
          >
            Send
          </Button>
        ) : (
          <Button
            className='w-full rounded-lg text-shark-base font-bold text-white  disabled:bg-text-20 disabled:text-text-60  '
            disabled
          >
            {pdfDetails.type === 'RECEIVER' ? 'Sign and Send' : 'Sign'}
          </Button>
        )}
      </div>
    </aside>
  )
}

export default SignaturePanel
