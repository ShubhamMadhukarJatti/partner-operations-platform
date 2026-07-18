'use server'

import fs from 'fs'
import { Readable } from 'stream'
import OpenAI from 'openai'

function getOpenAIClient(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY environment variable is not configured')
  }
  return new OpenAI({ apiKey })
}

export async function POST(req: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return new Response(
        'OpenAI API key is not configured. Please set OPENAI_API_KEY environment variable.',
        { status: 500 }
      )
    }

    const formData = await req.formData()
    const file = formData.get('audio') as File

    if (!file) {
      return new Response('No audio file provided', { status: 400 })
    }

    const supportedFormats = [
      'audio/flac',
      'audio/m4a',
      'audio/mp3',
      'audio/mp4',
      'audio/mpeg',
      'audio/mpga',
      'audio/oga',
      'audio/ogg',
      'audio/wav',
      'audio/webm'
    ]

    if (!supportedFormats.includes(file.type)) {
      return new Response(
        `Unsupported file format. Supported formats are: ${supportedFormats.join(', ')}`,
        { status: 400 }
      )
    }

    const buffer = await file.arrayBuffer()
    const stream = Readable.from(Buffer.from(buffer))
    const tempFilePath = `/tmp/uploaded-audio.${file.type.split('/')[1]}`
    const tempFile = fs.createWriteStream(tempFilePath)
    stream.pipe(tempFile)

    await new Promise<void>((resolve, reject) => {
      tempFile.on('finish', () => resolve())
      tempFile.on('error', reject)
    })

    const openai = getOpenAIClient()
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(tempFilePath),
      model: 'whisper-1'
    })

    fs.unlinkSync(tempFilePath)

    console.log(transcription?.text)

    return new Response(transcription?.text || 'No transcription text', {
      status: 200
    })
  } catch (error) {
    console.error(error)
    return new Response('Internal Server Error', { status: 500 })
  }
}
