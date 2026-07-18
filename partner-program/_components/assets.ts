/**
 * Figma exports are often SVG; files must use `.svg` so `next/image` + sharp
 * do not treat them as corrupt PNGs (which caused broken images in the browser).
 */
export const pp = {
  pattern: '/assets/partner-program-v2/pattern.svg',
  trust1: '/assets/partner-program-v2/trust-1.svg',
  trust2: '/assets/partner-program-v2/trust-2.svg',
  persona1: '/assets/partner-program-v2/persona-1.svg',
  persona2: '/assets/partner-program-v2/persona-2.svg',
  persona3: '/assets/partner-program-v2/persona-3.svg',
  persona4: '/assets/partner-program-v2/persona-4.svg',
  persona5: '/assets/partner-program-v2/persona-5.svg',
  persona6: '/assets/partner-program-v2/persona-6.svg',
  stepBg1: '/assets/partner-program-v2/step-bg-1.svg',
  stepBg2: '/assets/partner-program-v2/step-bg-2.svg',
  stepBg3: '/assets/partner-program-v2/step-bg-3.svg',
  stepEllipseA: '/assets/partner-program-v2/step-ellipse-a.svg',
  stepEllipseB: '/assets/partner-program-v2/step-ellipse-b.svg',
  stepEllipseC: '/assets/partner-program-v2/step-ellipse-c.svg',
  stepEllipseD: '/assets/partner-program-v2/step-ellipse-d.svg',
  stepCheckFrame: '/assets/partner-program-v2/step-check-frame.svg',
  stars: '/assets/partner-program-v2/stars.svg',
  checkIcon: '/assets/partner-program-v2/check-icon.svg'
} as const
