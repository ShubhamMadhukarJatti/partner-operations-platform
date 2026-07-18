'use client'

import React, { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { showCustomToast } from '@/components/custom-toast'

const MigrationForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  })

  const [loading, setIsLoading] = useState<boolean>(false)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault()
      // Handle form submission logic
      console.log('Form Data:', formData)
      setIsLoading(true)
      const response = await fetch(`/api/demo-book`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json-patch+json'
        },
        body: JSON.stringify(formData)
      })
      if (!response.ok) {
        throw new Error(`Failed to post data. Status: ${response.status}`)
      } else {
        setIsLoading(false)
        showCustomToast('Success', 'Demo booked successfully!', 'success', 5000)
        setFormData({
          name: '',
          email: '',
          company: '',
          message: ''
        })
      }
    } catch (error) {
      console.log('error --- ', error)
    }
  }

  return (
    <div className='flex items-center justify-center bg-white'>
      <div className='grid max-w-4xl grid-cols-1 gap-6 p-4 md:grid-cols-2 lg:p-8'>
        {/* Left Side: Information */}
        <div className='space-y-6'>
          <h1 className='w-[384px] text-3xl/[45px] font-bold'>
            Migrate to{' '}
            <span className='bg-gradient-to-r from-[#F84F2E] to-[#2748B7] bg-clip-text text-transparent'>
              Sharkdom
            </span>{' '}
            <span className='text-[#F84F2E]'>from Impartner</span>{' '}
            <span className='bg-gradient-to-r from-[#F84F2E] to-[#2748B7] bg-clip-text text-transparent'>
              or
            </span>{' '}
            <span className='text-[#F84F2E]'>Crossbeam</span> with upto 100$
            credits
          </h1>
          <p className='text-[16px]/[40px] text-[#555555]'>
            Get in touch to learn about our reliable infrastructure, advanced
            features, and seamless migration.
          </p>
          <ul className='space-y-4 text-[#0B0B0B]'>
            <li>🔒 HIPAA, GDPR, SOC-2 Compliant</li>
            <li>Get dedicated support</li>
            <li>🚀 Migrate in under two days</li>
          </ul>
        </div>

        {/* Right Side: Form */}
        <form
          onSubmit={handleSubmit}
          className='space-y-4 rounded-[20px] border p-6'
        >
          <div>
            <label
              htmlFor='name'
              className='block text-sm font-medium text-gray-700'
            >
              Name
            </label>
            <Input
              type='text'
              name='name'
              id='name'
              required
              className='mt-1 block w-full rounded-md border border-gray-300 bg-[#F5F8FA] px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div>
            <label
              htmlFor='email'
              className='block text-sm font-medium text-gray-700'
            >
              Work Email
            </label>
            <Input
              type='email'
              name='email'
              id='email'
              required
              className='mt-1 block w-full rounded-md border border-gray-300 bg-[#F5F8FA] px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div>
            <label
              htmlFor='company'
              className='block text-sm font-medium text-gray-700'
            >
              Company Name
            </label>
            <Input
              type='text'
              name='company'
              id='company'
              required
              className='mt-1 block w-full rounded-md border border-gray-300 bg-[#F5F8FA] px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
              value={formData.company}
              onChange={handleChange}
            />
          </div>

          <div>
            <label
              htmlFor='message'
              className='block text-sm font-medium text-gray-700'
            >
              Message
            </label>
            <textarea
              name='message'
              id='message'
              required
              rows={2}
              className='mt-1 block w-full rounded-md border border-gray-300 bg-[#F5F8FA] px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
              value={formData.message}
              onChange={handleChange}
            />
          </div>

          <div className='flex w-full items-center justify-center'>
            <Button
              variant={'ghost'}
              loading={loading}
              onClick={handleSubmit}
              type='submit'
              className='w-[136px] rounded-full bg-blue-600 px-4 py-2 text-white transition duration-300 hover:bg-blue-700'
            >
              Submit
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default MigrationForm
