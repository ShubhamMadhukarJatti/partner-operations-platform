export const serverConfig = {
  useSecureCookies: process.env.USE_SECURE_COOKIES === 'true',
  firebaseApiKey: process.env.FIREBASE_API_KEY!,
  secretCurrent: process.env.FIREBASE_SECRET_CURRENT!,
  secretPrevious: process.env.FIREBASE_SECRET_PREVIOUS!,
  serviceAccount: {
    projectId: process.env.FIREBASE_PROJECT_ID!,
    clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL!,
    privateKey: (process.env.FIREBASE_ADMIN_PRIVATE_KEY || '').replace(
      /\\n/g,
      '\n'
    )
  }
}

export const authConfig = {
  apiKey: serverConfig.firebaseApiKey,
  cookieName: 'AuthToken',
  cookieSignatureKeys: [
    serverConfig.secretCurrent,
    serverConfig.secretPrevious
  ],
  cookieSerializeOptions: {
    path: '/',
    httpOnly: true,
    secure: serverConfig.useSecureCookies, // Set this to true on HTTPS environments
    sameSite: 'lax' as const,
    maxAge: 12 * 60 * 60 * 24 // 12 days
  },
  serviceAccount: serverConfig.serviceAccount
}
