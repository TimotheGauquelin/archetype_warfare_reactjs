import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api_aw from "../../api/api_aw";
import { URL_BACK_GET_ALL_ARCHETYPES_NAMES } from "../../constant/urlsBack";
import { handleApiError, logError } from "../../utils/errorHandler";
import type { Archetype } from "../../types";

interface ArchetypeState {
  archetypes: Archetype[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ArchetypeState = {
  archetypes: [],
  isLoading: false,
  error: null,
};

export const fetchArchetypesNames = createAsyncThunk(
  "archetype/fetchArchetypesNames",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api_aw.get(URL_BACK_GET_ALL_ARCHETYPES_NAMES);
      if (response.status === 200 && response.data) {
        return response.data;
      }
      return rejectWithValue("Erreur lors du chargement des archétypes");
    } catch (error) {
      const appError = handleApiError(error);
      logError(appError, "fetchArchetypesNames");
      return rejectWithValue("Erreur lors du chargement des archétypes");
    }
  }
);

const archetypeSlice = createSlice({
  name: "archetype",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchArchetypesNames.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchArchetypesNames.fulfilled, (state, action) => {
        state.isLoading = false;
        state.archetypes = action.payload;
        state.error = null;
      })
      .addCase(fetchArchetypesNames.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default archetypeSlice.reducer;
