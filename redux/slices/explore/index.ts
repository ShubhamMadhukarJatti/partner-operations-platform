import {
  createAsyncThunk,
  createSlice,
  type PayloadAction
} from '@reduxjs/toolkit'

import { getSearchResult, getSearchResultsProps } from '@/lib/db/search'

type LoadingStatus = 'idle' | 'pending' | 'succeeded' | 'failed'

interface SearchOptions {
  partialName: string
  subSectorsCommaSeparated: string
  sectorsCommaSeparated: string
  partnershipType: string
  page: number
  size: number
}

interface ExploreState {
  searchOptions: SearchOptions
  organizations: any[]
  orgsLoading: LoadingStatus
}

const initialState: ExploreState = {
  searchOptions: {
    partialName: '',

    subSectorsCommaSeparated: '',
    sectorsCommaSeparated: '',
    partnershipType: '',

    page: 0,
    size: 15
  },

  organizations: [],
  orgsLoading: 'idle'
}

export const fetchExploreSearch = createAsyncThunk(
  'explore/fetchSearchResults',
  async ({ payload }: { payload: getSearchResultsProps }) => {
    const data = await getSearchResult(payload)

    return data
  }
)

export const exploreSlice = createSlice({
  name: 'explore',
  initialState,
  reducers: {
    setSearchQuery(state, action: PayloadAction<{ payload: string }>) {
      state.searchOptions.partialName = action.payload.payload
      state.searchOptions.page = 0
    },
    setSubSectorsCommaSeparated: (state, action: PayloadAction<string>) => {
      state.searchOptions.subSectorsCommaSeparated = action.payload
    },
    setSectorsCommaSeparated: (state, action: PayloadAction<string>) => {
      state.searchOptions.sectorsCommaSeparated = action.payload
    },
    setPartnershipType: (state, action: PayloadAction<string>) => {
      state.searchOptions.partnershipType = action.payload
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.searchOptions.page = action.payload
    }
  },
  extraReducers: (builder) => {
    builder

      .addCase(fetchExploreSearch.pending, (state) => {
        state.orgsLoading = 'pending'
      })
      .addCase(fetchExploreSearch.fulfilled, (state, action) => {
        state.orgsLoading = 'succeeded'
        state.organizations = action.payload.content
      })
      .addCase(fetchExploreSearch.rejected, (state) => {
        state.orgsLoading = 'failed'
      })
  }
})

export const { reducer, actions: exploreActions } = exploreSlice
