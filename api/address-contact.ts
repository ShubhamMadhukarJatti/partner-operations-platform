import {
  AddressContactData,
  AddressContactResponse,
  getAddressContact as serverGetAddressContact,
  updateAddressContact as serverUpdateAddressContact
} from '../db/address-contact'

/**
 * Client-side wrapper for fetching Address & Contact details
 */
export const fetchAddressContact =
  async (): Promise<AddressContactResponse> => {
    return await serverGetAddressContact()
  }

/**
 * Client-side wrapper for updating Address & Contact details
 */
export const saveAddressContact = async (
  payload: AddressContactData
): Promise<AddressContactResponse> => {
  return await serverUpdateAddressContact(payload)
}
