'use client'

import { useEffect, useState } from 'react'
import { ChevronDown } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'

export function QuestionsPopOver() {
  const [question, setQuestions] = useState<any>([])

  useEffect(() => {
    ;(async () => {
      await fetch('/api/configuration')
        .then((res) => res.json())
        .then((data) => {
          // console.table(data?.data)
          data?.data?.filter((item: any) => item.type === 'INBOX_QUES')
          setQuestions(
            data?.data?.filter((item: any) => item.type === 'INBOX_QUES')
          )
        })
    })()
  }, [])

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className=' flex h-14 scale-75 items-center px-8 text-lg font-semibold'>
          Ask a question
          <ChevronDown />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='mb-2 w-96'>
        <div className='grid'>
          <div className=''>
            <ul className=''>
              {question &&
                Array.isArray(question) &&
                question?.length > 0 &&
                question.map((ques: any) => (
                  <li
                    key={ques?.id}
                    className='cursor-pointer p-2 font-medium leading-none hover:bg-gray-400/20'
                  >
                    {ques?.value}
                  </li>
                ))}
              {/* <li className='font-medium leading-none'>
                Tell me about your startup
              </li>
              <li className='font-medium leading-none'>What your goals</li>
              <li className='font-medium leading-none'>Another question</li>
              <li className='font-medium leading-none'>Another question</li> */}
            </ul>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
