import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const SingleVideoPage = () => {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;

    const fetchVideo = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/getsinglevideo/${id}`);
        if (res.status === 200) {
          setVideo(res.data.Video);
        } else {
          navigate("/");
        }
      } catch (error) {
        console.error(error);
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [id, navigate]);

  if (loading) return <p className="text-center text-white">Loading video...</p>;
  if (!video) return <p className="text-center text-white">Video not found.</p>;

  return (
 <div
  style={{
    height: "100vh",
    backgroundColor: "black",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "10px",
  }}
>
  <div
    style={{
      width: "100%",
      maxWidth: "360px", // mobile width
      aspectRatio: "9 / 16", // TikTok-like aspect ratio
      position: "relative",
      borderRadius: "12px",
      overflow: "hidden",
    }}
  >
    <video
      src={video.videourl}
      controls
      autoPlay
      muted
      loop
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        paddingBottom:20
      }}
    />
  </div>
</div>

  );
};

export default SingleVideoPage;
