import { configureStore } from "@reduxjs/toolkit";
import { AppReducer } from "./reducer";
import { composeWithDevTools } from "redux-devtools-extension";

const store = configureStore({
  reducer: AppReducer,
});

export default store;
