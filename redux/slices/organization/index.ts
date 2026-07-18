import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

import { getCurrentOrganization } from '@/lib/db/organization'

type LoadingStatus = 'idle' | 'pending' | 'succeeded' | 'failed'

interface ExploreState {
  organization: any
  loading: LoadingStatus
}

const initialState: ExploreState = {
  organization: {},
  loading: 'idle'
}

export const fetchCurrentOrgRedux = createAsyncThunk(
  'explore/fetchCurrentOrganization',
  async ({ payload }: { payload: {} }, thunkAPI) => {
    try {
      const data = await getCurrentOrganization()

      return data
    } catch (error) {
      console.error('Error fetching current org:', error)

      // Return a rejected action with an error message
      return thunkAPI.rejectWithValue(
        'Failed to fetch saved results. Please try again later.'
      )
    }
  }
)

export const currentOrgSlice = createSlice({
  name: 'currentOrg',
  initialState,
  reducers: {
    updateEmailVerified: (state, action: PayloadAction<boolean>) => {
      state.organization.primaryEmailVerified = action.payload
    },
    /** Set org from auth/layout data so AccountPopover can show immediately without waiting for fetchCurrentOrgRedux */
    setCurrentOrgFromAuth: (state, action: PayloadAction<any>) => {
      state.organization = action.payload ?? {}
      state.loading = 'succeeded'
    }
  },
  extraReducers: (builder) => {
    builder

      .addCase(fetchCurrentOrgRedux.pending, (state) => {
        state.loading = 'pending'
      })
      .addCase(fetchCurrentOrgRedux.fulfilled, (state, action) => {
        state.loading = 'succeeded'
        state.organization = action.payload
      })
      .addCase(fetchCurrentOrgRedux.rejected, (state) => {
        state.loading = 'failed'
      })
  }
})

export const { reducer, actions: currentOrgActions } = currentOrgSlice
