'use client'

import React, { useEffect, useState } from 'react'
import { AlertCircle, Check, Info, X, XCircle } from 'lucide-react'
import { toast as sonnerToast } from 'sonner'

type ToastType = 'success' | 'info' | 'error'

interface CustomToastProps {
  title: string
  message: string
  type?: ToastType
  duration?: number
  toastId?: string | number
}

const toastConfig = {
  success: {
    bgGradient:
      'linear-gradient(90deg, rgba(0, 237, 81, 0.12) 0%, rgba(0, 237, 123, 0) 100%)',
    progressColor: '#01E17B',
    circleBg: '#01E17B',
    Icon: Check
  },
  info: {
    bgGradient:
      'linear-gradient(90deg, rgba(255, 212, 38, 0.11) 0%, rgba(255, 212, 38, 0) 100%)',
    progressColor: '#FFD21F',
    circleBg: '#FFD21F',
    Icon: Info
  },
  error: {
    bgGradient:
      'linear-gradient(90deg, rgba(240, 66, 72, 0.13) 0%, rgba(240, 66, 72, 0) 100%)',
    progressColor: '#F04349',
    circleBg: '#F04349',
    Icon: XCircle
  }
}

export const CustomToast: React.FC<CustomToastProps> = ({
  title,
  message,
  type = 'success',
  duration = 5000,
  toastId
}) => {
  const [progress, setProgress] = useState(100)
  const config = toastConfig[type]
  const { Icon } = config

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev - 100 / (duration / 100)
        if (newProgress <= 0) {
          clearInterval(interval)
          return 0
        }
        return newProgress
      })
    }, 100)

    return () => clearInterval(interval)
  }, [duration])

  const handleClose = () => {
    sonnerToast.dismiss(toastId)
  }

  return (
    <div
      className='flex w-[320px] flex-col overflow-hidden rounded-lg shadow-lg'
      style={{
        backgroundColor: '#242C32',
        backgroundImage: config.bgGradient
      }}
    >
      {/* Main content with icon and text */}
      <div className='flex items-center gap-3' style={{ padding: '12px 16px' }}>
        {/* Icon with circular background */}
        <div
          className='flex flex-shrink-0 items-center justify-center rounded-full'
          style={{
            width: '32px',
            height: '32px',
            backgroundColor: config.circleBg,
            border: '6px solid #303746d6',
            marginTop: '2px'
          }}
        >
          <Icon size={12} style={{ color: '#242C32', strokeWidth: 4 }} />
        </div>

        {/* Text content */}
        <div className='min-w-0 flex-1'>
          <div
            className='font-bold text-white'
            style={{
              fontSize: '17px',
              lineHeight: '22px',
              fontWeight: 700
            }}
          >
            {title}
          </div>
          <div
            className='mt-1'
            style={{
              color: '#C8C5C5',
              fontSize: '13px',
              lineHeight: '18px',
              fontWeight: 400
            }}
          >
            {message}
          </div>
        </div>

        {/* Close button */}
        <button
          onClick={handleClose}
          className='flex-shrink-0 rounded p-1 transition-colors hover:bg-opacity-20'
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            marginTop: '2px'
          }}
          aria-label='Close notification'
        >
          <X size={16} className='text-white' />
        </button>
      </div>

      {/* Progress bar (countdown) */}
      <div
        className='h-1 w-full'
        style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
      >
        <div
          className='h-full transition-all'
          style={{
            width: `${progress}%`,
            backgroundColor: config.progressColor,
            transitionDuration: '100ms',
            boxShadow: `0 0 8px ${config.progressColor}80, inset 0 0 4px ${config.progressColor}40`
          }}
        />
      </div>
    </div>
  )
}

export const showCustomToast = (
  title: string,
  message: string,
  type: ToastType = 'success',
  duration = 5000
) => {
  const toastId = sonnerToast.custom(
    (t) => (
      <CustomToast
        title={title}
        message={message}
        type={type}
        duration={duration}
        toastId={t}
      />
    ),
    {
      duration,
      position: 'top-right'
    }
  )
  return toastId
}
