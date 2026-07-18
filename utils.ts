import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getBaseUrl() {
  if (typeof window !== 'undefined') {
    // In the browser, we return a relative URL
    return ''
  }
  // When rendering on the server, we return an absolute URL

  // reference for vercel.com
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }

  // assume localhost
  return `http://localhost:${process.env.PORT ?? 3000}`
}

// wait for a given number of milliseconds
export function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const fetcher = (params: Parameters<typeof fetch>) => {
  const [url, options] = params
  return fetch(url, options).then((res) => res.json())
}

export function getGoogleSheetIdFromUrl(url: string): string | null {
  const regex = /\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/
  const match = url.match(regex)
  return match ? match[1] : null
}

export function getUniqueValuesFromObject(obj: { [key: string]: any }): any[] {
  // Extract all values from the object
  const values = Object.values(obj)

  // Use a Set to get unique values
  const uniqueValues = Array.from(new Set(values))

  return uniqueValues
}

export function calculateDateDifference(dateString: string): number {
  const inputDate = new Date(dateString)

  const today = new Date()

  today.setHours(0, 0, 0, 0)
  inputDate.setHours(0, 0, 0, 0)

  const diffInMilliseconds = inputDate.getTime() - today.getTime()

  const diffInDays = Math.abs(
    Math.round(diffInMilliseconds / (1000 * 60 * 60 * 24))
  )

  return diffInDays
}

export function generateSecureRandomString(length = 32) {
  const array = new Uint8Array(length)
  crypto.getRandomValues(array)
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join(
    ''
  )
}

export function convertFileToBinary(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = function (event) {
      if (!event.target) return
      const binaryData = event.target.result
      resolve(binaryData)
    }

    reader.onerror = function (error) {
      reject(error)
    }

    reader.readAsArrayBuffer(file)
  })
}

export const isValidEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}
