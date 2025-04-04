import React, { useState, useEffect, useRef } from "react";
import {
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Box,
  Typography,
  CircularProgress,
  MenuItem,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Person,
  Email,
  Phone,
  Cake,
  Lock,
  People,
  AccountCircle,
} from "@mui/icons-material";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import logo from "../../public/Baay Realty logo (2).png";

const RegisterForm = () => {
  const { referralId } = useParams(); // Get the referral ID from URL
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const navigate = useNavigate();
  const timerRef = useRef(null);

  const primaryColor = "#002657";
const primaryHoverColor = "#001a3d";
const primaryLightColor = "#334d7a";
const primaryContrastText = "#ffffff";


   useEffect(() => {
        document.title = "Baay Realty - Realtor Registration";
      }, []);

  // Add useEffect to set initial referrer value
  useEffect(() => {
    if (referralId) {
      setFormData(prev => ({
        ...prev,
        referrer: referralId
      }));
    }
  }, [referralId]);

  const [formData, setFormData] = useState({
    username: "",
    referrer: "",
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    dob: "",
    gender: "",
    bank: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear errors when the user starts typing
    setErrors({ ...errors, [name]: "" });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username) newErrors.username = "Username is required";
    if (!formData.referrer) newErrors.referrer = "Referrer is required";
    if (!formData.firstName) newErrors.firstName = "First Name is required";
    if (!formData.lastName) newErrors.lastName = "Last Name is required";
    if (!formData.phone) newErrors.phone = "Phone is required";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
    if (!formData.dob) newErrors.dob = "Date of Birth is required";
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.password) newErrors.password = "Password is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const startResendTimer = () => {
    setResendDisabled(true);
    setCountdown(60);
    
    timerRef.current = setInterval(() => {
      setCountdown((prevCount) => {
        if (prevCount <= 1) {
          clearInterval(timerRef.current);
          setResendDisabled(false);
          return 0;
        }
        return prevCount - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const requestOTP = async () => {
    try {
      const response = await fetch("https://newportal-backend.onrender.com/auth/realtor/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: formData.email }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        startResendTimer();
        return true;
      } else {
        toast.error(data.message || "Failed to send OTP. Please try again.");
        return false;
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast.error("An error occurred while sending OTP. Please try again.");
      return false;
    }
  };

  const verifyOTP = async (otp) => {
    try {
      const response = await fetch("https://newportal-backend.onrender.com/auth/realtor/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          email: formData.email,
          otp
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        return { success: true };
      } else {
        return { success: false, message: data.message || "Invalid OTP" };
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      return { success: false, message: "An error occurred while verifying OTP" };
    }
  };

  console.log(formData);

  const completeRegistration = async () => {
    try {
      const response = await fetch("https://newportal-backend.onrender.com/auth/realtor/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem('realtorJwt', data.token);
        localStorage.setItem('realtorData', JSON.stringify(data.newRealtor));
        
        // Show success message
        Swal.fire({
          icon: 'success',
          title: 'Registration Successful!',
          text: 'You are now registered as a realtor.',
          showConfirmButton: true,
          confirmButtonText: 'Go to Dashboard',
        }).then((result) => {
          if (result.isConfirmed) {
            navigate("/realtor-dashboard");
          }
        });
        
        return true;
      } else {
        toast.error(data.message || "Registration failed. Please try again.");
        return false;
      }
    } catch (error) {
      console.error("Error during registration:", error);
      toast.error("An error occurred. Please try again.");
      return false;
    }
  };

  const showOTPModal = async () => {
    // First request the OTP to be sent
    const otpSent = await requestOTP();
    if (!otpSent) return;
    
    const inputOptions = {
      customClass: {
        popup: 'swal-wide',
        input: 'swal-input'
      },
      title: 'Email Verification',
      html: `
        <p>We've sent a verification code to <strong>${formData.email}</strong></p>
        <div class="otp-container">
          <input type="text" id="otp-1" class="otp-input" maxlength="1" autofocus>
          <input type="text" id="otp-2" class="otp-input" maxlength="1">
          <input type="text" id="otp-3" class="otp-input" maxlength="1">
          <input type="text" id="otp-4" class="otp-input" maxlength="1">
          <input type="text" id="otp-5" class="otp-input" maxlength="1">
          <input type="text" id="otp-6" class="otp-input" maxlength="1">
        </div>
        <p id="countdown-text" class="countdown-text">Resend code in ${countdown} seconds</p>
      `,
      showConfirmButton: true,
      confirmButtonText: 'Verify',
      showCancelButton: true,
      cancelButtonText: 'Cancel',
      focusConfirm: false,
      allowOutsideClick: false,
      didOpen: () => {
        // Style for OTP input
        const style = document.createElement('style');
        style.innerHTML = `
          .swal-wide {
            width: 400px !important;
          }
          .otp-container {
            display: flex;
            justify-content: center;
            gap: 8px;
            margin: 20px 0;
          }
          .otp-input {
            width: 40px;
            height: 40px;
            text-align: center;
            font-size: 18px;
            border: 1px solid #ddd;
            border-radius: 4px;
          }
          .otp-input:focus {
            border-color: #3f51b5;
            outline: none;
          }
          .countdown-text {
            font-size: 14px;
            color: #666;
            margin-top: 10px;
          }
        `;
        document.head.appendChild(style);
        
        // Auto focus to next input
        const inputs = document.querySelectorAll('.otp-input');
        inputs.forEach((input, index) => {
          input.addEventListener('keyup', (e) => {
            if (e.key !== 'Backspace' && input.value) {
              const nextInput = inputs[index + 1];
              if (nextInput) nextInput.focus();
            }
          });
          
          input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && !input.value) {
              const prevInput = inputs[index - 1];
              if (prevInput) prevInput.focus();
            }
          });
        });
        
        // Update countdown timer
        const countdownElement = document.getElementById('countdown-text');
        let remainingTime = countdown;
        
        const countdownInterval = setInterval(() => {
          remainingTime--;
          if (remainingTime <= 0) {
            clearInterval(countdownInterval);
            countdownElement.textContent = 'Didn\'t receive the code? Resend';
            countdownElement.style.color = '#3f51b5';
            countdownElement.style.cursor = 'pointer';
            countdownElement.addEventListener('click', async () => {
              const otpResent = await requestOTP();
              if (otpResent) {
                countdownElement.textContent = `Resend code in ${countdown} seconds`;
                countdownElement.style.color = '#666';
                countdownElement.style.cursor = 'default';
                remainingTime = countdown;
                
                const newInterval = setInterval(() => {
                  remainingTime--;
                  if (remainingTime <= 0) {
                    clearInterval(newInterval);
                    countdownElement.textContent = 'Didn\'t receive the code? Resend';
                    countdownElement.style.color = '#3f51b5';
                    countdownElement.style.cursor = 'pointer';
                  } else {
                    countdownElement.textContent = `Resend code in ${remainingTime} seconds`;
                  }
                }, 2000);
              }
            });
          } else {
            countdownElement.textContent = `Resend code in ${remainingTime} seconds`;
          }
        }, 2000);
        
        // Cleanup interval on close
        Swal.getPopup().addEventListener('swalClose', () => {
          clearInterval(countdownInterval);
        });
      },
      preConfirm: () => {
        // Collect OTP from the inputs
        const otpValues = [];
        for (let i = 1; i <= 6; i++) {
          const input = document.getElementById(`otp-${i}`);
          otpValues.push(input.value);
        }
        
        const otp = otpValues.join('');
        
        if (otp.length !== 6 || !/^\d+$/.test(otp)) {
          Swal.showValidationMessage('Please enter a valid 6-digit OTP');
          return false;
        }
        
        return otp;
      }
    };
    
    const { value: otp, isDismissed } = await Swal.fire(inputOptions);
    
    if (isDismissed) return;
    
    if (otp) {
      setLoading(true);
      const verificationResult = await verifyOTP(otp);
      
      if (verificationResult.success) {
        await completeRegistration();
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Verification Failed',
          text: verificationResult.message,
          confirmButtonText: 'Try Again'
        }).then(() => {
          showOTPModal(); // Show the OTP modal again
        });
      }
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    console.log(formData)
    
    setLoading(true);
    try {
      // First check if the email and username are available
      const checkResponse = await fetch("https://newportal-backend.onrender.com/auth/realtor/check-availability", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          username: formData.username
        }),
      });
      
      const checkData = await checkResponse.json();
      
      if (!checkResponse.ok) {
        toast.error(checkData.message || "Registration failed. Email or username already in use.");
        setLoading(false);
        return;
      }
      
      // If available, proceed to OTP verification
      await showOTPModal();
      
    } catch (error) {
      console.error("Error during registration:", error);
      toast.error("An error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 600,
        margin: "auto",
        mt: 4,
        p: 4,
        boxShadow: 3,
        borderRadius: 2,
        background: "white",
      }}
    >
      <div className='flex justify-center items-center'>
        <img src={logo} className='w-32 h-32' alt="Baay Realty Logo" />
      </div>
      <Typography 
        variant="h4" 
        gutterBottom 
        align="center" 
        sx={{ 
          color: primaryColor, 
          fontWeight: "bold" 
        }}
      >
        Welcome to Our Platform!
      </Typography>
      <Typography 
        variant="body1" 
        gutterBottom 
        align="center" 
        sx={{ mb: 4, color: "#666" }}
      >
        Please fill out the form below to create your realtor account.
      </Typography>

      <form onSubmit={handleSubmit}>
        {/* Username */}
        <TextField
          fullWidth
          label="Username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          margin="normal"
          error={!!errors.username}
          helperText={errors.username}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
              '&:hover fieldset': {
                borderColor: primaryColor,
              },
              '&.Mui-focused fieldset': {
                borderColor: primaryColor,
                boxShadow: `0 0 0 2px ${primaryLightColor}`,
              },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Person sx={{ color: primaryColor }} />
              </InputAdornment>
            ),
          }}
        />

        {/* Referrer */}
        <TextField
          fullWidth
          label="Referrer"
          name="referrer"
          value={formData.referrer}
          onChange={handleChange}
          margin="normal"
          error={!!errors.referrer}
          helperText={errors.referrer}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
              '&:hover fieldset': {
                borderColor: primaryColor,
              },
              '&.Mui-focused fieldset': {
                borderColor: primaryColor,
                boxShadow: `0 0 0 2px ${primaryLightColor}`,
              },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <People sx={{ color: primaryColor }} />
              </InputAdornment>
            ),
            readOnly: !!referralId,
          }}
          disabled={!!referralId}
        />

        {/* First Name */}
        <TextField
          fullWidth
          label="First Name"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          margin="normal"
          error={!!errors.firstName}
          helperText={errors.firstName}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
              '&:hover fieldset': {
                borderColor: primaryColor,
              },
              '&.Mui-focused fieldset': {
                borderColor: primaryColor,
                boxShadow: `0 0 0 2px ${primaryLightColor}`,
              },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AccountCircle sx={{ color: primaryColor }} />
              </InputAdornment>
            ),
          }}
        />

        {/* Last Name */}
        <TextField
          fullWidth
          label="Last Name"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          margin="normal"
          error={!!errors.lastName}
          helperText={errors.lastName}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
              '&:hover fieldset': {
                borderColor: primaryColor,
              },
              '&.Mui-focused fieldset': {
                borderColor: primaryColor,
                boxShadow: `0 0 0 2px ${primaryLightColor}`,
              },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AccountCircle sx={{ color: primaryColor }} />
              </InputAdornment>
            ),
          }}
        />

        {/* Phone */}
        <TextField
          fullWidth
          label="Phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          margin="normal"
          error={!!errors.phone}
          helperText={errors.phone}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
              '&:hover fieldset': {
                borderColor: primaryColor,
              },
              '&.Mui-focused fieldset': {
                borderColor: primaryColor,
                boxShadow: `0 0 0 2px ${primaryLightColor}`,
              },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Phone sx={{ color: primaryColor }} />
              </InputAdornment>
            ),
          }}
        />

        {/* Email */}
        <TextField
          fullWidth
          label="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          margin="normal"
          error={!!errors.email}
          helperText={errors.email}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
              '&:hover fieldset': {
                borderColor: primaryColor,
              },
              '&.Mui-focused fieldset': {
                borderColor: primaryColor,
                boxShadow: `0 0 0 2px ${primaryLightColor}`,
              },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Email sx={{ color: primaryColor }} />
              </InputAdornment>
            ),
          }}
        />

        {/* Date of Birth */}
        <TextField
          fullWidth
          label="Date of Birth"
          name="dob"
          type="date"
          value={formData.dob}
          onChange={handleChange}
          margin="normal"
          error={!!errors.dob}
          helperText={errors.dob}
          InputLabelProps={{ shrink: true }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
              '&:hover fieldset': {
                borderColor: primaryColor,
              },
              '&.Mui-focused fieldset': {
                borderColor: primaryColor,
                boxShadow: `0 0 0 2px ${primaryLightColor}`,
              },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Cake sx={{ color: primaryColor }} />
              </InputAdornment>
            ),
          }}
        />

        {/* Gender */}
        <TextField
          fullWidth
          label="Gender"
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          margin="normal"
          error={!!errors.gender}
          helperText={errors.gender}
          select
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
              '&:hover fieldset': {
                borderColor: primaryColor,
              },
              '&.Mui-focused fieldset': {
                borderColor: primaryColor,
                boxShadow: `0 0 0 2px ${primaryLightColor}`,
              },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <People sx={{ color: primaryColor }} />
              </InputAdornment>
            ),
          }}
        >
          <MenuItem value="male">Male</MenuItem>
          <MenuItem value="female">Female</MenuItem>
          <MenuItem value="other">Other</MenuItem>
        </TextField>

        {/* Password */}
        <TextField
          fullWidth
          label="Password"
          name="password"
          type={showPassword ? "text" : "password"}
          value={formData.password}
          onChange={handleChange}
          margin="normal"
          error={!!errors.password}
          helperText={errors.password}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
              '&:hover fieldset': {
                borderColor: primaryColor,
              },
              '&.Mui-focused fieldset': {
                borderColor: primaryColor,
                boxShadow: `0 0 0 2px ${primaryLightColor}`,
              },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Lock sx={{ color: primaryColor }} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? 
                    <VisibilityOff sx={{ color: primaryColor }} /> : 
                    <Visibility sx={{ color: primaryColor }} />
                  }
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {/* Submit Button */}
        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{ 
            mt: 2, 
            borderRadius: '8px', 
            fontWeight: 'bold', 
            fontSize: '16px', 
            py: 1.5,
            backgroundColor: primaryColor,
            color: primaryContrastText,
            '&:hover': {
              backgroundColor: primaryHoverColor,
            }
          }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Register"}
        </Button>
      </form>

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
    </Box>
  );
};

export default RegisterForm;