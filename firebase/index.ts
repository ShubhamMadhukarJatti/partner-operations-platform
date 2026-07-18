import type { Auth, AuthError, AuthProvider, User } from 'firebase/auth'
import {
  GoogleAuthProvider,
  OAuthProvider,
  browserPopupRedirectResolver,
  getRedirectResult,
  signInWithPopup,
  signInWithRedirect,
  signOut,
  useDeviceLanguage
} from 'firebase/auth'

const CREDENTIAL_ALREADY_IN_USE_ERROR = 'auth/credential-already-in-use'
export const isCredentialAlreadyInUseError = (e: AuthError) =>
  e?.code === CREDENTIAL_ALREADY_IN_USE_ERROR

export const logout = async (auth: Auth): Promise<void> => {
  return signOut(auth)
}

export const getGoogleProvider = (auth: Auth) => {
  const provider = new GoogleAuthProvider()
  provider.addScope('profile')
  provider.addScope('email')
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useDeviceLanguage(auth)
  return provider
}

export const getLinkedInProvider = (auth: Auth) => {
  const provider = new OAuthProvider('oidc.linkedin') // use your Firebase OIDC provider ID
  provider.addScope('email')
  provider.addScope('openid')
  provider.addScope('profile')
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useDeviceLanguage(auth)
  return provider
}

/**
 * Legacy popup-based sign-in — kept for backward compatibility (login-form etc.)
 * Prefer loginWithProviderRedirect for new onboarding flows.
 */
export const loginWithProvider = async (
  auth: Auth,
  provider: AuthProvider
): Promise<User> => {
  const result = await signInWithPopup(auth, provider, browserPopupRedirectResolver)
  return result.user
}

/**
 * Redirect-based sign-in — no popup, works on all browsers.
 * After redirect back, call getOAuthRedirectResult() to get the user.
 */
export const loginWithProviderRedirect = async (
  auth: Auth,
  provider: AuthProvider
): Promise<void> => {
  await signInWithRedirect(auth, provider)
}

/**
 * Call this on page load to capture the result after OAuth redirect.
 * Returns null if no pending redirect result.
 */
export const getOAuthRedirectResult = async (
  auth: Auth
): Promise<User | null> => {
  const result = await getRedirectResult(auth)
  return result?.user ?? null
}
