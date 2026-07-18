import { reducer as configReducer } from '@/redux/slices/config'
import { reducer as exploreNewReducer } from '@/redux/slices/explore'
import { reducer as marketplaceReducer } from '@/redux/slices/marketplace'
import { reducer as currentOrgNewReducer } from '@/redux/slices/organization'
import { reducer as pendingMouReducer } from '@/redux/slices/pending-mou'
import { reducer as proposalOffersExpectationsReducer } from '@/redux/slices/proposal'
import { reducer as savedReducer } from '@/redux/slices/saved'
import { combineReducers, configureStore } from '@reduxjs/toolkit'

import { RESET_STORE } from './actions/action'
import { tableReducer } from './features/tableSlice'
import exploreReducer from './reducers/explore'
import { reducer as notificationReducer } from './reducers/notification'
import orgReducer from './reducers/organization'
import planReducer from './reducers/planCode'
import modalReducer from './slices/registerModal'

// Combine all reducers into a single root reducer
const appReducer = combineReducers({
  organization: orgReducer,
  exploreDrawer: exploreReducer,
  organizationPricingPlan: planReducer,
  notification: notificationReducer,
  explore: exploreNewReducer,
  saved: savedReducer,
  currentOrg: currentOrgNewReducer,
  proposalOffersExpectations: proposalOffersExpectationsReducer,
  marketplace: marketplaceReducer,
  config: configReducer,
  pendingMou: pendingMouReducer,
  table: tableReducer,
  modal: modalReducer
})

// Create a root reducer that handles resetting the state
const rootReducer = (state: any, action: any) => {
  if (action.type === RESET_STORE) {
    state = undefined // This resets the state
  }
  return appReducer(state, action)
}

// Configure the Redux store with performance optimizations
export const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: true,
      serializableCheck: {
        // Ignore these action types for performance
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
        // Ignore these field paths in all actions
        ignoredActionsPaths: ['meta.arg', 'payload.timestamp'],
        // Ignore these paths in the state
        ignoredPaths: ['items.dates']
      },
      immutableCheck: {
        // Only check in development and limit the size
        warnAfter: 32,
        ignoredPaths: ['items.dates']
      }
    })
})

// Define TypeScript types for the state and dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
