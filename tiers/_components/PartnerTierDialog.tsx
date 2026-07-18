import React, { useEffect, useState } from 'react'

import { generateSecureRandomString } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'

import PartnerTierInputCard, { PartnerTierData } from './PartnerTierInputCard'

interface PartnerTierDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData: PartnerTierData | null
  onSave: (data: PartnerTierData) => Promise<void> | void
}

const DEFAULT_PARTNER_TIER: PartnerTierData = {
  id: '',
  name: '',
  price: '',
  color: '#FBBF24',
  seatsLower: '',
  seatsUpper: '',
  discount: '',
  region: 'all'
}

const PartnerTierDialog = ({
  open,
  onOpenChange,
  initialData,
  onSave
}: PartnerTierDialogProps) => {
  const [formData, setFormData] =
    useState<PartnerTierData>(DEFAULT_PARTNER_TIER)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (open) {
      setIsSaving(false)
      if (initialData) {
        setFormData({ ...initialData })
      } else {
        // Initialize for new tier
        setFormData({
          ...DEFAULT_PARTNER_TIER,
          id: crypto.randomUUID(),
          color: '#FBBF24' // Default gold
        })
      }
    }
  }, [open, initialData])

  const handleSave = async () => {
    try {
      setIsSaving(true)
      await onSave(formData)
      onOpenChange(false)
    } catch (error) {
      console.error('Failed to save partner tier', error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='w-full max-w-[700px] overflow-hidden bg-white p-0'>
        <DialogHeader className='border-b bg-white p-6 pb-2'>
          <DialogTitle>
            {initialData ? 'Edit Partner Tier' : 'Add New Partner Tier'}
          </DialogTitle>
        </DialogHeader>

        <div className='max-h-[80vh] overflow-y-auto px-6'>
          <div className='flex justify-center'>
            <PartnerTierInputCard data={formData} onChange={setFormData} />
          </div>
        </div>

        <DialogFooter className='border-t bg-white p-6 pt-2'>
          <Button
            variant='outline'
            onClick={() => onOpenChange(false)}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : initialData ? 'Update Tier' : 'Add Tier'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default PartnerTierDialog
