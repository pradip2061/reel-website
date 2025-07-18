import React, { useEffect, useState } from "react";
import {
  Home,
  Upload,
  User,
  Smile,
  Book,
  Frown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getvideoThunk } from "../../store/getvideo/getvideoThunk";

const categories = [
  { label: "funny", icon: <Smile size={18} />, key: "funny" },
  { label: "education", icon: <Book size={18} />, key: "education" },
  { label: "sad", icon: <Frown size={18} />, key: "sad" },
];

const Nav = () => {
  const navigate=useNavigate()
  const dispatch =useDispatch()
  const[category,setCategory]=useState("")
     const selectcategory =(label)=>{
      setCategory(label)
     }

     useEffect(()=>{
        dispatch(getvideoThunk(category))
     },[category])

  return (
    <>
      {/* Deskto */}
      <nav className="hidden fixed md:flex  z-20 w-full items-center justify-between px-4 py-3 bg-black text-white border-b border-pink-500">
        <div className="flex items-center space-x-6">
          <span className="text-pink-500 font-bold text-xl">VidShare</span>
          <div className="flex items-center space-x-3">
            {categories.map((cat) => (
              <button
                key={cat.key}
                 onClick={()=>selectcategory(cat.label)}
                className={`flex items-center px-3 py-1 rounded-full text-sm ${
                  cat.label === "Funny"
                    ? "bg-pink-500 text-white"
                    : "hover:text-pink-400"
                }`}
              >
                {cat.icon}
                <span className="ml-1">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button className="flex items-center space-x-1 hover:text-pink-400" onClick={()=>navigate('/uploadvideo')}>
            <Upload size={18} />
            <span>Upload</span>
          </button>
          <button className="flex items-center space-x-1 hover:text-pink-400" onClick={()=>navigate('/userprofile')}>
            <User size={18} />
            <span>Profile</span>
          </button>
        </div>
      </nav>

      {/* Mobile Category Bar (Top) */}
      <div className="  absolute md:hidden  w-full z-20 flex overflow-x-auto space-x-3 px-4 py-2   text-white">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={()=>selectcategory(cat.label)}
            className={`flex items-center px-3 py-1 rounded-full text-sm whitespace-nowrap  hover:text-pink-400 `}
          >
            {cat.icon}
            <span className="ml-1">{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Mobile Bottom Tab Bar */}
      <div className="md:hidden fixed z-20 bottom-0 left-0 w-full bg-black  flex justify-between px-8 py-2 text-white">
        <button className="flex flex-col items-center text-xs" onClick={()=>navigate('/home')}>
          <Home size={20} />
          <span>Home</span>
        </button>
        <button className="flex flex-col items-center text-xs bg-pink-500 p-2 rounded-full -mt-1" onClick={()=>navigate('/uploadvideo')}>
          <Upload size={20} />
        </button>
        <button className="flex flex-col items-center text-xs" onClick={()=>navigate('/userprofile')}>
          <User size={20} />
          <span>Profile</span>
        </button>
      </div>
    </>
  );
};

export default Nav;
