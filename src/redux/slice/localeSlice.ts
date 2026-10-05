import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type CardLocale = "fr" | "en";

export interface LocaleState {
  value: CardLocale;
}

const initialState: LocaleState = {
  value: "fr",
};

const localeSlice = createSlice({
  name: "locale",
  initialState,
  reducers: {
    setLocale: (state, action: PayloadAction<CardLocale>) => {
      state.value = action.payload;
    },
  },
});

export const { setLocale } = localeSlice.actions;
export default localeSlice.reducer;
