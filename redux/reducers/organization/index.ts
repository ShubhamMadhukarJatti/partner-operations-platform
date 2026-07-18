import { OrganizationType } from '@/types'
import { createSlice } from '@reduxjs/toolkit'

type OrganizationDataType = {
  organizationData: OrganizationType | null
  organizationPlan: null
  lastFetched: Date | null
}

const initialState: OrganizationDataType = {
  organizationData: null,
  organizationPlan: null,
  lastFetched: null
}

export const organizationSlice = createSlice({
  name: 'exploreSectionData',
  initialState,
  reducers: {
    storeOrganizationData: (state, action) => {
      const { currentOrganization, fetchedDate } = action.payload
      state.organizationData = currentOrganization
      state.lastFetched = fetchedDate
    }
  }
})

export const { storeOrganizationData } = organizationSlice.actions

export default organizationSlice.reducer
