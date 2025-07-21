import React, { useEffect, useRef, useState } from "react";
import VideoCard from "../components/VideoPlayer";
import { useDispatch, useSelector } from "react-redux";
import { getvideoThunk } from "../../store/getvideo/getvideoThunk";
import { nextPage } from "../../store/getvideo/getvideoSlice";
import { ChevronDown } from "lucide-react";

const Home = () => {
  const containerRef = useRef(null);
  const dispatch = useDispatch();

  const { videos, currentPage, totalPages, status, limit,category} = useSelector(
    (state) => state.getvideo
  );
  const [visibleIndex, setVisibleIndex] = useState(0);

  // Fetch videos when category or currentPage changes
  useEffect(() => {
    dispatch(getvideoThunk({ category, page: currentPage, limit }));
  }, [dispatch, category, currentPage, limit]);

  const handleLoadMore = () => {
    if (currentPage < totalPages) {
      dispatch(nextPage());
    }
  };

  // Debounce timer ref
  const debounceTimer = useRef(null);

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

          // Debounce setVisibleIndex to avoid flickering
          if (debounceTimer.current) clearTimeout(debounceTimer.current);
          debounceTimer.current = setTimeout(() => {
            setVisibleIndex(index);
          }, 100); // 100ms debounce delay
        }
      });
    }, options);

    const elements = containerRef.current.querySelectorAll(".video-slide");
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [videos.length]);

  // DEBUG: Show current state in console
  console.log({ currentPage, totalPages, videosLength: videos?.length });

  if (status === "loading") {
    return (
      <div className="w-[400px] h-[600px] mx-auto p-2 pt-20">
        <div className="bg-white rounded-xl overflow-hidden shadow animate-pulse h-full w-full flex flex-col">
          {/* Top Text */}
          <div className="bg-gray-300 h-5 w-3/4 mx-auto mt-3 rounded"></div>

          {/* Video Placeholder */}
          <div className="bg-gray-300 flex-1 w-full mt-3"></div>

          {/* Bottom Section */}
          <div className="p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {/* Profile */}
              <div className="bg-gray-300 h-8 w-8 rounded-full"></div>
              <div>
                <div className="bg-gray-300 h-3 w-20 rounded mb-1"></div>
                <div className="bg-gray-300 h-2 w-12 rounded"></div>
              </div>
            </div>

            {/* Icons */}
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
      {videos?.map((video, index) => (
        <div
          key={video._id}
          className="video-slide snap-start snap-always relative"
          data-index={index}
          style={{ height: "100vh" }}
        >
          <VideoCard video={video} active={index === visibleIndex} />

          {(index === videos?.length - 1 && currentPage < totalPages) && (
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
