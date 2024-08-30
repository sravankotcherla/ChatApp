import { configureStore } from "@reduxjs/toolkit";
import { AppReducer } from "./reducer";

const store = configureStore({
  reducer: AppReducer,
});

export default store;
