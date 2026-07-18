'use client'

import { useLayoutEffect, type RefObject } from 'react'

/** Match Tailwind `xl` — mega menu only mounts at this width (avoids pill overflow). */
const XL_MIN = 1280

/**
 * Positions the Radix navigation viewport under the full-width header pill by
 * syncing CSS vars on the NavigationMenu root (see navigation-menu viewport wrapper).
 */
export function useMegaMenuAlignToHeader(
  headerPillRef: RefObject<HTMLElement | null> | undefined,
  navRootRef: RefObject<HTMLElement | null>
) {
  useLayoutEffect(() => {
    const clear = (nav: HTMLElement) => {
      nav.style.removeProperty('--mega-menu-shift-x')
      nav.style.removeProperty('--mega-menu-width')
    }

    const sync = () => {
      const nav = navRootRef.current
      if (!nav) return

      const header = headerPillRef?.current
      if (!header) {
        clear(nav)
        return
      }

      if (typeof window !== 'undefined' && window.innerWidth < XL_MIN) {
        clear(nav)
        return
      }

      const hr = header.getBoundingClientRect()
      const nr = nav.getBoundingClientRect()
      nav.style.setProperty(
        '--mega-menu-shift-x',
        `${Math.round(hr.left - nr.left)}px`
      )
      nav.style.setProperty('--mega-menu-width', `${Math.round(hr.width)}px`)
    }

    sync()

    const ro = new ResizeObserver(sync)
    const header = headerPillRef?.current
    const nav = navRootRef.current
    if (header) ro.observe(header)
    if (nav) ro.observe(nav)
    window.addEventListener('resize', sync, { passive: true })

    return () => {
      ro.disconnect()
      window.removeEventListener('resize', sync)
      if (navRootRef.current) clear(navRootRef.current)
    }
  }, [headerPillRef, navRootRef])
}
