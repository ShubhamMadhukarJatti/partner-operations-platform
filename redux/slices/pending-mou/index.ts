import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { getPendingMou } from '@/lib/db/mou'

type LoadingStatus = 'idle' | 'pending' | 'succeeded' | 'failed'

interface Document {
  id: number
  creationTimestamp: string // ISO 8601 formatted date-time string
  lastUpdatedTimestamp: string // ISO 8601 formatted date-time string
  organizationCollaborationId: number
  organizationId: number
  envelopeId: string
  pdfUrl: string // URL pointing to a PDF document
  signed: boolean // Indicates if the document has been signed
  organizationName: string
}

interface ExploreState {
  pendingMou: Document[]
  loading: LoadingStatus
}

const initialState: ExploreState = {
  pendingMou: [],
  loading: 'idle'
}

export const fetchPendingMou = createAsyncThunk(
  'explore/fetchPendingMou',
  async ({ payload }: { payload: { orgId: number } }, thunkAPI) => {
    try {
      const data = await getPendingMou(payload.orgId)
      return data
    } catch (error) {
      console.error('Error fetching pending mou:', error)
      // Return a rejected action with an error message
      return thunkAPI.rejectWithValue(
        'Failed to fetch pending mou results. Please try again later.'
      )
    }
  }
)

export const pendingMouSlice = createSlice({
  name: 'pendingMou',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(fetchPendingMou.pending, (state) => {
        state.loading = 'pending'
      })
      .addCase(fetchPendingMou.fulfilled, (state, action) => {
        state.loading = 'succeeded'
        state.pendingMou = action.payload
      })
      .addCase(fetchPendingMou.rejected, (state) => {
        state.loading = 'failed'
      })
  }
})

export const { reducer, actions: pendingMouActions } = pendingMouSlice
