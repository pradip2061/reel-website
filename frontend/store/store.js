import { configureStore } from '@reduxjs/toolkit'
import signupreducer from './signup/SignupSlice'
import loginreducer from './login/LoginSlice'
import logoutreducer from './logout/LogoutSlice'
import getvideoreducer from './getvideo/getvideoSlice'
import likereducer from './like/LikeSlice'
import commentReducer from './comment/commentSlice'
const store = configureStore({
   reducer:{
     signup:signupreducer,
     login:loginreducer,
     logout:logoutreducer,
     getvideo:getvideoreducer,
     like:likereducer,
     comment:commentReducer
   }
})

export default store