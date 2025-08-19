// src/pages/FlashPage.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const FlashPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/home', { replace: true });
    }, 1500); // 1.5-second splash screen

    return () => clearTimeout(timer); // cleanup
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-screen w-screen bg-black text-white flex-col animate-fade-in">
      <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-center">
        🎬 vid <span className="text-pink-500">Share</span>
      </h1>
      <p
        className="text-lg sm:text-xl animate-pulse text-center"
        role="status"
        aria-busy="true"
      >
        Loading your experience...
      </p>
    </div>
  );
};

export default FlashPage;
