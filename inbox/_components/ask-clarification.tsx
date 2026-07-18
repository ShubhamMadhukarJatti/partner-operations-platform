'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { OrganizationType } from '@/types'
import { Send } from 'lucide-react'

import { getServerUser } from '@/lib/server'
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

export function AskClarification({
  offer,
  senderOrg,
  proposal,
  receiverOrg,
  type,
  currentOrganization
}: {
  offer: any
  senderOrg: OrganizationType
  proposal: any
  receiverOrg: OrganizationType
  type: string
  currentOrganization: OrganizationType
}) {
  const [text, setText] = useState('')
  const [token, setToken] = useState<string>('')

  // console.log(
  //   currentOrganization?.id,
  //   proposal,
  //   proposal?.receiverOrganizationId,
  //   'this is proposal'
  // )

  useEffect(() => {
    ;(async () => {
      const { token, user } = await getServerUser()
      setToken(token || '')
    })()
  }, [])
  const router = useRouter()
  const sendAskForClarification = async () => {
    await fetch(`/api/ask-for-clarification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        chatRoomId: proposal.id,
        query: text,
        linkerId: offer.id,
        linkerType: type,
        flag: currentOrganization.id === senderOrg.id ? 'SENDER' : 'RECEIVER'
      })
    })
    setText('')
    router.push(`/inbox/${currentOrganization.id}`)
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        {currentOrganization?.id === proposal?.receiverOrganizationId ? (
          <Button
            variant='outline'
            className='mt-2 flex w-52 items-center gap-3 border-[#3662E3] text-[#3662E3]'
          >
            <Send />
            Ask for clarification
          </Button>
        ) : (
          <Button
            variant='outline'
            className={
              'mt-2 flex w-52 items-center gap-3 border-[#3662E3] text-[#3662E3] ' +
              (offer?.activeConversation === false ? 'hidden' : '')
            }
          >
            <Send />
            Reply for clarification
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className='space-y-2 sm:max-w-md lg:max-w-[630px]'>
        <DialogHeader>
          <DialogTitle>Ask for clarification</DialogTitle>
          <DialogDescription>
            <h6 className='font-medium'>{offer.benefit}</h6>
            <p className='indent-2 text-sm text-muted-foreground'>
              {offer.description}
            </p>
            <div className='flex flex-col gap-2.5 border-l-2 border-l-primary bg-[#F0F6FC] p-2'>
              <p className='text-base leading-5 text-[#101828]'>
                API integration
              </p>
              <p className='line-clamp-1 flex text-ellipsis text-sm text-[#475467]'>
                This is the expectation from us. We want to integrate Zomato API
                in our product. I think it would be beneficial to both parties
                and can lead to huge revenue source for both the parties.
              </p>
            </div>
          </DialogDescription>
        </DialogHeader>
        <div className='flex space-x-2'>
          <div className='grid flex-1 gap-2'>
            <Label htmlFor='link' className='text-base'>
              Please specify more about your doubts
            </Label>
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              id='link'
              className='focus-visible:ring-0'
              placeholder='Type your questions here'
            />
          </div>
        </div>
        <DialogFooter className='flex justify-center'>
          <DialogClose className='space-x-2'>
            <Button
              className='w-[285px] border border-[#101828]'
              variant='outline'
            >
              Cancel
            </Button>
            <Button
              className='w-[285px] min-w-[100px]'
              onClick={sendAskForClarification}
            >
              Send
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
