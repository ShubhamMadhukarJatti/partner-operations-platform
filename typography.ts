/**
 * FDS typography class names – single source of truth.
 * Use these constants instead of hardcoding 'fds-heading' etc.
 * Aligns with globals.css and @/components/ui/typography.
 */
export const FDS_TYPOGRAPHY = {
  heading: 'fds-heading',
  text: 'fds-text',
  textSemibold: 'fds-text-semibold',
  textLead: 'fds-text-lead',
  textLeadSemibold: 'fds-text-lead-semibold',
  textSm: 'fds-text-sm'
} as const

export type FDSTypographyVariant = keyof typeof FDS_TYPOGRAPHY
