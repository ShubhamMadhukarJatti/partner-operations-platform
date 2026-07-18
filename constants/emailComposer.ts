export const EMAIL_QUICK_ACTIONS = [
  'Make Tone Professional',
  'Improve Intro',
  'Add Benefits',
  'Make Tone Friendly',
  'Add CTA'
] as const

export type EmailQuickAction = (typeof EMAIL_QUICK_ACTIONS)[number]

export const EMAIL_TONE_STYLES = [
  'PROFESSIONAL',
  'ALERT',
  'ENQUIRE',
  'REPORTING'
] as const

export type EmailToneStyle = (typeof EMAIL_TONE_STYLES)[number]
