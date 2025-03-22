import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { TextField, Button, InputAdornment, IconButton, Typography, CircularProgress } from '@mui/material';
import { Visibility, VisibilityOff, CheckCircle } from '@mui/icons-material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logo from "../../public/Baay Realty logo (2).png";
import Swal from 'sweetalert2';

const RealtorLogin = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    captcha: ''
  });
  const [errors, setErrors] = useState({});
  const [captcha, setCaptcha] = useState('');


   useEffect(() => {
        document.title = "Baay Realty - Realtor Login";
      }, []);

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

    setIsLoading(true);
    try {
      const response = await fetch('https://newportal-backend.onrender.com/auth/realtor/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password
        })
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('realtorJwt', data.token);
        localStorage.setItem('realtorData', JSON.stringify(data.user));
        setLoginSuccess(true);
        setTimeout(() => navigate('/realtor-dashboard'), 3000);
      } else {
        toast.error(data.message || 'Login failed');
        generateCaptcha();
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
      generateCaptcha();
    } finally {
      setIsLoading(false);
    }
  };

  // Handle forgot password
  const handleForgotPassword = async () => {
    const { value: email } = await Swal.fire({
      title: 'Forgot Password',
      input: 'email',
      inputLabel: 'Enter your email address',
      inputPlaceholder: 'Email',
      showCancelButton: true,
      confirmButtonText: 'Send OTP',
      showLoaderOnConfirm: true,
      allowOutsideClick: () => !Swal.isLoading(),
      preConfirm: async (email) => {
        try {
          // Check if email exists in the backend
          const response = await fetch('http://localhost:3005/realtor/auth/check-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
          });
  
          const data = await response.json();
  
          if (!response.ok) {
            throw new Error(data.message || 'Email not found');
          }
  
          // Send OTP
          const otpResponse = await fetch('http://localhost:3005/realtor/auth/send-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
          });
  
          const otpData = await otpResponse.json();
  
          if (!otpResponse.ok) {
            throw new Error(otpData.message || 'Failed to send OTP');
          }
  
          return email;
        } catch (error) {
          Swal.showValidationMessage(`Error: ${error.message}`);
        }
      },
    });
  
    if (email) {
      // Verify OTP
      const { value: otp } = await Swal.fire({
        title: 'Enter OTP',
        input: 'text',
        inputLabel: 'A 6-digit OTP has been sent to your email',
        inputPlaceholder: 'OTP',
        showCancelButton: true,
        confirmButtonText: 'Verify',
        showLoaderOnConfirm: true,
        allowOutsideClick: () => !Swal.isLoading(),
        preConfirm: async (otp) => {
          try {
            const response = await fetch('http://localhost:3005/realtor/auth/verify-otp', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email, otp }),
            });
  
            const data = await response.json();
  
            if (!response.ok) {
              throw new Error(data.message || 'Invalid OTP');
            }
  
            return otp;
          } catch (error) {
            Swal.showValidationMessage(`Error: ${error.message}`);
          }
        },
      });
  
      if (otp) {
        // Change password
        const { value: formValues } = await Swal.fire({
          title: 'Change Password',
          html:
            '<input id="newPassword" type="password" placeholder="New Password" class="swal2-input">' +
            '<input id="confirmPassword" type="password" placeholder="Confirm Password" class="swal2-input">' +
            '<label class="flex items-center mt-2">' +
            '<input id="showPassword" type="checkbox" class="mr-2"> Show Password' +
            '</label>',
          focusConfirm: false,
          showCancelButton: true,
          confirmButtonText: 'Change Password',
          showLoaderOnConfirm: true,
          allowOutsideClick: () => !Swal.isLoading(),
          didOpen: () => {
            // Add event listener when the modal opens
            document.getElementById('showPassword').addEventListener('change', function() {
              const newPassword = document.getElementById('newPassword');
              const confirmPassword = document.getElementById('confirmPassword');
              
              newPassword.type = this.checked ? 'text' : 'password';
              confirmPassword.type = this.checked ? 'text' : 'password';
            });
          },
          preConfirm: async () => {
            const newPassword = document.getElementById('newPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
  
            // Validate passwords
            if (!newPassword || !confirmPassword) {
              Swal.showValidationMessage('Please fill in both password fields');
              return false;
            }
  
            if (newPassword !== confirmPassword) {
              Swal.showValidationMessage('Passwords do not match');
              return false;
            }
            
            try {
              const response = await fetch('http://localhost:3005/realtor/auth/change-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, newPassword }),
              });
    
              const data = await response.json();
    
              if (!response.ok) {
                throw new Error(data.message || 'Failed to change password');
              }
    
              // Send confirmation email
              await fetch('http://localhost:3005/realtor/auth/send-confirmation-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
              });
              
              return { success: true };
            } catch (error) {
              Swal.showValidationMessage(`Error: ${error.message}`);
              return false;
            }
          },
        });
  
        if (formValues && formValues.success) {
          Swal.fire({
            icon: 'success',
            title: 'Password Changed!',
            text: 'Your password has been updated successfully.',
          });
        }
      }
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
            Realtor Login
          </Typography>
          <Typography variant="body1" className="text-gray-600">
            Access your realtor dashboard
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
            disabled={isLoading}
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
                  <IconButton onClick={() => setShowPassword(!showPassword)} disabled={isLoading}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
            variant="outlined"
            disabled={isLoading}
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
              disabled={isLoading}
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
            disabled={isLoading}
          />

          <Button
            fullWidth
            variant="contained"
            color="primary"
            size="large"
            type="submit"
            className="h-12"
            disabled={isLoading}
          >
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Sign In"
            )}
          </Button>

          {/* Forgot Password Link */}
          <Button
            fullWidth
            variant="text"
            color="primary"
            onClick={handleForgotPassword}
            className="mt-4"
            disabled={isLoading}
          >
            Forgot Password?
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

export default RealtorLogin;