import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';
import { Building2, Upload, Briefcase, MapPin, Gift, Heart, Image, Calendar, User, Mail, Phone, Lock, CreditCard, Eye, EyeOff, HandCoins, ChevronLeft, ChevronRight } from 'lucide-react';
import { useParams } from "react-router-dom";
import logo from "../../../public/Baay Realty logo (2).png";

const SignupForm = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { referralId } = useParams(); // Get the referral ID from URL
  const [referrerDetails, setReferrerDetails] = useState(null); // Store referrer details
  const [resendTimer, setResendTimer] = useState(0);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpExpiry, setOtpExpiry] = useState(null);
  const [currentStep, setCurrentStep] = useState(1); // Track the current step/card

    useEffect(() => {
      document.title = "Baay Realtors - Client Registration";
    }, []);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    passportPhoto: "",
    password: '',
    confirmPassword: '',
    address: '',
    city: '',
    state: '',
    country: '',
    zipCode: '',
    nextOfKinName: '',
    nextOfKinRelationship: '',
    nextOfKinEmail: '',
    nextOfKinPhone: '',
    occupation: '',
    officeAddress: '',
    propertyId: '',
    paymentMethod: '',
    amount: '',
    referralCode: referralId,
    termsAccepted: false,
  });

  useEffect(() => {
    fetchProperties();
    if (referralId) {
      fetchReferrerDetails(referralId);
      console.log(referralId);
    }
  }, [referralId]);

  // Timer for OTP resend
  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  // Timer for OTP expiry
  useEffect(() => {
    let interval;
    if (otpExpiry) {
      interval = setInterval(() => {
        const now = new Date();
        if (now >= otpExpiry) {
          toast.error('OTP expired. Please request a new one.');
          setOtpExpiry(null);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpExpiry]);

  const fetchProperties = async () => {
    try {
      const response = await axios.get('https://newportal-backend.onrender.com/client/properties');
      setProperties(response.data);
      console.log(properties);
    } catch (error) {
      toast.error('Failed to fetch properties');
    }
  };

  const fetchReferrerDetails = async (referralId) => {
    try {
      const response = await axios.get(`https://newportal-backend.onrender.com/client/validate-referral/${referralId}`);
      setReferrerDetails(response.data); // Store referrer details
    } catch (error) {
      toast.error('Invalid referral code');
      setReferrerDetails(null);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.files[0] }));
  };

  const handleOtpChange = (e, index) => {
    const { value } = e.target;
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      
      // Auto-focus to next input
      if (value && index < 5) {
        document.getElementById(`otp-${index + 1}`).focus();
      }
    }
  };

  const handleOtpKeyDown = (e, index) => {
    // Move to previous input on backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  const validateStep1 = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;

    if (!formData.firstName || !formData.lastName) {
      toast.error('First and Last name are required');
      return false;
    }
    if (!emailRegex.test(formData.email)) {
      toast.error('Invalid email format');
      return false;
    }
    if (!phoneRegex.test(formData.phone)) {
      toast.error('Phone number must be 10 digits');
      return false;
    }
    if (!formData.dateOfBirth) {
      toast.error('Date of Birth is required');
      return false;
    }
    if (!formData.gender) {
      toast.error('Gender is required');
      return false;
    }
    if (!formData.passportPhoto) {
      toast.error('Passport Photo is required');
      return false;
    }
    if (!formData.address || !formData.city || !formData.state || !formData.country) {
      toast.error('Address details are required');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.nextOfKinName || !formData.nextOfKinRelationship || !formData.nextOfKinEmail || !formData.nextOfKinPhone) {
      toast.error('Next of Kin Details are required');
      return false;
    }
    if (!formData.occupation || !formData.officeAddress) {
      toast.error('Occupation Details are required');
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return false;
    }
    if (!formData.propertyId || !formData.paymentMethod || !formData.amount) {
      toast.error('Property Details are required');
      return false;
    }
    if (!formData.termsAccepted) {
      toast.error('You must accept the terms and conditions');
      return false;
    }
    return true;
  };

  const validateForm = () => {
    if (currentStep === 1) return validateStep1();
    if (currentStep === 2) return validateStep2();
    if (currentStep === 3) return validateStep3();
    return true;
  };

  const handleNext = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const sendOtp = async () => {
    if (!validateForm()) return;
  
    setLoading(true);
    try {
      // Send request to generate OTP
      const response = await axios.post('https://newportal-backend.onrender.com/client/send-otp', {
        email: formData.email,
        name: formData.firstName,
      });
  
      // Set OTP expiry time (15 minutes from now)
      const expiryTime = new Date();
      expiryTime.setMinutes(expiryTime.getMinutes() + 15);
      setOtpExpiry(expiryTime);
  
      // Start resend timer
      setResendTimer(60); // Reset the timer to 60 seconds
  
      // Show OTP input modal
      Swal.fire({
        title: 'Email Verification',
        html: `
          <p>We've sent a verification code to ${formData.email}</p>
          <p>Enter the 6-digit code below:</p>
          <div id="otp-container" style="display: flex; justify-content: center; gap: 10px; margin: 10px 0;">
            <input id="swal-otp-0" style="width: 40px; height: 40px; text-align: center; font-size: 18px; border: 1px solid #ddd; border-radius: 4px;" maxlength="1" />
            <input id="swal-otp-1" style="width: 40px; height: 40px; text-align: center; font-size: 18px; border: 1px solid #ddd; border-radius: 4px;" maxlength="1" />
            <input id="swal-otp-2" style="width: 40px; height: 40px; text-align: center; font-size: 18px; border: 1px solid #ddd; border-radius: 4px;" maxlength="1" />
            <input id="swal-otp-3" style="width: 40px; height: 40px; text-align: center; font-size: 18px; border: 1px solid #ddd; border-radius: 4px;" maxlength="1" />
            <input id="swal-otp-4" style="width: 40px; height: 40px; text-align: center; font-size: 18px; border: 1px solid #ddd; border-radius: 4px;" maxlength="1" />
            <input id="swal-otp-5" style="width: 40px; height: 40px; text-align: center; font-size: 18px; border: 1px solid #ddd; border-radius: 4px;" maxlength="1" />
          </div>
          <p>Code expires in 15 minutes</p>
          <button id="resend-otp" disabled class="swal2-confirm swal2-styled" style="background-color: gray; margin-top: 10px;">
            Resend Code (60s)
          </button>
        `,
        showCancelButton: true,
        confirmButtonText: 'Verify',
        confirmButtonColor: '#002657',
        cancelButtonText: 'Cancel',
        allowOutsideClick: false,
        didOpen: () => {
          // Handle OTP input behavior
          const inputs = Array.from({ length: 6 }, (_, i) => document.getElementById(`swal-otp-${i}`));
  
          inputs.forEach((input, index) => {
            input.addEventListener('input', (e) => {
              if (e.target.value && index < 5) {
                inputs[index + 1].focus();
              }
            });
  
            input.addEventListener('keydown', (e) => {
              if (e.key === 'Backspace' && !e.target.value && index > 0) {
                inputs[index - 1].focus();
              }
            });
          });
  
          // Handle resend button
          const resendButton = document.getElementById('resend-otp');
          const updateResendButton = () => {
            if (resendTimer > 0) {
              resendButton.disabled = true;
              resendButton.textContent = `Resend Code (${resendTimer}s)`;
            } else {
              resendButton.disabled = false;
              resendButton.textContent = 'Resend Code';
              resendButton.style.backgroundColor = '#E5B305';
            }
          };
  
          const interval = setInterval(() => {
            setResendTimer((prev) => {
              if (prev <= 1) {
                clearInterval(interval);
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
  
          updateResendButton();
  
          resendButton.addEventListener('click', async () => {
            if (resendTimer === 0) {
              try {
                await axios.post('https://newportal-backend.onrender.com/client/send-otp', {
                  email: formData.email,
                  name: formData.firstName,
                });
  
                // Reset OTP expiry time
                const expiryTime = new Date();
                expiryTime.setMinutes(expiryTime.getMinutes() + 15);
                setOtpExpiry(expiryTime);
  
                // Reset resend timer
                setResendTimer(60);
                resendButton.disabled = true;
                resendButton.style.backgroundColor = 'gray';
  
                toast.success('New OTP code sent!');
              } catch (error) {
                toast.error('Failed to resend OTP');
              }
            }
          });
  
          // Focus on first input
          inputs[0].focus();
        },
        preConfirm: () => {
          const enteredOtp = Array.from({ length: 6 }, (_, i) =>
            document.getElementById(`swal-otp-${i}`).value
          ).join('');
  
          return { otp: enteredOtp };
        },
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            // Verify OTP
            await axios.post('https://newportal-backend.onrender.com/client/verify-otp', {
              email: formData.email,
              otp: result.value.otp,
            });
  
            // OTP verified, proceed with registration
            handleFinalSubmit();
          } catch (error) {
            toast.error('Invalid or expired OTP. Please try again.');
            sendOtp(); // Reopen OTP dialog
          }
        }
      });
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to send verification code';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleFinalSubmit = async () => {
    setLoading(true);

    try {
      const selectedProperty = properties.find(p => p._id === formData.propertyId);

      if (!selectedProperty) {
        toast.error('Selected property not found');
        return;
      }
      
      // Upload passportPhoto to Cloudinary
      const passportPhotoData = new FormData();
      passportPhotoData.append('file', formData.passportPhoto);
      passportPhotoData.append('upload_preset', 'giweexpv');
      const passportPhotoResponse = await axios.post(
        'https://api.cloudinary.com/v1_1/dwpoik1jm/image/upload',
        passportPhotoData
      );
      const userData = {
        ...formData,
        passportPhoto: passportPhotoResponse.data.secure_url,
        propertyName: selectedProperty.propertyName,
        propertyActualPrice: selectedProperty.amount,
      };

      console.log(userData);
  
      // Show form download prompt
      const { subscriptionForm } = selectedProperty;
      
      Swal.fire({
        title: 'Download Subscription Form',
        html: `
          <p>Please download and fill the subscription form below</p>
          <p>After filling, send the form and your payment screenshot to our WhatsApp</p>
          <div style="margin: 20px 0;">
            <a href="${subscriptionForm}" target="_blank" id="download-form" class="swal2-confirm swal2-styled" style="background-color: #002657; margin-right: 10px; text-decoration: none; display: inline-block; padding: 10px 20px;">
              Download Form
            </a>
            <a href="https://wa.me/+2348071260398?text=Hello,%20I%20have%20completed%20my%20property%20registration%20for%20${selectedProperty.propertyName}" target="_blank" id="whatsapp-link" class="swal2-confirm swal2-styled" style="background-color: #25D366; text-decoration: none; display: inline-block; padding: 10px 20px;">
              WhatsApp Us
            </a>
          </div>
          <p style="color: #FF0000; font-weight: bold;">Important: Your property sale will not be approved until you send the completed form!</p>

          <p style="color: #FF0000; font-weight: bold;">Important: You have to submit the require document to the whatsapp number before the "I Have Sent The Files" button can work !</p>

        `,
        showCancelButton: false,
        confirmButtonText: 'I Have Sent The Files',
        confirmButtonColor: '#002657',
        allowOutsideClick: false,
        didOpen: () => {
          // Track if links were clicked
          let formDownloaded = false;
          let whatsappClicked = false;
          
          document.getElementById('download-form').addEventListener('click', () => {
            formDownloaded = true;
          });
          
          document.getElementById('whatsapp-link').addEventListener('click', () => {
            whatsappClicked = true;
          });
          
          // Disable the confirm button until WhatsApp is clicked
          const confirmButton = Swal.getConfirmButton();
          confirmButton.disabled = true;
          
          const checkBothClicked = setInterval(() => {
            if (whatsappClicked) {
              confirmButton.disabled = false;
              clearInterval(checkBothClicked);
            }
          }, 1000);
        }
      }).then(async (result) => {
        if (result.isConfirmed) {
          // Send data to the backend
          const response = await axios.post('https://newportal-backend.onrender.com/client/signup', userData);

          // Handle backend response
          const { token, user } = response.data;

          // Store token in localStorage or state management
          localStorage.setItem('Clienttoken', token);
          localStorage.setItem('Clientuser', JSON.stringify(user));
      
          Swal.fire({
            title: 'Registration Successful!',
            html: `
              Your registration and payment upload for ${selectedProperty.propertyName} was successful.<br>
              <span style="color: #E5B305">Check your email for confirmation.</span>
            `,
            icon: 'success',
            confirmButtonColor: '#002657',
          });
      
          navigate('/client-dashboard');
        }
      });
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Registration failed. Please try again.';
      toast.error(errorMessage);
      console.error('Registration error:', error.response?.data || error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    sendOtp(); // Start the OTP verification process
  };

  // Progress indicator
  const ProgressBar = () => (
    <div className="mb-8">
      <div className="flex justify-between">
        <div className={`flex flex-col items-center`}>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep >= 1 ? 'bg-[#002657] text-white' : 'bg-gray-200'}`}>1</div>
          <span className="text-sm mt-1">Personal</span>
        </div>
        <div className={`flex-1 h-0.5 self-center ${currentStep >= 2 ? 'bg-[#002657]' : 'bg-gray-200'}`}></div>
        <div className={`flex flex-col items-center`}>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep >= 2 ? 'bg-[#002657] text-white' : 'bg-gray-200'}`}>2</div>
          <span className="text-sm mt-1">Details</span>
        </div>
        <div className={`flex-1 h-0.5 self-center ${currentStep >= 3 ? 'bg-[#002657]' : 'bg-gray-200'}`}></div>
        <div className={`flex flex-col items-center`}>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep >= 3 ? 'bg-[#002657] text-white' : 'bg-gray-200'}`}>3</div>
          <span className="text-sm mt-1">Property</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className='flex justify-center mb-9 items-center'>
        <img src={logo} className='w-32 h-32' alt="Baay Realty Logo" />
      </div>
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl p-8">
        <h2 className="text-3xl font-bold text-center mb-8" style={{ color: '#002657' }}>
          Complete your payment proof upload and create your account
        </h2>

        <ProgressBar />

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Card 1: Personal Information */}
          {currentStep === 1 && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-6">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="flex items-center text-sm font-medium mb-2">
                    <User className="w-5 h-5 mr-2" style={{ color: '#E5B305' }} />
                    First Name*
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-[#E5B305] focus:border-[#002657] p-2"
                    required
                  />
                </div>

                <div>
                  <label className="flex items-center text-sm font-medium mb-2">
                    <User className="w-5 h-5 mr-2" style={{ color: '#E5B305' }} />
                    Last Name*
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-[#E5B305] focus:border-[#002657] p-2"
                    required
                  />
                </div>

                <div>
                  <label className="flex items-center text-sm font-medium mb-2">
                    <User className="w-5 h-5 mr-2" style={{ color: '#E5B305' }} />
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-[#E5B305] focus:border-[#002657] p-2"
                  />
                </div>

                <div>
                  <label className="flex items-center text-sm font-medium mb-2">
                    <Mail className="w-5 h-5 mr-2" style={{ color: '#E5B305' }} />
                    Email*
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-[#E5B305] focus:border-[#002657] p-2"
                    required
                  />
                </div>

                <div>
                  <label className="flex items-center text-sm font-medium mb-2">
                    <Phone className="w-5 h-5 mr-2" style={{ color: '#E5B305' }} />
                    Phone*
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-[#E5B305] focus:border-[#002657] p-2"
                    required
                  />
                </div>

                <div>
                  <label className="flex items-center text-sm font-medium mb-2">
                    <Calendar className="w-5 h-5 mr-2" style={{ color: '#E5B305' }} />
                    Date of Birth*
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-[#E5B305] focus:border-[#002657] p-2"
                    required
                  />
                </div>

                <div>
                  <label className="flex items-center text-sm font-medium mb-2">
                    <User className="w-5 h-5 mr-2" style={{ color: '#E5B305' }} />
                    Gender*
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-[#E5B305] focus:border-[#002657] p-2"
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>

                <div>
                  <label className="flex items-center text-sm font-medium mb-2">
                    <MapPin className="w-5 h-5 mr-2" style={{ color: '#E5B305' }} />
                    Address*
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-[#E5B305] focus:border-[#002657] p-2"
                    required
                  />
                </div>

                <div>
                  <label className="flex items-center text-sm font-medium mb-2">
                    <MapPin className="w-5 h-5 mr-2" style={{ color: '#E5B305' }} />
                    City*
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-[#E5B305] focus:border-[#002657] p-2"
                    required
                  />
                </div>

                <div>
                  <label className="flex items-center text-sm font-medium mb-2">
                    <MapPin className="w-5 h-5 mr-2" style={{ color: '#E5B305' }} />
                    State*
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-[#E5B305] focus:border-[#002657] p-2"
                    required
                  />
                </div>

                <div>
                  <label className="flex items-center text-sm font-medium mb-2">
                    <MapPin className="w-5 h-5 mr-2" style={{ color: '#E5B305' }} />
                    Country*
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-[#E5B305] focus:border-[#002657] p-2"
                    required
                  />
                </div>

                <div>
                  <label className="flex items-center text-sm font-medium mb-2">
                    <MapPin className="w-5 h-5 mr-2" style={{ color: '#E5B305' }} />
                    ZipCode
                  </label>
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-[#E5B305] focus:border-[#002657] p-2"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="flex items-center text-sm font-medium mb-2">
                    <Image className="w-5 h-5 mr-2" style={{ color: '#E5B305' }} />
                    Passport Photo*
                  </label>
                  <input
                    type="file"
                    name="passportPhoto"
                    onChange={handleFileChange}
                    accept="image/*"
                    className="mt-1 block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-sm file:font-semibold
                      file:bg-[#002657] file:text-white
                      hover:file:bg-[#E5B305]"
                    required
                  />
                </div>
              </div>
              
              <div className="flex justify-end mt-6">
                <button
                  type="button"
                  onClick={handleNext}
                  className="py-2 px-4 flex items-center rounded-md shadow-sm text-white font-medium hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: '#002657' }}
                >
                  Next
                  <ChevronRight className="ml-2 w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* Card 2: Details */}
          {currentStep === 2 && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Next of Kin Details */}
                <div className="space-y-6">
                  <h3 className="text-xl font-bold">Next of Kin Details</h3>

                  <div>
                    <label className="flex items-center text-sm font-medium mb-2">
                      <User className="w-5 h-5 mr-2" style={{ color: '#E5B305' }} />
                      Full Name*
                    </label>
                    <input
                      type="text"
                      name="nextOfKinName"
                      value={formData.nextOfKinName}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-[#E5B305] focus:border-[#002657] p-2"
                      required
                    />
                  </div>

                  <div>
                    <label className="flex items-center text-sm font-medium mb-2">
                      <Heart className="w-5 h-5 mr-2" style={{ color: '#E5B305' }} />
                      Relationship*
                    </label>
                    <input
                      type="text"
                      name="nextOfKinRelationship"
                      value={formData.nextOfKinRelationship}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-[#E5B305] focus:border-[#002657] p-2"
                      required
                    />
                  </div>

                  <div>
                    <label className="flex items-center text-sm font-medium mb-2">
                      <Mail className="w-5 h-5 mr-2" style={{ color: '#E5B305' }} />
                      Email*
                    </label>
                    <input
                      type="email"
                      name="nextOfKinEmail"
                      value={formData.nextOfKinEmail}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-[#E5B305] focus:border-[#002657] p-2"
                      required
                    />
                  </div>

                  <div>
                    <label className="flex items-center text-sm font-medium mb-2">
                      <Phone className="w-5 h-5 mr-2" style={{ color: '#E5B305' }} />
                      Phone*
                    </label>
                    <input
                      type="tel"
                      name="nextOfKinPhone"
                      value={formData.nextOfKinPhone}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-[#E5B305] focus:border-[#002657] p-2"
                      required
                    />
                  </div>
                </div>

                {/* Work & Referral Details */}
                <div className="space-y-6">
                  <h3 className="text-xl font-bold">Work & Referral Details</h3>

                  <div>
                    <label className="flex items-center text-sm font-medium mb-2">
                      <Briefcase className="w-5 h-5 mr-2" style={{ color: '#E5B305' }} />
                      Occupation*
                    </label>
                    <input
                      type="text"
                      name="occupation"
                      value={formData.occupation}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-[#E5B305] focus:border-[#002657] p-2"
                      required
                    />
                  </div>

                  <div>
                    <label className="flex items-center text-sm font-medium mb-2">
                      <MapPin className="w-5 h-5 mr-2" style={{ color: '#E5B305' }} />
                      Office Address*
                    </label>
                    <input
                      type="text"
                      name="officeAddress"
                      value={formData.officeAddress}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-[#E5B305] focus:border-[#002657] p-2"
                      required
                    />
                  </div>

                  <div>
                    <label className="flex items-center text-sm font-medium mb-2">
                      <Gift className="w-5 h-5 mr-2" style={{ color: '#E5B305' }} />
                      Referral Code
                    </label>
                    <input
                      type="text"
                      name="referralCode"
                      value={formData.referralCode}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-[#E5B305] focus:border-[#002657] p-2"
                    />
                    {referrerDetails && (
                      <p className="text-sm text-gray-600 mt-1">Referred by: {referrerDetails.firstName} {referrerDetails.lastName}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  onClick={handleBack}
                  className="py-2 px-4 flex items-center rounded-md shadow-sm text-white font-medium hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: '#E5B305' }}
                >
                  <ChevronLeft className="mr-2 w-5 h-5" />
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="py-2 px-4 flex items-center rounded-md shadow-sm text-white font-medium hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: '#002657' }}
                >
                  Next
                  <ChevronRight className="ml-2 w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* Card 3: Account & Property Payment */}
          {currentStep === 3 && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Property Purchase */}
                <div className="space-y-6">
                  <h3 className="text-xl font-bold">Property Purchase</h3>

                  <div>
                    <label className="flex items-center text-sm font-medium mb-2">
                      <Building2 className="w-5 h-5 mr-2" style={{ color: '#E5B305' }} />
                      Select Property*
                    </label>
                    <select
                      name="propertyId"
                      value={formData.propertyId}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-[#E5B305] focus:border-[#002657] p-2"
                      required
                    >
                      <option value="">Select a property</option>
                      {properties.map(property => (
                        <option key={property._id} value={property._id}>
                          {property.propertyName} - ₦{property.amount}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="flex items-center text-sm font-medium mb-2">
                      <CreditCard className="w-5 h-5 mr-2" style={{ color: '#E5B305' }} />
                      Payment Method*
                    </label>
                    <select
                      name="paymentMethod"
                      value={formData.paymentMethod}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-[#E5B305] focus:border-[#002657] p-2"
                      required
                    >
                      <option value="">Select payment method</option>
                      <option value="full">Full Payment</option>
                      <option value="installment">Installment</option>
                    </select>
                  </div>

                  <div>
                    <label className="flex items-center text-sm font-medium mb-2">
                      <HandCoins className="w-5 h-5 mr-2" style={{ color: '#E5B305' }} />
                      Amount*
                    </label>
                    <input
                      type="text"
                      name="amount"
                      value={formData.amount}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-[#E5B305] focus:border-[#002657] p-2"
                      required
                    />
                  </div>

                  <div className="flex items-center mt-4">
                    <input
                      type="checkbox"
                      name="termsAccepted"
                      checked={formData.termsAccepted}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-[#002657] focus:ring-[#E5B305] border-gray-300 rounded"
                      required
                    />
                    <label className="ml-2 block text-sm text-gray-900">
                      I accept the terms and conditions*
                    </label>
                  </div>
                </div>

                {/* Password Section */}
                <div className="space-y-6">
                  <h3 className="text-xl font-bold">Create Password</h3>

                  <div className="relative">
                    <label className="flex items-center text-sm font-medium mb-2">
                      <Lock className="w-5 h-5 mr-2" style={{ color: '#E5B305' }} />
                      Password*
                    </label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-[#E5B305] focus:border-[#002657] p-2"
                      required
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute inset-y-0 right-0 pr-3 pt-8 flex items-center"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>

                  <div className="relative">
                    <label className="flex items-center text-sm font-medium mb-2">
                      <Lock className="w-5 h-5 mr-2" style={{ color: '#E5B305' }} />
                      Confirm Password*
                    </label>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-[#E5B305] focus:border-[#002657] p-2"
                      required
                    />
                    <button
                      type="button"
                      onClick={toggleConfirmPasswordVisibility}
                      className="absolute inset-y-0 right-0 pr-3 pt-8 flex items-center"
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                
              </div>

              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  onClick={handleBack}
                  className="py-2 px-4 flex items-center rounded-md shadow-sm text-white font-medium hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: '#E5B305' }}
                >
                  <ChevronLeft className="mr-2 w-5 h-5" />
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="py-2 px-4 rounded-md shadow-sm text-white font-medium hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: '#002657' }}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    'Sign Up & Purchase Property'
                  )}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
      <ToastContainer position="top-right" />
    </div>
  );
};

export default SignupForm;