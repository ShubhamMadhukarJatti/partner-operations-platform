import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { getSearchResult, getSearchResultsProps } from '@/lib/db/search'

type LoadingStatus = 'idle' | 'pending' | 'succeeded' | 'failed'

interface ExploreState {
  organizations: any[]
  orgsLoading: LoadingStatus
  page: number
}

const initialState: ExploreState = {
  organizations: [],
  orgsLoading: 'idle',
  page: 0
}

export const fetchMarketplaceData = createAsyncThunk(
  'explore/fetchMarketplaceResults',
  async ({ payload }: { payload: getSearchResultsProps }) => {
    const data = await getSearchResult(payload)

    return data
  }
)

export const marketplaceSlice = createSlice({
  name: 'marketplace',
  initialState,
  reducers: {
    setMoreMarketplaceOrgs: (state, action) => {
      state.organizations = [...state.organizations, ...action.payload]
    }
  },
  extraReducers: (builder) => {
    builder

      .addCase(fetchMarketplaceData.pending, (state) => {
        state.orgsLoading = 'pending'
      })
      .addCase(fetchMarketplaceData.fulfilled, (state, action) => {
        state.orgsLoading = 'succeeded'
        state.organizations = action.payload.content
      })
      .addCase(fetchMarketplaceData.rejected, (state) => {
        state.orgsLoading = 'failed'
      })
  }
})

export const { reducer, actions: marketplaceActions } = marketplaceSlice
