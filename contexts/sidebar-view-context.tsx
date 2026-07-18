'use client'

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'

import {
  buildDashboardMenuByKind,
  collectDashboardMenuHrefs
} from '@/lib/dashboard-sidebar-menu'
import { useDevOnly } from '@/lib/devOnly'
import { getServerUser } from '@/lib/server'
import {
  fetchSidebarConfigWithRoleHints,
  hasSidebarConfigData,
  resolveSidebarRoleHints,
  setSidebarViewOverride,
  type SidebarViewOverride
} from '@/lib/sidebar-config-client'
import type {
  SidebarConfigApiData,
  SidebarConfigApiResponse
} from '@/lib/sidebar-config-types'
import { resolveSidebarMenuKind } from '@/lib/sidebar-config-types'

/** Fired before POST so layout can collapse → expand the sidebar. */
export const SIDEBAR_VIEW_CHANGE_ANIMATION = 'sidebar-view-change-animation'

type AppViewKind = 'vendor' | 'partner' | 'legacy'

function appViewKindFromRoleHints(
  h: { isVendor: boolean; isPartner: boolean } | undefined
): AppViewKind {
  if (!h) return 'vendor'
  if (h.isPartner && !h.isVendor) return 'partner'
  if (h.isVendor) return 'vendor'
  return 'vendor'
}

type SidebarViewContextValue = {
  /** When true, hide vendor-only CTAs (Cosell “Register New Deal”, Resell “Request License”). */
  hideVendorRestrictedDealCtAs: boolean
  isReady: boolean
  userId: string | null
  /** Resolved menu kind from loaded sidebar config. */
  appViewKind: AppViewKind
  /** Switch vendor vs partner nav + persist sidebar config. */
  setAppView: (view: SidebarViewOverride) => Promise<void>
  isViewChangePending: boolean
}

const SidebarViewContext = createContext<SidebarViewContextValue>({
  hideVendorRestrictedDealCtAs: false,
  isReady: false,
  userId: null,
  appViewKind: 'vendor',
  setAppView: async () => {},
  isViewChangePending: false
})

export function SidebarViewProvider({
  children
}: {
  children: React.ReactNode
}) {
  const queryClient = useQueryClient()
  const isDev = useDevOnly()
  const [isViewChangePending, setIsViewChangePending] = useState(false)

  const { data: user, isFetched: userFetched } = useQuery({
    queryKey: ['sidebar-view-auth-user'],
    queryFn: async () => {
      const { user: u } = await getServerUser()
      return u
    },
    staleTime: 5 * 60 * 1000,
    retry: false
  })

  const uid = user?.uid ?? null

  const { data: configJson, isFetched: configFetched } = useQuery({
    queryKey: ['sidebar-config', uid],
    queryFn: () => fetchSidebarConfigWithRoleHints(uid!),
    enabled: Boolean(uid),
    staleTime: 60 * 1000,
    refetchOnMount: 'always',
    retry: false
  })

  const { data: roleHints } = useQuery({
    queryKey: ['sidebar-role-hints', uid],
    queryFn: () => resolveSidebarRoleHints(uid!),
    enabled: Boolean(uid),
    staleTime: 60 * 1000,
    retry: false
  })

  useEffect(() => {
    if (!uid) return
    void queryClient.prefetchQuery({
      queryKey: ['sidebar-role-hints', uid],
      queryFn: () => resolveSidebarRoleHints(uid)
    })
    void queryClient.prefetchQuery({
      queryKey: ['sidebar-config', uid],
      queryFn: () => fetchSidebarConfigWithRoleHints(uid)
    })
  }, [uid, queryClient])

  const setAppView = useCallback(
    async (view: SidebarViewOverride) => {
      if (!uid) return
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent(SIDEBAR_VIEW_CHANGE_ANIMATION))
      }
      setIsViewChangePending(true)
      try {
        const prev = queryClient.getQueryData<SidebarConfigApiResponse | null>([
          'sidebar-config',
          uid
        ])
        const d = prev?.data
        const isVendorView = view === 'vendor'
        const isPartnerView = view === 'partner'
        const kind = isVendorView ? 'vendor' : 'partner'
        const sections = buildDashboardMenuByKind(kind, isDev)
        const sidebarItemHrefs = collectDashboardMenuHrefs(sections)

        const body: SidebarConfigApiData = {
          userId: uid,
          pinnedItemHrefs: Array.isArray(d?.pinnedItemHrefs)
            ? d.pinnedItemHrefs
            : [],
          openNestedItems:
            d?.openNestedItems && typeof d.openNestedItems === 'object'
              ? d.openNestedItems
              : {},
          isCollapsed: Boolean(d?.isCollapsed),
          isPartnerView,
          isVendorView,
          sidebarItemHrefs
        }

        const res = await fetch('/api/sidebar-config', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        })
        if (!res.ok) {
          const err = await res.json().catch(() => ({}))
          throw new Error(
            typeof err?.message === 'string'
              ? err.message
              : 'Failed to save view'
          )
        }
        const json = (await res.json()) as SidebarConfigApiResponse
        setSidebarViewOverride(view)
        queryClient.setQueryData(['sidebar-config', uid], json)
        await queryClient.invalidateQueries({
          queryKey: ['sidebar-config', uid]
        })
        await queryClient.refetchQueries({ queryKey: ['sidebar-config', uid] })
      } catch (e) {
        console.error('[SidebarView] setAppView', e)
      } finally {
        setIsViewChangePending(false)
      }
    },
    [uid, queryClient, isDev]
  )

  const value = useMemo((): SidebarViewContextValue => {
    const cfg = configJson?.data
    const hideVendorRestrictedDealCtAs = Boolean(cfg?.isVendorView)

    const appViewKind: AppViewKind = hasSidebarConfigData(configJson)
      ? resolveSidebarMenuKind(cfg ?? null)
      : appViewKindFromRoleHints(roleHints)

    return {
      hideVendorRestrictedDealCtAs,
      isReady: !uid || (userFetched && configFetched),
      userId: uid,
      appViewKind,
      setAppView,
      isViewChangePending
    }
  }, [
    configJson,
    uid,
    userFetched,
    configFetched,
    roleHints,
    setAppView,
    isViewChangePending
  ])

  return (
    <SidebarViewContext.Provider value={value}>
      {children}
    </SidebarViewContext.Provider>
  )
}

export function useSidebarView() {
  return useContext(SidebarViewContext)
}
