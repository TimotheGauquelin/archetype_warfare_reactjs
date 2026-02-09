import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api_aw from "../../api/api_aw";
import { URL_BACK_GET_ALL_ERAS } from "../../constant/urlsBack";
import { handleApiError, logError } from "../../utils/errorHandler";

export interface Era {
  id: number;
  label: string;
  [key: string]: unknown;
}

interface EraState {
  eras: Era[];
  isLoading: boolean;
  error: string | null;
}

const initialState: EraState = {
  eras: [],
  isLoading: false,
  error: null,
};

export const fetchEras = createAsyncThunk(
  "era/fetchEras",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api_aw.get(URL_BACK_GET_ALL_ERAS);
      if (response.status === 200 && response.data) {
        return response.data;
      }
      return rejectWithValue("Erreur lors du chargement des ères");
    } catch (error) {
      const appError = handleApiError(error);
      logError(appError, "fetchEras");
      return rejectWithValue("Erreur lors du chargement des ères");
    }
  }
);

const eraSlice = createSlice({
  name: "era",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEras.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchEras.fulfilled, (state, action) => {
        state.isLoading = false;
        state.eras = action.payload;
        state.error = null;
      })
      .addCase(fetchEras.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default eraSlice.reducer;
