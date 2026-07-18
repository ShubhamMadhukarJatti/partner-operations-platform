import { NextResponse } from 'next/server'

interface RequestBody {
  prompt: string
}

interface ApiResponse {
  data: JSON[]
  message: string
  status: number
}
export async function POST(req: Request): Promise<NextResponse> {
  try {
    const { prompt } = (await req.json()) as unknown as RequestBody

    const data = {
      sentence: prompt
    }

    const response = await fetch(
      'https://sharkdom-model.azurewebsites.net/evaluate',
      {
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(data)
      }
    )

    if (response.ok) {
      const graph = await response.json()

      const jsonReady = graph.evaluation
        .replace(/'/g, '"') // single to double quotes
        .replace(/\bTrue\b/g, 'true') // fix Python-style booleans
        .replace(/\bFalse\b/g, 'false')

      console.log(graph)
      const apiResponse: ApiResponse = {
        data: JSON.parse(jsonReady),
        message: 'Stats Fetched Successfully',
        status: 200
      }

      return NextResponse.json(apiResponse)
    } else {
      return NextResponse.json(
        {
          message: 'Failed to fetch data',
          status: response.status
        },
        { status: response.status }
      )
    }
  } catch (err: unknown) {
    console.log(`Error`, err)

    return NextResponse.json(
      {
        message: 'Internal Server Error',
        status: 500
      },
      { status: 500 }
    )
  }
}
