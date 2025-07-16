import React, { useEffect } from 'react';
import { Calendar, Users, UserPlus, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutThunk } from '../../store/logout/LogoutThunk';
import { resetdataLogout } from '../../store/logout/LogoutSlice';
import { toast } from "react-toastify";
const UserProfile = ({ user, userVideos }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  const dispatch=useDispatch()
  const status=useSelector((state)=>state.logout.status)
   const message=useSelector((state)=>state.logout.message)
  const navigate = useNavigate()
  const totalLikes = userVideos?.reduce((sum, video) => sum + video.likes, 0);
  const totalComments = userVideos?.reduce((sum, video) => sum + video.comments, 0);

  const logout=()=>{
    dispatch(logoutThunk())
  }
  useEffect(()=>{
    if(status === 'success'){
      toast.success(message)
       dispatch(resetdataLogout())
    }
  },[dispatch,status])
  return (
    <div className="max-w-4xl mx-auto px-4 py-6 mt-8 lg:pt-20 ">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      <h1 onClick={()=>navigate('/')}>X</h1>
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-pink-500 to-pink-600 p-6 sm:p-8 text-white">
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 space-y-4 sm:space-y-0">
            <img
              src={user?.avatar}
              alt={user?.username}
              className="w-24 h-24 rounded-full border-4 border-white shadow-lg mx-auto sm:mx-0"
            />
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">{user?.username}</h1>
              <p className="text-pink-100 mb-4">{user?.bio}</p>
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 space-y-2 sm:space-y-0 text-sm">
                <div className="flex items-center justify-center sm:justify-start space-x-2">
                  <Users size={18} />
                  <span>{user?.followers.toLocaleString()} followers</span>
                </div>
                <div className="flex items-center justify-center sm:justify-start space-x-2">
                  <UserPlus size={18} />
                  <span>{user?.following.toLocaleString()} following</span>
                </div>
                <div className="flex items-center justify-center sm:justify-start space-x-2">
                  <Calendar size={18} />
                  <span>Joined {formatDate(user?.createdAt)}</span>
                </div>
                {
                  localStorage.getItem('isLogin') ? <button onClick={logout}>logout</button>:<button onClick={()=>navigate('/loginsignup')}>signin</button>
                }
              </div>
            </div>
          </div>
        </div>
        {/* Stats */}
        <div className="p-4 sm:p-6 border-b">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-black">{userVideos?.length}</div>
              <div className="text-gray-600">Videos</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-black">{totalLikes?.toLocaleString()}</div>
              <div className="text-gray-600">Total Likes</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-black">{totalComments?.toLocaleString()}</div>
              <div className="text-gray-600">Total Comments</div>
            </div>
          </div>
        </div>

        {/* Videos Grid */}
        <div className="p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-bold text-black mb-4 sm:mb-6">Your Videos</h2>
          {userVideos?.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Play size={48} className="mx-auto" />
              </div>
              <p className="text-gray-600">No videos uploaded yet</p>
              <p className="text-sm text-gray-500 mt-2">
                Start sharing your content with the world!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {userVideos?.map((video) => (
                <div
                  key={video?.id}
                  className="bg-gray-50 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="relative">
                    <img
                      src={video?.thumbnailUrl}
                      alt={video?.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <span className={`px-2 py-1 rounded text-xs text-white ${
                        video?.category === 'education'
                          ? 'bg-blue-500'
                          : video?.category === 'funny'
                          ? 'bg-yellow-500'
                          : 'bg-gray-500'
                      }`}>
                        {video?.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-black mb-2 line-clamp-2">{video?.title}</h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{video?.description}</p>
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-1 text-sm text-gray-500">
                      <span>{video?.likes.toLocaleString()} likes</span>
                      <span>{video?.comments} comments</span>
                      <span>{formatDate(video?.createdAt)}</span>
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
