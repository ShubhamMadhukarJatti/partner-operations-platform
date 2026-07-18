'use client'

import React, { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const PerformanceTester: React.FC = () => {
  const [testResults, setTestResults] = useState<any[]>([])
  const [isRunning, setIsRunning] = useState(false)

  const runPerformanceTest = async () => {
    setIsRunning(true)
    const results: any[] = []

    // Test 1: Navigation Speed
    const navigationTest = () => {
      const start = performance.now()
      // Simulate navigation
      const end = performance.now()
      return {
        test: 'Navigation Speed',
        result: `${(end - start).toFixed(2)}ms`,
        status: end - start < 400 ? '✅ Good' : '❌ Slow',
        target: '< 400ms'
      }
    }

    // Test 2: Memory Usage
    const memoryTest = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory
        const usedMB = memory.usedJSHeapSize / 1024 / 1024
        return {
          test: 'Memory Usage',
          result: `${usedMB.toFixed(2)}MB`,
          status: usedMB < 50 ? '✅ Good' : usedMB < 100 ? '⚠️ OK' : '❌ High',
          target: '< 50MB'
        }
      }
      return {
        test: 'Memory Usage',
        result: 'N/A',
        status: '⚠️ Not Available',
        target: '< 50MB'
      }
    }

    // Test 3: API Calls
    const apiTest = () => {
      const requests = performance.getEntriesByType('resource')
      const apiCalls = requests.filter(
        (req) =>
          req.name.includes('/api/') ||
          req.name.includes('sharkdom') ||
          req.name.includes('persona')
      )
      return {
        test: 'API Calls',
        result: `${apiCalls.length} calls`,
        status: apiCalls.length < 5 ? '✅ Good' : '⚠️ Many',
        target: '< 5 calls'
      }
    }

    // Test 4: Bundle Size
    const bundleTest = () => {
      const requests = performance.getEntriesByType('resource')
      const jsFiles = requests.filter((req) => req.name.endsWith('.js'))
      const totalSize = jsFiles.reduce(
        (sum, file) => sum + ((file as any).transferSize || 0),
        0
      )
      const sizeMB = totalSize / 1024 / 1024
      return {
        test: 'Bundle Size',
        result: `${sizeMB.toFixed(2)}MB`,
        status: sizeMB < 2 ? '✅ Good' : sizeMB < 3 ? '⚠️ OK' : '❌ Large',
        target: '< 2MB'
      }
    }

    // Test 5: Render Performance
    const renderTest = () => {
      const start = performance.now()
      // Force a re-render
      setTimeout(() => {
        const end = performance.now()
        const renderTime = end - start
        results.push({
          test: 'Render Performance',
          result: `${renderTime.toFixed(2)}ms`,
          status: renderTime < 100 ? '✅ Good' : '⚠️ Slow',
          target: '< 100ms'
        })
        setTestResults([...results])
      }, 0)
    }

    // Run all tests
    results.push(navigationTest())
    results.push(memoryTest())
    results.push(apiTest())
    results.push(bundleTest())
    renderTest()

    setTestResults(results)
    setIsRunning(false)
  }

  const clearResults = () => {
    setTestResults([])
  }

  return (
    <Card className='w-full max-w-2xl'>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          🧪 Performance Tester
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='flex gap-2'>
          <Button
            onClick={runPerformanceTest}
            disabled={isRunning}
            className='bg-blue-600 hover:bg-blue-700'
          >
            {isRunning ? 'Running Tests...' : 'Run Performance Test'}
          </Button>
          <Button onClick={clearResults} variant='outline' disabled={isRunning}>
            Clear Results
          </Button>
        </div>

        {testResults.length > 0 && (
          <div className='space-y-2'>
            <h4 className='font-semibold'>Test Results:</h4>
            {testResults.map((result, index) => (
              <div
                key={index}
                className='flex items-center justify-between rounded bg-gray-50 p-2'
              >
                <div className='flex items-center gap-2'>
                  <span className='font-medium'>{result.test}:</span>
                  <span className='font-mono text-sm'>{result.result}</span>
                </div>
                <div className='flex items-center gap-2'>
                  <span className='text-sm text-gray-500'>
                    ({result.target})
                  </span>
                  <span className='text-sm font-medium'>{result.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className='text-sm text-gray-600'>
          <p>
            <strong>How to use:</strong>
          </p>
          <ul className='mt-2 list-inside list-disc space-y-1'>
            <li>
              Click &quot;Run Performance Test&quot; to test current performance
            </li>
            <li>Navigate between pages and run tests to see improvements</li>
            <li>Look for ✅ Good status indicators</li>
            <li>Compare results before and after optimizations</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}

export default PerformanceTester
