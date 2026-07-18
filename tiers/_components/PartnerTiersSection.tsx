import React from 'react'
import { Users2 } from 'lucide-react'

import { showCustomToast } from '@/components/custom-toast'

import AddTierCard from './AddTierCard'
import PartnerTierCard, { PartnerTier } from './PartnerTierCard'
import PartnerTierDialog from './PartnerTierDialog'
import { PartnerTierData } from './PartnerTierInputCard'

const DUMMY_PARTNER_TIERS: PartnerTier[] = [
  {
    id: '1',
    name: 'Gold',
    price: '₹ 12,999',
    seats: '500 - 800',
    discount: '20%',
    region: 'Global',
    color: '#FBBF24', // Amber/Gold
    active: true
  },
  {
    id: '2',
    name: 'Silver',
    price: '₹ 10,999',
    seats: '300 - 500',
    discount: '15%',
    region: 'Global',
    color: '#E5E5E5', // Light Gray/Silver
    active: true
  },
  {
    id: '3',
    name: 'Bronze',
    price: '₹ 8,999',
    seats: '100 - 300 seats',
    discount: '10%',
    region: 'Global',
    color: '#B45309', // Bronze/Brown
    active: true
  }
]

interface PartnerTiersSectionProps {
  initialTiers?: PartnerTier[]
}

