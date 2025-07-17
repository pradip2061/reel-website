import React, { useEffect, useRef, useState } from "react";
import VideoCard from "../components/VideoPlayer";
import { useDispatch, useSelector } from "react-redux";
import { getvideoThunk } from "../../store/getvideo/getvideoThunk";
import { showMoreVideos } from "../../store/getvideo/getvideoSlice";

const Home = () => {
  const containerRef = useRef(null);
  const dispatch = useDispatch();

  const videos = useSelector((state) => state.getvideo.videos);
  const visibleCount = useSelector((state) => state.getvideo.visibleCount);
  const [visibleIndex, setVisibleIndex] = useState(0);
  const [category, setCategory] = useState("All");

  useEffect(() => {
    dispatch(getvideoThunk(category));
  }, [category, dispatch]);

  const visibleVideos = videos.slice(0, visibleCount);

  const handleLoadMore = () => {
    dispatch(showMoreVideos());
  };

  useEffect(() => {
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

    const elements = document.querySelectorAll(".video-slide");
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, [visibleVideos.length]);

  return (
    <div
      ref={containerRef}
      className="h-screen overflow-y-scroll snap-y snap-mandatory"
    >
      {visibleVideos.map((video, index) => (
        <div
          key={video._id}
          className="video-slide snap-start snap-always relative"
          data-index={index}
          style={{ height: "100vh" }}
        >
          <VideoCard video={video} active={index === visibleIndex} />

          {/* ✅ Show Load More button only in the last visible video */}
          {index === visibleVideos.length - 1 && visibleCount < videos.length && (
            <div className="absolute bottom-44 left-1/2 transform -translate-x-1/2">
              <button
                onClick={handleLoadMore}
                className="text-white bg-pink-600 px-4 py-2 rounded-md"
              >
                Load More
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Home;
