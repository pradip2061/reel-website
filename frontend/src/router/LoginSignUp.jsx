import React, { useEffect, useRef, useState } from "react";
import {
  Eye, EyeOff, Mail, Lock, User,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { signupThunk } from "../../store/signup/SignupThunk";
import { resetdata } from "../../store/signup/SignupSlice";
import { loginThunk } from "../../store/login/LoginThunk";
import { resetdataLogin } from "../../store/login/LoginSlice";

export default function LoginSignup() {
  const [mode, setMode] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const errorSignup = useSelector((state) => state.signup.error);
  const messageSignup = useSelector((state) => state.signup.message);
  const errorLogin = useSelector((state) => state.login.error);
  const messageLogin = useSelector((state) => state.login.message);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    profilepic: null,
  });

  const fileInputRef = useRef(null);

  useEffect(() => {
    setMode(location.state || "login");
  }, [location]);

  const handleButtonClick = () => {
    fileInputRef.current.click(); // Trigger file input click
  };

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setFormData((prev) => ({
        ...prev,
        [name]: files[0],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      if (mode === "signup") {
        await dispatch(signupThunk(formData));
        dispatch(resetdata());
        setFormData({
          email: "",
          password: "",
          confirmPassword: "",
          firstName: "",
          lastName: "",
          profilepic: null,
        });
        setMode("login");
      } else {
        await dispatch(loginThunk(formData));
        dispatch(resetdataLogin());
        navigate("/", { replace: true });
      }
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (messageSignup) {
      toast.success(messageSignup);
    } else if (errorSignup) {
      toast.error(errorSignup);
    } else if (messageLogin) {
      toast.success(messageLogin);
    } else if (errorLogin) {
      toast.error(errorLogin);
    }
  }, [messageSignup, errorSignup, messageLogin, errorLogin]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 lg:pt-20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl p-6 space-y-6">
          <div className="flex bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => setMode("login")}
              className={`flex-1 py-3 rounded-lg font-semibold ${
                mode === "login"
                  ? "bg-white text-blue-600 shadow"
                  : "text-gray-600"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setMode("signup")}
              className={`flex-1 py-3 rounded-lg font-semibold ${
                mode === "signup"
                  ? "bg-white text-blue-600 shadow"
                  : "text-gray-600"
              }`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === "signup" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative">
                  <User className="absolute left-3 top-3.5 text-gray-400" />
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-10 py-3 border rounded-xl focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div className="relative">
                  <User className="absolute left-3 top-3.5 text-gray-400" />
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-10 py-3 border rounded-xl focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-3 top-3.5 text-gray-400" />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full pl-10 py-3 border rounded-xl focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-3.5 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="w-full pl-10 pr-10 py-3 border rounded-xl focus:ring-blue-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-gray-400"
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>

            {mode === "signup" && (
              <>
                <div>
                  <input
                    type="file"
                    name="profilepic"
                    onChange={handleInputChange}
                    ref={fileInputRef}
                    hidden
                  />
                  <button
                    type="button"
                    onClick={handleButtonClick}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Upload Profile Image
                  </button>
                  {formData.profilepic && (
                    <p className="text-sm mt-1 text-gray-500">
                      Selected: {formData.profilepic.name}
                    </p>
                  )}
                </div>

                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 text-gray-400" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-10 pr-10 py-3 border rounded-xl focus:ring-blue-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    className="absolute right-3 top-3.5 text-gray-400"
                  >
                    {showConfirmPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </>
            )}

            {mode === "login" && (
              <div className="text-right text-sm">
                <a href="#" className="text-blue-600">
                  Forgot Password?
                </a>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition-all duration-200"
            >
              {isLoading ? (
                <div className="flex justify-center items-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>
                    {mode === "login" ? "Signing In..." : "Creating Account..."}
                  </span>
                </div>
              ) : mode === "login" ? (
                "Sign In"
              ) : (
                "Create Account"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