const PartnerTiersSection = ({
  initialTiers = []
}: PartnerTiersSectionProps) => {
  const [tiers, setTiers] = React.useState<PartnerTier[]>(
    initialTiers.length > 0 ? initialTiers : []
  )
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [editingTier, setEditingTier] = React.useState<PartnerTier | null>(null)

  const handleAddTier = () => {
    setEditingTier(null)
    setIsDialogOpen(true)
  }

  const handleEditTier = (tier: PartnerTier) => {
    setEditingTier(tier)
    setIsDialogOpen(true)
  }

  const handleDeleteTier = async (tier: PartnerTier) => {
    // Optimistic update
    const previousTiers = [...tiers]
    setTiers(tiers.filter((t) => t.id !== tier.id))

    try {
      const response = await fetch(
        `/api/catalogues/partner/tiers/delete/${tier.id}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        }
      )

      if (!response.ok) {
        throw new Error('Failed to delete tier')
      }

      showCustomToast(
        'Success',
        'Partner API tier deleted successfully',
        'success'
      )
    } catch (error) {
      console.error('Error deleting tier:', error)
      showCustomToast('Error', 'Failed to delete tier', 'error')
      // Revert
      setTiers(previousTiers)
    }
  }

  const handleToggleActive = async (tier: PartnerTier, active: boolean) => {
    // Optimistic update
    const previousTiers = [...tiers]
    setTiers(tiers.map((t) => (t.id === tier.id ? { ...t, active } : t)))

    try {
      const response = await fetch(
        `/api/catalogues/partner/tiers/${tier.id}/status`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify({ active })
        }
      )

      if (!response.ok) {
        throw new Error('Failed to update status')
      }

      showCustomToast(
        'Success',
        `Tier ${active ? 'activated' : 'deactivated'} successfully`,
        'success'
      )
    } catch (error) {
      console.error('Error updating tier status:', error)
      showCustomToast('Error', 'Failed to update status', 'error')
      // Revert on failure
      setTiers(previousTiers)
    }
  }

  const onSaveTier = async (tierData: PartnerTierData) => {
    // Validate required fields
    if (
      !tierData.name ||
      !tierData.price ||
      !tierData.seatsLower ||
      !tierData.seatsUpper
    ) {
      showCustomToast(
        'Error',
        'Please fill in all mandatory fields (Name, Price, Seats).',
        'error'
      )
      throw new Error('Validation failed')
    }

    // Clean inputs
    const priceCleaned = tierData.price.replace(/[^0-9.]/g, '')
    const priceNum = Number(priceCleaned) || 0
    const seatLowerNum = Number(tierData.seatsLower) || 0
    const seatUpperNum = Number(tierData.seatsUpper) || 0
    const discountNum = Number(tierData.discount) || 0

    const seatsDisplay = `${seatLowerNum} - ${seatUpperNum}`

    try {
      const isEdit = !!editingTier
      const endpoint = isEdit
        ? `/api/catalogues/partner/tiers/update/${tierData.id}`
        : `/api/catalogues/partner/tiers/add`
      const method = isEdit ? 'PUT' : 'POST'

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          tierName: tierData.name,
          price: priceNum,
          currency: 'INR', // As requested in demo format
          seatLower: seatLowerNum,
          seatUpper: seatUpperNum,
          discountPercent: discountNum,
          region: tierData.region === 'all' ? 'India' : tierData.region, // Defaulting to India if 'all' or mapping as needed.
          // NOTE: The demo payload uses "India". Our UI uses 'all' or specific. We map accordingly.
          colorCode: tierData.color
        })
      })

      if (!response.ok) {
        throw new Error(`Failed to ${isEdit ? 'update' : 'add'} partner tier`)
      }

      showCustomToast(
        'Success',
        `Partner Tier ${isEdit ? 'updated' : 'added'} successfully!`,
        'success'
      )

      // Optimistic/Local Update
      const newTier: PartnerTier = {
        id: tierData.id,
        name: tierData.name,
        price:
          tierData.price.startsWith('$') || tierData.price.startsWith('₹')
            ? tierData.price
            : `₹ ${priceNum}`, // Simple formatting
        seats: seatsDisplay,
        discount: `${discountNum}%`,
        region: tierData.region === 'all' ? 'Global' : tierData.region,
        color: tierData.color,
        active: isEdit && editingTier ? editingTier.active : true
      }

      if (isEdit) {
        setTiers(
          tiers.map((t) =>
            t.id === newTier.id ? { ...newTier, active: t.active } : t
          )
        )
      } else {
        setTiers([...tiers, newTier])
      }

      // setIsDialogOpen(false) is handled by the Dialog component await
    } catch (error) {
      console.error('Error saving partner tier:', error)
      showCustomToast('Error', 'Failed to save partner tier.', 'error')
      throw error // Re-throw to keep dialog open
    }
  }

  // Helper to convert tier to input data format
  const getInitialDataForDialog = (): PartnerTierData | null => {
    if (!editingTier) return null

    // Parse seats string "500 - 800"
    const seatParts = editingTier.seats
      .replace(' seats', '')
      .split('-')
      .map((s) => s.trim())

    return {
      id: editingTier.id,
      name: editingTier.name,
      price: editingTier.price,
      seatsLower: seatParts[0] || '',
      seatsUpper: seatParts[1] || '',
      discount: editingTier.discount,
      region: editingTier.region === 'Global' ? 'all' : editingTier.region,
      color: editingTier.color
    }
  }

  return (
    <div className='space-y-6 pt-2'>
      <div className='space-y-1'>
        <div className='flex items-center gap-2 text-xl font-bold text-foreground'>
          <Users2 className='h-6 w-6' />
          <h2>Partner Tier</h2>
        </div>
        <p className='pl-8 text-sm text-muted-foreground'>
          Set your Pricing tiers, you can add any number of Tiers
        </p>
      </div>

      <div className='grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2'>
        {tiers.map((tier) => (
          <PartnerTierCard
            key={tier.id}
            tier={tier}
            onEdit={handleEditTier}
            onDelete={handleDeleteTier}
            onToggleActive={handleToggleActive}
          />
        ))}
        <div className='lg:h-full'>
          <AddTierCard onClick={handleAddTier} />
        </div>
      </div>

      <PartnerTierDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        initialData={
          getInitialDataForDialog()
            ? {
                ...getInitialDataForDialog()!,
                price: getInitialDataForDialog()!.price.replace(/[^0-9.]/g, '')
              }
            : null
        }
        onSave={onSaveTier}
      />
    </div>
  )
}

export default PartnerTiersSection
