export type PricingRegion = 'India' | 'US'
export const DEFAULT_PRICING_REGION: PricingRegion = 'US'

/** URL prefix locales from middleware (e.g. /en-us/pricing) → pricing/footer region */
export const LOCALE_TO_PRICING_REGION = {
  'en-us': 'US',
  'en-in': 'India',
  'hi-in': 'India'
} as const satisfies Record<string, PricingRegion>

/** Resolve region when user explicitly chose a locale path (overrides geo/IP). */
export function pricingRegionFromLocalePrefix(
  locale: string | null | undefined
): PricingRegion | undefined {
  if (!locale?.trim()) return undefined
  const key = locale.trim().toLowerCase()
  return LOCALE_TO_PRICING_REGION[key as keyof typeof LOCALE_TO_PRICING_REGION]
}

/** Header set by middleware on locale-prefixed rewrites so layouts match pricing. */
export const MARKETING_LOCALE_HEADER = 'x-sharkdom-marketing-locale'

type DetectPricingRegionOptions = {
  allowIpLookup?: boolean
}

const INVALID_COUNTRY_CODES = new Set(['XX', 'T1'])
const LOCAL_IPS = new Set(['127.0.0.1', '::1', 'localhost'])

function countryCodeToRegion(
  countryCode?: string | null
): PricingRegion | null {
  const normalizedCountryCode = countryCode?.trim().toUpperCase()

  if (
    !normalizedCountryCode ||
    INVALID_COUNTRY_CODES.has(normalizedCountryCode)
  ) {
    return null
  }

  return normalizedCountryCode === 'IN' ? 'India' : 'US'
}

function acceptLanguageToRegion(
  acceptLanguage?: string | null
): PricingRegion | null {
  if (!acceptLanguage) {
    return null
  }

  const localeMatches = acceptLanguage.matchAll(
    /\b[a-z]{2,3}-(?<country>[a-z]{2})\b/gi
  )

  for (const localeMatch of localeMatches) {
    const region = countryCodeToRegion(localeMatch.groups?.country ?? null)
    if (region) {
      return region
    }
  }

  return null
}

function getClientIp(headersList: Headers): string | null {
  const ipCandidates = [
    headersList.get('x-forwarded-for'),
    headersList.get('x-real-ip'),
    headersList.get('cf-connecting-ip')
  ]

  for (const candidate of ipCandidates) {
    if (!candidate) continue

    const normalizedCandidate = candidate.split(',')[0]?.trim()
    if (!normalizedCandidate) continue

    const cleanedIp = normalizedCandidate.startsWith('::ffff:')
      ? normalizedCandidate.slice(7)
      : normalizedCandidate

    if (LOCAL_IPS.has(cleanedIp)) {
      return null
    }

    return cleanedIp
  }

  return null
}

async function lookupCountryCodeByIp(
  ipAddress: string
): Promise<string | null> {
  const ipinfoToken = process.env.NEXT_PUBLIC_IPINFO_TOKEN

  if (ipinfoToken) {
    const ipinfoResponse = await fetch(
      `https://ipinfo.io/${encodeURIComponent(ipAddress)}/json?token=${ipinfoToken}`,
      {
        cache: 'no-store'
      }
    )

    if (ipinfoResponse.ok) {
      const ipinfoData = await ipinfoResponse.json()
      return ipinfoData.country ?? null
    }
  }

  const ipApiResponse = await fetch(
    `http://ip-api.com/json/${encodeURIComponent(ipAddress)}?fields=status,countryCode`,
    {
      cache: 'no-store'
    }
  )

  if (!ipApiResponse.ok) {
    return null
  }

  const ipApiData = await ipApiResponse.json()
  if (ipApiData.status !== 'success') {
    return null
  }

  return ipApiData.countryCode ?? null
}

export async function detectPricingRegion(
  headersList: Headers,
  options: DetectPricingRegionOptions = {}
): Promise<PricingRegion | null> {
  const { allowIpLookup = true } = options

  const headerCountryCode =
    headersList.get('x-vercel-ip-country') ||
    headersList.get('cf-ipcountry') ||
    headersList.get('cloudfront-viewer-country')

  const headerRegion = countryCodeToRegion(headerCountryCode)
  if (headerRegion) {
    return headerRegion
  }

  const acceptLanguageRegion = acceptLanguageToRegion(
    headersList.get('accept-language')
  )
  if (acceptLanguageRegion) {
    return acceptLanguageRegion
  }

  if (!allowIpLookup) {
    return null
  }

  const clientIp = getClientIp(headersList)
  if (!clientIp) {
    return null
  }

  try {
    const countryCode = await lookupCountryCodeByIp(clientIp)
    return countryCodeToRegion(countryCode)
  } catch (error) {
    console.warn('Failed to detect pricing region from IP lookup:', error)
    return null
  }
}
