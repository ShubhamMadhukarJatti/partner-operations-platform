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
    model: 'ft:gpt-3.5-turbo-0125:sharko::9ah9XSrF',
    stream: true,
    messages: [
      {
        role: 'system',
        content: `You will be provided with input about two startups, including the following details: - ABOUT: Description of the startup.
- MARKET SEGMENT: Whether the company operates in B2B (Business to Business) or B2C (Business to Consumer) or other.
- PREFERENCES: Any specific preferences regarding partnerships. - SECTOR: The sector in which the startup operates.
Based on the provided information, determine the most likely types of partnerships between the two startups. You should identify the types of partnerships from the following categories:
0. TECHNOLOGY
1. CO-MARKETING
2. STRATEGIC
3. COMMUNITY
4. BRAND_LICENSING 5. SALES
6. SOCIAL
For each type of partnership, provide a percentage likelihood. The response should be formatted as a list of dictionaries, where each dictionary contains:
- type: The type of partnership, represented by an integer (0 for TECHNOLOGY, 1 for CO-MARKETING, 2 for STRATEGIC, 3 for COMMUNITY, 4 for BRAND_LICENSING, 5 for SALES, 6 for SOCIAL).
- percentage: The likelihood of this type of partnership, represented as a percentage.
- is_potential_lead_customer: Whether the startup is a potential lead or customer.
- can_be_marketing_ally: Whether the startup can be a marketing ally.
- can_be_used_to_onboard_new_users: Whether the startup can be used to onboard new users.
- can_help_in_improving_our_brands_image: Whether the startup can help in improving our brand's image.
- can_help_my_customers: Whether the startup can help our customers.
Ensure the types of partnerships are listed in descending order of their likelihood, with the type having the highest percentage listed first.
NOTE: The boolean values for can_be_marketing_ally, can_be_used_to_onboard_new_users, and can_help_in_improving_our_brands_image should be true if there is any possibility, and false only in the worst case where the answer is definitively negative.
The output format should be like this:

[
{{"type": x, "percentage": y}},
// where x is the type and y is the percentage
// similarly for other 6 types {{"is_potential_lead_customer": boolean_value}}, {{"can_be_marketing_ally": boolean_value}},
{{"can_be_used_to_onboard_new_users": boolean_value}}, {{"can_help_in_improving_our_brands_image": boolean_value}}, {{"can_help_my_customers": boolean_value}}
] 
`
      },
      {
        role: 'user',
        content: `${prompt}`
      }
    ]
  })
  const stream = OpenAIStream(response as any)
  return new StreamingTextResponse(stream)
}
