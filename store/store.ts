import { configureStore } from "@reduxjs/toolkit";
import UiSlice from "./ui-slice";
import UserSlice from "./user-slice";

const store = configureStore({
  reducer: {
    ui: UiSlice.reducer,
    user: UserSlice.reducer,
  },
});

export const { setModalOpen, setPostModalOpen, setPost, setView } =
  UiSlice.actions;

export const { setUserModalOpen, setUserData, setText } = UserSlice.actions;

export default store;
