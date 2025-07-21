// Full working code with delete dropdown menu on each video card
import React, { useEffect, useState } from 'react';
import { Calendar, Users, UserPlus, Play, X, MoreVertical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutThunk } from '../../store/logout/LogoutThunk';
import { resetdataLogout } from '../../store/logout/LogoutSlice';
import { toast } from "react-toastify";
import axios from 'axios';

const UserProfile = () => {
  const dispatch = useDispatch();
  const status = useSelector((state) => state.logout.status);
  const message = useSelector((state) => state.logout.message);
  const navigate = useNavigate();
  const isLogin = localStorage.getItem('isLogin');
  const [info, setInfo] = useState(null);
  const [video, setVideo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);

  const logout = () => {
    dispatch(logoutThunk());
    setVideo([]);
    setInfo(null);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  useEffect(() => {
    if (status === 'success') {
      toast.success(message);
      dispatch(resetdataLogout());
    }
  }, [dispatch, status, message]);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/getpersonaldetail`, {
          withCredentials: true
        });
        if (res.status === 200) {
          setVideo(res.data.videos || []);
          setInfo(res.data.userinfo || {});
        } else {
          navigate("/home", { replace: true });
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchVideo();
  }, [navigate]);

  const deleteVideo = async (videoid) => {
    setDeletingId(videoid);
    try {
      await axios.get(`${import.meta.env.VITE_BASE_URL}/deletevideo?videoid=${videoid}`);
      setVideo((prev) => prev.filter((v) => v._id !== videoid));
    } catch (error) {
      console.error(error);
    } finally {
      setDeletingId(null);
    }
  };

  const totalLikes = video.reduce((sum, v) => sum + (v.isliked?.length || 0), 0);
  const totalComments = video.reduce((sum, v) => sum + (v.comments?.length || 0), 0);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8 pt-20">
        <div className="bg-white rounded-2xl shadow p-6 animate-pulse">
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 bg-gray-300 rounded-full"></div>
            <div className="flex-1 space-y-4 py-1">
              <div className="h-6 bg-gray-300 rounded w-3/4"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-6 mt-6 animate-pulse">
          <div className="h-12 bg-gray-300 rounded"></div>
          <div className="h-12 bg-gray-300 rounded"></div>
          <div className="h-12 bg-gray-300 rounded"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6 animate-pulse">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-gray-300 h-48 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 pt-20">
      <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden">
        <button
          onClick={() => navigate('/home', { replace: true })}
          className="absolute top-4 right-4 bg-white border border-gray-300 rounded-full p-2 hover:bg-gray-100 transition"
        >
          <X size={18} />
        </button>

        <div className="bg-gradient-to-r from-pink-500 to-pink-600 p-6 sm:p-10 text-white">
          <div className="flex flex-col sm:flex-row items-center sm:space-x-6 space-y-4 sm:space-y-0">
            <img
              src={info?.profilepic}
              alt={info?.Name}
              className="w-24 h-24 rounded-full border-4 border-white shadow-md bg-white"
            />
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-3xl font-bold">{info?.Name}</h1>
              <p className="text-pink-100 mt-1">{info?.email}</p>
          {
            isLogin &&     <div className="mt-4 flex flex-wrap justify-center sm:justify-start gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Users size={16} />
                  <span onClick={()=>navigate('/getuser', { state: { ids: info.followers,data:'followers' } })}>{info?.followers.length?.toLocaleString() || 0} followers</span>
                </div>
                <div className="flex items-center gap-2">
                  <UserPlus size={16} />
                  <span onClick={()=>navigate('/getuser', { state: { ids: info.following ,data:'following'} })}>{info?.following.length?.toLocaleString() || 0} following</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  <span>Joined {formatDate(info?.createdAt)}</span>
                </div>
              </div>
          }
             {
              isLogin ?  <div className="mt-4">
                <button
                  onClick={logout}
                  className="bg-white text-pink-600 font-semibold px-4 py-2 rounded hover:bg-gray-100 transition"
                >
                  Logout
                </button>
              </div> :  <div className="mt-4">
                <button
                  onClick={()=>navigate('/loginsignup')}
                  className="bg-white text-pink-600 font-semibold px-4 py-2 rounded hover:bg-gray-100 transition"
                >
                  Sign in
                </button>
              </div>
             }
            </div>
          </div>
        </div>

    {
      isLogin &&     <div className="grid grid-cols-1 sm:grid-cols-3 text-center border-t border-b p-6">
          <div>
            <p className="text-xl font-bold text-black">{video?.length}</p>
            <p className="text-gray-600">Videos</p>
          </div>
          <div>
            <p className="text-xl font-bold text-black">{totalLikes}</p>
            <p className="text-gray-600">Total Likes</p>
          </div>
          <div>
            <p className="text-xl font-bold text-black">{totalComments}</p>
            <p className="text-gray-600">Total Comments</p>
          </div>
        </div>
    }

        <div className="p-6">
          <h2 className="text-xl font-semibold text-black mb-4">Your Videos</h2>
          {video?.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Play size={48} className="mx-auto mb-4 text-gray-300" />
              <p>No videos uploaded yet</p>
              <p className="text-sm mt-1">Start sharing your content with the world!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {video?.map((vid) => (
                <div
                  key={vid._id}
                  className="relative bg-white rounded-xl overflow-hidden shadow hover:shadow-lg transition"
                >
                  <div className="relative">
                    <video
                      src={vid.videourl}
                      className="w-full h-48 object-cover"
                      controls
                    />
                    <span className="absolute top-2 right-2 px-2 py-1 bg-gray-600 text-white text-xs rounded">
                      {vid.category || 'General'}
                    </span>

                    {/* Dropdown Button */}
                    <div className="absolute top-2 left-2 z-10">
                      <button
                        onClick={() => setOpenDropdown(openDropdown === vid._id ? null : vid._id)}
                        className="p-1 bg-white rounded-full shadow hover:bg-gray-100"
                      >
                        <MoreVertical size={18} />
                      </button>
                      {openDropdown === vid._id && (
                        <div className="absolute mt-2 bg-white border border-gray-300 rounded shadow ">
                          <button
                            onClick={() => deleteVideo(vid._id)}
                            disabled={deletingId === vid._id}
                            className="block px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                          >
                            {deletingId === vid._id ? 'Deleting...' : 'Delete'}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-black text-lg mb-1 line-clamp-2">{vid.Title}</h3>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{vid.isliked.length || 0} likes</span>
                      <span>{vid.comments?.length || 0} comments</span>
                      <span>{formatDate(vid.createdAt)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;