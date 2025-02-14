import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import logo from "../../public/Baay Realty logo (2).png";

const generateCaptcha = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let captcha = "";
  for (let i = 0; i < 6; i++) {
    captcha += chars[Math.floor(Math.random() * chars.length)];
  }
  return captcha;
};

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    captchaInput: ""
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [captcha, setCaptcha] = useState("");
  const [isCaptchaVisible, setIsCaptchaVisible] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Check if the user is already logged in
  useEffect(() => {
    const token = localStorage.getItem("Admintoken");
    const username = localStorage.getItem("Adminusername");

    if (token && username) {
      // Redirect to the dashboard if the user is already logged in
      navigate("/admin-dashboard");
    }
  }, [navigate]);

  useEffect(() => {
    refreshCaptcha();
  }, []);

  useEffect(() => {
    if (errors.captchaInput) {
      setIsCaptchaVisible(false);
      const timer = setTimeout(() => setIsCaptchaVisible(true), 500);
      return () => clearTimeout(timer);
    }
  }, [errors.captchaInput]);

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "username":
        if (!value) error = "Username is required";
        break;
      case "password":
        if (!value) error = "Password is required";
        break;
      case "captchaInput":
        if (!value) error = "Captcha is required";
        else if (value !== captcha) error = "Captcha does not match";
        break;
      default:
        break;
    }
    return error;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const refreshCaptcha = () => {
    const newCaptcha = generateCaptcha();
    setCaptcha(newCaptcha);
    setFormData(prev => ({ ...prev, captchaInput: "" }));
    setErrors(prev => ({ ...prev, captchaInput: "" }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "https://newportal-backend.onrender.com/auth/admin/login",
        {
          username: formData.username,
          password: formData.password,
          captcha: formData.captchaInput,
        }
      );

      toast.success("Login Successful!");
      localStorage.setItem("Admintoken", response.data.token);
      localStorage.setItem("Adminusername", response.data.username);

      setTimeout(() => navigate('/admin-dashboard'), 3000);
      
      setFormData({ username: "", password: "", captchaInput: "" });
      refreshCaptcha();
    } catch (error) {
      const message = error.response?.data?.message || "Login Failed";
      toast.error(message);
      
      if (error.response?.status === 400 || error.response?.status === 401) {
        setErrors(prev => ({ ...prev, serverError: message }));
        refreshCaptcha();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-teal-400 to-cyan-500">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md transition-all duration-300 hover:shadow-2xl">
        <div className='flex justify-center items-center'>
          <img src={logo} className='w-32 h-32' alt="Baay Realty Logo" />
        </div>
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Admin Portal
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-left text-gray-700 mb-2">
              Username
            </label>
            <input
              name="username"
              type="text"
              value={formData.username}
              onChange={handleInputChange}
              onBlur={(e) => {
                const error = validateField(e.target.name, e.target.value);
                setErrors(prev => ({ ...prev, [e.target.name]: error }));
              }}
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.username ? "border-red-500" : "border-gray-300"
              } focus:ring-2 focus:ring-teal-500 focus:border-transparent`}
              placeholder="Enter username"
              autoComplete="username"
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1 text-left">{errors.username}</p>
            )}
          </div>

          <div>
            <label className="block text-sm text-left font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleInputChange}
                onBlur={(e) => {
                  const error = validateField(e.target.name, e.target.value);
                  setErrors(prev => ({ ...prev, [e.target.name]: error }));
                }}
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.password ? "border-red-500" : "border-gray-300"
                } focus:ring-2 focus:ring-teal-500 focus:border-transparent pr-10`}
                placeholder="Enter password"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-3.5 text-gray-400 hover:text-teal-500 focus:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1 text-left">{errors.password}</p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Captcha
              </label>
              <button
                type="button"
                onClick={refreshCaptcha}
                className="text-sm text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                    clipRule="evenodd"
                  />
                </svg>
                Refresh
              </button>
            </div>
            
            <div className="flex gap-4">
              <div className="relative flex-1">
                <div
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.captchaInput ? "border-red-500" : "border-gray-300"
                  } bg-gray-50 flex items-center justify-center text-xl font-mono transition-opacity ${
                    isCaptchaVisible ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <span className="filter select-none pointer-events-none">
                    {captcha}
                  </span>
                </div>
              </div>
              
              <input
                name="captchaInput"
                type="text"
                value={formData.captchaInput}
                onChange={handleInputChange}
                onBlur={(e) => {
                  const error = validateField(e.target.name, e.target.value);
                  setErrors(prev => ({ ...prev, [e.target.name]: error }));
                }}
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.captchaInput ? "border-red-500" : "border-gray-300"
                } focus:ring-2 focus:ring-teal-500 focus:border-transparent`}
                placeholder="Enter captcha"
                autoComplete="off"
              />
            </div>
            
            {errors.captchaInput && (
              <p className="text-red-500 text-sm mt-1">{errors.captchaInput}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-semibold rounded-lg transition-all duration-300 flex items-center justify-center disabled:opacity-75"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 mr-3 text-white"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Authenticating...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default AdminLogin;