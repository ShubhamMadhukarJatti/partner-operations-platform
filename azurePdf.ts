const { BlobServiceClient } = require('@azure/storage-blob')

const accountName = process.env.NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_NAME
const containerName = process.env.NEXT_PUBLIC_AZURE_STORAGE_CONTAINER_NAME
const sasToken = process.env.NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_KEY

function extractBlobName(url: string): string | null {
  const regex = /https:\/\/[^\/]+\/[^\/]+\/(.+)/
  const match = url.match(regex)
  if (match && match[1]) {
    // Decode the URI component to handle cases where characters are percent-encoded
    return decodeURIComponent(match[1])
  }
  return null
}

export async function getAzurePdf(pdfUrl: string) {
  const blobServiceClient = new BlobServiceClient(
    `https://${accountName}.blob.core.windows.net?${sasToken}`
  )

  const containerClient = blobServiceClient.getContainerClient(containerName)
  const blobClient = containerClient.getBlobClient(pdfUrl)
  // const blobClient = containerClient.getBlobClient(extractBlobName(pdfUrl))

  const downloadBlockBlobResponse = await blobClient.download()

  const downloaded = await downloadBlockBlobResponse.blobBody

  return downloaded
}
