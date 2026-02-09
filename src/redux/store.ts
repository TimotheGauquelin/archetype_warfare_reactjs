import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import userSlice from "./slice/userSlice";
import eraSlice from "./slice/eraSlice";
import cardTypeSlice from "./slice/cardTypeSlice";
import attributeSlice from "./slice/attributeSlice";
import archetypeSlice from "./slice/archetypeSlice";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
};

const rootReducer = combineReducers({
  user: userSlice,
  era: eraSlice,
  cardType: cardTypeSlice,
  attribute: attributeSlice,
  archetype: archetypeSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export let persistor = persistStore(store);
