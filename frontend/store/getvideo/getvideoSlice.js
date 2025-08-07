import { createSlice } from "@reduxjs/toolkit";
import { getvideoThunk } from "./getvideoThunk";

const getvideo = createSlice({
  name: "getvideo",
  initialState: {
    error: null,
    status: null,
    message: "",
    videos: [],
    category: "All",  
  },
  reducers: {
    resetVideos: (state) => {
      state.videos = [];
    },
    setCategory: (state, action) => {
      if (state.category !== action.payload) {
        state.category = action.payload;
        state.videos = [];
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

        const existingIds = new Set(state.videos.map((v) => v._id));
        const newVideos = action.payload?.videos?.filter((v) => !existingIds.has(v._id));

        state.videos.push(...newVideos);
      })
      .addCase(getvideoThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch videos";
      });
  },
});

export const { resetVideos, setCategory } = getvideo.actions;

export default getvideo.reducer;
