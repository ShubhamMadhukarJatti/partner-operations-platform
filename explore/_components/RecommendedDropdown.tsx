'use client'

import React, { useEffect, useRef, useState } from 'react'

export type DropdownOption = {
  id: string | number
  label: string
}

type Props = {
  options?: DropdownOption[] // <- optional now
  defaultId?: string | number | null
  onChange?: (option: DropdownOption) => void
  buttonClassName?: string
  menuClassName?: string
  placeholder?: string
  disabled?: boolean
}

/** Small custom filter icon (use your SVG if you want) */
const FilterIcon = ({
  className = 'text-gray-500'
}: {
  className?: string
}) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='18'
    height='12'
    viewBox='0 0 18 12'
    fill='none'
    className={className}
  >
    <path
      d='M3.88259 6.00575L13.8826 6.0053M1.38281 1.00586L16.3828 1.00519M6.38236 11.0056L11.3824 11.0054'
      stroke='#717680'
      strokeWidth='1.66667'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
)

export default function RecommendedDropdown({
  options: optionsProp,
  defaultId = null,
  onChange,
  buttonClassName = '',
  menuClassName = '',
  placeholder = 'Select',
  disabled = false
}: Props) {
  // default options if none provided
  const defaultOptions: DropdownOption[] = [
    { id: 'recommended', label: 'Recommended' },
    { id: 'high_match', label: 'High Match Percentage' },
    { id: 'popular', label: 'Popular' },
    { id: 'more_active', label: 'More Active Partners' },
    { id: 'less_ack', label: 'Less Acknowledge Time' }
  ]

  const options =
    optionsProp && optionsProp.length > 0 ? optionsProp : defaultOptions

  const [open, setOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1)
  const [selected, setSelected] = useState<DropdownOption | null>(
    () => options.find((o) => o.id === defaultId) ?? null
  )
  const rootRef = useRef<HTMLDivElement | null>(null)
  const listRef = useRef<HTMLUListElement | null>(null)

  useEffect(() => {
    setSelected(options.find((o) => o.id === defaultId) ?? null)
  }, [defaultId, options])

  // click outside -> close
  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current) return
      if (!rootRef.current.contains(e.target as Node)) {
        setOpen(false)
        setHighlightedIndex(-1)
      }
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  // keyboard interactions
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        setHighlightedIndex(-1)
        return
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setHighlightedIndex((i) => Math.min(i + 1, options.length - 1))
        return
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setHighlightedIndex((i) => Math.max(i - 1, 0))
        return
      }
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        if (highlightedIndex >= 0 && highlightedIndex < options.length) {
          const opt = options[highlightedIndex]
          setSelected(opt)
          onChange?.(opt)
          setOpen(false)
          setHighlightedIndex(-1)
        } else {
          setOpen((v) => !v)
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, highlightedIndex, options, onChange])

  const toggle = () => {
    if (disabled) return
    setOpen((v) => !v)
    if (!open) {
      setHighlightedIndex(options.findIndex((o) => o.id === selected?.id))
      setTimeout(() => listRef.current?.focus(), 0)
    } else {
      setHighlightedIndex(-1)
    }
  }

  const onSelect = (opt: DropdownOption) => {
    setSelected(opt)
    onChange?.(opt)
    setOpen(false)
    setHighlightedIndex(-1)
  }

  return (
    <div ref={rootRef} className='relative inline-block text-left'>
      <button
        type='button'
        aria-haspopup='listbox'
        aria-expanded={open}
        onClick={toggle}
        disabled={disabled}
        className={`inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700  hover:bg-gray-50 focus:outline-none ${buttonClassName}`}
      >
        <FilterIcon />
        <span>{selected ? selected.label : placeholder}</span>
        <svg
          width='16'
          height='10'
          viewBox='0 0 24 24'
          fill='none'
          className='ml-1 text-gray-400'
          aria-hidden
        >
          <path
            d='M6 9l6 6 6-6'
            stroke='currentColor'
            strokeWidth='1.5'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </svg>
      </button>

      {open && (
        <ul
          ref={listRef}
          tabIndex={-1}
          role='listbox'
          aria-activedescendant={
            highlightedIndex >= 0
              ? `opt-${options[highlightedIndex].id}`
              : undefined
          }
          className={`absolute left-0 right-0 z-50 mt-2 w-56 divide-y divide-gray-100 overflow-hidden rounded-lg border bg-white shadow-lg focus:outline-none ${menuClassName}`}
          style={{ minWidth: 220 }}
        >
          {options.map((opt, idx) => {
            const highlighted = idx === highlightedIndex
            const isSelected = selected?.id === opt.id
            return (
              <li
                id={`opt-${opt.id}`}
                key={opt.id}
                role='option'
                aria-selected={isSelected}
                className={`cursor-pointer px-4 py-3 text-sm text-gray-700 ${highlighted ? 'bg-gray-50' : ''}`}
                onMouseEnter={() => setHighlightedIndex(idx)}
                onMouseLeave={() => setHighlightedIndex(-1)}
                onClick={() => onSelect(opt)}
              >
                <div className='flex items-center justify-between'>
                  <div className='truncate'>{opt.label}</div>
                  {isSelected && (
                    <svg
                      width='16'
                      height='16'
                      viewBox='0 0 24 24'
                      fill='none'
                      className='text-indigo-600'
                    >
                      <path
                        d='M20 6L9 17l-5-5'
                        stroke='currentColor'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      />
                    </svg>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
