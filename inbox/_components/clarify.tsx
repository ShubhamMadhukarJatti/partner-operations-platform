import React, { useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

const Clarify = ({
  text,
  chat,
  userType,
  token,
  updateMessages
}: {
  text: string
  chat: any
  userType: any
  token: string
  updateMessages: any
}) => {
  const [reply, setReply] = useState('')

  const sendReply = async () => {
    await fetch(`/api/ask-for-clarification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        chatRoomId: chat.chatRoomId,
        query: reply,
        linkerId: chat.linkerId,
        linkerType: chat.linkerType,
        flag: userType
      })
    })
      .then((res) => res.json())
      .then(console.log)
    await updateMessages()
  }
  return (
    <div className='flex flex-col gap-2 rounded-xl p-4'>
      <h6 className='text-base font-semibold'>
        Please clarify this point in expectations
      </h6>
      <p className='text-base '>{text}</p>

      <div className='flex flex-col gap-2.5 border-l-2 border-l-primary bg-[#F0F6FC] p-2'>
        <p className='text-base leading-5'>API integration</p>
        <p className='text-sm text-[#475467]'>
          This is the expectation from us. We want to integrate Zomato API in
          our product. I think it would be beneficial to both parties and can
          lead to huge revenue source for both the parties.
        </p>
      </div>
      <Dialog>
        <DialogTrigger asChild>
          <Button className='mt-4 w-full'>Reply</Button>
        </DialogTrigger>
        <DialogContent className='space-y-2 sm:max-w-md lg:max-w-[630px]'>
          <DialogHeader>
            <DialogTitle>Reply for clarification</DialogTitle>
            <DialogDescription>
              <p className='text-black'>{text}</p>
              <div className='flex flex-col gap-2.5 border-l-2 border-l-primary bg-[#F0F6FC] p-2'>
                <p className='text-base leading-5 text-[#101828]'>
                  API integration
                </p>
                <p className='line-clamp-1 flex text-ellipsis text-sm text-[#475467]'>
                  This is the expectation from us. We want to integrate Zomato
                  API in our product. I think it would be beneficial to both
                  parties and can lead to huge revenue source for both the
                  parties.
                </p>
              </div>
            </DialogDescription>
          </DialogHeader>
          <div className='flex space-x-2'>
            <div className='grid flex-1 gap-2'>
              <Label htmlFor='link' className='text-base'>
                Please specify about your reply
              </Label>
              <Textarea
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                className='h-20'
                id='link'
                placeholder='Type your questions here'
              />
            </div>
          </div>
          <DialogFooter className='flex justify-center'>
            <DialogClose className='space-x-2'>
              <Button
                asChild
                className='w-[285px] border border-[#101828]'
                variant='outline'
              >
                Cancel
              </Button>
              <Button
                className='w-[285px] min-w-[100px]'
                asChild
                onClick={sendReply}
              >
                Send
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Clarify
