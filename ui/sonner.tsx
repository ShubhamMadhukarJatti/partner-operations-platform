'use client'

import React, { createContext, ReactNode, useContext, useState } from 'react'
import { AlertCircle, AlertTriangle, CheckCircle, Info, X } from 'lucide-react'

export type ToastType =
  | 'success'
  | 'error'
  | 'warning'
  | 'info'
  | 'default'
  | 'loading'

export interface Toast {
  id: number
  message: string
  type: ToastType
  createdAt: number
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
}

interface ToastContextType {
  toasts: Toast[]
  addToast: (message: string, options?: ToastOptions) => number
  removeToast: (id: number) => void
  dismiss: (id?: number) => void
}

interface ToastOptions {
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
  id?: number
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

const useToastContext = () => {
  const context = useContext(ToastContext)
  if (context === undefined) {
    throw new Error('useToast must be used within a Toaster component')
  }
  return context
}

// Sonner-compatible toast function
const createToastFunction = () => {
  let contextRef: ToastContextType | null = null

  const setContext = (context: ToastContextType) => {
    contextRef = context
  }

  const toast = (message: string, options?: ToastOptions) => {
    if (!contextRef) {
      console.warn('Toast called before Toaster is mounted')
      return 0
    }
    return contextRef.addToast(message, options)
  }

  // Sonner-style methods
  toast.success = (message: string, options?: ToastOptions) => {
    if (!contextRef) return 0
    return contextRef.addToast(message, { ...options })
  }

  toast.error = (message: string, options?: ToastOptions) => {
    if (!contextRef) return 0
    return contextRef.addToast(message, { ...options })
  }

  toast.warning = (message: string, options?: ToastOptions) => {
    if (!contextRef) return 0
    return contextRef.addToast(message, { ...options })
  }

  toast.info = (message: string, options?: ToastOptions) => {
    if (!contextRef) return 0
    return contextRef.addToast(message, { ...options })
  }

  toast.loading = (message: string, options?: ToastOptions) => {
    if (!contextRef) return 0
    return contextRef.addToast(message, { ...options })
  }

  toast.dismiss = (id?: number) => {
    if (!contextRef) return
    contextRef.dismiss(id)
  }

  return { toast, setContext }
}

const { toast, setContext } = createToastFunction()

// Provider Component
interface ToasterProps {
  children?: ReactNode
  position?:
    | 'top-left'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-right'
    | 'top-center'
    | 'bottom-center'
  expand?: boolean
  richColors?: boolean
  closeButton?: boolean
}

export const Toaster: React.FC<ToasterProps> = ({
  children,
  position = 'top-right',
  expand = false,
  richColors = false,
  closeButton = true
}) => {
  const [toasts, setToasts] = useState<Toast[]>([])
  const [nextId, setNextId] = useState(1)
  const [closingToast, setClosingToast] = useState<number | null>(null)

  const addToast = (message: string, options?: ToastOptions): number => {
    const id = options?.id || nextId

    // Determine type from the calling method
    const stack = new Error().stack
    let type: ToastType = 'default'

    if (stack?.includes('toast.success')) type = 'success'
    else if (stack?.includes('toast.error')) type = 'error'
    else if (stack?.includes('toast.warning')) type = 'warning'
    else if (stack?.includes('toast.info')) type = 'info'
    else if (stack?.includes('toast.loading')) type = 'loading'

    const newToast: Toast = {
      id,
      message,
      type,
      createdAt: Date.now(),
      description: options?.description,
      action: options?.action
    }

    setToasts((prev) => [...prev, newToast])
    setNextId((prev) => prev + 1)

    return id
  }

  const removeToast = (id: number) => {
    setClosingToast(id)
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id))
      setClosingToast(null)
    }, 300)
  }

  const dismiss = (id?: number) => {
    if (id) {
      removeToast(id)
    } else {
      // Dismiss all toasts
      toasts.forEach((toast) => removeToast(toast.id))
    }
  }

  const contextValue: ToastContextType = {
    toasts,
    addToast,
    removeToast,
    dismiss
  }

  // Set context for the global toast function
  React.useEffect(() => {
    setContext(contextValue)
  }, [contextValue])

  const getPositionClasses = () => {
    switch (position) {
      case 'top-left':
        return 'top-4 left-4'
      case 'top-right':
        return 'top-4 right-4'
      case 'bottom-left':
        return 'bottom-4 left-4'
      case 'bottom-right':
        return 'bottom-4 right-4'
      case 'top-center':
        return 'top-4 left-1/2 transform -translate-x-1/2'
      case 'bottom-center':
        return 'bottom-4 left-1/2 transform -translate-x-1/2'
      default:
        return 'top-4 right-4'
    }
  }

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <ToastContainer
        toasts={toasts}
        onRemove={removeToast}
        closingToast={closingToast}
        positionClasses={getPositionClasses()}
        closeButton={closeButton}
        richColors={richColors}
        position={position}
      />
    </ToastContext.Provider>
  )
}

