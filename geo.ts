/**
 * Cached geo-location detection via IP.
 * Makes ONE network call and caches the result for all consumers.
 *
 * Returns { countryCode, currency } or null on failure.
 */

type GeoResult = {
  countryCode: string // e.g. 'IN', 'US', 'GB'
  currency: 'INR' | 'USD'
}

let cachedResult: GeoResult | null = null
let fetchPromise: Promise<GeoResult | null> | null = null

async function fetchGeo(): Promise<GeoResult | null> {
  // Try primary API
  try {
    const res = await fetch('https://ipapi.co/json/', { cache: 'force-cache' })
    if (res.ok) {
      const data = await res.json()
      if (data?.country_code) {
        return {
          countryCode: data.country_code,
          currency: data.country_code === 'IN' ? 'INR' : 'USD'
        }
      }
    }
  } catch {
    // Primary failed, try fallback
  }

  // Fallback API (ip-api.com — no API key needed, 45 req/min)
  try {
    const res = await fetch('http://ip-api.com/json/?fields=countryCode')
    if (res.ok) {
      const data = await res.json()
      if (data?.countryCode) {
        return {
          countryCode: data.countryCode,
          currency: data.countryCode === 'IN' ? 'INR' : 'USD'
        }
      }
    }
  } catch {
    // Both failed
  }

  return null
}

/**
 * Get user's geo-location based on IP address.
 * Caches the result so only ONE network call is made across the entire app.
 */
export async function getUserGeo(): Promise<GeoResult | null> {
  if (cachedResult) return cachedResult

  // Deduplicate concurrent calls — only one fetch runs
  if (!fetchPromise) {
    fetchPromise = fetchGeo().then((result) => {
      cachedResult = result
      fetchPromise = null
      return result
    })
  }

  return fetchPromise
}
