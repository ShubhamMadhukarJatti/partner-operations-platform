const ZOHO_ACCOUNTS_BASE_CACHE_KEY = 'sharkdom.zohoAccountsBase'

let cachedZohoAccountsBase: string | null = null
let inFlightZohoAccountsBase: Promise<string> | null = null

function accountsBaseFromCountry(country?: string | null) {
  return country?.toUpperCase() === 'IN'
    ? 'https://accounts.zoho.in'
    : 'https://accounts.zoho.com'
}

export async function getZohoAccountsBase(): Promise<string> {
  if (cachedZohoAccountsBase) return cachedZohoAccountsBase

  // Try localStorage cache (client-only).
  if (typeof window !== 'undefined') {
    try {
      const stored = window.localStorage.getItem(ZOHO_ACCOUNTS_BASE_CACHE_KEY)
      if (stored) {
        cachedZohoAccountsBase = stored
        return stored
      }
    } catch {
      // ignore
    }
  }

  if (inFlightZohoAccountsBase) return inFlightZohoAccountsBase

  inFlightZohoAccountsBase = (async () => {
    const token = process.env.NEXT_PUBLIC_IPINFO_TOKEN
    if (!token) return accountsBaseFromCountry(null)

    try {
      const res = await fetch(`https://ipinfo.io/json?token=${token}`)
      const data = await res.json()
      const base = accountsBaseFromCountry(data?.country)

      cachedZohoAccountsBase = base
      if (typeof window !== 'undefined') {
        try {
          window.localStorage.setItem(ZOHO_ACCOUNTS_BASE_CACHE_KEY, base)
        } catch {
          // ignore
        }
      }

      return base
    } catch {
      return accountsBaseFromCountry(null)
    } finally {
      inFlightZohoAccountsBase = null
    }
  })()

  return inFlightZohoAccountsBase
}
