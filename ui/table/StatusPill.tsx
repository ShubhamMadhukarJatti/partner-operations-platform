'use client'

import React from 'react'

import { ColumnOption } from './types'

interface StatusPillProps {
  value: string
  options?: ColumnOption[]
}

// Convert hex to RGB
const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return { r, g, b }
}

// Create lighter background (10% opacity of the original color)
const getLighterBackground = (hexColor: string): string => {
  const { r, g, b } = hexToRgb(hexColor)
  return `rgba(${r}, ${g}, ${b}, 0.3)`
}

// Create darker text color (darken by reducing RGB values)
const getDarkerTextColor = (hexColor: string): string => {
  const { r, g, b } = hexToRgb(hexColor)
  // Darken by 80% (multiply by 0.2)
  const darkR = Math.round(r * 0.2)
  const darkG = Math.round(g * 0.2)
  const darkB = Math.round(b * 0.2)
  return `rgb(${darkR}, ${darkG}, ${darkB}, 0.8)`
}

export const StatusPill = ({ value, options }: StatusPillProps) => {
  const statusValue = value || 'No Status'
  const statusOption = options?.find((opt) => opt.label === statusValue)
  const baseColor = statusOption?.color || '#3B82F6'

  // Replace underscores with spaces
  const displayValue = statusValue.replace(/_/g, ' ')

  return (
    <span
      className='inline-flex items-center rounded-md px-1.5 py-1 text-xs font-medium'
      style={{
        backgroundColor: getLighterBackground(baseColor),
        color: getDarkerTextColor(baseColor)
      }}
    >
      {displayValue}
    </span>
  )
}
