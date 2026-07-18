'use client'

import React, { useState } from 'react'
import {
  useGoogleForms,
  useGoogleFormsResponses
} from '@/http-hooks/google-forms'

import { INTEGRATIONS } from '@/lib/constants/integrations'
import { getFormsAccessToken } from '@/lib/db/forms'
import { fetchconnectedApps } from '@/lib/db/organization'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export const GoogleFormsExample = () => {
  const [formId, setFormId] = useState('')
  const [accessToken, setAccessToken] = useState<string | null>(null)

  // Fetch specific form data (only when formId is provided)
  const {
    data: formData,
    isLoading: formLoading,
    error: formError
  } = useGoogleForms(formId || undefined)

  // Fetch form responses
  const {
    mutate: fetchResponses,
    data: responsesData,
    isPending: responsesLoading
  } = useGoogleFormsResponses()

  // Function to get access token manually (for testing)
  const handleGetAccessToken = async () => {
    try {
      const apps = await fetchconnectedApps()
      const refreshToken = apps.find(
        (app: any) => app.integrationType === INTEGRATIONS.GOOGLE_FORM
      )?.refreshToken

      if (refreshToken) {
        const token = await getFormsAccessToken(refreshToken)
        setAccessToken(token)
        console.log('Access token obtained:', token)
      } else {
        console.log('No Google Forms refresh token found')
      }
    } catch (error) {
      console.error('Error getting access token:', error)
    }
  }

  // Function to fetch form data
  const handleFetchForm = () => {
    if (formId) {
      // The useGoogleForms hook will automatically fetch when formId changes
      console.log('Fetching form data for:', formId)
    }
  }

  // Function to fetch responses for a specific form
  const handleFetchResponses = () => {
    if (formId) {
      fetchResponses(formId)
    }
  }

  return (
    <div className='space-y-6 p-6'>
      <h2 className='text-2xl font-bold'>Google Forms Integration Example</h2>

      {/* Access Token Section */}
      <div className='space-y-4'>
        <h3 className='text-lg font-semibold'>Access Token</h3>
        <Button onClick={handleGetAccessToken}>Get Access Token</Button>
        {accessToken && (
          <div className='rounded border border-green-200 bg-green-50 p-3'>
            <p className='text-sm text-green-800'>
              Access token obtained successfully!
            </p>
            <p className='mt-1 text-xs text-green-600'>
              Token: {accessToken.substring(0, 20)}...
            </p>
          </div>
        )}
      </div>

      {/* Form Data Section */}
      <div className='space-y-4'>
        <h3 className='text-lg font-semibold'>Form Data</h3>
        <div className='flex gap-2'>
          <Input
            type='text'
            value={formId}
            onChange={(e) => setFormId(e.target.value)}
            placeholder='Enter Form ID'
            className='flex-1'
          />
          <Button onClick={handleFetchForm} disabled={!formId}>
            Fetch Form
          </Button>
        </div>

        {formLoading && <p>Loading form data...</p>}
        {formError && (
          <div className='rounded border border-red-200 bg-red-50 p-3'>
            <p className='text-sm text-red-800'>
              Error loading form: {formError.message}
            </p>
          </div>
        )}
        {formData?.success && formData.data && (
          <div className='rounded border p-3'>
            <h4 className='font-medium'>
              {formData.data.info?.title || 'Untitled Form'}
            </h4>
            <p className='text-sm text-gray-600'>ID: {formData.data.formId}</p>
            <p className='text-sm text-gray-600'>
              Document Title: {formData.data.documentTitle}
            </p>
            <p className='text-sm text-gray-600'>
              Created:{' '}
              {new Date(formData.data.info?.createdTime || '').toLocaleString()}
            </p>
          </div>
        )}
      </div>

      {/* Form Responses Section */}
      <div className='space-y-4'>
        <h3 className='text-lg font-semibold'>Form Responses</h3>
        <div className='flex gap-2'>
          <Input
            type='text'
            value={formId}
            onChange={(e) => setFormId(e.target.value)}
            placeholder='Enter Form ID'
            className='flex-1'
          />
          <Button onClick={handleFetchResponses} disabled={!formId}>
            Fetch Responses
          </Button>
        </div>

        {responsesLoading && <p>Loading responses...</p>}
        {responsesData?.success && responsesData.data?.responses && (
          <div className='space-y-2'>
            <h4 className='font-medium'>
              Responses ({responsesData.data.responses.length})
            </h4>
            {responsesData.data.responses.map(
              (response: any, index: number) => (
                <div key={index} className='rounded border p-3'>
                  <p className='text-sm text-gray-600'>
                    Response ID: {response.responseId}
                  </p>
                  <p className='text-sm text-gray-600'>
                    Created: {new Date(response.createTime).toLocaleString()}
                  </p>
                  {/* You can add more response details here */}
                </div>
              )
            )}
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className='rounded border border-blue-200 bg-blue-50 p-4'>
        <h4 className='mb-2 font-medium text-blue-800'>
          How to get a Form ID:
        </h4>
        <ol className='list-inside list-decimal space-y-1 text-sm text-blue-700'>
          <li>Open your Google Form in the browser</li>
          <li>
            Look at the URL:{' '}
            <code>https://forms.google.com/form/d/FORM_ID_HERE</code>
          </li>
          <li>Copy the FORM_ID_HERE part</li>
          <li>Paste it in the Form ID field above</li>
        </ol>
      </div>
    </div>
  )
}
