'use client'

import { create } from 'zustand'

type AppState = {
  expandedMenu: boolean
  toggleMenu: () => void
}

export const useAppStore = create<AppState>()((set) => ({
  expandedMenu: true,
  toggleMenu: () => set((state) => ({ expandedMenu: !state.expandedMenu }))
}))
