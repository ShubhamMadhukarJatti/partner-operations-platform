export type SidebarConfigApiData = {
  userId: string
  pinnedItemHrefs: string[]
  openNestedItems: Record<string, boolean>
  isCollapsed: boolean
  isPartnerView: boolean
  isVendorView: boolean
  /** All navigable main-nav hrefs for the user’s vendor/partner/legacy menu (POST seed + PUT sync). */
  sidebarItemHrefs?: string[]
}

export type SidebarConfigApiResponse = {
  success?: boolean
  message?: string
  data?: SidebarConfigApiData
}

export function resolveSidebarMenuKind(
  data:
    | Pick<SidebarConfigApiData, 'isVendorView' | 'isPartnerView'>
    | null
    | undefined
): 'legacy' | 'vendor' | 'partner' {
  if (!data) return 'legacy'
  const v = Boolean(data.isVendorView)
  const p = Boolean(data.isPartnerView)
  if (p && !v) return 'partner'
  if (v) return 'vendor'
  return 'legacy'
}
