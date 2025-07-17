import  {createAsyncThunk }from "@reduxjs/toolkit";
import axios from 'axios'

 export const likeThunk = createAsyncThunk('like/likeThunk',async(videoid,{dispatch,rejectWithValue})=>{
 try {
   const response = await axios.post(
  `${import.meta.env.VITE_BASE_URL}/like`,
  {videoid},
  {
    headers: {
      "Content-Type": "application/json"
    },
    withCredentials:true
  }
);
    if(response.status == 200){
        return response.data.isLiked
    }
 } catch (error) {
    return rejectWithValue(error.response.data.message)
 }
})