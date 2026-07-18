'use client'

import { useState } from 'react'

import { getServerUser } from '@/lib/server'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function SmtpForm() {
  const [formData, setFormData] = useState({
    fromEmail: '',
    provider: 'gmail.com',
    password: ''
  })

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess(false)

    try {
      console.log('SMTP Form: Getting server user...')
      const { token, user } = await getServerUser()
      console.log('SMTP Form: Server user result:', {
        hasToken: !!token,
        hasUser: !!user,
        userId: user?.uid
      })
      console.log('SMTP Form: Full user object:', user)

      if (!user?.uid) {
        throw new Error('User not authenticated')
      }

      // Map provider to uppercase format for API
      const providerMap: { [key: string]: string } = {
        'gmail.com': 'GMAIL',
        'yahoo.com': 'YAHOO',
        'outlook.com': 'OUTLOOK'
      }

      // Construct the full email address
      const fullEmail = `${formData.fromEmail}@${formData.provider}`

      const payload = {
        userId: user.uid,
        username: fullEmail, // Use the full email as username
        password: formData.password,
        provider: providerMap[formData.provider] || 'GMAIL'
      }

      console.log('Sending payload:', payload)

      const response = await fetch('/api/api/mailboxes/connect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(
          result.message || `HTTP error! status: ${response.status}`
        )
      }

      console.log('Success:', result)
      setSuccess(true)
      setFormData({
        fromEmail: '',
        provider: 'gmail.com',
        password: ''
      })
    } catch (err) {
      console.error('Error:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='min-h-screen w-full'>
      <div className='flex  items-center justify-center py-6'>
        <div className='w-full max-w-2xl px-6'>
          {/* Heading */}
          <h2 className='mb-2 text-[20px] font-bold text-gray-800'>
            Connect your mailbox via SMTP
          </h2>
          <p className='mb-6 text-[14px] leading-relaxed text-[#4D5C78]'>
            Set up a custom provider using secure SMTP so Sharkdom can send on
            your behalf while keeping your personal email private.
          </p>

          <p className='mb-6 text-[16px] font-semibold leading-relaxed'>
            SMTP connection form
          </p>

          {/* Instructions */}
          <div className='mb-6 rounded-md bg-blue-50 p-4'>
            <h3 className='mb-2 text-sm font-semibold text-blue-800'>
              Setup Instructions:
            </h3>
            <ul className='space-y-1 text-xs text-blue-700'>
              <li>
                • For Gmail: Enable 2-factor authentication and generate an App
                Password
              </li>
              <li>
                • For Yahoo: Use your email password or generate an App Password
              </li>
              <li>• For Outlook: Use your email password</li>
            </ul>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className='mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700'>
              {error}
            </div>
          )}

          {success && (
            <div className='mb-4 rounded-md bg-green-50 p-3 text-sm text-green-700'>
              Mailbox connected successfully!
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className='space-y-5'>
            {/* From Email */}
            <div>
              <label className='mb-1 block text-sm font-medium text-gray-700'>
                From email <span className='text-red-500'>*</span>
              </label>
              <div className='flex items-center overflow-hidden rounded-md border'>
                <Input
                  type='text'
                  name='fromEmail'
                  value={formData.fromEmail}
                  onChange={handleChange}
                  placeholder='Enter first part of the email'
                  className='w-full rounded-none border-0 p-2 text-sm'
                  required
                />
                <select
                  name='provider'
                  value={formData.provider}
                  onChange={handleChange}
                  className='h-full border-l bg-gray-100 px-2 text-sm text-gray-700'
                >
                  <option value='gmail.com'>gmail.com</option>
                  <option value='yahoo.com'>yahoo.com</option>
                  <option value='outlook.com'>outlook.com</option>
                </select>
              </div>
            </div>

            {/* Password */}
            <div>
              <label className='mb-1 block text-sm font-medium text-gray-700'>
                App Password <span className='text-red-500'>*</span>
              </label>
              <Input
                type='password'
                name='password'
                value={formData.password}
                onChange={handleChange}
                placeholder='Enter your app password'
                className='w-full text-sm'
                required
              />
              <p className='mt-1 text-xs text-gray-500'>
                For Gmail, use an App Password. For other providers, use your
                email password.
              </p>
            </div>

            {/* Submit Button */}
            <div className='pt-4'>
              <Button
                type='submit'
                variant='primary'
                disabled={isLoading}
                className={cn('h-10 w-full', isLoading && 'cursor-not-allowed')}
              >
                {isLoading ? 'Connecting...' : 'Connect Mailbox'}
              </Button>
            </div>
          </form>
        </div>
      </div>
      {/* Buttons */}
      <div className='mb-2 mt-6 border'></div>
      <div className='mt-4 flex justify-end space-x-2'>
        <Button variant='primary' className='h-8 w-24'>
          Back
        </Button>
        <Button
          variant='primary'
          disabled={isLoading}
          className={cn('h-8 w-44 gap-2', isLoading && 'cursor-not-allowed')}
        >
          Check Connection
        </Button>
      </div>
    </div>
  )
}
