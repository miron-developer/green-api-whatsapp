import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";

import appSlice from "./slices/appSlice";

const store = configureStore({
  reducer: {
    app: appSlice,
  },
  devTools: true,
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export default store;
