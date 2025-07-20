import React, { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX, Heart, MessageCircle, Share2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { likeThunk } from "../../store/like/LikeThunk";
import { setdataLike } from "../../store/like/LikeSlice";
import { useNavigate } from "react-router-dom";
import CommentSection from "./CommentSection";
import { toast } from "react-toastify";

const VideoPlayer = ({ video }) => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [showcomment, setShowComment] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [videoLoading, setVideoLoading] = useState(true);
const userid = useSelector((state)=>state.login.userid)
  const isLogin = localStorage.getItem("isLogin");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const likedvideos = useSelector((state) => state.like?.likevideos ?? []);

  const toggleMute = () => setMuted((m) => !m);

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const { currentTime = 0, duration = 1 } = videoRef.current;
    setProgress((currentTime / duration) * 100);
  };

  const handleSeek = (e) => {
    if (!videoRef.current) return;
    const newTime = (+e.target.value / 100) * videoRef.current.duration;
    videoRef.current.currentTime = newTime;
    setProgress(+e.target.value);
  };

  const handlePlayPause = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().then(() => setPlaying(true)).catch(() => {});
    } else {
      videoRef.current.pause();
      setPlaying(false);
    }
  };

  const handleLike = (id) => {
    if (!isLogin) {
      toast.info("first login your account.");
      return;
    }
    setIsLiked((prev) => !prev);
    dispatch(likeThunk(id));
  };

  const refreshLikedVideos = async () => {
    try {
      const { data, status } = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/islike`,
        { withCredentials: true }
      );
      if (status === 200) {
        const serverLikes = data.likedvideos?.likedvideos ?? [];
        const localSorted = [...likedvideos].sort();
        const serverSorted = [...serverLikes].sort();
        if (JSON.stringify(localSorted) !== JSON.stringify(serverSorted)) {
          dispatch(setdataLike(serverLikes));
        }
        if (!localStorage.getItem("userid")) {
          localStorage.setItem("userid", data.id);
        }
      }
    } catch (err) {
      console.error("Fetch like error:", err?.response?.data?.message ?? err);
    }
  };

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!videoRef.current) return;
        if (entry.isIntersecting) {
          videoRef.current.play().then(() => setPlaying(true)).catch(() => {});
        } else {
          videoRef.current.pause();
          setPlaying(false);
        }
      },
      { threshold: 0.7 }
    );

    if (containerRef.current) obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    vid.addEventListener("timeupdate", handleTimeUpdate);
    return () => vid.removeEventListener("timeupdate", handleTimeUpdate);
  }, []);

  useEffect(() => {
    if (!isLogin) {
      return;
    }
    refreshLikedVideos();
  }, []);

  useEffect(() => {
    setIsLiked(likedvideos.includes(video._id));
  }, [likedvideos, video._id]);

  const onClose = () => setShowComment(false);
  const shareUrl = `${window.location.origin}/getsinglevideo/${video._id}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Link copied to clipboard!");
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  const handleprofile = ()=>{
    if(userid === video.userid){
      navigate('/userprofile')
    }else{
         navigate(`/visitprofile/${video?.userid}`)
    }
 
  }

  return (
    <div
      ref={containerRef}
      className="w-full h-full flex items-center justify-center bg-black"
    >
      <div className="relative w-full h-full max-w-md mx-auto bg-black text-white overflow-hidden">
        {/* Loading Spinner */}
        {videoLoading && (
          <div className="absolute inset-0 flex items-center justify-center z-20 bg-black/70">
            <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* Video */}
        <video
          ref={videoRef}
          src={video.videourl}
          muted={muted}
          loop
          playsInline
          onClick={handlePlayPause}
          preload="metadata"
          crossOrigin="anonymous"
          onCanPlay={() => setVideoLoading(false)}
          onLoadedData={() => setVideoLoading(false)}
          className={`w-full h-full object-contain cursor-pointer ${
            videoLoading ? "invisible" : "visible"
          }`}
        />

        {/* Mute Button */}
        <button
          onClick={toggleMute}
          className="absolute lg:top-16  top-14  right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 z-30"
        >
          {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>

        {/* Right-side Buttons */}
        <div className="absolute bottom-44 right-4 flex flex-col items-center space-y-4 z-10">
          <button onClick={() => handleLike(video._id)} className="flex flex-col items-center">
            <Heart size={28} className={`transition ${isLiked ? "text-pink-500 fill-pink-500" : "text-white"}`} />
            <span className="text-xs">Like</span>
          </button>
          <button onClick={() => setShowComment((prev) => !prev)} className="flex flex-col items-center">
            <MessageCircle size={28} />
            <span className="text-xs">Comment</span>
          </button>
          <button onClick={() => setShowShareModal(true)} className="flex flex-col items-center">
            <Share2 size={28} />
            <span className="text-xs">Share</span>
          </button>
        </div>

        {/* Bottom User Info */}
        <div className="absolute bottom-36 lg:bottom-10 left-4 flex items-center space-x-3 z-10">
          <img
            src={video.profilepic || "https://via.placeholder.com/40"}
            alt=""
            className="w-10 h-10 rounded-full border-2 border-white"
            onClick={handleprofile}
          />
          <div>
            <h3 className="font-bold text-pink-500">{video.Name || "Unknown"}</h3>
            <p className="text-sm">{video.Title || "No Title"}</p>
          </div>
        </div>

        {/* Comment Section */}
        {showcomment && <CommentSection videoId={video._id} onClose={onClose} />}

        {/* Seek Bar */}
        <div className="absolute w-full px-4 bottom-28 lg:bottom-5 z-10">
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={handleSeek}
            className="w-full h-1 rounded-full bg-white/20 accent-pink-500"
          />
        </div>

        {/* Share Modal */}
        {showShareModal && (
          <div
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center"
            onClick={() => setShowShareModal(false)}
          >
            {isLogin ? (
              <div
                className="bg-white rounded-xl p-6 w-80 space-y-4 relative"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className="absolute top-2 right-2 text-black text-lg"
                  onClick={() => setShowShareModal(false)}
                >
                  ❌
                </button>
                <h2 className="text-lg font-semibold text-black text-center">Share this video</h2>

                <button
                  onClick={handleCopyLink}
                  className="w-full bg-pink-500 text-white py-2 rounded-lg hover:bg-pink-600"
                >
                  📋 Copy Link
                </button>

                <div className="flex justify-around mt-2">
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(shareUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img src="https://img.icons8.com/color/48/whatsapp--v1.png" alt="WhatsApp" className="w-10 h-10" />
                  </a>
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img src="https://img.icons8.com/color/48/facebook-new.png" alt="Facebook" className="w-10 h-10" />
                  </a>
                </div>
              </div>
            ) : (
              <div
                className="bg-white rounded-xl p-6 w-80 flex justify-center relative"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => navigate("/loginsignup", { replace: true })}
                  className="bg-pink-500 text-white font-semibold px-4 py-2 rounded hover:bg-pink-600 transition"
                >
                  Sign In
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoPlayer;
