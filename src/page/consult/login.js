import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { TextField, Button, InputAdornment, IconButton, Typography } from '@mui/material';
import { Visibility, VisibilityOff, CheckCircle } from '@mui/icons-material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logo from "../../public/Baay Realty logo (2).png";

const ConsultLogin = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    captcha: ''
  });
  const [errors, setErrors] = useState({});
  const [captcha, setCaptcha] = useState('');

  // Generate random CAPTCHA
  useEffect(() => {
    generateCaptcha();
  }, []);

  const generateCaptcha = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let newCaptcha = '';
    for (let i = 0; i < 6; i++) {
      newCaptcha += chars[Math.floor(Math.random() * chars.length)];
    }
    setCaptcha(newCaptcha);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username) newErrors.username = 'Username is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.captcha !== captcha) newErrors.captcha = 'Captcha does not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await fetch('https://newportal-backend.onrender.com/auth/consult/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password
        })
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('consultJwt', data.token);
        localStorage.setItem('consultData', JSON.stringify(data.user));
        setLoginSuccess(true);
        setTimeout(() => navigate('/consult-dashboard'), 3000);
      } else {
        toast.error(data.message || 'Login failed');
        generateCaptcha();
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
      generateCaptcha();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-cyan-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 transform transition-all hover:shadow-2xl">
        <div className="text-center mb-8">
        <div className='flex justify-center items-center'>
          <img src={logo} className='w-32 h-32' alt="Baay Realty Logo" />
        </div>
          <Typography variant="h4" className="font-bold text-gray-800 mb-2">
            Consultant Login
          </Typography>
          <Typography variant="body1" className="text-gray-600">
            Access your consultant dashboard
          </Typography>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <TextField
            fullWidth
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            error={!!errors.username}
            helperText={errors.username}
            variant="outlined"
          />

          <TextField
            fullWidth
            label="Password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleChange}
            error={!!errors.password}
            helperText={errors.password}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
            variant="outlined"
          />

          <div className="bg-gray-100 p-4 rounded-lg flex items-center justify-between">
            <Typography variant="body1" className="font-mono text-xl">
              {captcha}
            </Typography>
            <Button
              variant="text"
              color="primary"
              onClick={generateCaptcha}
              className="ml-4"
            >
              Refresh
            </Button>
          </div>

          <TextField
            fullWidth
            label="Enter Captcha"
            name="captcha"
            value={formData.captcha}
            onChange={handleChange}
            error={!!errors.captcha}
            helperText={errors.captcha}
            variant="outlined"
          />

          <Button
            fullWidth
            variant="contained"
            color="primary"
            size="large"
            type="submit"
            className="h-12"
          >
            Sign In
          </Button>
        </form>

        <AnimatePresence>
          {loginSuccess && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="bg-white rounded-2xl p-8 max-w-sm text-center"
              >
                <CheckCircle className="text-green-500 text-6xl mb-4 mx-auto" />
                <Typography variant="h5" className="mb-4">
                  Login Successful!
                </Typography>
                <Typography variant="body1">
                  Redirecting to dashboard...
                </Typography>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <ToastContainer position="top-center" autoClose={3000} />
      </div>
    </div>
  );
};

export default ConsultLogin;