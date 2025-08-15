import { configureStore } from "@reduxjs/toolkit";
import personaReducer from "./slice.js";

export const store = configureStore({
  reducer: personaReducer,
});
  