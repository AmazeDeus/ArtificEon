import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./apiSlice";
import { setupListeners } from "@reduxjs/toolkit/query";
import authReducer from "./authSlice";

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer
  },
  // adding apiSlice middleware to the default middleware
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }).concat(apiSlice.middleware),
  devTools: false,
});

setupListeners(store.dispatch);
