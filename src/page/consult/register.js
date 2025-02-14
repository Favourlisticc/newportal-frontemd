import React, { useState, useEffect} from "react";
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
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from "../../public/Baay Realty logo (2).png";


const RegisterForm = () => {
  const { referralId } = useParams(); // Get the referral ID from URL
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

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
    // address: "",
    // country: "",
    // state: "",
    // accountName: "",
    // accountNumber: "",
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
    // if (!formData.address) newErrors.address = "Address is required";
    // if (!formData.country) newErrors.country = "Country is required";
    // if (!formData.state) newErrors.state = "State is required";
    // if (!formData.accountName) newErrors.accountName = "Account Name is required";
    // if (!formData.accountNumber) newErrors.accountNumber = "Account Number is required";
    // if (!formData.bank) newErrors.bank = "Bank is required";
    if (!formData.password) newErrors.password = "Password is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await fetch("https://newportal-backend.onrender.com/auth/consult/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        console.log("Registration successful:", data);
        setRegistrationSuccess(true);
        localStorage.setItem('consultJwt', data.token);
        localStorage.setItem('consultData', JSON.stringify(data.newConsultant));

        // Redirect to dashboard after 3 seconds
        setTimeout(() => {
          navigate("/consult-dashboard");
        }, 3000);
      } else {
        // Display backend error message using toast
        toast.error(data.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
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
        backgroundColor: "background.paper",
      }}
    >
      <div className='flex justify-center items-center'>
          <img src={logo} className='w-32 h-32' alt="Baay Realty Logo" />
        </div>
      <Typography variant="h4" gutterBottom align="center">
        Welcome to Our Platform!
      </Typography>
      <Typography variant="body1" gutterBottom align="center" sx={{ mb: 4 }}>
        Please fill out the form below to create your consultant account.
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
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Person />
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
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <People />
              </InputAdornment>
            ),
            readOnly: !!referralId, // Make field read-only if referral ID exists
          }}
          disabled={!!referralId} // Disable editing if referral ID exists
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
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AccountCircle />
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
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AccountCircle />
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
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Phone />
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
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Email />
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
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Cake />
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
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <People />
              </InputAdornment>
            ),
          }}
        >
          <MenuItem value="male">Male</MenuItem>
          <MenuItem value="female">Female</MenuItem>
          <MenuItem value="other">Other</MenuItem>
        </TextField>

        {/* Address
        <TextField
          fullWidth
          label="Address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          margin="normal"
          error={!!errors.address}
          helperText={errors.address}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Home />
              </InputAdornment>
            ),
          }}
        /> */}

        {/* Country
        <TextField
          fullWidth
          label="Country"
          name="country"
          value={formData.country}
          onChange={handleChange}
          margin="normal"
          error={!!errors.country}
          helperText={errors.country}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Map />
              </InputAdornment>
            ),
          }}
        /> */}

        {/* State
        <TextField
          fullWidth
          label="State"
          name="state"
          value={formData.state}
          onChange={handleChange}
          margin="normal"
          error={!!errors.state}
          helperText={errors.state}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LocationCity />
              </InputAdornment>
            ),
          }}
        /> */}

        {/* Account Name */}
        {/* <TextField
          fullWidth
          label="Account Name"
          name="accountName"
          value={formData.accountName}
          onChange={handleChange}
          margin="normal"
          error={!!errors.accountName}
          helperText={errors.accountName}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AccountCircle />
              </InputAdornment>
            ),
          }}
        /> */}

        {/* Account Number
        <TextField
          fullWidth
          label="Account Number"
          name="accountNumber"
          value={formData.accountNumber}
          onChange={handleChange}
          margin="normal"
          error={!!errors.accountNumber}
          helperText={errors.accountNumber}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AccountBalance />
              </InputAdornment>
            ),
          }}
        /> */}

        {/* Bank
        <TextField
          fullWidth
          label="Bank"
          name="bank"
          value={formData.bank}
          onChange={handleChange}
          margin="normal"
          error={!!errors.bank}
          helperText={errors.bank}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Business />
              </InputAdornment>
            ),
          }}
        /> */}

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
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Lock />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {/* Submit Button */}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Register"}
        </Button>
      </form>

      {/* Success Modal with Framer Motion */}
      <AnimatePresence>
        {registrationSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
            }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ duration: 0.5 }}
              style={{
                backgroundColor: "#4CAF50", // Green background
                padding: "40px",
                borderRadius: "16px",
                textAlign: "center",
                color: "white",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* SVG Stars Background */}
              <svg
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  zIndex: 0,
                }}
                viewBox="0 0 200 200"
                xmlns="http://www.w3.org/2000/svg"
              >
                {[...Array(20)].map((_, i) => (
                  <circle
                    key={i}
                    cx={Math.random() * 200}
                    cy={Math.random() * 200}
                    r={Math.random() * 2}
                    fill="white"
                  />
                ))}
              </svg>

              {/* Checkmark Icon */}
              <motion.svg
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                style={{ marginBottom: "20px" }}
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </motion.svg>

              {/* Success Message */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <Typography variant="h5" gutterBottom>
                  Registration Completed
                </Typography>
                <Typography variant="body1">
                  You have successfully registered!
                </Typography>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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