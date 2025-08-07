import React, { useEffect, useRef, useState } from "react";
import VideoCard from "../components/VideoPlayer";
import { useDispatch, useSelector } from "react-redux";
import { ChevronDown } from "lucide-react";
import axios from "axios";

const Home = () => {
  const containerRef = useRef(null);
  const debounceTimer = useRef(null);
  const [videos, setVideos] = useState([]);
  const [visibleIndex, setVisibleIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch 10 random videos
  const fetchRandomVideos = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get("/api/videos/random");
      setVideos((prev) => [...prev, ...res.data]); // Append new videos
    } catch (err) {
      console.error("Error fetching videos", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchRandomVideos();
  }, []);

  // Observer to detect which video is visible
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

            // If last video is visible, fetch more
            if (index === videos.length - 1) {
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
  }, [videos]);

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
