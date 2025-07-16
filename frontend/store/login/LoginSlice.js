import { createSlice } from "@reduxjs/toolkit";
import { loginThunk } from "./LoginThunk";
const login = createSlice({
name:'login',
initialState:{
    error:"",
    status:null,
    message:""
},
reducers:{
    resetdataLogin:(state)=>{
        state.error=""
          state.status=null
            state.message=""
    }
},
extraReducers:(builder)=>{
builder.addCase(loginThunk.pending,(state,action)=>{
state.error="",
state.status = 'pending',
state.message = ""
}).addCase(loginThunk.fulfilled,(state,action)=>{
state.error="",
state.status = 'success',
state.message = action.payload
localStorage.setItem('isLogin', 'true');
}).addCase(loginThunk.rejected,(state,action)=>{
state.error= action.payload,
state.status = 'failed',
state.message = ""
localStorage.removeItem('isLogin');
})
}
})

export const {resetdataLogin} = login.actions
export default login.reducer