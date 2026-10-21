import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { User } from "../../types";

const initialState: User = {
  isAuthenticated: false,
  id: null,
  username: null,
  email: null,
  roles: [],
  token: null,
  biography: null,
  country: null,
  loved_archetype_id: null,
  loved_archetype: null,
  quiz_points: 0,
};

interface SetUserPayload {
  isAuthenticated: boolean;
  id: string | null;
  username: string | null;
  email: string | null;
  roles: string[];
  token: string | null;
}

interface UpdateUserPayload {
  biography?: string | null;
  country?: string | null;
  loved_archetype_id?: number | string | null;
  loved_archetype?: User["loved_archetype"];
  quiz_points?: number;
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
      state.biography = null;
      state.country = null;
      state.loved_archetype_id = null;
      state.loved_archetype = null;
      state.quiz_points = 0;
    },
    updateUser: (state, action: PayloadAction<UpdateUserPayload>) => {
      if (action.payload.biography !== undefined) {
        state.biography = action.payload.biography;
      }
      if (action.payload.country !== undefined) {
        state.country = action.payload.country;
      }
      if (action.payload.loved_archetype_id !== undefined) {
        state.loved_archetype_id = action.payload.loved_archetype_id;
      }
      if (action.payload.loved_archetype !== undefined) {
        state.loved_archetype = action.payload.loved_archetype;
      }
      if (action.payload.quiz_points !== undefined) {
        state.quiz_points = action.payload.quiz_points;
      }
    }
  }
});

export const { setUser, clearUser, updateUser } = userSlice.actions;

export default userSlice.reducer;
