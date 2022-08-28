import { createSlice } from "@reduxjs/toolkit";

const UiSlice = createSlice({
  name: "ui",
  initialState: {
    modalOpen: false,
    postModalOpen: false,
    post: null,
    view: "posts",
  },
  reducers: {
    setModalOpen(state, action) {
      state.modalOpen = action.payload;
    },
    setPostModalOpen(state, action) {
      state.postModalOpen = action.payload;
    },
    setPost(state, action) {
      state.post = action.payload;
    },
    setView(state, action) {
      state.view = action.payload;
    },
  },
});

export const modalSelector = (state: any) => state.ui.modalOpen;

export const postModalSelector = (state: any) => state.ui.postModalOpen;

export const postSelector = (state: any) => state.ui.post;

export const viewSelector = (state: any) => state.ui.view;

export default UiSlice;
