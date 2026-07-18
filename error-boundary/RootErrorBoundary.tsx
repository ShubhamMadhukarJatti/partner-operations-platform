'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

const CHUNK_RELOAD_KEY = 'chunk_load_error_reloaded'

function isChunkLoadError(error: Error | null) {
  if (!error) return false

  const message = error.message || ''
  const name = error.name || ''

  return (
    name === 'ChunkLoadError' ||
    message.includes('Loading chunk') ||
    message.includes('ChunkLoadError') ||
    message.includes('Failed to fetch dynamically imported module')
  )
}

export class RootErrorBoundary extends Component<Props, State> {
  private pathnameRef = ''

  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    }
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null
    }
  }

  componentDidMount() {
    if (typeof window !== 'undefined') {
      this.pathnameRef = window.location.pathname
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Root Error Boundary caught an error:', error, errorInfo)

    if (isChunkLoadError(error)) {
      console.warn('Chunk load error detected, attempting one-time reload...')

      try {
        const hasReloaded = sessionStorage.getItem(CHUNK_RELOAD_KEY)

        if (!hasReloaded) {
          sessionStorage.setItem(CHUNK_RELOAD_KEY, 'true')
          window.location.reload()
          return
        }

        console.error(
          'Chunk load error persisted after one reload. Showing fallback UI.'
        )
      } catch (e) {
        console.error('Failed to handle chunk auto-reload logic:', e)
      }
    }

    this.setState({
      error,
      errorInfo
    })
  }

  componentDidUpdate() {
    if (typeof window === 'undefined') return

    const currentPath = window.location.pathname

    if (currentPath !== this.pathnameRef) {
      this.pathnameRef = currentPath

      if (this.state.hasError) {
        this.setState({
          hasError: false,
          error: null,
          errorInfo: null
        })
      }

      try {
        sessionStorage.removeItem(CHUNK_RELOAD_KEY)
      } catch (e) {
        console.error('Failed to clear chunk reload key on navigation:', e)
      }
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    })
  }

  handleReload = () => {
    if (typeof window !== 'undefined') {
      window.location.reload()
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className='flex min-h-screen items-center justify-center bg-gray-50 p-4'>
          <div className='mx-auto w-full max-w-md rounded-lg border border-red-200 bg-white p-6 shadow-lg'>
            <div className='mb-4 text-center'>
              <h2 className='mb-2 text-2xl font-bold text-red-600'>
                Something went wrong
              </h2>

              <p className='mb-4 text-sm text-gray-600'>
                An unexpected error occurred. You can try again or refresh the
                page.
              </p>

              {this.state.error && process.env.NODE_ENV === 'development' && (
                <details className='mb-4 text-left'>
                  <summary className='cursor-pointer text-sm font-medium text-gray-700'>
                    Error Details (Dev Only)
                  </summary>
                  <pre className='mt-2 max-h-40 overflow-auto whitespace-pre-wrap break-words rounded bg-gray-100 p-2 text-xs'>
                    {this.state.error.toString()}
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </details>
              )}
            </div>

            <div className='flex gap-2'>
              <button
                onClick={this.handleReset}
                className='flex-1 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700'
              >
                Try Again
              </button>

              <button
                onClick={this.handleReload}
                className='flex-1 rounded-md bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700'
              >
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
