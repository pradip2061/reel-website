import { configureStore } from '@reduxjs/toolkit'
import signupreducer from './signup/SignupSlice'
import loginreducer from './login/LoginSlice'
import logoutreducer from './logout/LogoutSlice'
import getvideoreducer from './getvideo/getvideoSlice'
const store = configureStore({
   reducer:{
     signup:signupreducer,
     login:loginreducer,
     logout:logoutreducer,
     getvideo:getvideoreducer
   }
})

export default store