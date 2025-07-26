// src/pages/FlashPage.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import { useState } from 'react';

const FlashPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
      checkToken();        
  }, []);

  const checkToken = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/verifytoken`, {
        withCredentials: true,
      });

      if (response.status === 200) {
        navigate("/home", { replace: true });
      }
    } catch (error) {
      localStorage.removeItem("isLogin");
      navigate("/loginsignup", { replace: true });
    }
  };

  return (
    <div className="flex items-center justify-center h-screen w-screen bg-black text-white flex-col animate-fade-in">
      <h1 className="text-4xl font-bold mb-4">🎬 vid <span className='text-pink-500'>Share</span></h1>
      <p className="text-lg animate-pulse">Loading your experience...</p>
    </div>
  );
};

export default FlashPage;
