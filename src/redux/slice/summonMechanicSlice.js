import { createSlice } from "@reduxjs/toolkit";

const summonMechanicSlice = createSlice({
  name: "summonMechanics",
  initialState: {
    summonMechanics: [],
    isFetching: false,
    error: false,
  },
  reducers: {
    searchSummonMechanicsStart: (state) => {
      state.isFetching = true;
    },
    searchSummonMechanicsSuccess: (state, action) => {
      state.isFetching = false;
      state.summonMechanics = action.payload;
    },
    searchSummonMechanicsFailure: (state) => {
      state.isFetching = false;
      state.error = true;
    },
  },
});

export const {
  searchSummonMechanicsStart,
  searchSummonMechanicsFailure,
  searchSummonMechanicsSuccess,
} = summonMechanicSlice.actions;
export default summonMechanicSlice.reducer;
