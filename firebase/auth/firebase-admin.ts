// import { initFirestore } from '@auth/firebase-adapter'
// import admin from 'firebase-admin'
// import { cert, getApps, initializeApp } from 'firebase-admin/app'

// let app

// // Initialize the Firebase Admin SDK if not already initialized
// if (!getApps().length) {
//   app = initializeApp({
//     credential: cert({
//       projectId: process.env.FIREBASE_PROJECT_ID,
//       clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
//       privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY!.replace(/\\n/g, '\n') // Handle newline issues
//     })
//   })
// }

// const adminDb = initFirestore({
//   credential: admin.credential.cert({
//     projectId: process.env.FIREBASE_PROJECT_ID,
//     clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
//     privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY!.replace(/\\n/g, '\n')
//   })
// })

// export { adminDb }

// import { initFirestore } from '@auth/firebase-adapter'
// import { cert, getApps, initializeApp } from 'firebase-admin/app'

// const firebaseConfig = {
//   credential: cert({
//     projectId: process.env.FIREBASE_PROJECT_ID,
//     clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
//     privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY!.replace(/\\n/g, '\n')
//   })
// }

// // const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0]
// const adminDb = initFirestore(firebaseConfig)

// export { adminDb }

// firebase-admin.ts
import admin from 'firebase-admin'

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n')
    })
  })
}

export const adminDb = admin.firestore()
