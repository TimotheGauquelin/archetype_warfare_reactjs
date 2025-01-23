import { createSlice } from "@reduxjs/toolkit";

const archetypeSlice = createSlice({
  name: "archetype",
  initialState: {
    archetypes: null,
    isFetching: false,
    error: false,
  },
  reducers: {
    searchArchetypeStart: (state) => {
      state.isFetching = true;
    },
    searchArchetypeSuccess: (state, action) => {
      state.isFetching = false;
      state.isResetingPassword = false;
      //   state.token = action.payload;
    },
    searchArchetypeFailure: (state) => {
      state.isFetching = false;
      state.error = true;
    },
  },
});

export const {
  searchArchetypeStart,
  searchArchetypeFailure,
  searchArchetypeSuccess,
} = archetypeSlice.actions;
export default archetypeSlice.reducer;
