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

import PricingTierInputCard, { PricingTierData } from './PricingTierInputCard'

interface PricingTierDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData: PricingTierData | null
  onSave: (data: PricingTierData) => Promise<void> | void
}

const DEFAULT_TIER: PricingTierData = {
  id: '',
  name: '',
  price: '',
  color: '#000000',
  features: ['']
}

const PricingTierDialog = ({
  open,
  onOpenChange,
  initialData,
  onSave
}: PricingTierDialogProps) => {
  const [formData, setFormData] = useState<PricingTierData>(DEFAULT_TIER)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (open) {
      setIsSaving(false) // Reset saving state on open
      if (initialData) {
        setFormData({ ...initialData })
      } else {
        // Initialize for new tier
        setFormData({
          ...DEFAULT_TIER,
          id: crypto.randomUUID(),
          color: '#3B82F6', // Default blue
          features: ['']
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
      console.error('Failed to save tier', error)
      // Keep dialog open on error
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='w-full max-w-[700px] overflow-hidden bg-white p-0'>
        <DialogHeader className='border-b bg-white p-6'>
          <DialogTitle>
            {initialData ? 'Edit Tier' : 'Add New Tier'}
          </DialogTitle>
        </DialogHeader>

        <div className='max-h-[80vh] overflow-y-auto px-6'>
          <div className='flex justify-center'>
            <PricingTierInputCard data={formData} onChange={setFormData} />
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

export default PricingTierDialog
