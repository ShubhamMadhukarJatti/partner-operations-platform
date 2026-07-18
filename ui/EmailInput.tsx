'use client'

import React, { useCallback, useState } from 'react'

import { cn } from '@/lib/utils'

interface EmailInputProps {
  value: string[]
  onChange: (emails: string[]) => void
  placeholder?: string
  className?: string
}

const EmailInput: React.FC<EmailInputProps> = ({
  value = [],
  onChange,
  placeholder = 'Enter email addresses separated by commas',
  className
}) => {
  const [inputValue, setInputValue] = useState('')
  const [errors, setErrors] = useState<string[]>([])

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email.trim())
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setInputValue(newValue)

    if (newValue.endsWith(',') || newValue.endsWith(' ')) {
      const email = newValue.replace(/[, ]+$/, '').trim()
      if (email) {
        addEmail(email)
        setInputValue('')
      }
    }
  }

  const addEmail = useCallback(
    (email: string) => {
      const trimmedEmail = email.trim()
      if (!trimmedEmail) return

      if (!validateEmail(trimmedEmail)) {
        setErrors((prev) => [...prev, `${trimmedEmail} is not a valid email`])
        return
      }

      if (value.includes(trimmedEmail)) {
        setErrors((prev) => [...prev, `${trimmedEmail} is already added`])
        return
      }

      onChange([...value, trimmedEmail])
      setErrors([])
    },
    [value, onChange]
  )

  const removeEmail = useCallback(
    (emailToRemove: string) => {
      onChange(value.filter((email) => email !== emailToRemove))
    },
    [value, onChange]
  )

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      const email = inputValue.trim()
      if (email) {
        addEmail(email)
        setInputValue('')
      }
    } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      removeEmail(value[value.length - 1])
    }
  }

  const handleBlur = () => {
    const email = inputValue.trim()
    if (email) {
      addEmail(email)
      setInputValue('')
    }
  }

  const clearErrors = () => {
    setErrors([])
  }

  return (
    <div className={cn('w-full', className)}>
      <div className='relative'>
        <div
          className='flex min-h-[40px] cursor-text flex-wrap gap-2 rounded-md border border-inputField-border bg-inputField-bg p-2 focus-within:ring-2 focus-within:ring-inputField-ring focus-within:ring-offset-0'
          onClick={(e) => {
            const input = e.currentTarget.querySelector('input')
            input?.focus()
          }}
        >
          {value.map((email, index) => (
            <span
              key={index}
              className='inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-1 text-sm text-blue-800'
            >
              {email}
              <button
                type='button'
                onClick={() => removeEmail(email)}
                className='ml-1 text-blue-600 hover:text-blue-800 focus:outline-none'
              >
                ×
              </button>
            </span>
          ))}
          <input
            type='text'
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            onFocus={clearErrors}
            placeholder={value.length === 0 ? placeholder : ''}
            className='min-w-[120px] flex-1 bg-transparent text-sm text-inputField-content outline-none placeholder:text-inputField-content'
          />
        </div>
      </div>

      {errors.length > 0 && (
        <div className='mt-1 text-sm text-red-600'>
          {errors.map((error, index) => (
            <div key={index}>{error}</div>
          ))}
        </div>
      )}
    </div>
  )
}

export default EmailInput
