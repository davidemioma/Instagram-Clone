import { createSlice } from "@reduxjs/toolkit";

const UserSlice = createSlice({
  name: "user",
  initialState: {
    userModalOpen: false,
    userData: null,
    text: "",
  },
  reducers: {
    setUserModalOpen(state, action) {
      state.userModalOpen = action.payload;
    },
    setUserData(state, action) {
      state.userData = action.payload;
    },
    setText(state, action) {
      state.text = action.payload;
    },
  },
});

export const userModalSelector = (state: any) => state.user.userModalOpen;

export const userDataSelector = (state: any) => state.user.userData;

export const userTextSelector = (state: any) => state.user.text;

export default UserSlice;
