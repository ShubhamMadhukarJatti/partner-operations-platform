import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'

const s3Client = new S3Client({
  region: process.env.S3_REGION!,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY!,
    secretAccessKey: process.env.S3_SECRET_KEY!
  }
})

type UploadFilesToS3Props = {
  file: File
  fileName: string
}

const uploadFilesToS3 = async ({ file, fileName }: UploadFilesToS3Props) => {
  const buffer = Buffer.from(await file.arrayBuffer())

  const params = {
    Bucket: process.env.S3_BUCKET_NAME!,
    Key: `${fileName}`,
    Body: buffer,
    ContentType: file.type
  }
  const command = new PutObjectCommand(params)

  try {
    await s3Client.send(command)
    return fileName
  } catch (error) {
    console.error('Error uploading file', error)
    throw new Error('Error uploading file')
  }
}

type Props = {
  id: string
  file: File
  folder?: string
}

export const uploadFile = async ({ id, file, folder }: Props) => {
  const folderName = folder ? `${folder}` : 'logos'

  try {
    if (file.size === 0) {
      return { status: 'error', message: 'Please upload a file' }
    }

    const fileName = `${folderName}/${id}`
    await uploadFilesToS3({ file, fileName })
  } catch (err) {
    console.error('Error uploading file', err)
    throw new Error('Error uploading file')
  }
}
