import { FirebaseApp, getApp, getApps, initializeApp } from 'firebase/app'
import { Auth, getAuth } from 'firebase/auth'
import { Firestore, getFirestore } from 'firebase/firestore'

function getFirebaseConfig() {
  const apiKey = process.env.NEXT_PUBLIC_SHARANAGATI_FIREBASE_API_KEY
  const authDomain = process.env.NEXT_PUBLIC_SHARANAGATI_FIREBASE_AUTH_DOMAIN
  const storageBucket =
    process.env.NEXT_PUBLIC_SHARANAGATI_FIREBASE_STORAGE_BUCKET
  const projectId = process.env.NEXT_PUBLIC_SHARANAGATI_FIREBASE_PROJECT_ID
  const appId = process.env.NEXT_PUBLIC_SHARANAGATI_FIREBASE_APP_ID
  const measurementId = process.env.NEXT_PUBLIC_SHARANAGATI_MEASUREMENT_ID
  const messagingSenderId = process.env.NEXT_PUBLIC_SHARANAGATI_MESSAGING_ID

  if (!apiKey || !authDomain || !projectId) {
    if (typeof window === 'undefined') {
      return null
    }
    throw new Error(
      'Firebase configuration is missing. Please set required environment variables.'
    )
  }

  return {
    apiKey,
    authDomain,
    storageBucket: storageBucket || '',
    projectId,
    appId: appId || '',
    measurementId: measurementId || '',
    messagingSenderId: messagingSenderId || ''
  }
}

let appInstance: FirebaseApp | null = null
let authInstance: Auth | null = null
let dbInstance: Firestore | null = null

function getFirebaseApp(): FirebaseApp | null {
  if (appInstance) {
    return appInstance
  }

  const config = getFirebaseConfig()
  if (!config) {
    return null
  }

  try {
    appInstance = !getApps().length ? initializeApp(config) : getApp()
    return appInstance
  } catch (error) {
    if (typeof window === 'undefined') {
      return null
    }
    throw error
  }
}

function getFirebaseAuth(): Auth | null {
  if (authInstance) {
    return authInstance
  }
  const app = getFirebaseApp()
  if (!app) return null
  try {
    authInstance = getAuth(app)
    return authInstance
  } catch (error) {
    if (typeof window === 'undefined') {
      return null
    }
    throw error
  }
}

function getFirebaseDb(): Firestore | null {
  if (dbInstance) {
    return dbInstance
  }
  const app = getFirebaseApp()
  if (!app) return null
  try {
    dbInstance = getFirestore(app)
    return dbInstance
  } catch (error) {
    if (typeof window === 'undefined') {
      return null
    }
    throw error
  }
}

export const app = getFirebaseApp()
export const auth = getFirebaseAuth()
export const db = getFirebaseDb()
