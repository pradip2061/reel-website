import { createSlice } from "@reduxjs/toolkit";
import { likeThunk } from "./LikeThunk";
const like= createSlice({
name:'like',
initialState:{
    error:"",
    status:null,
    isliked:null,
    likevideos:[]
},
reducers:{
    setdataLike:(state,action)=>{
        console.log(action,"slice")
        state.error=""
            state.likevideos=action.payload
    }
},
extraReducers:(builder)=>{
builder.addCase(likeThunk.pending,(state,action)=>{
state.error="",
state.status = 'pending'
}).addCase(likeThunk.fulfilled,(state,action)=>{
state.error="",
state.status = 'success'
state.likevideos = action.payload
}).addCase(likeThunk.rejected,(state,action)=>{
state.error= action.payload,
state.status = 'failed'
})
}
})

export const {setdataLike} = like.actions
export default like.reducer