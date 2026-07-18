import { NextResponse } from 'next/server'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const file = searchParams.get('file')!
    const fileType = searchParams.get('fileType')!
    const folder = searchParams.get('folder') || 'logos'

    const client = new S3Client({
      region: process.env.S3_REGION!,
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY!,
        secretAccessKey: process.env.S3_SECRET_KEY!
      }
    })

    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: `${folder}/${file}`,
      ContentType: fileType
    })

    const url = await getSignedUrl(client, command, { expiresIn: 60 })

    // Set cache control headers to disable caching
    const headers = {
      'Cache-Control': 'no-store, max-age=0'
    }

    return NextResponse.json({ url }, { status: 200, headers })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.error()
  }
}
