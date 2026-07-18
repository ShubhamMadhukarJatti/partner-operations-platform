// import { NextResponse, userAgent } from 'next/server'

// import { getCurrentOrganization } from '@/lib/db/organization'
// import { getServerUser } from '@/lib/server'

// export async function GET(req: Request) {
//   const url = new URL(req.url)
//   const code = url.searchParams.get('code')

//   console.log(code, `slack code from url`)

//   // const { user, token } = await getServerUser()

//   // const org = await getCurrentOrganization()

//   if (!code) {
//     // return NextResponse.json(
//     //   { error: 'Missing code parameter' },
//     //   { status: 400 }
//     // )
//     return NextResponse.redirect(
//       `https://slack.com/oauth/v2/authorize?client_id=${process.env.NEXT_PUBLIC_SLACK_CLIENT_ID}&scope=commands,chat:write&redirect_uri=${process.env.NEXT_PUBLIC_SLACK_REDIRECT_URL}`,
//       302
//     )
//   }

//   try {
//     // Exchange the authorization code for an access token
//     const response = await fetch('https://slack.com/api/oauth.v2.access', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/x-www-form-urlencoded'
//       },
//       body: new URLSearchParams({
//         client_id: process.env.NEXT_PUBLIC_SLACK_CLIENT_ID || '',
//         client_secret: process.env.SLACK_CLIENT_SECRET || '',
//         code: code,
//         redirect_uri: process.env.NEXT_PUBLIC_SLACK_REDIRECT_URL || ''
//       })
//     })

//     const data = await response.json()

//     console.log(data, `acccess token slack data`)

//     if (!data.ok) {
//       throw new Error(data.error || 'Failed to fetch access token')
//     }

//     console.log('Slack OAuth Success:', data)
//     const { access_token, team, authed_user } = data

//     // Save the access token to your backend

//     // const updatePayload = {
//     //   organizationId: org.id,
//     //   refreshToken: access_token,
//     //   integrationType: 'SLACK',
//     //   userId: user?.uid
//     // }

//     // const backendResponse = await fetch(
//     //   `${process.env.SHARKDOM_API_URL}/user/slack/token`,
//     //   {
//     //     headers: {
//     //       Authorization: `Bearer ${token}`,
//     //       'Content-Type': 'application/json'
//     //     },

//     //     method: 'POST',
//     //     body: JSON.stringify(updatePayload)
//     //   }
//     // )
//     // if (!backendResponse.ok) {
//     //   const errorResponse = await backendResponse.json()
//     //   return NextResponse.json(
//     //     { errorResponse, access_token, user },
//     //     { status: 500 }
//     //   )
//     // }
//     return NextResponse.redirect(
//       'https://sharkdom.com/integrations?app=SLACK',
//       302
//     )
//   } catch (error: any) {
//     console.error('Slack OAuth Error:', error.message)

//     // return NextResponse.json({ error: error.message }, { status: 500 })
//     return NextResponse.redirect(
//       `https://slack.com/oauth/v2/authorize?client_id=${process.env.NEXT_PUBLIC_SLACK_CLIENT_ID}&scope=commands,chat:write&redirect_uri=${process.env.NEXT_PUBLIC_SLACK_REDIRECT_URL}`,
//       302
//     )
//   }
// }

// File: /app/api/slack/route.ts
import { NextResponse } from 'next/server'

import { generateSecureRandomString } from '@/lib/utils'

export async function GET() {
  const slackOAuthURL = new URL('https://slack.com/oauth/v2/authorize')
  const slackScopes = 'channels:read,chat:write,chat:write.public'
  const userScopes = ''
  slackOAuthURL.searchParams.set(
    'client_id',
    process.env.NEXT_PUBLIC_SLACK_CLIENT_ID || ''
  )
  slackOAuthURL.searchParams.set('scope', slackScopes)
  // slackOAuthURL.searchParams.set('user_scope', userScopes)
  slackOAuthURL.searchParams.set(
    'redirect_uri',
    process.env.NEXT_PUBLIC_SLACK_REDIRECT_URL || ''
  )
  slackOAuthURL.searchParams.set('state', generateSecureRandomString())

  return NextResponse.redirect(slackOAuthURL.toString(), 302)
}
