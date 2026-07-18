import { NextRequest, NextResponse } from 'next/server'

import { getServerUser } from '@/lib/server'

// Configure maxDuration for Vercel (up to 60 seconds for Pro plans)
export const maxDuration = 60
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    console.log('Document extraction API called')

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      console.log('No file provided in request')
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    console.log('File received:', {
      name: file.name,
      size: file.size,
      type: file.type
    })

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]

    if (!allowedTypes.includes(file.type)) {
      console.log('Invalid file type:', file.type)
      return NextResponse.json(
        {
          error: 'Invalid file type. Only PDF, DOC, and DOCX files are allowed.'
        },
        { status: 400 }
      )
    }

    // Get authentication token
    const { token } = await getServerUser()
    if (!token) {
      console.log('No authentication token found')
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Create FormData for the external API
    const externalFormData = new FormData()
    externalFormData.append('file', file)

    // Call the backend document extraction API
    const backendApiUrl = `${process.env.SHARKDOM_API_URL}/api/docfetcher/extract-agreement`
    console.log('Calling backend API:', backendApiUrl)

    const response = await fetch(backendApiUrl, {
      method: 'POST',
      headers: {
        // Don't set Content-Type for FormData - let fetch set it with boundary
        Authorization: `Bearer ${token}`
      },
      body: externalFormData,
      // Add timeout for the external API call
      signal: AbortSignal.timeout(55000) // 55 seconds to stay under the 60-second limit
    })

    console.log('Backend API response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Backend API error:', response.status, errorText)
      throw new Error(
        `Backend API error: ${response.status} ${response.statusText} - ${errorText}`
      )
    }

    const data = await response.json()
    console.log('Document extraction successful')
    console.log(
      'Backend API response data structure:',
      JSON.stringify(data, null, 2)
    )

    return NextResponse.json({
      status: 'success',
      data: data
    })
  } catch (error: any) {
    console.error('Document extraction error:', error)

    // Handle timeout errors specifically
    if (error.name === 'TimeoutError' || error.message.includes('timeout')) {
      console.log('Request timed out')
      return NextResponse.json(
        {
          error:
            'Document processing timed out. Please try again with a smaller file or contact support.',
          status: 'timeout'
        },
        { status: 408 }
      )
    }

    // Handle authentication errors
    if (
      error.message.includes('Authentication required') ||
      error.message.includes('401')
    ) {
      return NextResponse.json(
        {
          error: 'Authentication failed. Please log in again.',
          status: 'auth_error'
        },
        { status: 401 }
      )
    }

    return NextResponse.json(
      {
        error: 'Failed to process document',
        details: error.message,
        status: 'error'
      },
      { status: 500 }
    )
  }
}
