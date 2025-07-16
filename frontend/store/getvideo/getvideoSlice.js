import { createSlice } from "@reduxjs/toolkit";
import { getvideoThunk } from "./getvideoThunk";
const getvideo = createSlice({
name:'getvideo',
initialState:{
    error:null,
    status:null,
    message:"",
    videos:[]
},
reducers:{
    resetdata:(state)=>{
        state.error=null
          state.status=null
            state.message="",
            state.videos=[]
    }
},
extraReducers:(builder)=>{
builder.addCase(getvideoThunk.pending,(state,action)=>{
state.error=null,
state.status = 'pending',
state.message = ""
}).addCase(getvideoThunk.fulfilled,(state,action)=>{
state.error=null,
state.status = 'success',
state.videos= action.payload
}).addCase(getvideoThunk.rejected,(state,action)=>{
state.error= action.payload,
state.status = 'failed',
state.message = ""
})
}
})

export const {resetdata} = getvideo.actions
export default getvideo.reducer