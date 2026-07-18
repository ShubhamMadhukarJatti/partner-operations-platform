'use client'

import { usePathname } from 'next/navigation'

export function useIsHiddenSidebar() {
  const pathname = usePathname()

  // These are example route patterns:
  // "/pathName" - Represents the base route.
  // "/pathName/:id" - Represents a dynamic route with an `id` parameter.
  // @Souravdey777

  const hideSideBarPaths = [
    // '/dashboard/:id',
    '/dashboard/:id/edit',
    '/priority-trial'
  ]

  const isSidebarHidden = hideSideBarPaths.some((pattern) => {
    if (!pattern.includes(':')) {
      return pathname === pattern || pathname?.startsWith(pattern)
    }

    const regexPattern = pattern.replace(/:\w+/g, '[^/]+').replace(/\//g, '\\/')

    const regex = new RegExp(`^${regexPattern}$`)
    return regex.test(pathname || '')
  })

  return isSidebarHidden
}
