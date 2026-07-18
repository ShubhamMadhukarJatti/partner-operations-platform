import { SearchOrganizationResponse } from '@/types'
import { createSlice } from '@reduxjs/toolkit'

type StateX = {
  recommendationsData: SearchOrganizationResponse[] | null
  recommendationSectors: SearchOrganizationResponse[] | null
  recommendationPartnerShipTypes: SearchOrganizationResponse[] | null
}

const initialState: StateX = {
  recommendationsData: null,
  recommendationSectors: null,
  recommendationPartnerShipTypes: null
}

export const exploreSectionSlice = createSlice({
  name: 'exploreSectionData',
  initialState,
  reducers: {
    storeRecommendations: (state, action) => {
      const { recommendationsData } = action.payload
      state.recommendationsData = recommendationsData
    },
    storeRecommendationSectors: (state, action) => {
      const { sectors } = action.payload
      state.recommendationSectors = sectors
    },
    storeRecommendationPartnershipType: (state, action) => {
      const { partnershipType } = action.payload
      state.recommendationPartnerShipTypes = partnershipType
    }
  }
})

export const {
  storeRecommendations,
  storeRecommendationSectors,
  storeRecommendationPartnershipType
} = exploreSectionSlice.actions

export default exploreSectionSlice.reducer
