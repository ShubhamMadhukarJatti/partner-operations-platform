import { createSlice } from '@reduxjs/toolkit'

const modalSlice = createSlice({
  name: 'modal',
  initialState: {
    isLoadingModalVisible: false
  },
  reducers: {
    showModal: (state) => {
      state.isLoadingModalVisible = true
    },
    hideModal: (state) => {
      state.isLoadingModalVisible = false
    }
  }
})

export const { showModal, hideModal } = modalSlice.actions
export default modalSlice.reducer
