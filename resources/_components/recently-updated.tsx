'use client'

import { useState } from 'react'

import { RESOURCES_RECENTLY_UPDATED } from '@/lib/constants/resources'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { AccordianIcon } from '@/components/icons/icons'

import { VideoDialog } from './video-dialog'

export default function RecentlyUpdated() {
  const [selectedVideo, setSelectedVideo] = useState<{
    title: string
    url: string
  } | null>(null)

  const handleView = (index: number, subIndex?: number) => {
    const item =
      subIndex !== undefined
        ? RESOURCES_RECENTLY_UPDATED[index].subitems?.[subIndex]
        : RESOURCES_RECENTLY_UPDATED[index]
    if (item?.videoUrl) {
      setSelectedVideo({ title: item.title, url: item.videoUrl })
    }
  }

  return (
    <div>
      <h3 className='text-shark-xl font-bold text-text-100'>
        Recently updated
      </h3>

      <div className='mt-5 w-full rounded-lg bg-white shadow-sm'>
        <Accordion type='single' collapsible className='w-full'>
          {RESOURCES_RECENTLY_UPDATED.map((item, index) => (
            <AccordionItem value={`item-${index}`} key={index}>
              <div className='flex items-center justify-between px-4'>
                <div className='flex items-center gap-2 py-4 text-sm'>
                  <AccordianIcon />
                  {item.title}
                </div>

                {item.action === 'Open' ? (
                  <AccordionTrigger>
                    <Button
                      variant='ghost'
                      className='text-blue-600 hover:text-blue-800'
                      onClick={() => handleView(index)}
                    >
                      {item.action}
                    </Button>
                  </AccordionTrigger>
                ) : (
                  <Button
                    variant='ghost'
                    className='text-blue-600 hover:text-blue-800'
                    onClick={() => handleView(index)}
                  >
                    {item.action}
                  </Button>
                )}
              </div>
              {item.subitems && (
                <AccordionContent>
                  <div className='pl-8'>
                    {item.subitems.map((subitem, subIndex) => (
                      <div
                        key={subIndex}
                        className='flex items-center justify-between px-4 py-2'
                      >
                        <div className='flex items-center gap-2'>
                          <AccordianIcon />
                          <span className='text-sm'>{subitem.title}</span>
                        </div>
                        <Button
                          variant='ghost'
                          className='text-blue-600 hover:text-blue-800'
                          onClick={() => handleView(index, subIndex)}
                        >
                          {subitem.action}
                        </Button>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              )}
            </AccordionItem>
          ))}
        </Accordion>
      </div>
      <VideoDialog
        videoInfo={selectedVideo}
        onClose={() => setSelectedVideo(null)}
      />
    </div>
  )
}
