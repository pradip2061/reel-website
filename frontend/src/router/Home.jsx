import React, { useEffect, useRef, useState } from "react";
import VideoCard from "../components/VideoPlayer";
import { useDispatch, useSelector } from "react-redux";
import { getvideoThunk } from "../../store/getvideo/getvideoThunk";
import { nextPage } from "../../store/getvideo/getvideoSlice";
import { ChevronDown } from "lucide-react";

const Home = () => {
  const containerRef = useRef(null);
  const dispatch = useDispatch();

  const { videos, currentPage, totalPages, status,limit } = useSelector(
    (state) => state.getvideo
  );
  const [visibleIndex, setVisibleIndex] = useState(0);
  const [category, setCategory] = useState("All");

  // Fetch videos when category or currentPage changes
  useEffect(() => {
    dispatch(getvideoThunk({ category, page:currentPage,limit}));
  }, [dispatch, category, currentPage]);

  const handleLoadMore = () => {
    if (currentPage < totalPages) {
      dispatch(nextPage());
    }
  };

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
          setVisibleIndex(index);
        }
      });
    }, options);

    const elements = containerRef.current.querySelectorAll(".video-slide");
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, [videos.length]);

  // DEBUG: Show current state in console
  console.log({ currentPage, totalPages, videosLength: videos.length });

  if (!videos) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8 pt-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl overflow-hidden shadow animate-pulse"
            >
              <div className="bg-gray-300 h-72 w-full"></div>
              <div className="p-4 space-y-3">
                <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                <div className="flex justify-between">
                  <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/6"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/5"></div>
                </div>
              </div>
            </div>
          ))}
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
          key={video._id}
          className="video-slide snap-start snap-always relative"
          data-index={index}
          style={{ height: "100vh" }}
        >
          <VideoCard video={video} active={index === visibleIndex} />

          {/* Load More button: force display if you want */}
          {(index === videos.length - 1 && currentPage < totalPages) && (
            <div
              className="absolute bottom-40 left-1/2 transform -translate-x-1/2 z-50"
            >
              <button
                onClick={handleLoadMore}
                className="flex items-center bg-pink-500 px-4 py-2 rounded text-white text-sm font-bold shadow-lg focus:outline-none"
              >
                Load More <ChevronDown className="ml-1 w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Home;
