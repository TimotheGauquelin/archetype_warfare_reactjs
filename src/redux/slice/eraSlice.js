import { createSlice } from "@reduxjs/toolkit";

const eraSlice = createSlice({
  name: "eras",
  initialState: {
    eras: [],
    isFetching: false,
    error: false,
  },
  reducers: {
    searchErasStart: (state) => {
      state.isFetching = true;
    },
    searchErasSuccess: (state, action) => {
      state.isFetching = false;
      state.eras = action.payload;
    },
    searchErasFailure: (state) => {
      state.isFetching = false;
      state.error = true;
    },
  },
});

export const { searchErasStart, searchErasFailure, searchErasSuccess } =
  eraSlice.actions;
export default eraSlice.reducer;
