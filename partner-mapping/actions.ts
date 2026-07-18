'use server'

import { revalidatePath } from 'next/cache'
import { updatePlaceholderPageStatus as updatePlaceholderPageStatusService } from '@/services/dashboard'

type UpdatePlaceholderPageStatus = {
  user_id: string
  is_continue_free_partner_mapping: boolean
  is_continue_free_deal: boolean
}

export async function updatePartnerMappingStatus() {
  try {
    const response = (await updatePlaceholderPageStatusService({
      placeholderPage: 'PARTNER_MAPPING'
    })) as UpdatePlaceholderPageStatus

    // Revalidate the cache for the affected pages
    revalidatePath('/partner-mapping')
    revalidatePath('/partner-mapping/start')

    return {
      success: true,
      data: response
    }
  } catch (error) {
    console.error('Error in updatePartnerMappingStatus:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}
