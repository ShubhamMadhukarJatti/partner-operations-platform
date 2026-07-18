/**
 * Custom check for Next.js redirect errors.
 * Next.js redirect() throws a unique error with a `digest` starting with 'NEXT_REDIRECT;'.
 * Since this project uses Next.js 14.1.4, the official `isRedirectError` is not publicly
 * exported on 'next/navigation' yet, so we use this utility to avoid type resolution issues.
 */
export function isRedirectError(err: any): boolean {
  return !!(
    err &&
    typeof err === 'object' &&
    'digest' in err &&
    typeof err.digest === 'string' &&
    err.digest.startsWith('NEXT_REDIRECT;')
  )
}
