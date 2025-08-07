import React, { useEffect, useRef, useState } from "react";
import VideoCard from "../components/VideoPlayer";
import axios from "axios";
import { ChevronDown } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { getvideoThunk } from "../../store/getvideo/getvideoThunk";

const Home = () => {
  const containerRef = useRef(null);
  const debounceTimer = useRef(null);
  const [videos, setVideos] = useState([]);
  const [visibleIndex, setVisibleIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const {limit, category } = useSelector(
    (state) => state.getvideo
  );
  const dispatch = useDispatch()
  // 🔄 Fetch 10 random videos
  const fetchRandomVideos = async () => {
    try {
      setIsLoading(true);
      dispatch(getvideoThunk({category,limit}))
    } catch (error) {
      console.error("Failed to fetch videos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 📦 Initial load
  useEffect(() => {
    fetchRandomVideos();
  }, []);

  // 👁️ Intersection observer to track which video is in view
  useEffect(() => {
    if (!containerRef.current) return;

    const options = {
      root: containerRef.current,
      threshold: 0.6,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = Number(entry.target.getAttribute("data-index"));

          if (debounceTimer.current) clearTimeout(debounceTimer.current);
          debounceTimer.current = setTimeout(() => {
            setVisibleIndex(index);

            // 🧠 If last video is visible, load more
            if (index === videos.length - 1 && !isLoading) {
              fetchRandomVideos();
            }
          }, 100);
        }
      });
    }, options);

    const elements = containerRef.current.querySelectorAll(".video-slide");
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [videos, isLoading]);

  // ⌛ Optional loading skeleton
  if (videos.length === 0 && isLoading) {
    return (
      <div className="w-[400px] h-[600px] mx-auto p-2 pt-20">
        <div className="bg-white rounded-xl overflow-hidden shadow animate-pulse h-full w-full flex flex-col">
          <div className="bg-gray-300 h-5 w-3/4 mx-auto mt-3 rounded"></div>
          <div className="bg-gray-300 flex-1 w-full mt-3"></div>
          <div className="p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-gray-300 h-8 w-8 rounded-full"></div>
              <div>
                <div className="bg-gray-300 h-3 w-20 rounded mb-1"></div>
                <div className="bg-gray-300 h-2 w-12 rounded"></div>
              </div>
            </div>
            <div className="flex flex-col gap-3 items-center">
              <div className="bg-gray-300 h-5 w-5 rounded-full"></div>
              <div className="bg-gray-300 h-5 w-5 rounded-full"></div>
              <div className="bg-gray-300 h-5 w-5 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="h-screen overflow-y-scroll snap-y snap-mandatory relative"
    >
      {videos.map((video, index) => (
        <div
          key={`${video._id}-${index}`}
          className="video-slide snap-start snap-always relative"
          data-index={index}
          style={{ height: "100vh" }}
        >
          <VideoCard video={video} active={index === visibleIndex} />

          {/* Optional loader for last video */}
          {index === videos.length - 1 && isLoading && (
            <div className="absolute bottom-60 left-1/2 transform -translate-x-1/2 z-50">
              <button
                disabled
                className="flex items-center bg-pink-500 px-4 py-2 rounded text-white text-sm font-bold shadow-lg"
              >
                Loading... <ChevronDown className="ml-1 w-4 h-4 animate-bounce" />
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Home;
