import { createSlice } from "@reduxjs/toolkit";
import { commentThunk } from "./commentThunk";
const comment= createSlice({
name:'comment',
initialState:{
    error:"",
    status:null,
    comments:[]
},
reducers:{
    setComment:(state,action)=>{
        console.log(action,"slice")
        state.error=""
            state.comments=action.payload,
            state.status = "success"
    },
     RefreshComment:(state,action)=>{
        console.log(action,"slice")
        state.error=""
            state.status = null,
            state.comments=[]
    },
},
extraReducers:(builder)=>{
builder.addCase(commentThunk.pending,(state,action)=>{
state.error="",
state.status = 'pending',
state.comments=[]
}).addCase(commentThunk.fulfilled,(state,action)=>{
state.error="",
state.status = 'success'
}).addCase(commentThunk.rejected,(state,action)=>{
state.error= action.payload,
state.status = 'failed'
})
}
})

export const {setComment,RefreshComment} = comment.actions
export default comment.reducer