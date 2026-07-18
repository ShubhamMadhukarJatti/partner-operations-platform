'use client'

import React, { useMemo, useState } from 'react'
import {
  Clock,
  FileText,
  MoreVertical,
  Paperclip,
  RotateCw,
  Trash2
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type Attachment = {
  id: string
  name: string
  type?: 'pdf' | 'png' | 'jpg' | 'doc'
}

type Draft = {
  id: string
  subject: string
  excerpt: string
  status: 'Draft' | 'Sent' | 'Received'
  attachments?: Attachment[]
  time: string
  dateLabel?: string
}

const SAMPLE_DATA: Draft[] = [
  {
    id: '1',
    subject: 'Global Compliance and Ethical Issues Managing Technology',
    excerpt:
      'Beautiful Products, online since 2005, is the best place to buy ...',
    status: 'Draft',
    attachments: [
      { id: 'a1', name: 'Art_Requirements.pdf', type: 'pdf' },
      { id: 'a2', name: 'Logo.png', type: 'png' }
    ],
    time: '2025-11-08T11:30:00'
  },
  {
    id: '2',
    subject: 'Business Law',
    excerpt:
      'Learn how to write effective letters to your customers and clients.',
    status: 'Draft',
    attachments: [
      { id: 'a3', name: 'Art_Requirements.pdf', type: 'pdf' },
      { id: 'a4', name: 'Logo.png', type: 'png' }
    ],
    time: '2025-11-08T11:30:00'
  },
  {
    id: '3',
    subject: 'Business Economics',
    excerpt:
      'Letters to customers are an essential element of customer service.',
    status: 'Draft',
    attachments: [],
    time: '2025-11-08T11:30:00'
  },
  {
    id: '4',
    subject: 'Business Ethics',
    excerpt: 'Refund is the most popular payment gateway...',
    status: 'Draft',
    attachments: [
      { id: 'a5', name: 'Art_Requirements.pdf', type: 'pdf' },
      { id: 'a6', name: 'Logo.png', type: 'png' }
    ],
    time: '2025-11-08T11:30:00'
  },
  {
    id: '5',
    subject: 'Organizational Processes',
    excerpt:
      'On this site you can discover beautiful products with your favorite brands...',
    status: 'Draft',
    attachments: [],
    time: '2025-11-08T11:30:00'
  }
]

function formatTime(iso: string) {
  const d = new Date(iso)
  const time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  const date = d.toLocaleDateString()
  return { time, date }
}

const DraftsPage = () => {
  const [activeTab, setActiveTab] = useState<'Sent' | 'Received' | 'Draft'>(
    'Draft'
  )
  const [items, setItems] = useState<Draft[]>(SAMPLE_DATA)
  const [selected, setSelected] = useState<Record<string, boolean>>({})

  const counts = useMemo(() => {
    return {
      Sent: items.filter((i) => i.status === 'Sent').length,
      Received: items.filter((i) => i.status === 'Received').length,
      Draft: items.filter((i) => i.status === 'Draft').length
    }
  }, [items])

  const visible = items.filter((i) => i.status === activeTab)

  const allVisibleSelected =
    visible.length > 0 && visible.every((v) => selected[v.id])

  const toggleSelectAll = () => {
    if (allVisibleSelected) {
      // unselect visible
      const copy = { ...selected }
      visible.forEach((v) => delete copy[v.id])
      setSelected(copy)
    } else {
      const copy = { ...selected }
      visible.forEach((v) => (copy[v.id] = true))
      setSelected(copy)
    }
  }

  const toggleSelectOne = (id: string) => {
    setSelected((s) => ({ ...s, [id]: !s[id] }))
  }

  const selectedCount = Object.values(selected).filter(Boolean).length

  const deleteSelected = () => {
    if (!confirm(`Delete ${selectedCount} selected draft(s)?`)) return
    setItems((prev) => prev.filter((p) => !selected[p.id]))
    setSelected({})
  }

  const refresh = () => {
    // placeholder refresh — in real app you'd re-fetch
    setItems((prev) => [...prev])
  }

  return (
    <div className='min-h-screen p-6'>
      <div className='rounded-lg border bg-white'>
        {/* Tabs */}
        <div className='flex items-center justify-start gap-4 border-b px-4 py-3'>
          {(['Sent', 'Received', 'Draft'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`relative rounded-full px-3 py-1 text-sm  ${
                activeTab === t
                  ? 'bg-white font-bold text-[#3E50F7] '
                  : 'font-medium text-gray-600'
              }`}
            >
              <span>{t}</span>
              <span
                className={`ml-2 inline-block py-0.5 text-xs ${
                  activeTab === t
                    ? 'bg-white font-bold text-[#3E50F7]'
                    : 'font-medium text-gray-600'
                }`}
              >
                ({counts[t]})
              </span>
              {activeTab === t && (
                <span className='absolute -bottom-[12px] left-4 right-4 h-0.5 rounded bg-[#3E50F7]' />
              )}
            </button>
          ))}
        </div>

        {/* Actions toolbar */}
        <div className='flex items-center justify-between border-b px-4 py-3'>
          <div className='flex items-center gap-3'>
            <label className='flex items-center gap-2'>
              <Input
                type='checkbox'
                checked={allVisibleSelected}
                onChange={toggleSelectAll}
                className='h-4 w-4 rounded border-gray-300'
              />
            </label>

            <button
              onClick={refresh}
              className='flex items-center gap-2 rounded-full px-2 py-1 text-sm text-gray-600 hover:bg-gray-50'
              title='Refresh'
            >
              <RotateCw className='h-4 w-4' />
            </button>

            <button
              onClick={() => alert('More actions...')}
              className='flex items-center gap-2 rounded-full px-2 py-1 text-sm text-gray-600 hover:bg-gray-50'
              title='More'
            >
              <MoreVertical className='h-4 w-4' />
            </button>

            <div className='ml-2 text-sm text-gray-500'>
              {selectedCount} selected
            </div>
          </div>

          <div className='flex items-center gap-3'>
            <Button
              variant={
                selectedCount === 0 ? 'destructiveLight' : 'destructiveSolid'
              }
              size='sm'
              onClick={deleteSelected}
              disabled={selectedCount === 0}
              className='flex items-center gap-2 disabled:cursor-not-allowed'
            >
              <Trash2 className='h-4 w-4' />
              Delete
            </Button>
          </div>
        </div>

        {/* List header (optional columns row) */}
        {/* <div className='hidden border-b border-t px-4 py-2 text-sm text-gray-500 md:flex'>
          <div className='w-10' />
          <div className='w-1/4'>Status</div>
          <div className='flex-1'>Subject</div>
          <div className='w-40 text-right'>Time</div>
        </div> */}

        {/* List */}
        <div className='px-2 py-1'>
          {visible.length === 0 ? (
            <div className='p-6 text-center text-gray-500'>No items</div>
          ) : (
            visible.map((row) => {
              const { time, date } = formatTime(row.time)
              return (
                <div
                  key={row.id}
                  className='flex items-center gap-3 border-b px-3 py-3 hover:bg-gray-50'
                >
                  {/* checkbox */}
                  <div className='w-10'>
                    <Input
                      type='checkbox'
                      checked={!!selected[row.id]}
                      onChange={() => toggleSelectOne(row.id)}
                      className='h-4 w-4 rounded border-gray-300'
                    />
                  </div>

                  {/* status label */}
                  <div className='w-32 text-sm font-medium text-[#DF4245]'>
                    {row.status}
                  </div>

                  {/* subject / excerpt / attachments */}
                  <div className='min-w-0 flex-1'>
                    <div className='flex items-start justify-between'>
                      <div className='min-w-0'>
                        <div className='truncate text-sm font-semibold text-gray-800'>
                          {row.subject}
                        </div>
                        <div className='truncate text-sm text-gray-500'>
                          {row.excerpt}
                        </div>

                        {row.attachments && row.attachments.length > 0 && (
                          <div className='mt-2 flex flex-wrap gap-2'>
                            {row.attachments.map((a) => (
                              <span
                                key={a.id}
                                className='inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-2 py-1 text-xs text-gray-700'
                              >
                                <Paperclip className='h-3 w-3 text-gray-500' />
                                <span className='max-w-[200px] truncate'>
                                  {a.name}
                                </span>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* right-side small actions (on each row) */}
                      <div className='ml-4 hidden md:flex md:flex-col md:items-end md:justify-between'>
                        <div className='text-xs text-gray-400'>{time}</div>
                        <div className='text-xs text-gray-400'>{date}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
export default DraftsPage
