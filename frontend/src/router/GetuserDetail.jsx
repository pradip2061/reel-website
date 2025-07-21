import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const GetuserDetail = () => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const location = useLocation();
  const idArray = location.state?.ids || [];
  const data = location.state?.data || ''; // 'followers' or 'following'
  console.log(users)
const navigate=useNavigate()
  useEffect(() => {
    const fetchuser = async () => {
      try {
        setLoading(true);
        const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/getuserfollow`, {
          userid: idArray,
        });
        if (res.status === 200) {
          setUsers(res.data.users);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchuser();
  }, [idArray]);

  return (
    <div className="min-h-screen bg-white text-black px-4 py-8 pt-20">
      <h1 className="text-2xl font-bold text-pink-500 mb-6 text-center">
        {data === 'following' ? 'Following' : 'Followers'}
      </h1>

      {loading ? (
        <div className="flex flex-col gap-4">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="flex items-center gap-4 bg-pink-50 p-4 rounded-2xl shadow animate-pulse"
            >
              <div className="w-14 h-14 rounded-full bg-pink-200"></div>
              <div className="h-5 bg-pink-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {users.map((user, index) => (
            <div
              key={index}
              className="flex items-center gap-4 bg-pink-100 p-4 rounded-2xl shadow hover:bg-pink-200 transition duration-300"
            >
              <img
                src={user.profilepic || 'https://via.placeholder.com/60'}
                alt={user.Name}
                className="w-14 h-14 rounded-full border-2 border-pink-500 object-cover"
                onClick={()=>navigate(`/visitprofile/${user.userid}`)}
              />
              <span className="text-lg font-semibold text-pink-700">{user.Name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GetuserDetail;
