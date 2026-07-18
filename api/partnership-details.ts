import {
  PartnershipDetailsData,
  PartnershipDetailsResponse,
  getPartnershipDetails as serverGetPartnershipDetails,
  updatePartnershipDetails as serverUpdatePartnershipDetails
} from '../db/partnership-details'

/**
 * Client-side wrapper for fetching partnership details
 */
export const fetchPartnershipDetails =
  async (): Promise<PartnershipDetailsResponse> => {
    return await serverGetPartnershipDetails()
  }

/**
 * Client-side wrapper for updating partnership details
 */
export const savePartnershipDetails = async (
  payload: PartnershipDetailsData
): Promise<PartnershipDetailsResponse> => {
  return await serverUpdatePartnershipDetails(payload)
}
