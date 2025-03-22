import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import Swal from 'sweetalert2';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logo from "../../../public/Baay Realty logo (2).png";

const LoginForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    rememberMe: false,
  });
  const [errors, setErrors] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

    useEffect(() => {
         document.title = "Baay Realty - Client Login";
       }, []);

  // Check existing authentication
  useEffect(() => {
    const token = localStorage.getItem('Clienttoken');
    const userData = localStorage.getItem('Clientuser');

    if (token && userData) {
      navigate('/client-dashboard');
    }
  }, [navigate]);

  // Validate form
  const validateForm = () => {
    let isValid = true;
    const newErrors = { username: '', password: '' };

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle form submission
 const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validateForm()) return;

  setLoading(true);
  try {
    const response = await fetch('http://localhost:3005/auth/client/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: formData.username,
        password: formData.password,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem('Clienttoken', data.token);
      localStorage.setItem('Clientuser', JSON.stringify(data.user));

      Swal.fire({
        icon: 'success',
        title: 'Login Successful!',
        text: 'Redirecting to dashboard...',
        showConfirmButton: false,
        timer: 2000,
      });

      navigate('/client-dashboard');
    } else {
      toast.error(data.message || 'Login failed');
    }
  } catch (error) {
    toast.error('Network error. Please try again.');
  } finally {
    setLoading(false);
  }
};

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
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
    preConfirm: async (email) => {
      try {
        // Check if email exists in the backend
        const response = await fetch('http://localhost:3005/client/auth/check-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Email not found');
        }

        // Send OTP
        const otpResponse = await fetch('http://localhost:3005/client/auth/send-otp', {
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
      preConfirm: async (otp) => {
        try {
          const response = await fetch('http://localhost:3005/client/auth/verify-otp', {
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
      // Change password with confirm password and show/hide toggle
      let showPassword = false;
      let showConfirmPassword = false;

      const result = await Swal.fire({
        title: 'Change Password',
        html: `
          <div class="swal2-input-container">
            <div class="password-container" style="position: relative; margin-bottom: 15px;">
              <input id="swal-input-password" type="password" class="swal2-input" placeholder="New Password">
              <button type="button" id="toggle-password" style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer;">
                <i class="fas fa-eye"></i>
              </button>
            </div>
            <div class="password-container" style="position: relative;">
              <input id="swal-input-confirm-password" type="password" class="swal2-input" placeholder="Confirm Password">
              <button type="button" id="toggle-confirm-password" style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer;">
                <i class="fas fa-eye"></i>
              </button>
            </div>
            <div id="password-error" style="color: red; margin-top: 10px; display: none;"></div>
          </div>
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Change Password',
        showLoaderOnConfirm: true,
        didOpen: () => {
          const togglePassword = document.getElementById('toggle-password');
          const toggleConfirmPassword = document.getElementById('toggle-confirm-password');
          const passwordInput = document.getElementById('swal-input-password');
          const confirmPasswordInput = document.getElementById('swal-input-confirm-password');

          togglePassword.addEventListener('click', () => {
            showPassword = !showPassword;
            passwordInput.type = showPassword ? 'text' : 'password';
            togglePassword.innerHTML = showPassword ? '<i class="fas fa-eye-slash"></i>' : '<i class="fas fa-eye"></i>';
          });

          toggleConfirmPassword.addEventListener('click', () => {
            showConfirmPassword = !showConfirmPassword;
            confirmPasswordInput.type = showConfirmPassword ? 'text' : 'password';
            toggleConfirmPassword.innerHTML = showConfirmPassword ? '<i class="fas fa-eye-slash"></i>' : '<i class="fas fa-eye"></i>';
          });
        },
        preConfirm: async () => {
          const passwordInput = document.getElementById('swal-input-password');
          const confirmPasswordInput = document.getElementById('swal-input-confirm-password');
          const passwordError = document.getElementById('password-error');
          
          const newPassword = passwordInput.value;
          const confirmPassword = confirmPasswordInput.value;

          // Validate password match
          if (newPassword !== confirmPassword) {
            passwordError.textContent = 'Passwords do not match!';
            passwordError.style.display = 'block';
            return false;
          }

          // Validate password is not empty
          if (!newPassword) {
            passwordError.textContent = 'Password cannot be empty!';
            passwordError.style.display = 'block';
            return false;
          }

          try {
            const response = await fetch('http://localhost:3005/client/auth/change-password', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email, newPassword }),
            });

            const data = await response.json();

            if (!response.ok) {
              throw new Error(data.message || 'Failed to change password');
            }

            // Send confirmation email
            await fetch('http://localhost:3005/client/auth/send-confirmation-email', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email }),
            });

            return newPassword;
          } catch (error) {
            Swal.showValidationMessage(`Error: ${error.message}`);
          }
        },
      });

      if (result.isConfirmed) {
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
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md flex-col justify-center items-center">
        <div className="flex justify-center items-center">
          <img src={logo} className="w-32 h-32" alt="Baay Realty Logo" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign In to your Baay Realty Client Dashboard
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Username Input */}
            <div>
              <label htmlFor="username" className="block text-left text-sm font-medium text-gray-700">
                Username
              </label>
              <div className="mt-1">
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleInputChange}
                  className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                    errors.username ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.username && (
                  <p className="mt-1 text-sm text-red-500">{errors.username}</p>
                )}
              </div>
            </div>

            {/* Password Input with Eye Icon */}
            <div>
              <label htmlFor="password" className="block text-left text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </button>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                )}
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="rememberMe"
                  name="rememberMe"
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>

              {/* Forgot Password Link */}
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm text-indigo-600 hover:text-indigo-500"
              >
                Forgot Password?
              </button>
            </div>

            {/* Submit Button with Loading State */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  'Sign in'
                )}
              </button>
            </div>

            {/* Signup Link */}
            <div className="text-center text-sm">
              <span className="text-gray-600">Don't have an account? </span>
              <Link
                to="/signup"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Sign Up
              </Link>
            </div>
          </form>
        </div>
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

export default LoginForm;