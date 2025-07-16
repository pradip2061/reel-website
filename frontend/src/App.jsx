import React from 'react'
import Home from "./router/Home"
import { BrowserRouter, Routes,Route } from 'react-router-dom'
import Nav from './components/Nav'
import UploadVideo from './router/UploadVideo'
import UserProfile from './router/UserProfile'
import LoginSignup from './router/LoginSignUp'
import store from '../store/store'
import {Provider}from 'react-redux'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function App() {
  return (
    <Provider store={store}>
    <BrowserRouter>
    <Nav/>
        <ToastContainer 
        position="top-right" 
        autoClose={3000} 
        hideProgressBar={false} 
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
      />
      <Routes>
        <Route path='/' element={<Home/>}/>
         <Route path='/uploadvideo' element={<UploadVideo/>}/>
         <Route path='/userprofile' element={<UserProfile/>}/>
         <Route path='/loginsignup' element={<LoginSignup/>}/>
      </Routes>
    </BrowserRouter>
    </Provider>
  )
}

export default App

