// components/GoogleFormPicker.tsx
import { useEffect, useState } from 'react'

const CLIENT_ID =
  '160693041158-eb11lol4lf9so4ncir211n177kqlqrm3.apps.googleusercontent.com'
const API_KEY = 'AIzaSyBCwDGelx-IpS7WRlLc6I_I-7GHIMwCkX0'
const APP_ID = '160693041158'
const SCOPES = 'https://www.googleapis.com/auth/drive.file'

declare global {
  interface Window {
    gapi: any
    google: any
  }
}

interface GoogleFormPickerProps {
  onFormSelected?: (formId: string, formName: string) => void
  disabled?: boolean
  className?: string
  selectedFormId?: string
  selectedFormName?: string
  existingAccessToken?: string | null // Add prop for existing access token
}

export default function GoogleFormPicker({
  onFormSelected,
  disabled = false,
  className = '',
  selectedFormId,
  selectedFormName,
  existingAccessToken
}: GoogleFormPickerProps) {
  const [gapiReady, setGapiReady] = useState(false)
  const [gisReady, setGisReady] = useState(false)
  const [tokenClient, setTokenClient] = useState<any>(null)
  const [accessToken, setAccessToken] = useState<string | null>(
    existingAccessToken || null
  )
  const [formInfo, setFormInfo] = useState<{ name: string; id: string } | null>(
    null
  )
  const [isLoading, setIsLoading] = useState(false)
  const [pickerInstance, setPickerInstance] = useState<any>(null)

  // Use selected form info from props if available, otherwise use local state
  const displayFormInfo =
    selectedFormId && selectedFormName
      ? { id: selectedFormId, name: selectedFormName }
      : formInfo

  useEffect(() => {
    // Load GAPI
    const scriptGapi = document.createElement('script')
    scriptGapi.src = 'https://apis.google.com/js/api.js'
    scriptGapi.onload = () => {
      window.gapi.load('picker', () => setGapiReady(true))
    }
    document.body.appendChild(scriptGapi)

    // Load GIS
    const scriptGIS = document.createElement('script')
    scriptGIS.src = 'https://accounts.google.com/gsi/client'
    scriptGIS.async = true
    scriptGIS.defer = true
    scriptGIS.onload = () => {
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: (resp: any) => {
          if (resp && resp.access_token) {
            setAccessToken(resp.access_token)
            openPicker(resp.access_token)
          } else {
            // If no access token received, reset loading state
            setIsLoading(false)
          }
        }
      })
      setTokenClient(client)
      setGisReady(true)
    }
    document.body.appendChild(scriptGIS)

    // Cleanup function
    return () => {
      if (pickerInstance) {
        try {
          pickerInstance.setVisible(false)
        } catch (error) {
          console.log('Picker already closed')
        }
      }
    }
  }, [])

  // Update access token when prop changes
  useEffect(() => {
    if (existingAccessToken) {
      setAccessToken(existingAccessToken)
    }
  }, [existingAccessToken])

  const openPicker = (token: string) => {
    if (!token) {
      setIsLoading(false)
      return
    }

    const view = new window.google.picker.View(window.google.picker.ViewId.DOCS)
    view.setMimeTypes('application/vnd.google-apps.form')

    const picker = new window.google.picker.PickerBuilder()
      .enableFeature(window.google.picker.Feature.NAV_HIDDEN)
      .setAppId(APP_ID)
      .setOAuthToken(token)
      .setDeveloperKey(API_KEY)
      .addView(view)
      .setCallback(pickerCallback)
      .build()

    setPickerInstance(picker)
    picker.setVisible(true)
  }

  const pickerCallback = (data: any) => {
    if (data.action === window.google.picker.Action.PICKED) {
      const doc = data.docs[0]
      const formId = doc.id
      const formName = doc.name

      setFormInfo({ id: formId, name: formName })
      setIsLoading(false)

      // Call the callback function to integrate with parent component
      if (onFormSelected) {
        onFormSelected(formId, formName)
      }
    } else if (data.action === window.google.picker.Action.CANCEL) {
      // User closed the picker without selecting
      setIsLoading(false)
      console.log('Form picker was closed without selection')
    } else if (data.action === window.google.picker.Action.LOADED) {
      // Picker loaded successfully
      console.log('Form picker loaded successfully')
    }
  }

  // Reset form info when selectedFormId changes from parent
  useEffect(() => {
    if (selectedFormId && selectedFormName) {
      setFormInfo({ id: selectedFormId, name: selectedFormName })
    } else if (!selectedFormId) {
      // Clear form info when no form is selected
      setFormInfo(null)
    }
  }, [selectedFormId, selectedFormName])

  const handlePickForm = () => {
    if (disabled || !gapiReady || !gisReady) return

    setIsLoading(true)

    // If we already have an access token, use it directly
    if (accessToken) {
      openPicker(accessToken)
      return
    }

    // Otherwise, request a new token
    try {
      tokenClient?.requestAccessToken({ prompt: '' })
    } catch (error) {
      console.error('Error requesting access token:', error)
      setIsLoading(false)
    }
  }

  return (
    <div className={`p-4 text-center ${className}`}>
      <div className='rounded-xl border border-slate-200 bg-white p-6 shadow-sm'>
        <h4 className='mb-2 text-sm font-medium text-slate-700'>
          Select Your Partner Form
        </h4>
        <p className='mb-3 text-xs text-slate-600'>
          {disabled
            ? 'Form configuration is already saved and locked. You cannot change the form at this stage.'
            : 'Choose the Google Form you want to use for partner applications:'}
        </p>

        <button
          onClick={handlePickForm}
          disabled={disabled || !gapiReady || !gisReady || isLoading}
          className={`w-full rounded-lg border px-3 py-2 text-sm font-medium shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 ${
            disabled
              ? 'cursor-not-allowed border-slate-300 bg-slate-50 text-slate-400'
              : !gapiReady || !gisReady
                ? 'cursor-wait border-slate-300 bg-slate-50 text-slate-400'
                : isLoading
                  ? 'cursor-wait border-blue-300 bg-blue-50 text-blue-700 focus:ring-blue-100'
                  : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400 focus:border-blue-500 focus:ring-blue-100'
          }`}
        >
          {isLoading ? (
            <div className='flex items-center justify-center gap-2'>
              <div className='h-4 w-4 animate-spin rounded-full border border-blue-200 border-t-blue-600'></div>
              Opening Form Picker...
            </div>
          ) : !gapiReady || !gisReady ? (
            <div className='flex items-center justify-center gap-2'>
              <div className='h-4 w-4 animate-spin rounded-full border border-slate-200 border-t-slate-400'></div>
              Loading Form Picker...
            </div>
          ) : disabled ? (
            'Form Configuration Locked'
          ) : (
            'Pick Google Form'
          )}
        </button>

        {/* Status indicator */}
        {!gapiReady || !gisReady ? (
          <div className='mt-2 text-xs text-slate-500'>
            Initializing Google Form Picker...
          </div>
        ) : null}

        {displayFormInfo && (
          <div
            className={`mt-4 rounded-lg border p-3 ${
              disabled
                ? 'border-blue-100 bg-blue-50'
                : 'border-green-100 bg-green-50'
            }`}
          >
            <div
              className={`flex items-center gap-2 ${
                disabled ? 'text-blue-700' : 'text-green-700'
              }`}
            >
              <svg width='16' height='16' viewBox='0 0 24 24' fill='none'>
                <path
                  d='M22 11.08V12a10 10 0 1 1-5.93-9.14'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
                <path
                  d='M22 4L12 14.01l-3-3'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
              <div className='text-sm'>
                <p className='font-medium'>
                  {disabled
                    ? 'Form Configuration Locked'
                    : 'Form Selected Successfully!'}
                </p>
                <p
                  className={`text-xs ${
                    disabled ? 'text-blue-600' : 'text-green-600'
                  }`}
                >
                  {displayFormInfo.name}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
