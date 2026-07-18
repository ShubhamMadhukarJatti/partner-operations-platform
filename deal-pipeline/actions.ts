'use server'

import { revalidatePath } from 'next/cache'
import { updatePlaceholderPageStatus as updatePlaceholderPageStatusService } from '@/services/dashboard'

type UpdatePlaceholderPageStatus = {
  user_id: string
  is_continue_free_deal: boolean
  is_continue_free_partner_mapping: boolean
}

export async function updateDealPipelineStatus() {
  try {
    const response = (await updatePlaceholderPageStatusService({
      placeholderPage: 'DEAL_PIPELINE'
    })) as UpdatePlaceholderPageStatus

    // Revalidate the cache for the affected pages
    revalidatePath('/deal-pipeline')
    revalidatePath('/deal-pipeline/start')

    return {
      success: true,
      data: response
    }
  } catch (error) {
    console.error('Error in updateDealPipelineStatus:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}
