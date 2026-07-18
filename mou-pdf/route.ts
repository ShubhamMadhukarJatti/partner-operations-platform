// /app/api/getPdf/route.ts

import { NextResponse } from 'next/server'
import { BlobServiceClient } from '@azure/storage-blob'

export async function POST(req: Request) {
  const body = await req.json()

  const { pdfUrl } = body

  const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME
  const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME
  const sasToken = process.env.AZURE_STORAGE_ACCOUNT_KEY

  if (!accountName || !containerName || !sasToken) {
    return NextResponse.json(
      { error: 'Azure storage credentials are missing' },
      { status: 500 }
    )
  }
  //   https://mous.blob.core.windows.net/mous-pdf/Demo%20AccountsXWickerai_2024-11-09_85672.pdf
  const pdfPath = pdfUrl.split('/mous-pdf/')[1]

  try {
    const blobServiceClient = new BlobServiceClient(
      `https://${accountName}.blob.core.windows.net?${sasToken}`
    )
    const containerClient = blobServiceClient.getContainerClient(containerName)

    console.log(pdfPath)
    const blobClient = containerClient.getBlobClient(
      'Demo AccountsXWickerai_2024-11-09_85672.pdf'
    )

    const downloadBlockBlobResponse = await blobClient.download()

    const downloaded = await (
      await downloadBlockBlobResponse.blobBody
    )?.arrayBuffer()

    return new NextResponse(downloaded, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline; filename="your-pdf-file.pdf"'
      }
    })
  } catch (error) {
    console.error('Error fetching PDF:', error)
    return NextResponse.json({ error: 'Error fetching PDF' }, { status: 500 })
  }
}

// Helper function to convert a stream to a buffer
async function blobToString(blob: Blob): Promise<string> {
  const fileReader = new FileReader()
  return new Promise<string>((resolve, reject) => {
    fileReader.onloadend = (ev) => {
      if (ev.target) {
        resolve(ev.target.result as string)
      } else {
        reject(new Error('Failed to read blob'))
      }
    }
    fileReader.onerror = reject
    fileReader.readAsText(blob)
  })
}
