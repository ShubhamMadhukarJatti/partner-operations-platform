/**
 * Utility functions to detect and handle dummy/demo flow
 * This ensures dummy flow changes don't affect the main production flow
 */

/**
 * Check if we're in dummy flow mode
 * Dummy flow is active when:
 * 1. Partner ID starts with 'dummy-' (from DUMMY_PARTNERS_DATA)
 * 2. URL contains ?demo=true parameter
 * 3. Environment variable DEMO_MODE is set
 */
export const isDummyFlow = (partnerId?: string | number): boolean => {
  // Check environment variable
  if (typeof window !== 'undefined') {
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('demo') === 'true') {
      return true
    }
  }

  // Check if partner ID is a dummy ID
  if (partnerId) {
    const idString = String(partnerId)
    if (idString.startsWith('dummy-')) {
      return true
    }
  }

  // Check environment variable (server-side)
  if (process.env.DEMO_MODE === 'true') {
    return true
  }

  return false
}

/**
 * Check if current route is a dummy partner route
 */
export const isDummyPartnerRoute = (): boolean => {
  if (typeof window === 'undefined') return false

  const pathname = window.location.pathname
  // Check if path contains dummy partner IDs
  const dummyIds = ['dummy-1', 'dummy-2', 'dummy-3', 'dummy-4', 'dummy-5']
  return dummyIds.some((id) => pathname.includes(id))
}
