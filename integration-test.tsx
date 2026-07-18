'use client'

import React, { useEffect, useState } from 'react'

import { INTEGRATIONS } from '@/lib/constants/integrations'
import { getFormsAccessToken } from '@/lib/db/forms'
import { fetchconnectedApps } from '@/lib/db/organization'
import { getSheetsAccessToken } from '@/lib/db/sheets'
import { Button } from '@/components/ui/button'

interface TestResults {
  sheets?: { success?: boolean; error?: string; accessToken?: string }
  forms?: { success?: boolean; error?: string; accessToken?: string }
}

export const IntegrationTest = () => {
  const [connectedApps, setConnectedApps] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<TestResults>({})

  const loadConnectedApps = async () => {
    try {
      const apps = await fetchconnectedApps()
      setConnectedApps(apps)
      console.log('Connected apps loaded:', apps)
    } catch (error) {
      console.error('Error loading connected apps:', error)
    }
  }

  const testSheetsIntegration = async () => {
    setLoading(true)
    try {
      const sheetsApp = connectedApps.find(
        (app: any) => app.integrationType === INTEGRATIONS.GOOGLE_SHEET
      )

      if (!sheetsApp?.refreshToken) {
        setResults((prev: TestResults) => ({
          ...prev,
          sheets: { error: 'No Google Sheets refresh token found' }
        }))
        return
      }

      const accessToken = await getSheetsAccessToken(sheetsApp.refreshToken)
      setResults((prev: TestResults) => ({
        ...prev,
        sheets: {
          success: true,
          accessToken: accessToken?.substring(0, 20) + '...'
        }
      }))
    } catch (error: any) {
      setResults((prev: TestResults) => ({
        ...prev,
        sheets: { error: error.message || 'Unknown error' }
      }))
    } finally {
      setLoading(false)
    }
  }

  const testFormsIntegration = async () => {
    setLoading(true)
    try {
      const formsApp = connectedApps.find(
        (app: any) => app.integrationType === INTEGRATIONS.GOOGLE_FORM
      )

      if (!formsApp?.refreshToken) {
        setResults((prev: TestResults) => ({
          ...prev,
          forms: { error: 'No Google Forms refresh token found' }
        }))
        return
      }

      const accessToken = await getFormsAccessToken(formsApp.refreshToken)
      setResults((prev: TestResults) => ({
        ...prev,
        forms: {
          success: true,
          accessToken: accessToken?.substring(0, 20) + '...'
        }
      }))
    } catch (error: any) {
      setResults((prev: TestResults) => ({
        ...prev,
        forms: { error: error.message || 'Unknown error' }
      }))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadConnectedApps()
  }, [])

  return (
    <div className='space-y-6 p-6'>
      <h2 className='text-2xl font-bold'>Integration Test</h2>

      <div className='space-y-4'>
        <Button onClick={loadConnectedApps}>Refresh Connected Apps</Button>

        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          {/* Google Sheets */}
          <div className='rounded-lg border p-4'>
            <h3 className='mb-2 text-lg font-semibold'>Google Sheets</h3>
            <div className='space-y-2'>
              <Button
                onClick={testSheetsIntegration}
                disabled={loading}
                size='sm'
              >
                Test Sheets Integration
              </Button>

              {results.sheets && (
                <div
                  className={`rounded p-2 text-sm ${
                    results.sheets.success
                      ? 'border border-green-200 bg-green-50 text-green-800'
                      : 'border border-red-200 bg-red-50 text-red-800'
                  }`}
                >
                  {results.sheets.success ? (
                    <div>
                      <p>✅ Success!</p>
                      <p>Access Token: {results.sheets.accessToken}</p>
                    </div>
                  ) : (
                    <p>❌ Error: {results.sheets.error}</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Google Forms */}
          <div className='rounded-lg border p-4'>
            <h3 className='mb-2 text-lg font-semibold'>Google Forms</h3>
            <div className='space-y-2'>
              <Button
                onClick={testFormsIntegration}
                disabled={loading}
                size='sm'
              >
                Test Forms Integration
              </Button>

              {results.forms && (
                <div
                  className={`rounded p-2 text-sm ${
                    results.forms.success
                      ? 'border border-green-200 bg-green-50 text-green-800'
                      : 'border border-red-200 bg-red-50 text-red-800'
                  }`}
                >
                  {results.forms.success ? (
                    <div>
                      <p>✅ Success!</p>
                      <p>Access Token: {results.forms.accessToken}</p>
                    </div>
                  ) : (
                    <p>❌ Error: {results.forms.error}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Connected Apps Display */}
        <div className='mt-6'>
          <h3 className='mb-2 text-lg font-semibold'>Connected Apps</h3>
          <div className='space-y-2'>
            {connectedApps.map((app: any, index: number) => (
              <div key={index} className='rounded border p-3 text-sm'>
                <p>
                  <strong>Type:</strong> {app.integrationType}
                </p>
                <p>
                  <strong>Connected:</strong> {app.isConnected ? 'Yes' : 'No'}
                </p>
                <p>
                  <strong>Has Refresh Token:</strong>{' '}
                  {app.refreshToken ? 'Yes' : 'No'}
                </p>
                {app.refreshToken && (
                  <p>
                    <strong>Token:</strong> {app.refreshToken.substring(0, 20)}
                    ...
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
