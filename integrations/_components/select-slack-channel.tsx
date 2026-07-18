'use client'

import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { MessageSquareText, UserRound } from 'lucide-react'

import { saveSlackChannel } from '@/lib/actions/slack'
import { Button } from '@/components/ui/button'
import { Dialog, DialogClose, DialogContent } from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/outlined-select'
import { showCustomToast } from '@/components/custom-toast'

type Props = {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}

export function SelectSlackChannel({ open, setOpen }: Props) {
  const [channels, setChannels] = useState([])
  const [selectedChannel, setSelectedChannel] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const response = await fetch('/api/slack/channel')

        if (!response.ok) {
          throw new Error('Failed to fetch channels')
        }
        const data = await response.json()
        setChannels(data.channels)
      } catch (error) {
        console.error('Error fetching channels:', error)
      }
    }

    fetchChannels()
  }, [])

  const handleSaveSlackChannel = async () => {
    if (selectedChannel === '') {
      showCustomToast('Error', 'Please select a Slack channel', 'error', 5000)
      setLoading(false)
      return
    }
    try {
      setLoading(true)
      console.log(selectedChannel)
      const response = await saveSlackChannel({ channelId: selectedChannel })
      console.log(response)
      if (response) {
        showCustomToast(
          'Success',
          'Slack channel saved successfully',
          'success',
          5000
        )
      } else {
        showCustomToast('Error', 'Failed to save Slack channel', 'error', 5000)
      }
    } catch (error) {
      console.error('Error saving slack channel:', error)
    } finally {
      setLoading(false)
      setOpen(false)
      router.replace('/integrations')
    }
  }

  return (
    <Dialog open={open}>
      <DialogContent
        className='w-full max-w-[482px] bg-white px-5 py-4'
        hideCloseBtn
      >
        <div className='space-y-6'>
          <div className='flex items-center justify-between'>
            <span className='text-shark-xl font-bold text-text-100'>
              Integration
            </span>

            <DialogClose asChild className=''>
              <Button
                variant='primary'
                className='p-0 hover:bg-transparent'
                onClick={() => {
                  setOpen(false)
                }}
              >
                <Image
                  src={'/close-circle.svg'}
                  alt='method-logo'
                  width={32}
                  height={32}
                />
              </Button>
            </DialogClose>
          </div>

          <div className='flex items-center justify-center gap-4'>
            <Image
              src={'/slack-s.svg'}
              width={56}
              height={56}
              alt='sharkdom-logo'
            />
            <Image
              src={'/slack-x.svg'}
              width={31}
              height={26}
              alt='sharkdom-logo'
            />

            <Image
              src={'/slack-c.svg'}
              width={50}
              height={50}
              alt='slack-logo'
            />
          </div>

          <div>
            <h2 className='mb-2 text-center text-shark-xl font-bold text-text-100'>
              ShardomApp is requesting permission to access
            </h2>

            <p className='text-center text-shark-sm text-text-60'>
              A configuration message will be automatically sent to the selected
              channel after setup is complete
            </p>
          </div>

          <Select
            onValueChange={(value) => {
              setSelectedChannel(value)
            }}
          >
            <SelectTrigger className='mt-4 w-full rounded-lg' label='Configure'>
              <SelectValue placeholder='Select the workspace' />
            </SelectTrigger>

            <SelectContent>
              {channels &&
                channels.map((item: any) => (
                  <SelectItem value={item.id} key={item.id}>
                    {item.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>

          <div className='mx-auto max-w-xl p-4'>
            <h6 className='mb-6 text-shark-lg font-bold text-text-100'>
              What will SharkdomApp be able to view?
            </h6>

            <ul className='space-y-4'>
              <li className='border-b border-text-20 pb-4'>
                <button className='flex w-full items-center justify-between text-left text-shark-sm text-text-60'>
                  <div className='flex items-center gap-3'>
                    <UserRound size={16} />
                    <span>Content and info about you</span>
                  </div>
                </button>
              </li>

              <li className='border-b border-text-20 pb-4'>
                <button className='flex w-full items-center justify-between text-left text-shark-sm text-text-60'>
                  <div className='flex items-center gap-3'>
                    <MessageSquareText size={16} />
                    <span>Content and info about channels & converations</span>
                  </div>
                </button>
              </li>
              <li className='border-b border-text-20 pb-4'>
                <button className='flex w-full items-center justify-between text-left text-shark-sm text-text-60'>
                  <div className='flex items-center gap-3'>
                    <UserRound size={16} />
                    <span>Perform actions as you</span>
                  </div>
                </button>
              </li>

              <li className='border-b border-text-20 pb-4'>
                <button className='flex w-full items-center justify-between text-left text-shark-sm text-text-60'>
                  <div className='flex items-center gap-3'>
                    <MessageSquareText size={16} />
                    <span>Perform actions in channels & conversations</span>
                  </div>
                </button>
              </li>
            </ul>
          </div>

          {/* <div className='mx-auto max-w-xl p-4'>
            <h6 className='mb-6 text-shark-lg font-bold text-text-100'>
              What will SharkdomApp be able to view?
            </h6>

            <ul className='space-y-4'>
              
            </ul>
          </div> */}

          <div className='flex items-center justify-center gap-4 '>
            <Button
              variant='primary'
              onClick={() => {
                setOpen(false)
              }}
              className='h-[48px] w-full max-w-[213px] rounded-lg text-sm font-bold'
            >
              Cancel
            </Button>
            <Button
              variant='primary'
              onClick={handleSaveSlackChannel}
              loading={loading}
              className='h-[48px] w-full max-w-[213px] rounded-lg text-sm font-bold'
            >
              Allow
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
