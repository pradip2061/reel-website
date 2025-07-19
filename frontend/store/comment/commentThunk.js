import  {createAsyncThunk }from "@reduxjs/toolkit";
import axios from 'axios'

 export const commentThunk = createAsyncThunk('comment/commentThunk',async({videoId,message},{dispatch,rejectWithValue})=>{
 try {
    console.log(videoId,"from thunk")
   const response = await axios.post(
  `${import.meta.env.VITE_BASE_URL}/comment`,
  {videoId,message},
  {
    headers: {
      "Content-Type": "application/json"
    },
    withCredentials:true
  }
);
 } catch (error) {
    return rejectWithValue(error.response.data.message)
 }
})