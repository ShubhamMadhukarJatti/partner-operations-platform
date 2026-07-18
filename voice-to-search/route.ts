import { OpenAIStream, StreamingTextResponse } from 'ai'
import OpenAI from 'openai'

function getOpenAIClient(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY environment variable is not configured')
  }
  return new OpenAI({ apiKey })
}

export const runtime = 'edge'

export async function POST(req: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return new Response(
      JSON.stringify({
        error:
          'OpenAI API key is not configured. Please set OPENAI_API_KEY environment variable.'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }

  const { prompt } = await req.json()
  const openai = getOpenAIClient()

  const response = await openai.chat.completions.create({
    model: process.env.OPEN_AI_SEARCH_MODEL_ID as string,
    stream: true,
    messages: [
      {
        role: 'system',
        content: `prompt = """ 
You will be provided with a transcript of an audio recording. Your task is to analyze the transcript and extract relevant information to categorize it into specific fields. Your output should be in JSON format, including the preferred sectors, categories, and subcategories.

Output Format:

[{"Preferred SECTORS": ["Sector1", "Sector2"]},
  {"Preferred Categories": ["Category1", "Category2"]},
  {"Preferred Sub Categories": ["SubCategory1", "SubCategory2"]}]


Fields to Extract:

1. SECTORS: 
   - Education
   - Medical
   - Tech
   - Agriculture
   - Restaurant
   - Software
   - Marketing
   - Business
   - Finance
   - Health tech
   - Manufacturing
   - Property
   - Media
   - Fashion
   - Transportation
   - Food
   - Entertainment

2. CATEGORIES:
   - STRATEGIC
   - TECHNOLOGY
   - CO-MARKETING
   - COMMUNITY
   - BRAND_LICENSING
   - SALES
   - SOCIAL

3. SUBCATEGORIES:
   - Web3
   - Blockchain
   - Marketing Consultant
   - Development Consultant
   - Marketplace
   - Logistics
   - Analytics
   - Insurance Tech
   - IoT
   - SAAS
   - Food Tech
   - AR/VR
   - Retail
   - GenAI
   - Property Management Software
   - Customer Experience Management (CXM)
   - Lending Platform
   - Digital Payment
   - Mental Health
   - Platform
   - Recycling Tech
   - Chatbot
   - Mobility as a Service
   - Supply Chain

Example Transcript:
"I'm actually looking for, what to say, a partner for my startup. So, like, I'm looking for, what to say, web three-way startups that, like, has something to do with, what to say, JNI and have a more younger audience, right? And, like, I want, what we are going to be offering is, what we are is actually, what to say, insights and analytics platform. So, like, all the web three, what to say, what to say, protocols or anything, they could, what to say, for voting, for having their, what to say, monitoring their votings, right? So, we could be the one, we could be the platform for them to, what to say, manage their insights, right? So, we are looking for these kind of partners."

Expected Output:
[{ "Preferred SECTORS": ["Tech", "Business"]},
  {"Preferred Categories": ["COMMUNITY", "TECHNOLOGY"]},
  {"Preferred Sub Categories": ["Web3", "Analytics"]}]


Analyze the transcript provided to generate a similar JSON output with appropriate sectors, categories, and subcategories.
"""`
      },
      {
        role: 'system',
        content: `${prompt}`
      }
    ]
  })
  const stream = await OpenAIStream(response as any)
  return new StreamingTextResponse(stream)
}
