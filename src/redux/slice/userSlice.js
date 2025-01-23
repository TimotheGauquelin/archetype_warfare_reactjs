import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    currentUser: null,
    token: null,
    isFetching: false,
    error: false,
    isResetingPassword: false,
  },
  reducers: {
    loginStart: (state) => {
      state.isFetching = true;
    },
    loginSuccess: (state, action) => {
      state.isFetching = false;
      state.isResetingPassword = false;
      state.token = action.payload;
      state.currentUser = action.payload;
    },
    loginFailure: (state) => {
      state.isFetching = false;
      state.error = true;
    },
    logOut: (state) => {
      state.currentUser = null;
      state.token = null;
    },
    resetPasswordStart: (state) => {
      state.isFetching = true;
      state.isResetingPassword = true;
    },
    resetPasswordSent: (state, action) => {
      state.isFetching = false;
    },

    resetPasswordFailure: (state) => {
      state.isFetching = false;
      state.isResetingPassword = false;
      state.error = true;
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logOut,
  resetPasswordStart,
  resetPasswordSent,
  resetPasswordFailure,
} = userSlice.actions;
export default userSlice.reducer;
