import React, { useEffect, useRef, useState } from "react";
import {
  Volume2,
  VolumeX,
  Heart,
  MessageCircle,
  Share2,
} from "lucide-react";

const VideoCard = ({ video }) => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [muted, setMuted] = useState(false);
  const [liked, setLiked] = useState(false);
  const [progress, setProgress] = useState(0);
  const [playing, setPlaying] = useState(false);

  // Toggle mute
  const toggleMute = () => {
    setMuted((prev) => !prev);
  };

  // Track time update for progress bar
  const handleTimeUpdate = () => {
    const current = videoRef.current?.currentTime || 0;
    const duration = videoRef.current?.duration || 1;
    setProgress((current / duration) * 100);
  };

  // Seek to new time on progress bar change
  const handleSeek = (e) => {
    const newTime = (e.target.value / 100) * videoRef.current.duration;
    videoRef.current.currentTime = newTime;
    setProgress(e.target.value);
  };

  // Toggle play/pause
  const handlePlayPause = () => {
    if (!videoRef.current) return;

    if (videoRef.current.paused) {
      videoRef.current
        .play()
        .then(() => setPlaying(true))
        .catch(() => {});
    } else {
      videoRef.current.pause();
      setPlaying(false);
    }
  };

  // Auto-play when in view using IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        const videoEl = videoRef.current;
        if (!videoEl) return;

        if (entry.isIntersecting) {
          videoEl
            .play()
            .then(() => setPlaying(true))
            .catch(() => {});
        } else {
          videoEl.pause();
          setPlaying(false);
        }
      },
      { threshold: 0.7 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.addEventListener("timeupdate", handleTimeUpdate);
    }
    return () => {
      if (videoRef.current) {
        videoRef.current.removeEventListener("timeupdate", handleTimeUpdate);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-full flex items-center justify-center bg-black "
    >
      <div className="relative w-full h-full max-w-md mx-auto bg-black text-white overflow-hidden">
        {/* Video Element */}
        <video
          ref={videoRef}
          src={video.videourl}
          muted={muted}
          loop
          playsInline
          className="w-full h-full object-contain cursor-pointer"
          onClick={handlePlayPause}
          crossOrigin="anonymous"
          preload="metadata"
        />

        {/* Mute Button */}
        <div className="absolute lg:top-16 top-2 right-4 z-30">
          <button
            onClick={toggleMute}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30"
          >
            {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
        </div>

        {/* Right Side Buttons */}
        <div className="absolute bottom-44 right-4 flex flex-col items-center space-y-4 z-10">
          <button
            onClick={() => setLiked(!liked)}
            className="flex flex-col items-center"
          >
            <Heart
              size={28}
              className={`transition ${
                liked ? "text-pink-500 fill-pink-500" : "text-white"
              }`}
            />
            <span className="text-xs">Like</span>
          </button>
          <button className="flex flex-col items-center">
            <MessageCircle size={28} />
            <span className="text-xs">Comment</span>
          </button>
          <button className="flex flex-col items-center">
            <Share2 size={28} />
            <span className="text-xs">Share</span>
          </button>
        </div>

        {/* Bottom Left Info */}
        <div className="absolute bottom-32 lg:bottom-10 left-4 z-10 flex items-center space-x-3">
          <img
            src={video.profilepic || "https://via.placeholder.com/40"}
            alt=""
            className="w-10 h-10 rounded-full border-2 border-white"
          />
          <div>
            <h3 className="font-bold text-pink-500">{video.Name || "Unknown"}</h3>
            <p className="text-sm text-white">{video.Title || "No Title"}</p>
          </div>
        </div>

        {/* Seek Bar */}
        <div className="absolute w-full px-4 bottom-24 lg:bottom-5 z-10">
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={handleSeek}
            className="w-full h-1 rounded-full bg-white/20 accent-pink-500"
          />
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
