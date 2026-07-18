import { NextResponse } from 'next/server'

export async function GET() {
  const envVars = {
    SHARKDOM_API_URL: process.env.SHARKDOM_API_URL,
    NODE_ENV: process.env.NODE_ENV,
    hasSharkdomUrl: !!process.env.SHARKDOM_API_URL
  }

  console.log('Environment check:', envVars)

  return NextResponse.json({
    message: 'Environment variables check',
    data: envVars
  })
}
