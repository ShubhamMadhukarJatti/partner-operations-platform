/**
 * Example usage of the devOnly utility
 * This file shows how to use devOnly in different scenarios
 */

import React from 'react'

import { devOnly, useDevOnly } from './devOnly'

// Example 1: Using devOnly utility function
const ExampleComponent = () => {
  return (
    <div>
      <h1>My App</h1>

      {/* This will only render in development */}
      {devOnly(
        <div className='rounded border border-yellow-400 bg-yellow-100 p-4'>
          <p className='text-yellow-800'>🔧 Development Mode Only</p>
          <p className='text-sm text-yellow-600'>
            This debug panel only shows in dev
          </p>
        </div>
      )}

      {/* Regular content always shows */}
      <p>This content shows in all environments</p>
    </div>
  )
}

// Example 2: Using useDevOnly hook
const ExampleComponentWithHook = () => {
  const isDev = useDevOnly()

  return (
    <div>
      <h1>My App</h1>

      {/* Conditional rendering based on dev status */}
      {isDev && (
        <div className='rounded border border-blue-400 bg-blue-100 p-4'>
          <p className='text-blue-800'>🚀 Performance Monitor</p>
          <p className='text-sm text-blue-600'>Development tools active</p>
        </div>
      )}

      {/* Another way to conditionally render */}
      {isDev ? (
        <div className='rounded bg-green-100 p-2'>Debug mode: ON</div>
      ) : (
        <div className='rounded bg-gray-100 p-2'>Production mode</div>
      )}
    </div>
  )
}

// Example 3: Wrapping entire components
const DevOnlyButton = () => (
  <button className='rounded bg-red-500 px-4 py-2 text-white'>
    🔧 Dev Tools
  </button>
)

const MainApp = () => {
  return (
    <div>
      <h1>My Application</h1>

      {/* Wrap entire components */}
      {devOnly(<DevOnlyButton />)}

      {/* Or use the hook for more complex logic */}
      <ExampleComponentWithHook />
    </div>
  )
}

export { ExampleComponent, ExampleComponentWithHook, MainApp }
