import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { User } from "../../types";

const initialState: User = {
  isAuthenticated: false,
  id: null,
  username: null,
  email: null,
  roles: [],
  token: null,
  belovedArchetype: null
};

interface SetUserPayload {
  isAuthenticated: boolean;
  id: number | null;
  username: string | null;
  email: string | null;
  roles: string[];
  token: string | null;
}

interface UpdateUserPayload {
  username: string;
  email: string;
  belovedArchetype: string;
  roles: string[];
}

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<SetUserPayload>) => {
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
    updateUser: (state, action: PayloadAction<UpdateUserPayload>) => {
      state.username = action.payload.username;
      state.email = action.payload.email;
      state.roles = action.payload.roles;
      state.belovedArchetype = action.payload.belovedArchetype;
    }
  }
});

export const { setUser, clearUser, updateUser } = userSlice.actions;

export default userSlice.reducer;
