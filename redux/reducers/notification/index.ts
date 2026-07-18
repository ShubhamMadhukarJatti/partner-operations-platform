import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { getNotificationData } from '@/lib/db/notifications'

type LoadingStatus = 'idle' | 'pending' | 'succeeded' | 'failed'

export const fetchNotifications = createAsyncThunk(
  'notifications',
  async (auth: any) => {
    const { organizationId } = auth

    const data = await getNotificationData(organizationId)

    return data
  }
)

const initialState: any = {
  notifications: [],
  notificationLoading: 'idle',
  unreadCount: 0
}

export const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    newNotification(state, action) {
      const notification = action.payload

      state.notifications.unshift(notification)

      if (!notification.read) {
        state.unreadCount += 1
      }
    },

    markAsRead(state, action) {
      const { id } = action.payload
      const notification = state.notifications.find(
        (notification: any) => notification.id === id
      )
      if (notification && !notification.read) {
        notification.read = true
        if (state.unreadCount > 0) {
          state.unreadCount -= 1
        }
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.notificationLoading = 'pending'
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        const notifications = Array.isArray(action.payload) ? action.payload : []
        const unreadCount = notifications.reduce(
          (count: number, notification: any) =>
            notification.read ? count : count + 1,
          0
        )
        state.notifications = notifications
        state.unreadCount = unreadCount

        state.notificationLoading = 'succeeded'
      })
      .addCase(fetchNotifications.rejected, (state) => {
        state.notificationLoading = 'failed'
      })
  }
})

export const { reducer, actions: notificationAction } = notificationSlice
