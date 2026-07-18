import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { TBenefit } from '@/app/(app)/proposal/_components/create-proposal-v2'

interface ExploreState {
  offers: TBenefit[]
  expectations: TBenefit[]
}

const initialState: ExploreState = {
  offers: [],
  expectations: []
}

export const proposalOffersExpectationsSlice = createSlice({
  name: 'proposalOffersExpectations',
  initialState,
  reducers: {
    updateOffersExpectations: (state, action: PayloadAction<ExploreState>) => {
      state.offers = action.payload.offers
      state.expectations = action.payload.expectations
    }
  }
})

export const { reducer, actions: proposalOffersExpectationsActions } =
  proposalOffersExpectationsSlice
