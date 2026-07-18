import {
  CompanyDetailsData,
  CompanyDetailsResponse,
  getCompanyDetails as serverGetCompanyDetails,
  updateCompanyDetails as serverUpdateCompanyDetails
} from '../db/company-details'

/**
 * Client-side wrapper for fetching company details
 * To be used with React Query
 */
export const fetchCompanyDetails =
  async (): Promise<CompanyDetailsResponse> => {
    return await serverGetCompanyDetails()
  }

/**
 * Client-side wrapper for updating company details
 * To be used with React Query mutations
 */
export const saveCompanyDetails = async (
  payload: CompanyDetailsData
): Promise<CompanyDetailsResponse> => {
  return await serverUpdateCompanyDetails(payload)
}
