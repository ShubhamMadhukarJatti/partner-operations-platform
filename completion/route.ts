import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

function getOpenAIClient(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY environment variable is not configured')
  }
  return new OpenAI({ apiKey })
}

export const runtime = 'edge'

export async function POST(req: NextRequest) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      {
        error:
          'OpenAI API key is not configured. Please set OPENAI_API_KEY environment variable.'
      },
      { status: 500 }
    )
  }

  const { prompt } = await req.json()
  const openai = getOpenAIClient()
  const validationResponse = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL as string,
    messages: [
      {
        role: 'user',
        content: `A model that evaluates detailed proposals and determines, in the simplest terms, whether the proposal is legitimate or not. A proposal is considered legitimate if it adheres to platform guidelines, meaning it must be ethical, responsible, realistic, achievable, specific, and actionable. It should not be a general statement of intent, rely on unrealistic assumptions or expectations, nor violate any laws or ethical standards.

The response format should be as follows:

If the proposal is valid:
{
  "evaluateProposal": {
    "validResponse": "Generate a successful message that the current proposal is valid."
  }
}

If the proposal is invalid, your task is to give the output as described below:

{
  "evaluateProposal": {
    "invalidResponse": {
      "message": "This kind of partnership is not valid for any kind of partnership in our model.",
      "justification": "Explain why the proposal is not valid according to platform guidelines (ethical, responsible, realistic, achievable, specific, actionable) in one line.",
      "suggestions": "Provide specific recommendations to modify the proposal to make it valid."
    }
  }
}

        Proposal: ${prompt}
Output:\n`
      }
    ]
  })

  const validationResult = validationResponse.choices[0].message.content
  const isValid = validationResult?.includes('"validResponse":')

  let finalResponse = {
    valid: isValid,
    validationResult: isValid ? '' : JSON.parse(validationResult!),
    toneVariations: null
  }

  if (isValid) {
    const toneResponse = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL_TONE as string,
      messages: [
        {
          role: 'user',
          content: `
You are tasked with creating proposals in different tones. You will be provided with an input proposal, and your first step is to internally validate whether it is legitimate. If the proposal is not legitimate, revise it to create a legitimate version, and then generate a response based on the requirements below.

A proposal is considered legitimate if it adheres to platform guidelines, meaning it must be ethical, responsible, realistic, achievable, specific, and actionable. It should not be a general statement of intent, rely on unrealistic assumptions or expectations, nor violate any laws or ethical standards.

Your task is to generate the proposal in each of the following tones:

- Standard
- Fluency
- Natural
- Formal
- Academic
- Simple
- Creative
- Expanded
- Shortened

Format your response in JSON, where each tone is its own key. The values should represent the proposal written in that specific tone.

Example Format:

{
  "standard": "Your proposal in standard tone here",
  "fluency": "Your proposal in fluency tone here",
  "natural": "Your proposal in natural tone here",
  "formal": "Your proposal in formal tone here",
  "academic": "Your proposal in academic tone here",
  "simple": "Your proposal in simple tone here",
  "creative": "Your proposal in creative tone here",
  "expand": "Your expanded version of the proposal",
  "shorten": "Your shortened version of the proposal"
}

The context of the proposal will be provided by the user, and the suggestions from the evaluating LLM will be considered for any modifications if necessary.

Proposal : ${prompt}
Output:\n`
        }
      ]
    })

    finalResponse.toneVariations = JSON.parse(
      toneResponse.choices[0].message.content!
    )
  }

  return NextResponse.json(finalResponse)
}
