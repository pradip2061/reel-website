import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Provider, useDispatch } from "react-redux";
import store from "../store/store";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";
import { setUserid } from "../store/login/LoginSlice";
import axios from "axios";


// Lazy load pages
const Home = lazy(() => import("./router/Home"));
const UploadVideo = lazy(() => import("./router/UploadVideo"));
const UserProfile = lazy(() => import("./router/UserProfile"));
const LoginSignup = lazy(() => import("./router/LoginSignUp"));
const CommentSection = lazy(() => import("./components/CommentSection"));
const SingleVideoPage = lazy(() => import("./router/SingleVideoPage"));
const FlashPage = lazy(() => import("./router/FlashPage"));
const Nav = lazy(() => import("./components/Nav"));
const VisitProfile = lazy(()=>import("./router/VisitProfile"))
function AppRoutes() {
  const location = useLocation();
  const hideNavbarRoutes = ["/"];
  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);
  const dispatch = useDispatch()

useEffect(() => {
  const getuserid = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/verifytoken`, {
        withCredentials: true, 
      });
      if (response.status === 200) {
        dispatch(setUserid(response.data.userid));
      }
    } catch (error) {
      console.error("User verification failed:", error?.response?.data?.message || error.message);
    }
  };
  getuserid();
}, []);


  return (
    <>
      {!shouldHideNavbar && <Nav />}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
        toastClassName=" !w-[60vw] sm:!w-[360px] !text-sm sm:!text-base"
      />
      <Suspense fallback={<div className="text-center mt-10">Loading...</div>}>
        <Routes>
          <Route path="/" element={<FlashPage />} />
          <Route path="/home" element={<Home />} />
          <Route path="/uploadvideo" element={<UploadVideo />} />
          <Route path="/userprofile" element={<UserProfile />} />
           <Route path="/visitprofile/:id" element={<VisitProfile />} />
          <Route path="/loginsignup" element={<LoginSignup />} />
          <Route path="/comment" element={<CommentSection />} />
          <Route path="/getsinglevideo/:id" element={<SingleVideoPage />} />
        </Routes>
      </Suspense>
    </>
  );
}

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </Provider>
  );
}

export default App;
