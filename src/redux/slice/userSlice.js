import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  id: null,
  username: null,
  email: null,
  roles: [],
  token: null
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.isAuthenticated = action.payload.isAuthenticated;
      state.id = action.payload.id;
      state.username = action.payload.username;
      state.email = action.payload.email;
      state.roles = action.payload.roles;
      state.token = action.payload.token;
    },
    clearUser: (state) => {
      state.isAuthenticated = false;
      state.id = null;
      state.username = null;
      state.email = null;
      state.roles = [];
      state.token = null;
    },
    updateUser: (state, action) => {
      state.username = action.payload.username;
      state.email = action.payload.email;
      state.roles = action.payload.roles;
    }
  }
});

export const { setUser, clearUser, updateUser } = userSlice.actions;

export default userSlice.reducer;
