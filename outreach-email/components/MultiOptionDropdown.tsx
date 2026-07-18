'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Check, ChevronDown, X } from 'lucide-react'

export type Option = {
  id: string | number
  label: string
}

type Props = {
  options: Option[]
  value: Array<string | number>
  onChange: (newValue: Array<string | number>) => void
  placeholder?: string
  maxChipsToShow?: number
  className?: string
}

export default function MultiSelectDropdown({
  options,
  value,
  onChange,
  placeholder = 'Select...',
  maxChipsToShow = 3,
  className = ''
}: Props) {
  const [open, setOpen] = useState(false)
  const [filter, setFilter] = useState('')
  const ref = useRef<HTMLDivElement | null>(null)

  // close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const toggleOption = (id: string | number) => {
    if (value.includes(id)) onChange(value.filter((v) => v !== id))
    else onChange([...value, id])
  }

  const clearOne = (id: string | number) => {
    onChange(value.filter((v) => v !== id))
  }

  const clearAll = () => onChange([])

  const selectAllVisible = (visibleIds: Array<string | number>) => {
    // add all visible that are not yet selected
    const toAdd = visibleIds.filter((id) => !value.includes(id))
    onChange([...value, ...toAdd])
  }

  const visibleOptions = options.filter((o) =>
    o.label.toLowerCase().includes(filter.trim().toLowerCase())
  )

  const visibleIds = visibleOptions.map((o) => o.id)

  return (
    <div ref={ref} className={`relative inline-block text-left ${className}`}>
      {/* Trigger / chips */}
      <div
        className='flex min-w-[260px] max-w-[640px] flex-wrap items-center gap-2 rounded-full border bg-white p-3'
        onClick={() => setOpen((s) => !s)}
        role='button'
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') setOpen((s) => !s)
        }}
      >
        {/* chips */}
        {value.length === 0 ? (
          <div className='text-bse pl-2 font-medium'>{placeholder}</div>
        ) : (
          <>
            {value.length <= maxChipsToShow ? (
              value.map((v) => {
                const opt = options.find((o) => o.id === v)
                if (!opt) return null
                return (
                  <span
                    key={v}
                    className='flex items-center gap-2 rounded-full bg-[#E8F0FF] px-2 py-1 text-sm font-medium text-[#1F4BFF]'
                  >
                    <span className='max-w-[160px] truncate'>{opt.label}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        clearOne(v)
                      }}
                      aria-label={`Remove ${opt.label}`}
                    >
                      <X className='h-3 w-3 text-[#1F4BFF]' />
                    </button>
                  </span>
                )
              })
            ) : (
              <span className='text-sm font-medium text-gray-700'>{`${value.length} selected`}</span>
            )}

            {/* clear all small x */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                clearAll()
              }}
              className='ml-1 rounded-full p-1 hover:bg-gray-100'
              aria-label='Clear all'
            >
              <X className='h-4 w-4 text-gray-500' />
            </button>
          </>
        )}

        {/* spacer and dropdown icon */}
        <div className='ml-auto flex items-center gap-2'>
          <div className='px-2 py-1 text-xs text-gray-500'>
            {/* optional count */}
          </div>
          <ChevronDown className='h-4 w-4 text-gray-500' />
        </div>
      </div>

      {/* Dropdown panel */}
      {open && (
        <div className='absolute z-50 mt-2 max-h-80 w-[320px] min-w-[280px] overflow-hidden rounded-lg border bg-white'>
          <div className='p-3'>
            {/* header: search + select all */}
            <div className='flex items-center gap-2'>
              <input
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                placeholder='Search'
                className='w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:outline-none'
              />
              <button
                onClick={() =>
                  // toggle: if not all visible are selected, select visible; else remove them
                  visibleIds.every((id) => value.includes(id))
                    ? onChange(value.filter((v) => !visibleIds.includes(v)))
                    : selectAllVisible(visibleIds)
                }
                className='whitespace-nowrap rounded-md bg-[#F3F4FF] px-3 py-2 text-sm font-medium text-[#1F4BFF]'
              >
                {visibleIds.every((id) => value.includes(id))
                  ? 'Unselect'
                  : 'Select all'}
              </button>
            </div>

            {/* list */}
            <div className='mt-3 max-h-56 overflow-auto'>
              {visibleOptions.length === 0 ? (
                <div className='p-3 text-sm text-gray-400'>No results</div>
              ) : (
                visibleOptions.map((opt) => {
                  const checked = value.includes(opt.id)
                  return (
                    <label
                      key={opt.id}
                      className={`flex cursor-pointer items-center justify-between gap-3 rounded-md px-2 py-2 hover:bg-gray-50 ${
                        checked ? 'bg-[#EEF6FF]' : ''
                      }`}
                    >
                      <div className='flex items-center gap-3'>
                        <input
                          type='checkbox'
                          checked={checked}
                          onChange={() => toggleOption(opt.id)}
                          onClick={(e) => e.stopPropagation()}
                          className='h-4 w-4 rounded border-gray-300 text-[#1F4BFF]'
                        />
                        <span className='text-sm text-gray-700'>
                          {opt.label}
                        </span>
                      </div>
                      {checked && <Check className='h-4 w-4 text-[#1F4BFF]' />}
                    </label>
                  )
                })
              )}
            </div>

            {/* footer: show selected count */}
            <div className='mt-3 flex items-center justify-between border-t pt-3'>
              <div className='text-xs text-gray-500'>{`${value.length} selected`}</div>
              <div className='flex items-center gap-2'>
                <button
                  onClick={() => {
                    setFilter('')
                    onChange([])
                  }}
                  className='text-xs text-gray-500 hover:underline'
                >
                  Clear
                </button>
                <button
                  onClick={() => setOpen(false)}
                  className='rounded-md bg-[#1F4BFF] px-3 py-1 text-xs font-medium text-white'
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
