'use client'

import { DndContext } from '@dnd-kit/core'
import fontkit from '@pdf-lib/fontkit'
import { ChevronDown, ChevronUp, Loader2 } from 'lucide-react'
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import { Document, Page, pdfjs } from 'react-pdf'

import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'
import 'simplebar-react/dist/simplebar.min.css'

import { useState } from 'react'
import { DocumentDownload } from 'iconsax-react'
import { useForm } from 'react-hook-form'
import { useResizeDetector } from 'react-resize-detector'
import SimpleBar from 'simplebar-react'
import { z } from 'zod'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { showCustomToast } from '@/components/custom-toast'

import { Droppable } from './Droppable'
import SignaturePanel from './SignaturePanel'

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`

export interface DocumentType {
  id: number
  creationTimestamp: string // ISO 8601 formatted date-time string
  lastUpdatedTimestamp: string // ISO 8601 formatted date-time string
  organizationCollaborationId: number
  organizationId: number
  envelopeId: string
  pdfUrl: string // URL pointing to a PDF document
  signed: boolean // Indicates if the document has been signed
  type: string
}

interface PdfRendererProps {
  pdfDetails: DocumentType
  url: any
  organization: any
}

const PdfRenderer = ({ pdfDetails, url, organization }: PdfRendererProps) => {
  const [numPages, setNumPages] = useState<number>()
  const [currPage, setCurrPage] = useState<number>(1)
  const [scale, setScale] = useState<number>(1)
  const [rotation, setRotation] = useState<number>(0)
  const [renderedScale, setRenderedScale] = useState<number | null>(null)
  const [signature, setSignature] = useState<boolean>(false)

  const [pdfUrl, setPdfUrl] = useState<string | null>(url)

  async function modifyPdf() {
    const fontBytes = await fetch('/bettina-signature.regular.ttf').then(
      (res) => res.arrayBuffer()
    )
    const existingPdfBytes = await fetch(url).then((res) => res.arrayBuffer())

    const pdfDoc = await PDFDocument.load(existingPdfBytes)
    pdfDoc.registerFontkit(fontkit)

    const helveticaFont = await pdfDoc.embedFont(fontBytes)

    const pages = pdfDoc.getPages()

    const page = pages[1]
    const { width, height } = page.getSize()

    const textSize = 8

    const textHeight = helveticaFont.heightAtSize(textSize)

    // Ensure text fits within page bounds
    const x = width / 2 + 60
    const y = textHeight + 10
    if (x < 0 || y < 0) {
      console.error('Text position is out of bounds')
      return
    }

    page.drawText(organization.name, {
      x: pdfDetails.type === 'RECEIVER' ? x - 30 : 75,
      y: 842 / 4 - 4,
      size: 10,
      font: helveticaFont,
      color: rgb(0.95, 0.1, 0.1)
    })

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
    if (!font) {
      console.error('Failed to embed font')
      return
    }

    const idText = pdfDetails.envelopeId.substring(0, 30) + '...'

    // -------------add image

    const imageBytes = await fetch('/signer.png').then((res) =>
      res.arrayBuffer()
    )
    const image = await pdfDoc.embedPng(imageBytes)

    page.drawImage(image, {
      x: pdfDetails.type === 'RECEIVER' ? x - 60 : 50,
      y: height / 4 - 30,
      width: 90, // You can adjust the size of the image
      height: 60
    })

    page.drawText(idText, {
      x: pdfDetails.type === 'RECEIVER' ? x - 25 : 85,
      y: height / 4 - 32,
      size: textSize,
      font,
      color: rgb(0, 0, 0)
    })

    const pdfBytes = await pdfDoc.save()
    const pdfBlob = new Blob([pdfBytes as unknown as BlobPart], {
      type: 'application/pdf'
    })
    const pdfUrl = URL.createObjectURL(pdfBlob)
    setPdfUrl(pdfUrl)
  }

  const isLoading = renderedScale !== scale

  const CustomPageValidator = z.object({
    page: z
      .string()
      .refine((num) => Number(num) > 0 && Number(num) <= numPages!)
  })

  type TCustomPageValidator = z.infer<typeof CustomPageValidator>

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm<TCustomPageValidator>({
    defaultValues: {
      page: '1'
    }
  })

  const { width, ref } = useResizeDetector()

  const handlePageSubmit = ({ page }: TCustomPageValidator) => {
    setCurrPage(Number(page))
    setValue('page', String(page))
  }

  function handleDragEnd(event: any) {
    if (event.over && event.over.id === 'droppable') {
      modifyPdf()
      setSignature(true)
      showCustomToast('Success', 'PDF Signed Successfully', 'success', 5000)
    }
  }

  console.log(width)

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className='flex w-full  flex-col overflow-y-hidden'>
        <div className='flex h-20 w-full items-center justify-between border-b border-zinc-200 px-8'>
          <div>
            <span className='text-shark-lg text-text-100'>
              Memorandum_of_Understanding.pdf
            </span>
          </div>
          <div className='flex items-center gap-1.5'>
            <Button
              disabled={currPage <= 1}
              onClick={() => {
                setCurrPage((prev) => (prev - 1 > 1 ? prev - 1 : 1))
                setValue('page', String(currPage - 1))
              }}
              variant='ghost'
              aria-label='previous page'
              className='rounded-lg border border-text-30 p-2'
            >
              <ChevronDown className='h-4 w-4' />
            </Button>

            <Button
              disabled={numPages === undefined || currPage === numPages}
              onClick={() => {
                setCurrPage((prev) =>
                  prev + 1 > numPages! ? numPages! : prev + 1
                )
                setValue('page', String(currPage + 1))
              }}
              variant='ghost'
              aria-label='next page'
              className='rounded-lg border border-text-30 p-2 '
            >
              <ChevronUp className='h-4 w-4' />
            </Button>

            <div className='ml-3 flex items-center gap-1.5'>
              <Input
                {...register('page')}
                className={cn(
                  'h-8 w-12 text-center',
                  errors.page && 'focus-visible:ring-red-500'
                )}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSubmit(handlePageSubmit)()
                  }
                }}
              />
              <p className='space-x-1 text-sm text-zinc-700'>
                <span>/</span>
                <span>{numPages ?? 'x'}</span>
              </p>
            </div>
          </div>

          <Button
            onClick={() => {
              if (pdfUrl) {
                const link = document.createElement('a')
                link.href = pdfUrl
                link.download = 'mou.pdf'
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
              }
            }}
            className='flex items-center gap-2 rounded-lg border border-text-20 bg-transparent text-primary-light-blue hover:bg-background-ghost-white hover:text-text-100'
          >
            <DocumentDownload /> Download PDF
          </Button>
        </div>

        <div className=' flex w-full justify-center '>
          <div className='max-w-[20%] flex-1 shrink-0'></div>

          <Droppable>
            <div className=' max-h-screen w-full max-w-[100%] flex-1  shrink-0   '>
              <SimpleBar
                autoHide={false}
                hidden
                className='hide-scrollbar flex max-h-[calc(100vh-5rem)]  justify-center '
              >
                <div ref={ref} className=''>
                  <Document
                    loading={
                      <div className='flex justify-center'>
                        <Loader2 className='my-24 h-6 w-6 animate-spin' />
                      </div>
                    }
                    onLoadError={() => {
                      showCustomToast(
                        'Error',
                        'Error Loading PDF',
                        'error',
                        5000
                      )
                    }}
                    onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                    file={{ url: pdfUrl! }}
                    className=' h-[100vh] max-h-full'
                  >
                    {Array.from(new Array(numPages), (_, index) => (
                      <Page
                        className={cn(isLoading ? 'hidden' : '')}
                        key={`page_${index + 1}`}
                        width={width}
                        pageNumber={index + 1}
                        scale={scale}
                        rotate={rotation}
                        onRenderSuccess={() => setRenderedScale(scale)}
                        loading={
                          <div className='flex justify-center'>
                            <Loader2 className='my-24 h-6 w-6 animate-spin' />
                          </div>
                        }
                      />
                    ))}
                  </Document>
                </div>
              </SimpleBar>
            </div>
            {/* <div className='flex-1'></div> */}
          </Droppable>

          <SignaturePanel
            modifyPdf={modifyPdf}
            pdfDetails={pdfDetails}
            pdfUrl={pdfUrl}
            signature={signature}
            organization={organization}
          />
        </div>
      </div>
    </DndContext>
  )
}

export default PdfRenderer
