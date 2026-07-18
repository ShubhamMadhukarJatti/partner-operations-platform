'use client'

import { useEffect, useState } from 'react'

import { getServerUser } from '@/lib/server'
import { Textarea } from '@/components/ui/textarea'

export function MessageInput({
  userType,
  chatRoomId,
  updateMessages
}: {
  userType: string
  chatRoomId: string
  updateMessages: any
}) {
  const [query, setQuery] = useState('')
  const [token, setToken] = useState('')

  useEffect(() => {
    ;(async () => {
      const { token } = await getServerUser()
      setToken(token || '')
    })()
  }, [])

  const sendReply = async () => {
    console.log('reply', {
      chatRoomId,
      query: query,
      linkerId: '-1',
      linkerType: 'EMPTY',
      flag: userType
    })

    // await updateChatMessages({
    //   chatRoomId,
    //   query: query,
    //   linkerId: '-1',
    //   linkerType: 'EMPTY',
    //   flag: userType
    // })
    // await updateMessages()
    setQuery('')
  }

  return (
    <div className='grid gap-2 bg-transparent bg-none px-12 py-4'>
      <Textarea
        className='relative resize-none rounded-xl border  border-[#D4D4D4] shadow-md'
        placeholder='Type your message here.'
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      ></Textarea>
      <button
        className='absolute m-2 place-self-end rounded-3xl border bg-[#E7E9EA] px-4 py-2 text-sm'
        onClick={sendReply}
      >
        Send
      </button>
    </div>
  )
}
