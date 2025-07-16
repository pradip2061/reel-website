import { createSlice } from "@reduxjs/toolkit";
import { signupThunk } from "./SignupThunk";
const signup = createSlice({
name:'signup',
initialState:{
    error:null,
    status:null,
    message:""
},
reducers:{
    resetdata:(state)=>{
        state.error=null
          state.status=null
            state.message=""
    }
},
extraReducers:(builder)=>{
builder.addCase(signupThunk.pending,(state,action)=>{
state.error=null,
state.status = 'pending',
state.message = ""
}).addCase(signupThunk.fulfilled,(state,action)=>{
state.error=null,
state.status = 'success',
state.message = action.payload
}).addCase(signupThunk.rejected,(state,action)=>{
state.error= action.payload,
state.status = 'failed',
state.message = ""
})
}
})

export const {resetdata} = signup.actions
export default signup.reducer