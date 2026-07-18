'use client'

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  SIDEBAR_VIEW_CHANGE_ANIMATION,
  SidebarViewProvider
} from '@/contexts/sidebar-view-context'
import { useUIStore } from '@/store/uiStore'

import AllPageTopbar from '@/app/(app)/(dashboard-pages)/_components/layout/all-page-topbar'
import { Sidebar } from '@/app/(app)/(dashboard-pages)/_components/layout/sidebar'

import { useIsHiddenSidebar } from './useIsHiddenSidebar.hook'

type Props = {
  children: React.ReactNode
  isSettings: boolean
}

const VIEW_CHANGE_ANIMATION_MS = 260

const SidebarMenuLayout = React.memo(({ children, isSettings }: Props) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false)
  const [isViewAnimating, setIsViewAnimating] = useState(false)

  const collapseHydratedRef = useRef(false)
  const collapseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const expandTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearViewChangeTimers = useCallback(() => {
    if (collapseTimerRef.current) {
      clearTimeout(collapseTimerRef.current)
      collapseTimerRef.current = null
    }

    if (expandTimerRef.current) {
      clearTimeout(expandTimerRef.current)
      expandTimerRef.current = null
    }
  }, [])

  const toggleSidebar = useCallback(() => {
    if (isViewAnimating) return
    setIsCollapsed((prev) => !prev)
  }, [isViewAnimating])

  useEffect(() => {
    const onViewChange = () => {
      clearViewChangeTimers()
      setIsViewAnimating(true)

      // Phase 1: smoothly collapse
      setIsCollapsed(true)

      // Phase 2: smoothly expand again
      collapseTimerRef.current = setTimeout(() => {
        setIsCollapsed(false)

        expandTimerRef.current = setTimeout(() => {
          setIsViewAnimating(false)
          expandTimerRef.current = null
        }, VIEW_CHANGE_ANIMATION_MS)
      }, VIEW_CHANGE_ANIMATION_MS)
    }

    window.addEventListener(SIDEBAR_VIEW_CHANGE_ANIMATION, onViewChange)

    return () => {
      window.removeEventListener(SIDEBAR_VIEW_CHANGE_ANIMATION, onViewChange)
      clearViewChangeTimers()
    }
  }, [clearViewChangeTimers])

  const handleCollapsedFromServer = useCallback((collapsed: boolean) => {
    if (collapseHydratedRef.current) return
    collapseHydratedRef.current = true
    setIsCollapsed(collapsed)
  }, [])

  const isSidebarHidden = useIsHiddenSidebar()
  const sidebarOpen = useUIStore((state) => state.sidebarOpen)

  const showSidebar = useMemo(
    () => sidebarOpen && !isSidebarHidden,
    [sidebarOpen, isSidebarHidden]
  )

  return (
    <SidebarViewProvider>
      <div
        className={`flex h-screen select-none overflow-hidden ${isSettings ? 'bg-transparent' : ''}`}
      >
        {showSidebar && (
          <Sidebar
            className=''
            isCollapsed={isCollapsed}
            isViewAnimating={isViewAnimating}
            toggleSidebar={toggleSidebar}
            isSettings={isSettings}
            onCollapsedFromServer={handleCollapsedFromServer}
          />
        )}

        <div className='flex min-w-0 flex-1 flex-col overflow-hidden'>
          <AllPageTopbar />
          <main
            className={`hide-scrollbar min-h-0 flex-1 overflow-y-auto ${isSettings ? 'bg-transparent' : 'bg-[var(--page-gradient-bg)]'}`}
          >
            {children}
          </main>
        </div>
      </div>
    </SidebarViewProvider>
  )
})

SidebarMenuLayout.displayName = 'SidebarMenuLayout'

export default SidebarMenuLayout
