import { createSlice } from "@reduxjs/toolkit";

const initialUiState = {
  isGroupModalShow: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState: initialUiState,
  reducers: {
    showGroupModal(state) {
      state.isGroupModalShow = true;
    },
    closeGroupModal(state) {
      state.isGroupModalShow = false;
    },
  },
});

export default uiSlice;
export const uiActions = uiSlice.actions;
