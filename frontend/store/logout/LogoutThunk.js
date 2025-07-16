import  {createAsyncThunk }from "@reduxjs/toolkit";
import axios from 'axios'


 export const logoutThunk = createAsyncThunk('logout/logoutThunk',async(formData,{dispatch,rejectWithValue})=>{
 try {
   const response = await axios.get(
  `${import.meta.env.VITE_BASE_URL}/logout`,{withCredentials:true}
);
    if(response.status == 200){
           
        return response.data.message
    }
 } catch (error) {
    return rejectWithValue(error.response.data.message)
 }
})