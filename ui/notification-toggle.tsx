'use client'

import React from 'react'

import { colors } from '@/lib/constants/notification-settings-constants'

interface NotificationToggleProps {
  checked: boolean
  onChange: (checked: boolean) => void
  className?: string
}

const NotificationToggle: React.FC<NotificationToggleProps> = ({
  checked,
  onChange,
  className = ''
}) => {
  return (
    <button
      type='button'
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${className}`}
      style={{
        backgroundColor: checked ? colors.toggle.active : '#D1D5DB'
      }}
      onClick={() => onChange(!checked)}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
        style={{
          backgroundColor: colors.toggle.handle
        }}
      />
    </button>
  )
}

export default NotificationToggle
