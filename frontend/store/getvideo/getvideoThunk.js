// src/store/getvideo/getvideoThunk.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';

export const getvideoThunk = createAsyncThunk(
  'getvideo/getvideoThunk',
  async ({ category,limit}, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/getvideo`, {
        params: { category, limit }
      });

      if (response.status === 200) {
         console.log(response)
        return {
          videos: response.data.videos
        };
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch videos");
    }
  }
);
