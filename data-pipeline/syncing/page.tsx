'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCreatePersonaOverlapRecord } from '@/http-hooks/partner-match'
import { useQueryClient } from '@tanstack/react-query'
import { CheckCircle2, Loader2 } from 'lucide-react'

import { showCustomToast } from '@/components/custom-toast'
import { GradientPageBackground } from '@/components/shared/gradient-page-background'

import DataPipelineStepper from '../_components/DataPipelineStepper'

let globalProgress = 0
let globalActiveStep = 0
let globalSyncTriggered = false
const listeners = new Set<(progress: number, step: number) => void>()

const setGlobalProgressAndStep = (p: number, s: number) => {
  globalProgress = p
  globalActiveStep = s
  listeners.forEach((listener) => listener(p, s))
}

export default function SyncingPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const createPersonaOverlapRecord = useCreatePersonaOverlapRecord()
  const queryClient = useQueryClient()

  const [progress, setProgress] = useState(globalProgress)
  const [activeStep, setActiveStep] = useState(globalActiveStep) // 0: Connecting, 1: Syncing, 2: Verifying, 3: Completed

  useEffect(() => {
    const handleStateChange = (p: number, s: number) => {
      setProgress(p)
      setActiveStep(s)
    }
    listeners.add(handleStateChange)
    return () => {
      listeners.delete(handleStateChange)
    }
  }, [])

  const steps = [
    { label: 'Connecting', done: activeStep > 0 },
    { label: 'Syncing Data', done: activeStep > 1 },
    { label: 'Verifying', done: activeStep > 2 },
    { label: 'Completed', done: activeStep > 3 }
  ]

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (globalSyncTriggered) return
    globalSyncTriggered = true

    const runSync = async () => {
      // Step 0: Connecting (0% - 10%)
      setGlobalProgressAndStep(10, 0)

      const syncTimer = setTimeout(() => {
        // Step 1: Syncing Data (10% - 45%)
        setGlobalProgressAndStep(45, 1)
      }, 1000)

      const verifyTimer = setTimeout(() => {
        // Step 2: Verifying (45% - 85%)
        setGlobalProgressAndStep(85, 2)
      }, 3000)

      const completeTimer = setTimeout(() => {
        // Step 3: Completed (100%)
        setGlobalProgressAndStep(100, 3)

        // Clean up session and local window state for the entire pipeline
        sessionStorage.removeItem('__sharkdom_pending_import_payload')
        delete (window as any).__sharkdom_pending_import_payload
        sessionStorage.removeItem('fieldMappingData')
        sessionStorage.removeItem('__sharkdom_temp_csvData')
        sessionStorage.removeItem('__sharkdom_temp_csvData_contacts')
        sessionStorage.removeItem('__sharkdom_temp_csvData_companies')
        sessionStorage.removeItem('__sharkdom_temp_csvData_deals')
        sessionStorage.removeItem('csvData')
        sessionStorage.removeItem('csvFileName')
        sessionStorage.removeItem('pending_recordType')
        sessionStorage.removeItem('returnToPartnerPortal')
        sessionStorage.removeItem('__sharkdom_mapping_rowsByTab')
        sessionStorage.removeItem('__sharkdom_mapping_samplesFetched')
        delete (window as any).__sharkdom_temp_csvData
        delete (window as any).__sharkdom_temp_csvData_contacts
        delete (window as any).__sharkdom_temp_csvData_companies
        delete (window as any).__sharkdom_temp_csvData_deals
        delete (window as any).__sharkdom_fieldMappingData

        showCustomToast(
          'Success',
          'Data imported successfully!',
          'success',
          3000
        )

        // Reset global states for future syncs
        globalSyncTriggered = false
        globalProgress = 0
        globalActiveStep = 0

        // Invalidate version caches so the version-history and insights pages see the new records immediately
        queryClient.invalidateQueries({ queryKey: ['overlap-record-versions'] })
        queryClient.invalidateQueries({
          queryKey: ['versioned-overlap-records']
        })
        queryClient.invalidateQueries({ queryKey: ['persona-versions'] })
        queryClient.invalidateQueries({ queryKey: ['persona-version-data'] })
        queryClient.invalidateQueries({
          queryKey: ['persona-details-by-version']
        })
        queryClient.invalidateQueries({ queryKey: ['get-persona-preview'] })
        queryClient.invalidateQueries({ queryKey: ['get-persona'] })

        // Wait a brief moment to show Completed state
        setTimeout(() => {
          sessionStorage.setItem('show_insights_loader', 'true')
          router.push('/data-pipeline/insights')
        }, 1500)
      }, 4500)

      return () => {
        clearTimeout(syncTimer)
        clearTimeout(verifyTimer)
        clearTimeout(completeTimer)
      }
    }

    runSync()
  }, [router, searchParams, queryClient])

  // Get status message and remaining time text dynamically
  const getStatusText = () => {
    if (activeStep === 0) return 'Connecting to source...'
    if (activeStep === 1) return 'Syncing Data (45%... 2 mins remaining)'
    if (activeStep === 2) return 'Verifying synced records...'
    return 'Completed!'
  }

  return (
    <GradientPageBackground className='flex min-h-screen flex-col'>
      <style>{`
        @keyframes stripe-march {
          from { transform: translateX(0); }
          to   { transform: translateX(-40px); }
        }
      `}</style>

      {/* Stepper */}
      <div className='flex justify-center pt-5'>
        <DataPipelineStepper current={4} />
      </div>

      {/* Centered content */}
      <div className='flex flex-1 flex-col items-center justify-center gap-8 px-6'>
        {/* Title */}
        <div className='flex flex-col items-center gap-2 text-center'>
          <h1 className='text-2xl font-semibold leading-[34px] text-[#25224A]'>
            Wait for the action
          </h1>
          <p className='text-sm font-normal leading-5 text-[#4D5C78]'>
            Details from the connected source
          </p>
        </div>

        {/* Progress + status */}
        <div className='flex w-full max-w-2xl flex-col items-center gap-4'>
          {/* Progress bar container */}
          <div className='relative h-3.5 w-full overflow-hidden rounded-full border border-[#CBD5E1] bg-[#E2E8F0] shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)]'>
            <div
              className='h-full rounded-full transition-all duration-500 ease-out'
              style={{
                width: `${progress}%`,
                background:
                  'repeating-linear-gradient(45deg, #2563EB 0px, #2563EB 14px, #60A5FA 14px, #60A5FA 28px)',
                backgroundSize: '40px 40px',
                animation: 'stripe-march 0.8s linear infinite'
              }}
            />
          </div>

          {/* Progress label */}
          <span className='text-sm font-semibold text-[#2C2B2B]'>
            {getStatusText()}
          </span>

          {/* Status steps */}
          <div className='flex flex-wrap items-center justify-center gap-3 rounded-2xl border border-[#E2E8F0] bg-white px-6 py-3.5 text-sm text-[#2A3241] shadow-[0_4px_12px_rgba(0,0,0,0.02)]'>
            {steps.map((step, i) => (
              <div key={step.label} className='flex items-center gap-3'>
                {i > 0 && <span className='font-medium text-[#CBD5E1]'>→</span>}
                <div className='flex items-center gap-2'>
                  {step.done ? (
                    <CheckCircle2
                      className='h-5 w-5 text-[#10B981]'
                      fill='#10B981'
                      strokeWidth={0}
                    />
                  ) : activeStep === i ? (
                    <Loader2 className='h-5 w-5 animate-spin text-[#2563EB]' />
                  ) : (
                    <div className='h-5 w-5 rounded-full border-2 border-[#CBD5E1] bg-white' />
                  )}
                  <span
                    className={
                      activeStep === i
                        ? 'font-bold text-[#1E293B]'
                        : 'text-[#64748B]'
                    }
                  >
                    {step.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer note */}
        <p className='text-xs font-medium text-[#64748B]'>
          We will notify you once its done
        </p>
      </div>
    </GradientPageBackground>
  )
}
