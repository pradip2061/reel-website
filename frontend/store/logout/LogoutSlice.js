import { createSlice } from "@reduxjs/toolkit";
import { logoutThunk } from "./LogoutThunk";


const logout = createSlice({
name:'logout',
initialState:{
    error:"",
    status:null,
    message:""
},
reducers:{
    resetdataLogout:(state)=>{
        state.error=""
          state.status=null
            state.message=""
            localStorage.removeItem('isLogin')
    }
},
extraReducers:(builder)=>{
builder.addCase(logoutThunk.pending,(state,action)=>{
state.error="",
state.status = 'pending',
state.message = ""
}).addCase(logoutThunk.fulfilled,(state,action)=>{
    localStorage.removeItem('userid')
state.error="",
state.status = 'success',
state.message = action.payload
}).addCase(logoutThunk.rejected,(state,action)=>{
state.error= action.payload,
state.status = 'failed',
state.message = ""
})
}
})

export const {resetdataLogout} = logout.actions
export default logout.reducer