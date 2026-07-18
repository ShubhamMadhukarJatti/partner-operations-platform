import React, { useRef, useState } from 'react'
import { useOfflinePartnerDetails } from '@/http-hooks/offline-partners'

import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import HistoryList from './HistoryList'
import ParticipantsList from './Participants'
import PreviewTab from './PreviewTab'
import Remarks from './Remarks'

const navTabs = [
  {
    name: 'Preview',
    value: 'preview'
  },
  {
    name: 'Participants',
    value: 'participants'
  },
  {
    name: 'History',
    value: 'history'
  },
  {
    name: 'Remarks',
    value: 'remarks'
  }
]

const ShowPreviewTabs: React.FC<{
  params?: { id: number }
  extractionData?: any
  file?: File | null
}> = ({ params, extractionData, file }) => {
  const [tab, setTab] = useState('preview')

  const [step, setStep] = useState(1)

  const { isLoading } = useOfflinePartnerDetails(params?.id || 123)

  console.log('ShowPreviewTabs received extractionData:', extractionData)

  const onTabChange = (value: string) => {
    setTab(value)
  }

  const tabContent = () => {
    switch (tab) {
      case 'preview':
        return (
          <div className='flex flex-col gap-4'>
            <PreviewTab extractionData={extractionData} file={file} />
          </div>
        )
      case 'participants':
        return (
          <div>
            <ParticipantsList extractionData={extractionData} />
          </div>
        )
      case 'history':
        return (
          <div>
            <HistoryList />
          </div>
        )
      case 'remarks':
        return (
          <div>
            <Remarks />
          </div>
        )
      default:
        return null
    }
  }

  return (
    <ScrollArea>
      <div className='p-4'>
        <Tabs
          defaultValue={navTabs[0].value}
          onValueChange={onTabChange}
          value={tab}
          className='w-full'
        >
          <TabsList className='flex w-full items-start justify-start rounded-none border-b bg-white '>
            {navTabs.map((currentTab) => (
              <TabsTrigger
                key={currentTab.value}
                value={currentTab.value}
                className=' relative rounded-lg px-4 text-sm font-semibold text-text-100 hover:bg-text-20 data-[state=active]:text-primary-blue data-[state=active]:shadow-none'
              >
                {currentTab.name}
                {tab === currentTab.value && (
                  <hr className='absolute -bottom-1 left-0 h-[4px] w-full rounded-full bg-primary-blue'></hr>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
          <div className='py-4'>
            {navTabs.map((tab) =>
              isLoading ? (
                <div key={tab.value} className='flex w-full flex-col gap-4'>
                  <Skeleton className='h-[100px] w-full' />
                  <Skeleton className='h-[100px] w-full' />
                  <Skeleton className='h-[100px] w-full' />
                </div>
              ) : (
                <TabsContent key={tab.value} value={tab.value}>
                  {tabContent()}
                </TabsContent>
              )
            )}
          </div>
        </Tabs>
      </div>
      {/* {step === 1 && (
        <>
          <div className='flex flex-col px-4 pb-2 pt-6'>
            <p className='text-lg font-bold text-[#2A3241]'>Upload Contract</p>
            <p className='text-base text-[#2A3241]'>
              Drag and drop document to upload your portfolio on previous
              company.
            </p>
          </div>
          <div className='m-4 rounded-lg border-2 border-dashed  border-[#C4CDD5] bg-[#FAFBFB] py-10'>
            <motion.div
              whileHover='animate'
              className='group/file relative block w-full cursor-pointer overflow-hidden rounded-lg p-0'
              onClick={handleClick}
            >
              <input
                ref={fileInputRef}
                type='file'
                accept='.pdf,.doc,.docx'
                className='hidden'
                onChange={handleFileChange}
              />

              <div className='flex w-full flex-col items-center justify-center gap-0'>
                <Image src='/upload.svg' alt='CSV' width={87} height={73} />
                <p className='relative z-20 mt-2  text-sm font-bold leading-4'>
                  Select a Pdf, Docx file to upload
                </p>
                <p className='relative z-20 mt-0.5 text-center text-xs font-normal leading-[14.52px] text-text-80'>
                  or drag & drop it here
                </p>
              </div>
            </motion.div>
          </div>

          {file && (
            <div className='relative mx-auto mt-6 w-full max-w-xl'>
              <motion.div
                layoutId='file-upload'
                className='rounded-lg border border-text-20 p-4'
              >
                <div className='flex w-full items-center justify-between gap-4'>
                  <div className='flex items-center gap-2'>
                    <Image
                      src='/file-upload.svg'
                      alt='CSV'
                      width={40}
                      height={40}
                    />

                    <div>
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        layout
                        className='max-w-xs truncate text-base font-bold leading-5  text-text-100 '
                      >
                        {file.name}
                      </motion.p>
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        layout
                        className='mt-1 w-fit text-sm font-normal leading-4 text-text-80'
                      >
                        {(file.size / (1024 * 1024)).toFixed(2)} MB
                      </motion.p>
                    </div>
                  </div>
                  <Button
                    variant='ghost'
                    size='icon'
                    className='hover:bg-transparent'
                    onClick={() => {
                      setFile(null)
                    }}
                  >
                    <Image
                      src='/close-circle-red.svg'
                      alt='CSV'
                      width={32}
                      height={32}
                    />
                  </Button>
                </div>

                <div className='mt-2 flex items-center justify-between gap-2'>
                  <div className='h-2 w-full rounded-full bg-shark-blue-50'>
                    <div
                      className='h-full rounded-full bg-primary-light-blue transition-all duration-300 ease-in-out'
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className=' text-right text-xs  text-text-80'>
                    {uploadProgress}%
                  </p>
                </div>
              </motion.div>
            </div>
          )}
        </>
      )} */}
      {/* {step === 2 && ( */}

      {/* )} */}
    </ScrollArea>
  )
}

export default ShowPreviewTabs
