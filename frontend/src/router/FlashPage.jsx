// src/pages/FlashPage.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const FlashPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/loginsignup',{replace:true}); // Change this to your actual homepage route
    }, 3000); // 3 seconds

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-screen w-screen bg-black text-white flex-col animate-fade-in">
      <h1 className="text-4xl font-bold mb-4">🎬 vid <span className='text-pink-500'>Share</span></h1>
      <p className="text-lg animate-pulse">Loading your experience...</p>
    </div>
  );
};

export default FlashPage;
