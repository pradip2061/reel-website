import React, { useEffect, useRef, useState } from "react";
import VideoCard from "../components/VideoPlayer";
import { useDispatch, useSelector } from "react-redux";
import { getvideoThunk } from "../../store/getvideo/getvideoThunk";




const Home = () => {
  const containerRef = useRef(null);
  const [visibleIndex, setVisibleIndex] = useState(0);
  const dispatch= useDispatch()
  const videos =useSelector((state)=>state.getvideo.videos)
  const[category,setCategory]=useState("All")
  console.log(videos)
  useEffect(()=>{
    console.log("hello")
    dispatch(getvideoThunk(category))
},[category,dispatch])

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
  }, []);

  return (
    <div
      ref={containerRef}
      className="h-screen overflow-y-scroll snap-y snap-mandatory"
    >
      {videos.map((video, index) => (
        <div
          key={video.id}
          className="video-slide snap-start snap-always"
          data-index={index}
          style={{ height: "100vh" }}
        >
          <VideoCard video={video} active={index === visibleIndex} />
        </div>
      ))}
    </div>
  );
};

export default Home;
