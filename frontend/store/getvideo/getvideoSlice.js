import { createSlice } from "@reduxjs/toolkit";
import { getvideoThunk } from "./getvideoThunk";

const getvideo = createSlice({
  name: "getvideo",
  initialState: {
    error: null,
    status: null,
    message: "",
    videos: [],
    currentPage: 1,
    totalPages: 0,
    limit: 4,
    category: "All",  // add default category here, lowercase recommended
  },
  reducers: {
    setVideos: (state, action) => {
      state.videos = action.payload.videos;
      state.totalPages = action.payload.totalPages;
      state.currentPage = action.payload.currentPage;
    },
    resetVideos: (state) => {
      state.videos = [];
      state.currentPage = 1;
      state.totalPages = 0;
    },
    nextPage: (state) => {
      if (state.currentPage < state.totalPages) {
        state.currentPage += 1;
      }
    },
    prevPage: (state) => {
      if (state.currentPage > 1) {
        state.currentPage -= 1;
      }
    },
    setPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setCategory: (state, action) => {
      // Only change if different to avoid unnecessary reset
      if (state.category !== action.payload) {
        console.log(action.payload)
        state.category = action.payload;
        state.videos = [];
        state.currentPage = 1;
        state.totalPages = 0;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getvideoThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getvideoThunk.fulfilled, (state, action) => {
        state.status = "success";
        state.error = null;

        if (state.currentPage === 1) {
          // Replace videos on first page
          state.videos = action.payload.videos;
        } else {
          // Append unique videos on next pages
          const newVideoIds = new Set(state.videos.map((v) => v._id));
          const filtered = action.payload.videos.filter(
            (v) => !newVideoIds.has(v._id)
          );
          state.videos = [...state.videos, ...filtered];
        }

        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(getvideoThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch videos";
      });
  },
});

export const {
  setVideos,
  resetVideos,
  nextPage,
  prevPage,
  setPage,
  setCategory,
} = getvideo.actions;

export default getvideo.reducer;
