import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const UploadVideo = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [videoFile, setVideoFile] = useState(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
const isLogin = localStorage.getItem('isLogin')
  const categories = [
    { label: 'funny', emoji: '😄' },
    { label: 'education', emoji: '📚' },
    { label: 'sad', emoji: '😢' },
     { label: 'love', emoji: '❤️' }
  ];

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('video/')) {
      setVideoFile(file);
    } else {
      alert('Please select a valid video file.');
    }
  };

  const handleSubmit = async () => {
    if (!videoFile || !title || !category) {
      toast.error('Please fill all required fields.');
      return;
    }

    if(!isLogin){
      toast.info("first login your account.")
      return 
    }

    const formData = new FormData();
    formData.append('videourl', videoFile);
    formData.append('Title', title);
    formData.append('category', category);

    try {
      setLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/uploadvideo`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          withCredentials:true
        }
      );
      console.log(res.data);
      alert('Video uploaded successfully!');
      navigate('/',{replace:true});
    } catch (error) {
      console.error(error);
      alert('Video upload failed!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 mt-8">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-black text-center w-full">
            Upload Video
          </h2>
          <h1 onClick={() => navigate('/home',{replace:true})} className="cursor-pointer text-xl font-bold">X</h1>
        </div>

        <form className="space-y-6">
          {/* Video Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Video File
            </label>
            <div className="relative">
              <input
                type="file"
                accept="video/*"
                onChange={handleVideoChange}
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
              />
              <div
                className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-pink-500 transition-colors"
              >
                <div className="flex flex-col items-center space-y-2">
                  <Upload size={48} className="text-gray-400" />
                  <p className="text-gray-500">
                    {videoFile ? videoFile.name : 'Click to upload video'}
                  </p>
                  <p className="text-sm text-gray-400">MP4, WebM, or OGV</p>
                </div>
              </div>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-pink-500 transition-colors"
              placeholder="Enter video title"
            />
          </div>

          {/* Category Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <div className="grid grid-cols-3 gap-4">
              {categories.map((cat, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-colors text-center ${
                    category === cat.label
                      ? 'border-pink-500 bg-pink-100'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setCategory(cat.label)}
                >
                  <div className="text-2xl mb-1">{cat.emoji}</div>
                  <div className="font-medium">{cat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-gradient-to-r from-pink-500 to-pink-600 text-white py-3 rounded-lg font-medium hover:from-pink-600 hover:to-pink-700 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Upload size={20} />
            {loading ? 'Uploading...' : 'Upload Video'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadVideo;
