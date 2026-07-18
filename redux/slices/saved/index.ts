import { OrganizationType } from '@/types'
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

import { getSavedOrganizations } from '@/lib/db/organization'

type LoadingStatus = 'idle' | 'pending' | 'succeeded' | 'failed'

interface ExploreState {
  page: number
  last: boolean
  organizations: any[]
  savedLoading: LoadingStatus
}

const initialState: ExploreState = {
  page: 0,
  last: false,

  organizations: [],
  savedLoading: 'idle'
}

export const fetchExploreSaved = createAsyncThunk(
  'explore/fetchSavedResults',
  async (
    { payload }: { payload: { orgId: number; page: number } },
    thunkAPI
  ) => {
    try {
      const data = await getSavedOrganizations(payload.orgId, payload.page)

      return data
    } catch (error) {
      console.error('Error fetching saved results:', error)

      // Return a rejected action with an error message
      return thunkAPI.rejectWithValue(
        'Failed to fetch saved results. Please try again later.'
      )
    }
  }
)

export const savedSlice = createSlice({
  name: 'saved',
  initialState,
  reducers: {
    saveOrganization(state, action: PayloadAction<OrganizationType>) {
      const updatedOrganization = action.payload

      const index = state.organizations.findIndex(
        (org) => org.id === updatedOrganization.id
      )

      if (index !== -1) {
        state.organizations[index] = updatedOrganization
      } else {
        state.organizations.push(updatedOrganization)
      }

      state.savedLoading = 'succeeded'
    }
  },
  extraReducers: (builder) => {
    builder

      .addCase(fetchExploreSaved.pending, (state) => {
        state.savedLoading = 'pending'
      })
      .addCase(fetchExploreSaved.fulfilled, (state, action) => {
        state.savedLoading = 'succeeded'
        state.organizations = action.payload.content
        state.last = action.payload.last
      })
      .addCase(fetchExploreSaved.rejected, (state) => {
        state.savedLoading = 'failed'
      })
  }
})

export const { reducer, actions: savedActions } = savedSlice
