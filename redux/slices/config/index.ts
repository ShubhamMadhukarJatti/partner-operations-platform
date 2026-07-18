import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

type LoadingStatus = 'idle' | 'pending' | 'succeeded' | 'failed'

interface ExploreState {
  config: any
  configLoading: LoadingStatus
}

const initialState: ExploreState = {
  config: null,
  configLoading: 'idle'
}

export const fetchConfigData = createAsyncThunk(
  'explore/fetchConfig',
  async ({ payload }: any) => {
    return payload
  }
)

export const configSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(fetchConfigData.pending, (state) => {
        state.configLoading = 'pending'
      })
      .addCase(fetchConfigData.fulfilled, (state, action) => {
        state.configLoading = 'succeeded'
        state.config = action.payload
      })
      .addCase(fetchConfigData.rejected, (state) => {
        state.configLoading = 'failed'
      })
  }
})

export const { reducer, actions: configActions } = configSlice
