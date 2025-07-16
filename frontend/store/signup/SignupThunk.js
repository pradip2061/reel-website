import  {createAsyncThunk }from "@reduxjs/toolkit";
import axios from 'axios'
 export const signupThunk = createAsyncThunk('singup/signupThunk',async(formData,{dispatch,rejectWithValue})=>{
    console.log(formData,'thunk')
 try {
       const data = new FormData();
            data.append("firstName", formData.firstName);
            data.append("lastName", formData.lastName);
            data.append("email", formData.email);
            data.append("password", formData.password);
            data.append("confirmPassword", formData.confirmPassword);
              data.append("profilepic", formData.profilepic);
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/signup`,data,{
        headers:{
            "Content-Type":'multipart/form-data'
        }
    })
    if(response.status == 200){
        return response.data.message
    }
 } catch (error) {
    return rejectWithValue(error.response.data.message)
 }
})