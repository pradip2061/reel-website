import  {createAsyncThunk }from "@reduxjs/toolkit";
import axios from 'axios'
 export const getvideoThunk = createAsyncThunk('getvideo/getvideoThunk',async(category,{dispatch,rejectWithValue})=>{
 try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/getvideo?category=${category}`)
    if(response.status == 200){
        return response.data.videos
    }
 } catch (error) {
    return rejectWithValue(error.response.data.message)
 }
})