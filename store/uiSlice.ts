import { createSlice } from "@reduxjs/toolkit";

const initialUiState = {
  isGroupModalShow: false,
  isLogoutModalShow: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState: initialUiState,
  reducers: {
    showGroupModal(state) {
      state.isGroupModalShow = true;
    },
    showLogoutModal(state) {
      state.isLogoutModalShow = true;
    },
    closeGroupModal(state) {
      state.isGroupModalShow = false;
    },
    closeLogoutModal(state) {
      state.isLogoutModalShow = false;
    },
  },
});

export default uiSlice;
export const uiActions = uiSlice.actions;
