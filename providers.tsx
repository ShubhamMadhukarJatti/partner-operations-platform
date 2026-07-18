'use client'

import React from 'react'
import { store } from '@/redux/store'
import { Provider as ReduxProvider } from 'react-redux'

export function ReduxProviders({
  children // session,
}: {
  children: React.ReactNode
}) {
  return <ReduxProvider store={store}>{children}</ReduxProvider>
}
