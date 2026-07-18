'use server'

import { revalidatePath } from 'next/cache'

import { updateOrganization } from './organization'

interface CompanyDetailsData {
  id: number
  companyName: string
  foundedOn: string
  websiteUrl: string
  contactNumber?: string
  inHousePartnershipTeam: string
  sharkdomPersonalisedUrl: string
  aboutCompany: string
  aboutProductService: string
  logo?: string
  address?: string
  country?: string
  state?: string
  code?: string
}

export const saveCompanyDetails = async (data: CompanyDetailsData) => {
  try {
    // First, update the main organization data
    const organizationPayload = {
      id: data.id,
      startupName: data.companyName,
      dateOfIncorporation: data.foundedOn,
      website: data.websiteUrl,
      contactNumber: data.contactNumber || '',
      about: data.aboutCompany,
      briefDescription: data.aboutProductService,
      address: data.address || '',
      country: data.country || '',
      state: data.state || '',
      code: data.code || '',
      // Required fields from the schema
      registrationType: '',
      legalName: '',
      services: '',
      city: '',
      companyType: '',
      preferedPartnershipTypes: [],
      targetMarket: '',
      referralProgram: false,
      inHousePartnership: data.inHousePartnershipTeam,
      brandingPage: '',
      activePartnerProgram: '',
      currentPartnerCount: ''
    }

    const organizationResponse = await updateOrganization(organizationPayload)

    revalidatePath('/settings/company-details')

    return {
      success: true,
      data: organizationResponse
    }
  } catch (error: any) {
    console.error('Error saving company details:', error)
    throw new Error(error.message || 'Failed to save company details')
  }
}
