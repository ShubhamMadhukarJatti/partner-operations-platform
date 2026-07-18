import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const error = url.searchParams.get('error')
  const source = url.searchParams.get('source')
  const partnerId = url.searchParams.get('partnerId')

  if (error) {
    // Handle errors if the user denies permissions
    const redirectPath =
      source === 'partnership' && partnerId
        ? `/offline-partners/partnership/${partnerId}?error=access_denied`
        : `/integrations?error=access_denied`
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}${redirectPath}`
    )
  }

  // For Trello, the token comes in the URL fragment (hash)
  // We need to handle this on the frontend since server-side can't access fragments
  const redirectPath =
    source === 'partnership' && partnerId
      ? `/offline-partners/partnership/${partnerId}?trello_callback=true`
      : `/integrations?trello_callback=true`

  return NextResponse.redirect(
    `${process.env.NEXT_PUBLIC_BASE_URL}${redirectPath}`
  )
}
