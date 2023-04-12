import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import contactReducer from "./ContactSlice"


export const store = configureStore({
  reducer: {
   contact:contactReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
