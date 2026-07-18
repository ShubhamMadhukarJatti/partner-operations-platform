import {
  IppDetailsData,
  IppDetailsResponse,
  getIppDetails as serverGetIppDetails,
  updateIppDetails as serverUpdateIppDetails
} from '../db/ipp-details'

/**
 * Client-side wrapper for fetching IPP details
 */
export const fetchIppDetails = async (): Promise<IppDetailsResponse> => {
  return await serverGetIppDetails()
}

/**
 * Client-side wrapper for updating IPP details
 */
export const saveIppDetails = async (
  payload: IppDetailsData
): Promise<IppDetailsResponse> => {
  return await serverUpdateIppDetails(payload)
}