// Toast Container Component
interface ToastContainerProps {
  toasts: Toast[]
  onRemove: (id: number) => void
  closingToast: number | null
  positionClasses: string
  closeButton: boolean
  richColors: boolean
  position: string
}

const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  onRemove,
  closingToast,
  positionClasses,
  closeButton,
  richColors,
  position
}) => {
  const toastTypes = {
    success: {
      icon: CheckCircle,
      bgColor: richColors ? 'bg-green-600 text-white' : 'bg-green-50',
      borderColor: richColors ? 'border-green-600' : 'border-green-200',
      iconColor: richColors ? 'text-white' : 'text-green-600',
      textColor: richColors ? 'text-white' : 'text-green-800'
    },
    error: {
      icon: AlertCircle,
      bgColor: richColors ? 'bg-red-600 text-white' : 'bg-red-50',
      borderColor: richColors ? 'border-red-600' : 'border-red-200',
      iconColor: richColors ? 'text-white' : 'text-red-600',
      textColor: richColors ? 'text-white' : 'text-red-800'
    },
    warning: {
      icon: AlertTriangle,
      bgColor: richColors ? 'bg-yellow-600 text-white' : 'bg-yellow-50',
      borderColor: richColors ? 'border-yellow-600' : 'border-yellow-200',
      iconColor: richColors ? 'text-white' : 'text-yellow-600',
      textColor: richColors ? 'text-white' : 'text-yellow-800'
    },
    info: {
      icon: Info,
      bgColor: richColors ? 'bg-blue-600 text-white' : 'bg-blue-50',
      borderColor: richColors ? 'border-blue-600' : 'border-blue-200',
      iconColor: richColors ? 'text-white' : 'text-blue-600',
      textColor: richColors ? 'text-white' : 'text-blue-800'
    },
    default: {
      icon: Info,
      bgColor: 'bg-white',
      borderColor: 'border-gray-200',
      iconColor: 'text-gray-600',
      textColor: 'text-gray-800'
    },
    loading: {
      icon: Info, // You can replace with a spinner icon
      bgColor: 'bg-white',
      borderColor: 'border-gray-200',
      iconColor: 'text-gray-600',
      textColor: 'text-gray-800'
    }
  }

  if (toasts.length === 0) return null

  const currentToast = toasts[0]
  const remainingCount = toasts.length - 1
  const toastConfig = toastTypes[currentToast.type]
  const IconComponent = toastConfig.icon

  // Determine animation direction based on position
  const isTopPosition = position.includes('top')
  const isBottomPosition = position.includes('bottom')

  return (
    <>
      <div className={`fixed ${positionClasses} z-50`}>
        <div className='relative'>
          {/* Background Toast (Second in queue) */}
          {toasts.length > 1 && (
            <div
              className={`
                absolute ${isTopPosition ? 'top-2' : 'bottom-2'} right-2 w-full max-w-sm
                ${toastTypes[toasts[1].type].bgColor} ${toastTypes[toasts[1].type].borderColor}
                z-10 scale-95 transform rounded-lg border opacity-60
                shadow-md transition-all duration-300 ease-in-out
              `}
            >
              <div className='p-4'>
                <div className='flex items-start space-x-3'>
                  {React.createElement(toastTypes[toasts[1].type].icon, {
                    className: `w-5 h-5 mt-0.5 flex-shrink-0 ${toastTypes[toasts[1].type].iconColor}`
                  })}
                  <div className='min-w-0 flex-1'>
                    <p
                      className={`text-sm font-medium ${toastTypes[toasts[1].type].textColor} truncate`}
                    >
                      {toasts[1].message}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Main Toast (First in queue) */}
          <div
            className={`
              relative z-20 mx-auto w-full max-w-sm
              ${toastConfig.bgColor} ${toastConfig.borderColor}
              transform rounded-lg border
              shadow-lg transition-all duration-300 ease-in-out
              ${
                closingToast === currentToast.id
                  ? isTopPosition
                    ? 'toast-slide-down'
                    : 'toast-slide-up'
                  : isTopPosition
                    ? 'toast-slide-up-in'
                    : 'toast-slide-down-in'
              }
            `}
          >
            <div className='p-4'>
              <div className='flex items-start space-x-3'>
                <IconComponent
                  className={`mt-0.5 h-5 w-5 flex-shrink-0 ${toastConfig.iconColor}`}
                />
                <div className='min-w-0 flex-1'>
                  <p className={`text-sm font-medium ${toastConfig.textColor}`}>
                    {currentToast.message}
                  </p>

                  {currentToast.description && (
                    <p
                      className={`mt-1 text-xs ${richColors ? 'text-white/80' : 'text-gray-600'}`}
                    >
                      {currentToast.description}
                    </p>
                  )}

                  {remainingCount > 0 && (
                    <p
                      className={`mt-1 text-xs ${richColors ? 'text-white/60' : 'text-gray-500'}`}
                    >
                      +{remainingCount} more notification
                      {remainingCount !== 1 ? 's' : ''}
                    </p>
                  )}
                </div>

                <div className='flex items-center space-x-2'>
                  {currentToast.action && (
                    <button
                      onClick={currentToast.action.onClick}
                      className={`rounded px-2 py-1 text-xs ${
                        richColors
                          ? 'bg-white/20 text-white hover:bg-white/30'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      } transition-colors`}
                    >
                      {currentToast.action.label}
                    </button>
                  )}

                  {closeButton && (
                    <button
                      onClick={() => onRemove(currentToast.id)}
                      className={`flex-shrink-0 rounded-full p-1 transition-colors hover:bg-gray-200 ${
                        richColors ? 'hover:bg-white/20' : ''
                      }`}
                    >
                      <X
                        className={`h-4 w-4 ${richColors ? 'text-white/80' : 'text-gray-400'}`}
                      />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes toast-slide-up-in {
          from {
            transform: translateY(-100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes toast-slide-down-in {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes toast-slide-down {
          from {
            transform: translateY(0);
            opacity: 1;
          }
          to {
            transform: translateY(100%);
            opacity: 0;
          }
        }

        @keyframes toast-slide-up {
          from {
            transform: translateY(0);
            opacity: 1;
          }
          to {
            transform: translateY(-100%);
            opacity: 0;
          }
        }

        .toast-slide-up-in {
          animation: toast-slide-up-in 0.3s ease-in-out;
        }

        .toast-slide-down-in {
          animation: toast-slide-down-in 0.3s ease-in-out;
        }

        .toast-slide-down {
          animation: toast-slide-down 0.3s ease-in-out;
        }

        .toast-slide-up {
          animation: toast-slide-up 0.3s ease-in-out;
        }
      `}</style>
    </>
  )
}

// Export the toast function for global usage (Sonner-compatible)
export { toast }
