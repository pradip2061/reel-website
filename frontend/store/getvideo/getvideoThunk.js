// src/store/getvideo/getvideoThunk.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';

export const getvideoThunk = createAsyncThunk(
  'getvideo/getvideoThunk',
  async ({ category, page, limit}, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/getvideo`, {
        params: { category, page, limit }
      });

      if (response.status === 200) {
         console.log(response)
        return {
          videos: response.data.videos,
          hasMore: response.data.hasMore || false ,
          totalPages:response.data.totalPages,
          currentPage:response.data.currentPage
        };
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch videos");
    }
  }
);
