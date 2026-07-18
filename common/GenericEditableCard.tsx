import React from 'react'
import { Edit } from 'lucide-react'

import { Button } from '@/components/ui/button'

interface GenericEditableCardProps {
  title: string
  icon: React.ReactNode | string
  isEditing: boolean
  isSaving?: boolean
  onEdit: () => void
  onCancel: () => void
  onSave: () => void
  children: React.ReactNode
  className?: string
  primaryColor?: string
}

const GenericEditableCard: React.FC<GenericEditableCardProps> = ({
  title,
  icon,
  isEditing,
  isSaving = false,
  onEdit,
  onCancel,
  onSave,
  children,
  className = '',
  primaryColor = '#6863FB'
}) => {
  return (
    <div
      className={`h-[min-content] rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-md dark:border-[#252666] dark:bg-[#130F55] ${className}`}
    >
      {/* Header */}
      <div className='mb-6 flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          {typeof icon === 'string' ? (
            <img
              src={icon}
              alt={title}
              width={24}
              height={24}
              className='dark:invert'
            />
          ) : (
            icon
          )}
          <h3 className='text-lg font-bold text-[#2A3241] dark:text-white'>
            {title}
          </h3>
        </div>
        {!isEditing && (
          <button
            className='flex h-8 w-8 items-center justify-center rounded transition-colors hover:bg-gray-50 dark:bg-white/5'
            onClick={onEdit}
          >
            <Edit size={24} color={primaryColor} />
          </button>
        )}
      </div>

      {/* Content */}
      {children}

      {/* Action Buttons */}
      {isEditing && (
        <div className='mt-6 flex justify-end gap-3'>
          <Button
            variant='outline'
            onClick={onCancel}
            className='px-6'
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button
            onClick={onSave}
            className='px-6'
            style={{ backgroundColor: primaryColor, color: 'white' }}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      )}
    </div>
  )
}

export default GenericEditableCard
