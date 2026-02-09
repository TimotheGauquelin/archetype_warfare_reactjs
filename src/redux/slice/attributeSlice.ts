import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api_aw from "../../api/api_aw";
import { URL_BACK_GET_ALL_ATTRIBUTES } from "../../constant/urlsBack";
import { handleApiError, logError } from "../../utils/errorHandler";

export interface Attribute {
  id: number;
  label: string;
  [key: string]: unknown;
}

interface AttributeState {
  attributes: Attribute[];
  isLoading: boolean;
  error: string | null;
}

const initialState: AttributeState = {
  attributes: [],
  isLoading: false,
  error: null,
};

export const fetchAttributes = createAsyncThunk(
  "attribute/fetchAttributes",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api_aw.get(URL_BACK_GET_ALL_ATTRIBUTES);
      if (response.status === 200 && response.data) {
        return response.data;
      }
      return rejectWithValue("Erreur lors du chargement des attributs");
    } catch (error) {
      const appError = handleApiError(error);
      logError(appError, "fetchAttributes");
      return rejectWithValue("Erreur lors du chargement des attributs");
    }
  }
);

const attributeSlice = createSlice({
  name: "attribute",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAttributes.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAttributes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.attributes = action.payload;
        state.error = null;
      })
      .addCase(fetchAttributes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default attributeSlice.reducer;
