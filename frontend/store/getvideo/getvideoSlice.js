import { createSlice } from "@reduxjs/toolkit";
import { getvideoThunk } from "./getvideoThunk";
const getvideo = createSlice({
name:'getvideo',
initialState:{
    error:null,
    status:null,
    message:"",
    videos:[],
     visibleCount: 4,
},
reducers:{
       setvideos: (state, action) => {
      state.videos = action.payload;
      state.visibleCount = 4;  // reset visible count on new fetch
    },
    showMoreVideos: (state) => {
      state.visibleCount += 4; // show 4 more videos
      if (state.visibleCount > state.videos.length) {
        state.visibleCount = state.videos.length; // cap to max length
      }
    },
    resetVideos: (state) => {
      state.videos = [];
      state.visibleCount = 4;
    },
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

export const {setvideos,showMoreVideos,resetVideos} = getvideo.actions
export default getvideo.reducer