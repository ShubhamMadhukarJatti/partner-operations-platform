import { getApp, getApps, initializeApp } from 'firebase/app'
import { connectAuthEmulator, getAuth } from 'firebase/auth'
import { Tokens } from 'next-firebase-auth-edge'
import { filterStandardClaims } from 'next-firebase-auth-edge/lib/auth/claims'

import { User } from '@/lib/firebase/auth/context'

import { clientConfig } from '../config/client-config'

export const getFirebaseApp = () => {
  if (getApps().length) {
    return getApp()
  }

  const app = initializeApp(clientConfig)

  return app
}

export const mapTokensToUser = ({ decodedToken }: Tokens): User => {
  const {
    uid,
    email,
    picture: photoURL,
    email_verified: emailVerified,
    phone_number: phoneNumber,
    name: displayName
  } = decodedToken

  const customClaims = filterStandardClaims(decodedToken)

  return {
    uid,
    email: email ?? null,
    displayName: displayName ?? null,
    photoURL: photoURL ?? null,
    phoneNumber: phoneNumber ?? null,
    emailVerified: emailVerified ?? false,
    customClaims
  }
}

export function getFirebaseAuth() {
  const auth = getAuth(getFirebaseApp())

  if (process.env.NEXT_PUBLIC_EMULATOR_HOST) {
    // https://stackoverflow.com/questions/73605307/firebase-auth-emulator-fails-intermittently-with-auth-emulator-config-failed
    ;(auth as unknown as any)._canInitEmulator = true
    connectAuthEmulator(auth, process.env.NEXT_PUBLIC_EMULATOR_HOST, {
      disableWarnings: true
    })
  }

  return auth
}
