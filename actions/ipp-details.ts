'use server'

import { revalidatePath } from 'next/cache'

import {
  getOrganizationDetails,
  updateOrganizationDetails
} from './organization'

interface IPPDetailsData {
  companyBrandingPageLink: string
  activePartnerPrograms: string
  currentNumberOfPartners: string
}

export const getIPPDetails = async (organizationId: number) => {
  try {
    const data = await getOrganizationDetails(organizationId)

    return {
      companyBrandingPageLink: data?.brandingPage || '',
      activePartnerPrograms: data?.activePartnerProgram || '',
      currentNumberOfPartners: data?.currentPartnerCount || ''
    }
  } catch (error: any) {
    console.error('Error fetching IPP details:', error)
    throw new Error(error.message || 'Failed to fetch IPP details')
  }
}

export const saveIPPDetails = async (
  organizationId: number,
  data: IPPDetailsData
) => {
  try {
    const payload = {
      id: organizationId,
      brandingPage: data.companyBrandingPageLink,
      activePartnerProgram: data.activePartnerPrograms,
      currentPartnerCount: data.currentNumberOfPartners,
      inHousePartnership: '', // Required field
      // Additional required fields from ProfileSchema
      briefDescription: '',
      about: '',
      website: '',
      registrationType: '',
      services: '',
      city: '',
      state: '',
      companyType: '',
      preferedPartnershipTypes: [],
      targetMarket: '',
      referralProgram: false,
      legalName: '',
      dateOfIncorporation: '',
      code: '',
      country: '',
      address: '',
      contactNumber: '',
      startupName: ''
    }

    const response = await updateOrganizationDetails(payload)

    revalidatePath('/settings/partner-details')

    return {
      success: true,
      data: response
    }
  } catch (error: any) {
    console.error('Error saving IPP details:', error)
    throw new Error(error.message || 'Failed to save IPP details')
  }
}
