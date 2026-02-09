import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api_aw from "../../api/api_aw";
import { URL_BACK_GET_ALL_CARD_TYPES } from "../../constant/urlsBack";
import { handleApiError, logError } from "../../utils/errorHandler";

export interface CardType {
  id: number;
  label: string;
  num_order?: number;
  [key: string]: unknown;
}

interface CardTypeState {
  cardTypes: CardType[];
  isLoading: boolean;
  error: string | null;
}

const initialState: CardTypeState = {
  cardTypes: [],
  isLoading: false,
  error: null,
};

export const fetchCardTypes = createAsyncThunk(
  "cardType/fetchCardTypes",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api_aw.get(URL_BACK_GET_ALL_CARD_TYPES);
      if (response.status === 200 && response.data?.data) {
        return response.data.data;
      }
      return rejectWithValue("Erreur lors du chargement des types de cartes");
    } catch (error) {
      const appError = handleApiError(error);
      logError(appError, "fetchCardTypes");
      return rejectWithValue("Erreur lors du chargement des types de cartes");
    }
  }
);

const cardTypeSlice = createSlice({
  name: "cardType",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCardTypes.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCardTypes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cardTypes = action.payload;
        state.error = null;
      })
      .addCase(fetchCardTypes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default cardTypeSlice.reducer;
